import { test, expect, type Page } from '@playwright/test';

/**
 * Guards the results screen, which has silently broken twice.
 *
 * The SVO fixture in src/lib/sampleDataSVO.ts is deliberately the hard case:
 * 10 questions of which 5 are `active: false`. That mismatch between total and
 * active count is exactly what once made the results step unreachable, so these
 * tests must keep running against a fixture that has inactive questions in it.
 */

const INACTIVE_QUESTION_TEXT =
	'Communities should support new businesses and economic development.';

/** The card holding the question text and its answer buttons. */
function questionCard(page: Page) {
	return page.locator('div.shadow-md').first();
}

/**
 * Answers whichever question is showing and waits for the step to advance.
 * Every question type in use auto-advances on selection except multiple_choice,
 * which needs its Continue button.
 */
async function answerCurrentQuestion(page: Page, expectedStepLabel: string) {
	await expect(page.getByText(expectedStepLabel)).toBeVisible();

	const continueButton = page.getByRole('button', { name: 'Continue' });
	if (await continueButton.isVisible().catch(() => false)) {
		await questionCard(page).getByRole('button').first().click();
		await continueButton.click();
		return;
	}

	await questionCard(page).getByRole('button').first().click();
}

async function completeQuiz(page: Page, questionCount: number) {
	await page.getByRole('button', { name: 'Start Quiz' }).click();

	for (let i = 1; i <= questionCount; i++) {
		await answerCurrentQuestion(page, `Question ${i} of ${questionCount}`);
	}

	await expect(page.getByText('Step 2 of 3: Rank Topics')).toBeVisible();
	await page.getByRole('button', { name: /Results/ }).click();
	await expect(page.getByText('Step 3 of 3: Results')).toBeVisible();
}

/** Percentages are the whole point of the results screen. */
async function expectMatchPercentages(page: Page) {
	const percentages = page.getByText(/^\d+%$/);
	await expect(percentages.first()).toBeVisible();
	expect(await percentages.count()).toBeGreaterThan(0);
}

test.describe('SVO mode, with inactive questions in the sheet', () => {
	test('reaches results and renders match percentages', async ({ page }) => {
		await page.goto('/?svo=true&demo=true');

		// Only the 5 active questions of 10 are asked. If this reads "of 10" the
		// active filter has regressed; if the run dies at the last Next, the
		// results step is being indexed off the unfiltered count again.
		await completeQuiz(page, 5);

		await expectMatchPercentages(page);
		// The original symptom was a rendered but completely empty <main>.
		// .last() because the layout and the page each declare one.
		await expect(page.locator('main').last()).not.toBeEmpty();
	});

	test('omits inactive questions from the answer comparison', async ({ page }) => {
		await page.goto('/?svo=true&demo=true');
		await completeQuiz(page, 5);

		// An inactive question was never asked, so showing it would report it as
		// unanswered by every candidate.
		await expect(page.getByText(INACTIVE_QUESTION_TEXT)).toHaveCount(0);

		// The candidate row is a div[role="button"], so a tag selector misses it.
		await page.locator('[aria-controls^="candidate-details-"]').first().click();

		const viewAnswers = page.getByRole('button', { name: /View Answers/ }).first();
		if (await viewAnswers.isVisible().catch(() => false)) {
			await viewAnswers.click();
			await expect(page.getByText(INACTIVE_QUESTION_TEXT)).toHaveCount(0);
		}
	});
});

test.describe('without the svo parameter', () => {
	// This is what the bare production URL and any embed that forgets the flag
	// resolve to. It used to take a separate Tabletop code path that could not
	// work, and reported every candidate as a non-responder with no percentage.
	test('behaves identically to the svo path', async ({ page }) => {
		await page.goto('/?demo=true');
		await completeQuiz(page, 5);

		await expectMatchPercentages(page);
		await expect(page.getByText('Additional Candidates')).toHaveCount(0);
	});
});

test.describe('sheet diagnostics', () => {
	test('stay silent when the data is sound', async ({ page }) => {
		await page.goto('/?svo=true&demo=true&debug=true');
		await expect(page.getByRole('button', { name: 'Start Quiz' })).toBeVisible();
		await expect(page.getByText(/spreadsheet problem|Spreadsheet advisories/i)).toHaveCount(0);
	});
});

