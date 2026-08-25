/**
 * Appearance for a newsroom embed. Colors and fonts ride on the quiz URL,
 * the same way `title` and `header` already do.
 *
 * Parameter names (source of truth — keep both builders in step):
 *   accent  6-digit hex, no #     buttons, selected answers, high match bars
 *   ink     6-digit hex, no #     headings, question text, candidate names
 *   bg      paper | white | cream page behind the cards (light surfaces only)
 *   display allowlisted id        heading face
 *   sans    allowlisted id        body face
 *
 * Omit a parameter to keep the QuizTheVote default. Invalid values are ignored.
 */

export type BgId = 'paper' | 'white' | 'cream';

export const PAGE_BACKGROUNDS: { id: BgId; label: string; hex: string }[] = [
	{ id: 'paper', label: 'Light grey (QuizTheVote)', hex: '#f4f6f7' },
	{ id: 'white', label: 'White', hex: '#ffffff' },
	{ id: 'cream', label: 'Cream', hex: '#f6f1e8' }
];

export const DEFAULT_THEME = {
	accent: '#008c95',
	ink: '#283a47',
	bg: 'paper' as BgId,
	display: 'bonnie',
	sans: 'jakarta'
} as const;

export type DisplayFontId = 'bonnie' | 'source-serif' | 'source-sans' | 'georgia';
export type SansFontId = 'jakarta' | 'source-sans' | 'source-serif' | 'georgia' | 'system';

export type QuizTheme = {
	accent: string;
	ink: string;
	bg: BgId;
	display: DisplayFontId;
	sans: SansFontId;
};

export function pageBackgroundHex(id: BgId): string {
	return PAGE_BACKGROUNDS.find((b) => b.id === id)?.hex ?? PAGE_BACKGROUNDS[0].hex;
}

export const DISPLAY_FONTS: { id: DisplayFontId; label: string; stack: string }[] = [
	{ id: 'bonnie', label: 'Bonnie (QuizTheVote)', stack: '"Bonnie", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif' },
	{ id: 'source-serif', label: 'Source Serif', stack: '"Source Serif 4", Georgia, "Times New Roman", Times, serif' },
	{ id: 'source-sans', label: 'Source Sans', stack: '"Source Sans 3", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif' },
	{ id: 'georgia', label: 'Georgia', stack: 'Georgia, "Times New Roman", Times, serif' }
];

