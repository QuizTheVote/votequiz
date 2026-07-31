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

test.describe('non-SVO mode', () => {
	test('ranks candidates instead of filing them all as non-responders', async ({ page }) => {
		await page.goto('/?demo=true');
		await completeQuiz(page, 9);

		await expectMatchPercentages(page);

		// These scorers report no participation rate. Absent that evidence every
		// candidate once landed under "Additional Candidates" with no score.
		await expect(page.getByText('Additional Candidates')).toHaveCount(0);
	});
});

test.describe('URL parameters', () => {
	test('title replaces the header and header=false removes it', async ({ page }) => {
		await page.goto('/?svo=true&demo=true&title=Springfield%202026%20Council%20Race');
		await expect(page.getByText('Springfield 2026 Council Race')).toBeVisible();

		await page.goto('/?svo=true&demo=true&header=false');
		await expect(page.locator('nav')).toHaveCount(0);
	});
});
