# Known Issues

Originally audited 2026-07-31 against commit `78f66b5` (tagged `v2.4.0`), the
state deployed since 2025-10-20. Every item was reproduced, not inferred.

Updated 2026-07-31 after the fixes described in [UNKNOWNS.md](UNKNOWNS.md) and
the commits on branch `chore/consolidate-docs`. Fixed items are kept, marked, and
dated, because the audit trail is the point: several of these were introduced by
a change that looked safe.

## Fixed

### 1. Results screen renders nothing when any question is `Active = FALSE` — FIXED

The function that advanced to the results step counted *all* questions, while the
guard that decided whether to draw the results step counted only *active* ones.
When the two disagreed no branch matched and `<main>` rendered empty.

Introduced by `9d1eb75` ("CRITICAL FIX: Only display and score active
questions"), which added the active-question filter but only half-migrated the
step indexing.

Production had been spared only because the demo sheet and Base Template had
every row set to `Active = TRUE`, so the counts coincided by accident. It would
have fired the first time a newsroom deactivated a question, which the template
instructions encourage.

Both counts now come from `activeQuestions`. Covered by
`tests/quiz-flow.spec.ts`, which runs against a fixture that deliberately has 5
of 10 questions inactive.

### 2. Non-SVO mode reported every candidate as a non-responder — FIXED

The results screen split candidates on `(c.participationRate || 0) >= 0.5`, but
only the SVO scorers populated that field. On the legacy path `|| 0` sent every
candidate into the "Additional Candidates" bucket labelled "Did not respond to
survey", with no percentages at all. This is what the bare production URL showed.

A missing rate is now treated as absence of evidence rather than proof of
non-response. The legacy path has since been deleted outright (see 8).

### 3. Every navigation link on the About, Methodology and Newsroom pages 404ed — FIXED

The hrefs were root-absolute, so they discarded the `/votequiz` base path:

```
404  https://quizthevote.github.io/about.html
404  https://quizthevote.github.io/methodology.html
404  https://quizthevote.github.io/newsroom.html
404  https://quizthevote.github.io/
```

The `.html` suffix was not the problem, since adapter-static does emit those
files; the missing base path was. The "Try the Demo" buttons had the same defect.

The three pages now share one `SiteNav` component and route every href through
`base`. The build's `handleHttpError` is set to `fail`, so a recurrence breaks
the build rather than printing a warning nobody reads. Verified by clicking every
link in a production preview.

### 4. `candidate.website` did not exist — FIXED

The results screen guarded on and linked to `candidate.website`. The `Candidate`
interface has `link_url` and `link_text`, so no link ever rendered. Now reads
`link_url` with `link_text` as the label.

### 5. Inactive questions leaked into the answer comparison — FIXED

`EnhancedResults.svelte` filtered questions by topic but not by `active`, so the
View Answers panel listed questions nobody was asked and attributed them as
unanswered by every candidate. Now filtered.

### 8. Tabletop and the legacy non-SVO path — REMOVED

`tabletop` was a runtime dependency imported at the top of `src/lib/sheets.ts`,
so it shipped to every visitor. Tabletop.js is abandoned and targets a retired
Google Sheets API, so the non-SVO `?sheet=` path could only fail — and it was the
default whenever `svo=true` was absent.

Deleted along with `fetchSheetData`, `calculateMatches`,
`calculateWeightedMatches`, the duplicate 5-point question markup and the non-SVO
fixture, for a net reduction of about 735 lines. Everything now parses as SVO and
the `svo` parameter is an accepted no-op, so existing embeds keep working.

### 14. About and Methodology used `prose` without the plugin installed — FIXED

Both pages wrap their content in `<div class="prose prose-lg max-w-none">`, which
comes from `@tailwindcss/typography`. That plugin was never in `package.json`, so
the classes matched nothing and Tailwind's preflight left every heading at body
size. Both public pages had been rendering as an undifferentiated wall of text
since they were written, which is easy to miss in review because the markup
looks correct.

Found while checking the brand work, not caused by it. The plugin is now
installed and themed to the brand: Bonnie for headings, ink for body, teal for
links.

### 11. Two `<main>` elements, and two stacked headers on the public pages — FIXED

`+layout.svelte` rendered both a `<Navbar>` and a `<main>`, while every route
also declared its own `<main>`. So each page nested a `<main>` inside a `<main>`,
which is invalid and confuses screen readers, and the About, Methodology and
Newsroom pages showed the layout's header above their own `SiteNav`. The second
header was easy to miss while the logo was a small emoji and obvious the moment
it became the real mark.

The layout now renders nothing but the page. The quiz route owns `Navbar`, which
is the right header for it: the quiz is embedded in an iframe on a newsroom's
site, so it must not offer links that navigate the reader off that page. The
public pages own `SiteNav` with the full link set.

### 9. An absent or lowercase `Active` column emptied the quiz — FIXED

`active: row.Active === 'TRUE' || row.Active === true` meant a sheet with no
`Active` column marked every question inactive, and so did `true`, `Yes` or
`TRUE ` with a trailing space. The result was a quiz with nothing to ask.

Parsing is now tolerant of case and of yes/1, and an absent column means all
questions are active. A sheet where every question really is inactive now reports
that as an error rather than rendering an empty quiz.

### 12. The public methodology page describes an algorithm the app does not use — FIXED

Decided 2026-08-23: keep the scorer as it is, and make the methodology page
describe that scorer. Do not change scoring to match the old copy.

The page had claimed cosine similarity on scale questions and a
"research-validated" transformation that spread results across 20–100%. The
app has never done either. `agree_5` is a graduated distance rule (identical
= 1.0; one step on the same side of neutral = 0.5; crossing neutral or two
or more steps = 0). The published percentage is
`Math.round(rawScore * 100)`, optionally weighted by the voter's topic
ranking. Jaccard on multiple choice and topic weighting were already
accurate.

The `/methodology` page now states those rules. The scorer was not touched.

## Open

### 13. The homepage demo sheet is misconfigured

Sheet `1Y2BprkPQC_9RNwZGQLPo5kLWS5lGqAyKFBOOJMJCeFA` is the quiz every
prospective newsroom tries. Re-verified against the live CSV on 2026-07-31:

- Its `Candidates` tab header is `id, name, party, photo, bio, website`. There is
  no `link_url`, so no candidate link renders anywhere in the results. This is
  the sheet-side half of issue 4; the code half is fixed.
- Its `Topics` tab declares five ids (`economy`, `healthcare`, `environment`,
  `education`, `general`) but its active questions use only three. Voters rank
  Environment and Education on the ranking screen and that ranking is discarded.
- `Quiz_Data` row 3 reads "parks and recretation services".

All three are spreadsheet edits, no code involved. Rename `website` to
`link_url`, optionally add a `link_text` column for the label, fix the typo, and
resolve the topic mismatch either by adding Environment and Education questions
or by deleting those two rows from `Topics`.

Deliberate consequence of the severity rule below: none of this is visible to a
voter today, because none of it changes the match percentages. Append
`&debug=true` to the demo URL to see all three reported.

### A note on diagnostic severity

`error` is reserved for "the voter's matches will be wrong or missing" because
errors render publicly, above the quiz. Everything the sheet owner should fix but
that leaves scoring correct is a `notice`, visible only under `?debug=true`.

The legacy `website` column was briefly an error. Verified against the real demo
sheet that this put a banner reading "This quiz has a spreadsheet problem that
affects its results" on the homepage demo, which overstated a missing hyperlink
and would have greeted every prospective newsroom. It is now a notice.

### 6. The WordPress embed builder prefers the wrong Google Sheets URL form

Found while verifying U7. The generator on `quizthevote.com/build-your-quiz/`
extracts the sheet id like this:

```js
m=u.match(/\/spreadsheets\/d\/e\/([\w-]+)/); if(m)return m[1];   // checked FIRST
m=u.match(/\/spreadsheets\/d\/([\w-]+)/);   if(m)return m[1];
```

The `/d/e/` form is the **published-to-web** URL and it is tested first. A
newsroom that follows the instructions, which tell them to publish the
`Quiz_Data` tab, and then pastes the URL from that publish dialog gets its
`2PACX-...` token extracted instead of the sheet id. Those tokens run to roughly
89 characters and the app requires 30 to 50, so the voter sees a generic failure
with no indication of the cause.

This is why every instruction document insists on copying the address bar URL. A
tool that has to be documented around is a tool that should reject the bad input.

**Status:** the in-app copy of this generator
(`src/routes/newsroom/+page.svelte`) is fixed, and a corrected drop-in
replacement for WordPress is committed at
`wordpress/build-your-quiz.fixed.js`. Deploying it needs WP admin access, so it
remains open. See [../wordpress/README.md](../wordpress/README.md).

A newsroom quiz is about to start (U6, 2026-08-23). This is the highest-value
item that still needs a login.

### 7. Results page overflows the recommended iframe height on mobile

Found while verifying U12. At a 390x844 viewport against the demo sheet, the
results step reports a `scrollHeight` of **967px** with all six candidates
collapsed. The builder's default iframe height is 900px and its slider tops out
at 1200px, so the default embed clips the results on a phone before the voter
expands anything. Expanding a candidate makes it substantially taller.

The real fix is for the app to post its height to the parent page and for the
embed snippet to listen, so the iframe follows its content. Raising the default
only moves the threshold.

### 10. Three implementations of the embed URL builder

The same string concatenation exists in the WordPress page, in
`src/routes/newsroom/+page.svelte`, and in the docs. They have already drifted:
the in-app version's Copy Template button pointed at sheet
`1XtS_4-k5yDvgBT_CAqYR9nsUXK9B5aREZPKaALF2LsE` while the live builder uses
`1B08mC5xl_crFRbNnOIKnPWvlSl1U9v_NDeLq73wa3o4`. Both now use `1B08mC5`, but
**which template is correct has not been confirmed** — see U2.

Worth deciding whether the in-app `/newsroom` page or the WordPress page is the
real builder, and deleting the other.

## Maintenance

- **`npm run check` passes** (was 10 errors). CI now runs it, plus the Playwright
  suite, as a gate on deploy.
- **CI runs Node 22** (was end-of-life Node 18); `.nvmrc` records it.
- **Browser data (`caniuse-lite`) is over a year stale.** `npx update-browserslist-db@latest`.
- **No `npm run lint`** and no lint config.
- **Three `svelte-check` warnings remain**: a drag handler without an ARIA role
  in `TopicImportanceRanker.svelte`, an unassociated form label in
  `newsroom/+page.svelte`, and the `@apply` at-rule, which is a false positive.
- **The `elex-quiz-app/` directory** at the workspace root was an untouched
  `npx sv create` scaffold from 2025-05-16, still serving "Welcome to SvelteKit",
  and was never in any git repository. Removed 2026-07-31. Its 18 real files are
  archived alongside the project at `unused-sveltekit-scaffold-2026-07-31.zip`
  (15 KB, excludes `node_modules`). It was worth removing because its name looked
  more like the main app than `elex-quiz-app-tailwind/` does.

## Not tracked in version control

- The Base Template spreadsheet lives in Google Drive; only a snapshot is
  committed under `template/`.
- The Apps Script lives in Google's editor. `apps-script/Code.gs` is a committed
  extraction that has never been diffed against what is installed (U1). `clasp`
  is now configured to make that a two-way sync.
- The WordPress generator is captured under `wordpress/` from the live page, but
  the source of record is still in WP admin (U8).