test.describe('Settings tab: completion CTA and sharing', () => {
	// A 44-char id that satisfies the app's 30-50 char sheet-id guard.
	const SHEET_ID = 'a'.repeat(44);

	const csv = (rows: string[][]) => rows.map(r => r.join(',')).join('\n');

	const QUIZ_DATA = csv([
		['Question', 'Topic', 'Type', 'Priority', 'Active', 'Option1', 'Option2', 'Option3', 'Option4', 'Option5', 'Alex Rivera', 'Jordan Lee'],
		['Should the city expand transit?', 'transit', 'pick_1_3', 'Essential', 'TRUE', 'Yes', 'Maybe', 'No', '', '', 'Yes', 'No'],
		['Should taxes fund parks?', 'parks', 'pick_1_3', 'Essential', 'TRUE', 'Yes', 'Maybe', 'No', '', '', 'Yes', 'Maybe']
	]);

	const CANDIDATES = csv([
		['id', 'name', 'party', 'photo', 'bio', 'link_url', 'link_text'],
		['c1', 'Alex Rivera', 'Green', '', 'Bio one', 'https://example.com/alex', 'Site'],
		['c2', 'Jordan Lee', 'Blue', '', 'Bio two', 'https://example.com/jordan', 'Site']
	]);

	const TOPICS = csv([
		['id', 'name', 'description'],
		['transit', 'Transit', 'About transit'],
		['parks', 'Parks', 'About parks']
	]);

	const SETTINGS = csv([
		['key', 'value'],
		['completion_headline', 'Stay informed'],
		['completion_body', 'Sign up for our election newsletter.'],
		['completion_button_label', 'Subscribe'],
		['completion_button_url', 'https://news.example.com/subscribe'],
		['share_url', 'https://news.example.com/quiz']
	]);

	/** Serves the four tabs the app fetches, optionally omitting Settings. */
	async function mockSheet(page: Page, opts: { settings?: string | null } = {}) {
		await page.route('**/gviz/**', async route => {
			const target = new URL(route.request().url()).searchParams.get('sheet');
			const body =
				target === 'Quiz_Data' ? QUIZ_DATA :
				target === 'Candidates' ? CANDIDATES :
				target === 'Topics' ? TOPICS :
				target === 'Settings' ? (opts.settings ?? SETTINGS) : '';

			// A missing Settings tab returns an error page in production; model that
			// as a non-200 so the app's .catch fallback is exercised.
			if (target === 'Settings' && opts.settings === null) {
				await route.fulfill({ status: 404, contentType: 'text/html', body: 'Not found' });
				return;
			}
			await route.fulfill({ status: 200, contentType: 'text/csv', body });
		});
	}

	test('renders the newsroom completion CTA and a share link to their page', async ({ page }) => {
		await mockSheet(page);
		await page.goto(`/?sheet=${SHEET_ID}`);
		await completeQuiz(page, 2);

		// Completion CTA from the Settings tab.
		await expect(page.getByRole('heading', { name: 'Stay informed' })).toBeVisible();
		const cta = page.getByRole('link', { name: 'Subscribe' });
		await expect(cta).toHaveAttribute('href', 'https://news.example.com/subscribe');

		// Share opens a panel whose links carry the newsroom's share_url.
		await page.getByRole('button', { name: 'Share' }).click();
		const xShare = page.getByRole('link', { name: 'X' });
		await expect(xShare).toBeVisible();
		expect(await xShare.getAttribute('href')).toContain(encodeURIComponent('https://news.example.com/quiz'));
	});

	test('works when the Settings tab is absent: no CTA, share falls back', async ({ page }) => {
		await mockSheet(page, { settings: null });
		await page.goto(`/?sheet=${SHEET_ID}`);
		await completeQuiz(page, 2);

		await expect(page.getByText('Stay informed')).toHaveCount(0);

		await page.getByRole('button', { name: 'Share' }).click();
		const xShare = page.getByRole('link', { name: 'X' });
		await expect(xShare).toBeVisible();
		expect(await xShare.getAttribute('href')).toContain(encodeURIComponent('https://www.quizthevote.com'));
	});

	test('an invalid completion_button_url drops the button but is reported under debug', async ({ page }) => {
		const badSettings = csv([
			['key', 'value'],
			['completion_headline', 'Stay informed'],
			['completion_button_label', 'Subscribe'],
			['completion_button_url', 'javascript:alert(1)']
		]);
		await mockSheet(page, { settings: badSettings });
		await page.goto(`/?sheet=${SHEET_ID}&debug=true`);

		// The rejected URL is surfaced as an advisory under ?debug=true.
		await expect(page.getByText(/completion_button_url.*not a valid/i)).toBeVisible();

		await completeQuiz(page, 2);

		// Headline still shows, but the unsafe button does not.
		await expect(page.getByRole('heading', { name: 'Stay informed' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Subscribe' })).toHaveCount(0);
	});
});

test.describe('URL parameters', () => {
	test('title replaces the header and header=false removes it', async ({ page }) => {
		await page.goto('/?svo=true&demo=true&title=Springfield%202026%20Council%20Race');
		await expect(page.getByText('Springfield 2026 Council Race')).toBeVisible();

		await page.goto('/?svo=true&demo=true&header=false');
		await expect(page.locator('nav')).toHaveCount(0);
	});

	test('accent and display params restyle the quiz and still start', async ({ page }) => {
		await page.goto('/?demo=true&accent=1a365d&display=georgia');
		await expect(page.getByRole('button', { name: 'Start Quiz' })).toBeVisible();

		const accent = await page.evaluate(() =>
			getComputedStyle(document.documentElement).getPropertyValue('--qtv-accent').trim().toLowerCase()
		);
		expect(accent).toBe('#1a365d');

		const display = await page.evaluate(() =>
			getComputedStyle(document.documentElement).getPropertyValue('--qtv-font-display')
		);
		expect(display).toMatch(/Georgia/);
	});

	test('source-serif and source-sans params apply those stacks', async ({ page }) => {
		await page.goto('/?demo=true&display=source-serif&sans=source-sans');
		await expect(page.getByRole('button', { name: 'Start Quiz' })).toBeVisible();

		const display = await page.evaluate(() =>
			getComputedStyle(document.documentElement).getPropertyValue('--qtv-font-display')
		);
		const sans = await page.evaluate(() =>
			getComputedStyle(document.documentElement).getPropertyValue('--qtv-font-sans')
		);
		expect(display).toMatch(/Source Serif 4/);
		expect(sans).toMatch(/Source Sans 3/);
	});

	test('white background is applied, cream still works on old URLs, and an unknown bg is ignored', async ({ page }) => {
		await page.goto('/?demo=true&bg=white');
		await expect(page.getByRole('button', { name: 'Start Quiz' })).toBeVisible();
		const white = await page.evaluate(() =>
			getComputedStyle(document.body).backgroundColor
		);
		expect(white).toBe('rgb(255, 255, 255)');

		await page.goto('/?demo=true&bg=cream');
		await expect(page.getByRole('button', { name: 'Start Quiz' })).toBeVisible();
		const cream = await page.evaluate(() =>
			getComputedStyle(document.body).backgroundColor
		);
		expect(cream).toBe('rgb(246, 241, 232)');

		await page.goto('/?demo=true&bg=ff0000');
		await expect(page.getByRole('button', { name: 'Start Quiz' })).toBeVisible();
		const paper = await page.evaluate(() =>
			getComputedStyle(document.documentElement).getPropertyValue('--qtv-bg').trim().toLowerCase()
		);
		expect(paper).toBe('#f4f6f7');
	});

	test('match bars keep the accent on a mid-range score', async ({ page }) => {
		await page.goto('/?svo=true&demo=true&accent=94065e');
		await completeQuiz(page, 5);

		const bar = page.locator('[aria-controls^="candidate-details-"] .h-7 .h-full').first();
		const style = await bar.getAttribute('style');
		expect(style).toContain('linear-gradient');
		expect(style).toContain('color-mix');
		expect(style).toMatch(/var\(--qtv-brand-500\)/);
	});

	test('a custom heading color does not tint the page background', async ({ page }) => {
		await page.goto('/?demo=true&ink=f11e1e');
		await expect(page.getByRole('button', { name: 'Start Quiz' })).toBeVisible();
		const paper = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
		expect(paper).toBe('rgb(244, 246, 247)');

		await page.goto('/?demo=true&ink=f11e1e&bg=white');
		await expect(page.getByRole('button', { name: 'Start Quiz' })).toBeVisible();
		const white = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
		expect(white).toBe('rgb(255, 255, 255)');
	});

	test('an invalid accent is ignored', async ({ page }) => {
		await page.goto('/?demo=true&accent=not-a-color');
		await expect(page.getByRole('button', { name: 'Start Quiz' })).toBeVisible();
		const accent = await page.evaluate(() =>
			getComputedStyle(document.documentElement).getPropertyValue('--qtv-accent').trim().toLowerCase()
		);
		expect(accent).toBe('#008c95');
	});
});