export const SANS_FONTS: { id: SansFontId; label: string; stack: string }[] = [
	{ id: 'jakarta', label: 'Plus Jakarta Sans (QuizTheVote)', stack: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif' },
	{ id: 'source-sans', label: 'Source Sans', stack: '"Source Sans 3", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif' },
	{ id: 'source-serif', label: 'Source Serif', stack: '"Source Serif 4", Georgia, "Times New Roman", Times, serif' },
	{ id: 'georgia', label: 'Georgia', stack: 'Georgia, "Times New Roman", Times, serif' },
	{ id: 'system', label: 'This device', stack: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }
];

const DISPLAY_IDS = new Set(DISPLAY_FONTS.map((f) => f.id));
const SANS_IDS = new Set(SANS_FONTS.map((f) => f.id));

export function parseHex(raw: string | null): string | null {
	if (!raw) return null;
	const value = raw.trim().replace(/^#/, '');
	if (/^[0-9a-fA-F]{6}$/.test(value)) return `#${value.toLowerCase()}`;
	if (/^[0-9a-fA-F]{3}$/.test(value)) {
		return `#${value[0]}${value[0]}${value[1]}${value[1]}${value[2]}${value[2]}`.toLowerCase();
	}
	return null;
}

function parseDisplay(raw: string | null): DisplayFontId | null {
	if (raw && DISPLAY_IDS.has(raw as DisplayFontId)) return raw as DisplayFontId;
	return null;
}

function parseSans(raw: string | null): SansFontId | null {
	if (raw && SANS_IDS.has(raw as SansFontId)) return raw as SansFontId;
	return null;
}

function parseBg(raw: string | null): BgId | null {
	if (!raw) return null;
	const value = raw.trim().toLowerCase().replace(/^#/, '');
	if (value === 'paper' || value === 'white' || value === 'cream') return value;
	const hex = parseHex(raw);
	if (!hex) return null;
	return PAGE_BACKGROUNDS.find((b) => b.hex === hex)?.id ?? null;
}

export function parseThemeFromSearch(search: string): QuizTheme {
	const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
	return {
		accent: parseHex(params.get('accent')) ?? DEFAULT_THEME.accent,
		ink: parseHex(params.get('ink')) ?? DEFAULT_THEME.ink,
		bg: parseBg(params.get('bg')) ?? DEFAULT_THEME.bg,
		display: parseDisplay(params.get('display')) ?? DEFAULT_THEME.display,
		sans: parseSans(params.get('sans')) ?? DEFAULT_THEME.sans
	};
}

export function themeIsDefault(theme: QuizTheme): boolean {
	return (
		theme.accent === DEFAULT_THEME.accent &&
		theme.ink === DEFAULT_THEME.ink &&
		theme.bg === DEFAULT_THEME.bg &&
		theme.display === DEFAULT_THEME.display &&
		theme.sans === DEFAULT_THEME.sans
	);
}

/** Query string fragment with only the values that differ from the default. */
export function themeQuery(theme: QuizTheme): string {
	const params = new URLSearchParams();
	if (theme.accent !== DEFAULT_THEME.accent) params.set('accent', theme.accent.slice(1));
	if (theme.ink !== DEFAULT_THEME.ink) params.set('ink', theme.ink.slice(1));
	if (theme.bg !== DEFAULT_THEME.bg) params.set('bg', theme.bg);
	if (theme.display !== DEFAULT_THEME.display) params.set('display', theme.display);
	if (theme.sans !== DEFAULT_THEME.sans) params.set('sans', theme.sans);
	return params.toString();
}

function fontStack(id: string, list: { id: string; stack: string }[]): string {
	return list.find((f) => f.id === id)?.stack ?? list[0].stack;
}

function hexToRgb(hex: string): [number, number, number] {
	const n = hex.replace('#', '');
	return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
}

function relativeLuminance(hex: string): number {
	const channel = (c: number) => {
		const s = c / 255;
		return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
	};
	const [r, g, b] = hexToRgb(hex);
	return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
	const l1 = relativeLuminance(a);
	const l2 = relativeLuminance(b);
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + 0.05) / (darker + 0.05);
}

/**
 * True when custom colors are likely hard to read.
 * Accent is button fill (3:1 is enough). Heading-on-background is body text (4.5:1).
 * The default teal is ~4.0:1 on white, so a 4.5 check would always warn on the brand look.
 */
export function themeHasContrastWarning(theme: QuizTheme): boolean {
	if (themeIsDefault(theme)) return false;
	return contrastRatio(theme.accent, '#ffffff') < 3 || contrastRatio(theme.ink, pageBackgroundHex(theme.bg)) < 4.5;
}

const THEME_VARS = [
	'--qtv-accent',
	'--qtv-ink',
	'--qtv-bg',
	'--qtv-font-display',
	'--qtv-font-sans',
	'--qtv-brand-50',
	'--qtv-brand-100',
	'--qtv-brand-200',
	'--qtv-brand-300',
	'--qtv-brand-400',
	'--qtv-brand-500',
	'--qtv-brand-600',
	'--qtv-brand-700',
	'--qtv-brand-800',
	'--qtv-brand-900',
	'--qtv-ink-50',
	'--qtv-ink-100',
	'--qtv-ink-200',
	'--qtv-ink-300',
	'--qtv-ink-400',
	'--qtv-ink-500',
	'--qtv-ink-600',
	'--qtv-ink-700',
	'--qtv-ink-800',
	'--qtv-ink-900'
] as const;

export function applyTheme(theme: QuizTheme, root: HTMLElement = document.documentElement): void {
	if (themeIsDefault(theme)) {
		for (const name of THEME_VARS) root.style.removeProperty(name);
		root.style.removeProperty('background-color');
		if (typeof document !== 'undefined') document.body.style.removeProperty('background-color');
		return;
	}

	const page = pageBackgroundHex(theme.bg);

	root.style.setProperty('--qtv-accent', theme.accent);
	root.style.setProperty('--qtv-ink', theme.ink);
	root.style.setProperty('--qtv-bg', page);
	root.style.setProperty('--qtv-font-display', fontStack(theme.display, DISPLAY_FONTS));
	root.style.setProperty('--qtv-font-sans', fontStack(theme.sans, SANS_FONTS));

	if (theme.accent !== DEFAULT_THEME.accent) {
		root.style.setProperty('--qtv-brand-50', `color-mix(in srgb, ${theme.accent} 10%, white)`);
		root.style.setProperty('--qtv-brand-100', `color-mix(in srgb, ${theme.accent} 18%, white)`);
		root.style.setProperty('--qtv-brand-200', `color-mix(in srgb, ${theme.accent} 32%, white)`);
		root.style.setProperty('--qtv-brand-300', `color-mix(in srgb, ${theme.accent} 48%, white)`);
		root.style.setProperty('--qtv-brand-400', `color-mix(in srgb, ${theme.accent} 72%, white)`);
		root.style.setProperty('--qtv-brand-500', theme.accent);
		root.style.setProperty('--qtv-brand-600', `color-mix(in srgb, ${theme.accent} 82%, black)`);
		root.style.setProperty('--qtv-brand-700', `color-mix(in srgb, ${theme.accent} 70%, black)`);
		root.style.setProperty('--qtv-brand-800', `color-mix(in srgb, ${theme.accent} 55%, black)`);
		root.style.setProperty('--qtv-brand-900', `color-mix(in srgb, ${theme.accent} 40%, black)`);
	}

	if (theme.ink !== DEFAULT_THEME.ink) {
		root.style.setProperty('--qtv-ink-50', `color-mix(in srgb, ${theme.ink} 6%, ${page})`);
		root.style.setProperty('--qtv-ink-100', `color-mix(in srgb, ${theme.ink} 12%, ${page})`);
		root.style.setProperty('--qtv-ink-200', `color-mix(in srgb, ${theme.ink} 22%, ${page})`);
		root.style.setProperty('--qtv-ink-300', `color-mix(in srgb, ${theme.ink} 35%, ${page})`);
		root.style.setProperty('--qtv-ink-400', `color-mix(in srgb, ${theme.ink} 50%, #8a8e92)`);
		root.style.setProperty('--qtv-ink-500', `color-mix(in srgb, ${theme.ink} 65%, #8a8e92)`);
		root.style.setProperty('--qtv-ink-600', `color-mix(in srgb, ${theme.ink} 72%, #808080)`);
		root.style.setProperty('--qtv-ink-700', `color-mix(in srgb, ${theme.ink} 82%, #50555b)`);
		root.style.setProperty('--qtv-ink-800', `color-mix(in srgb, ${theme.ink} 90%, black)`);
		root.style.setProperty('--qtv-ink-900', theme.ink);
	}

	if (theme.bg !== DEFAULT_THEME.bg) {
		root.style.backgroundColor = page;
		if (typeof document !== 'undefined') document.body.style.backgroundColor = page;
		// body uses ink-50, so point that at the chosen page color.
		if (theme.ink === DEFAULT_THEME.ink) {
			root.style.setProperty('--qtv-ink-50', page);
		}
	}
}

export function appendThemeQuery(url: string, theme: QuizTheme): string {
	const extra = themeQuery(theme);
	if (!extra) return url;
	return url.includes('?') ? `${url}&${extra}` : `${url}?${extra}`;
}
