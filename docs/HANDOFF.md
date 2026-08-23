# Handoff — 2026-08-15

Use this as the first message in a new agent chat if you want a fresh context
window for the next phase: **mechanics of the quiz app**, not more branding.

The previous conversation did a large audit, then shipped bug fixes and the
brand identity. That work is **live on production**. Do not re-audit from
scratch. Read this file, then `docs/KNOWN_ISSUES.md`, `docs/UNKNOWNS.md`,
`docs/README.md`, and `docs/BRAND.md`. Treat `docs/archive/` as history, not
truth.

## How to talk to Evan

He is the product owner, not a day-to-day engineer. He has asked, more than
once, for plain language. Do not say "CI is green." Say "the automated tests
on GitHub passed." Do not say "SSG" or "prerender" unless you also say what
that means for him. Lead with what is true and what to do. If you are unsure,
say so and say what would settle it.

He cares about rollback safety. Prefer a branch, a commit he can revert, and
no silent deletions. When something needs his Google or WordPress login, give
him numbered steps, not a dump of options.

## Yes, start a new chat

The last conversation is long. A new chat with this file attached (or with
the instruction "read `docs/HANDOFF.md` first") is the right way to start
mechanical work. The facts below are enough; the old transcript is not
required.

## Where the code actually lives

| Thing | Path |
| --- | --- |
| Workspace folder | `/Users/evanwyloge/elex-quiz-app` |
| **The git repo** | `/Users/evanwyloge/elex-quiz-app/elex-quiz-app-tailwind` |
| GitHub | `github.com/QuizTheVote/votequiz` |
| Live app | `https://quizthevote.github.io/votequiz/` |
| Marketing site | `https://quizthevote.com` (WordPress; embeds the app in an iframe) |
| Brand package (not in git) | `/Users/evanwyloge/elex-quiz-app/Client Files` |

The workspace root is **not** the repo. An unused SvelteKit scaffold that
used to sit at `elex-quiz-app/elex-quiz-app/` was zipped and deleted on
2026-07-31 (`unused-sveltekit-scaffold-2026-07-31.zip` at the workspace
root). Do not recreate it.

**Local checkout warning (as of 2026-08-15):** the working copy may still be
on branch `feat/brand-identity`. Production `main` is ahead of that local
`main` ref. First command in a new session:

```
cd /Users/evanwyloge/elex-quiz-app/elex-quiz-app-tailwind
git fetch origin
git checkout main
git pull origin main
```

Expected tip of `origin/main`: `dda2a3f` — *Merge pull request #2 from
QuizTheVote/feat/brand-identity*. There are no open PRs.

## What is live right now

Both of these merged on 2026-07-31 and deployed to GitHub Pages:

1. [PR #1](https://github.com/QuizTheVote/votequiz/pull/1) — bug fixes,
   spreadsheet diagnostics, tests that must pass before a deploy, removal of
   the dead Tabletop/legacy scoring path, nav 404s fixed.
2. [PR #2](https://github.com/QuizTheVote/votequiz/pull/2) — brand colours,
   Bonnie + Plus Jakarta Sans (self-hosted), Q mark instead of the ballot-box
   emoji, teal-to-sand match bars.

The homepage embed is:

```
https://quizthevote.github.io/votequiz/?sheet=1Y2BprkPQC_9RNwZGQLPo5kLWS5lGqAyKFBOOJMJCeFA&svo=true
```

Evan confirmed on 2026-07-31: **no newsroom quizzes were live** at deploy
time. Re-ask before the next production deploy; that can change.

GitHub write access is the `AbsolutEvan` account. The default `gh` login on
this machine is often `ewyloge-asu`, which is read-only on this repo. Switch
to `AbsolutEvan` to push or merge, then switch back.

## How the product works (one paragraph)

A newsroom copies a Google Sheet template, fills in candidates and questions,
and pastes the sheet URL into an embed generator. That generator produces an
iframe pointing at the static app with `?sheet=<id>&svo=true`. The app
fetches three tabs as CSV from Google's `gviz` endpoint (not the
publish-to-web `/pub` URL), scores the voter against each candidate, and
shows match percentages. There is no server of our own. The four pieces that
must stay in sync are: this web app, the Apps Script menu inside the sheet,
the Base Template spreadsheet, and the WordPress embed generator.

## Architecture, current

- **SvelteKit 2 + Svelte 5**, static adapter, base path `/votequiz` in
  production.
- **Tailwind 3.4** with a custom theme (`ink`, `brand`, `sand`, `font-display`
  = Bonnie). See `tailwind.config.ts` and `docs/BRAND.md`.
- **One data path.** `src/lib/sheets.ts` → `fetchSheetDataSVO`. Tabletop.js
  and the old cosine-similarity scorers are gone. `?svo=true` is accepted and
  ignored so existing embeds keep working.
- **Scoring** is in `src/lib/scorer.ts`. Per-question similarity, then a
  mean, optionally weighted by the voter's topic ranking. `agree_5` is a
  graduated distance rule, **not** cosine similarity. Final percent is
  `Math.round(rawScore * 100)`.
- **Quiz UI** is `src/routes/+page.svelte`. Public pages are `/about`,
  `/methodology`, `/newsroom`. Layout renders only a `<slot />`; each route
  owns its own header and `<main>`.
  - Quiz uses `Navbar` (no outbound nav — it lives in an iframe).
  - Public pages use `SiteNav`.
- **Diagnostics.** `diagnoseSheet` in `sheets.ts` emits `{severity, message}`.
  `error` = voter's matches will be wrong or missing (shown publicly).
  `notice` = sheet owner should fix, scoring still correct (shown only with
  `?debug=true` or in local dev). Do not promote the leftover `website`
  column back to `error`; that banner appeared on the public homepage demo
  and was wrong.
- **Tests.** Playwright in `tests/quiz-flow.spec.ts`, desktop + Pixel 5.
  `.github/workflows/deploy.yml` runs `npm run check` and `npm test` on
  every PR to `main` and on every push to `main`. Deploy jobs run only after
  that, and not on PRs. Node 22 (see `.nvmrc`).
- **Apps Script** snapshot: `apps-script/Code.gs`. `clasp` is configured
  (`apps-script/.clasp.json.example`) but has never been synced against the
  installed script.
- **WordPress generator:** live page still has the published-to-web URL bug.
  Fixed drop-in is `wordpress/build-your-quiz.fixed.js`. In-app generator on
  `/newsroom` is already fixed.

### URL parameters (verified)

| Param | Effect |
| --- | --- |
| `sheet=<id>` | Load that sheet. Id must be 30–50 chars. |
| `svo=true` | No-op. Always set by generators. |
| `demo=true` | Built-in fixture; **overrides** `sheet`. |
| no `sheet` | Same as `demo=true`. |
| `debug=true` | Show notices as well as errors. |
| `title=...` | Replace header text. Logo/mark only shows for the default title. |
| `header=false` | Hide the header. |

CSV URL the app actually uses:

```
https://docs.google.com/spreadsheets/d/<id>/gviz/tq?tqx=out:csv&sheet=<tab>
```

Google sends `cache-control: no-cache`. HTTP-level staleness is not the
problem. Internal Google delay is still unmeasured (U4).

### Named sheets

| ID | Role |
| --- | --- |
| `1B08mC5xl_crFRbNnOIKnPWvlSl1U9v_NDeLq73wa3o4` | Base Template — what "Copy Template" gives newsrooms |
| `1Y2BprkPQC_9RNwZGQLPo5kLWS5lGqAyKFBOOJMJCeFA` | Homepage demo, embedded on quizthevote.com |

A third ID, `1XtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE`, used to be on the
in-app Copy Template button. Both builders now point at `1B08mC5`. Whether
any other live sheets exist is U2.

## What the last phase already fixed

Do not reopen these unless you can reproduce a regression.

- Blank results when any question is `Active=FALSE` (step index vs active
  count). Tests cover a fixture with 5 of 10 inactive.
- Non-responders bucket swallowing every candidate when
  `participationRate` was missing. Legacy path then deleted.
- Nav links 404ing because they ignored `/votequiz`.
- `candidate.website` (field is `link_url` / `link_text`).
- Inactive questions leaking into "View Answers".
- `Active` column only accepting the exact string `TRUE`.
- Tabletop + unused cosine helpers removed (~735 lines).
- Nested `<main>` and double headers.
- About/Methodology `prose` classes with no typography plugin.
- Brand: Q mark, palette, fonts, favicon. Match bars are teal → sand, not
  green → red (nonpartisan + colour-blindness).
- Unused scaffold directory removed.

## What is still open — mechanics first

These are the right next-phase candidates. Ordered by value.

### App / embed mechanics (code, can start now)

1. **Iframe height (issue 7).** Results are 967px on a phone with six
   candidates collapsed. The WordPress builder defaults the iframe to 900px
   and caps the slider at 1200px. Expanding a candidate makes it worse.
   Raising the default only moves the cutoff. The real fix is the app
   posting its height to the parent and the embed snippet listening
   (`postMessage`). Touches `+page.svelte` and both embed generators
   (in-app `/newsroom` and WordPress). This is the highest-value mechanical
   fix for voters.

2. **Methodology copy vs real scoring (issue 12).** The public page claims
   cosine similarity and a "research-validated" normalisation. The app does
   neither. This is Evan's editorial decision: change the copy, or change
   the scorer. Do not silently change scoring. The distance rule is
   defensible; the lie is the problem. Matching percentage is the product's
   central claim.

3. **One embed-URL builder (issue 10).** Three copies of the same string
   concat (WordPress, `/newsroom`, docs) have already drifted. Decide which
   page is the real builder and delete or generate the other from it.

4. **WordPress generator bug (issue 6).** Live
   `quizthevote.com/build-your-quiz/` prefers `/spreadsheets/d/e/`
   (published-to-web `2PACX-...` tokens, ~89 chars). The app requires 30–50
   char sheet ids, so those embeds fail with a generic error. Fixed JS is
   ready at `wordpress/build-your-quiz.fixed.js`. Deploy needs WP admin
   (U8). The in-app `/newsroom` copy is already correct.

5. **Remaining `svelte-check` warnings.** Drag handler without an ARIA role
   in `TopicImportanceRanker.svelte`; unassociated label on
   `newsroom/+page.svelte`. Not blockers.

### Spreadsheet / Google (needs Evan)

6. **Homepage demo sheet (issue 13).** `1Y2Bprk...` still has `website`
   instead of `link_url`, a 5-vs-3 topic mismatch (Environment and
   Education are ranked then discarded), and "parks and recretation
   services". Spreadsheet edits only. Visible under
   `...?sheet=1Y2Bprk...&svo=true&debug=true`.

7. **Unknowns that need his login.** Step-by-step list is at the bottom of
   `docs/UNKNOWNS.md`. Highest value: one unpublished scratch copy of the
   template (closes U3, unblocks U11). Then: export installed Apps Script
   (U1), time one cell edit (U4), run the candidate survey once (U5),
   export WP snippets (U8).

   Status snapshot:

   | ID | Status | Blocker |
   | --- | --- | --- |
   | U1 Apps Script vs repo | OPEN | Google |
   | U2 sheet inventory | OPEN | Google / memory |
   | U3 is Publish-to-web required? | OPEN | scratch sheet |
   | U4 CSV staleness | PARTIAL | one timed edit |
   | U5 survey flow | OPEN | Google |
   | U6 live newsroom quizzes | answered 2026-07-31: none; re-ask |
   | U7 builder source | RESOLVED | |
   | U8 WP snippet export | OPEN | WordPress |
   | U9 URL params | RESOLVED | |
   | U10 legacy path | RESOLVED (deleted) | |
   | U11 silent-failure inventory | OPEN | scratch sheet |
   | U12 mobile/iframe | RESOLVED (found issue 7) | |

### Brand leftovers (not the next phase unless he asks)

Halftone textures and the wordmark from `Client Files` are unused. Embed
height was unchanged by the font swap (still 967px). Do not start a visual
pass unless he asks.

## Suggested first move for the mechanics phase

Ask Evan which of these he wants first. If he says "you pick," start with
**iframe auto-height (issue 7)**. It is a voter-facing mechanical defect,
does not require Google, and forces a clean contract between the app and
both embed snippets — which also advances issue 10.

Do **not** change scoring without an explicit decision on issue 12.

Do **not** treat the methodology page, the WordPress page, or old docs under
`archive/` as a description of the current scorer. Read `src/lib/scorer.ts`.

## Commands that work

From `elex-quiz-app-tailwind/`:

```
npm run check    # svelte-check; expect 0 errors, 3 warnings
npm test         # Playwright; 10 tests, desktop + mobile
npm run build    # must succeed; broken prerender links fail the build
npm run preview  # production build locally; remember /votequiz base path
```

If Playwright's browser binary is missing from a temp cache, run
`npx playwright install chromium`. That has happened on this machine.

## Things a previous agent got wrong (do not repeat)

- The live homepage demo was never a blank page. A `?svo=true&demo=true`
  combo and some internal nav 404s were real; claiming "the quiz doesn't
  work" was not.
- Do not invent broken URLs. Show the actual URL.
- The demo sheet problems do not change match percentages, so they must
  stay `notice`, not a public error banner.
- "CI" means the automated tests GitHub runs on each change. He asked
  what it stood for. Don't use the abbreviation without the words.
