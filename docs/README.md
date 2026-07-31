# Quiz The Vote — Documentation

Start here. This index exists because the project accumulated ~40 overlapping
documents between June and October 2025, many of which contradict each other.
Everything under `archive/` is kept for history but **should not be trusted**
for how the system works today.

## The four moving parts

Quiz The Vote is not just the web app. Four artifacts have to stay in sync:

| Part | Source of truth | Location |
| --- | --- | --- |
| Quiz web app | this repo | `src/` |
| Google Apps Script (`🗳️ Quiz Tools` menu) | this repo | `apps-script/Code.gs` |
| Base Template spreadsheet | Google Drive | snapshot in `template/` |
| WordPress embed generator | quizthevote.com WP admin | capture in `wordpress/` |

Before October 2025 only the web app was under version control, which is why the
docs drifted. All four now have a representation here, though two of them are
copies rather than sources of record. What is still unverified about each is
tracked in [`UNKNOWNS.md`](UNKNOWNS.md).

## Current documentation

| Document | What it covers |
| --- | --- |
| `SIMPLIFIED_TEMPLATE_INSTRUCTIONS.md` | Short newsroom-facing setup guide (newest, Oct 19 2025) |
| `UPDATED_TEMPLATE_INSTRUCTIONS_v2.4.md` | Full text for the sheet's Instructions tab (Oct 14 2025) |
| `QUIZ_UPDATE_SUMMARY_v2.4.md` | Feature changelog for the v2.4 app release (Oct 14 2025) |
| `BASE_TEMPLATE_STRUCTURE.md` | Sheet structure reference (Sep 8 2025 — see caveat below) |
| `KNOWN_ISSUES.md` | Verified bugs and open work, with fixed items kept and dated |
| `UNKNOWNS.md` | Unverified assumptions, each with a defined test and an owner |
| `history/` | The `app update 2.0`–`2.5` narrative logs, in order |

`BASE_TEMPLATE_STRUCTURE.md` is mostly accurate but predates two changes: the
`website` column became `link_url` plus `link_text`, and `multiple_choice`
options switched from comma-separated to pipe-separated (`|`).

## How the system actually works

A newsroom copies the Base Template spreadsheet, fills in candidates and
questions, publishes the `Quiz_Data` tab, and pastes the sheet URL into the
embed generator at <https://www.quizthevote.com/build-your-quiz/>. That
produces an iframe pointing at the hosted app with the sheet ID as a URL
parameter.

The live site embeds it exactly this way:

```
https://quizthevote.github.io/votequiz/?sheet=<SHEET_ID>&svo=true
```

### URL parameters

All verified by test, not from documentation. See U9 in [`UNKNOWNS.md`](UNKNOWNS.md).

| Parameter | Effect |
| --- | --- |
| `sheet=<ID>` | Load a newsroom's Google Sheet (the production path). Must be 30 to 50 characters. |
| `svo=true` | Accepted and ignored. There is only one parser now; every generated embed sets it, so it stays supported. |
| `demo=true` | Ignores `sheet` and uses the built-in fixture. Takes precedence over `sheet`. |
| `debug=true` | Also show non-critical spreadsheet advisories, not just errors |
| `title=<text>` | Override the header text. Suppresses the ballot-box emoji. |
| `header=false` | Remove the header element entirely |

Omitting `sheet` behaves exactly like `demo=true`, which is why the bare
`quizthevote.github.io/votequiz/` URL shows the sample quiz.

### Sheet tabs the app reads

`Quiz_Data` (required), `Candidates` (required), `Topics` (optional).

`Quiz_Data` columns:

```
Question | Topic | Type | Priority | Active | Option1..Option5 | <one column per candidate>
```

Candidate answer column headers must match `Candidates.name` exactly, or that
candidate scores zero. Likewise every `Quiz_Data.Topic` value must be a
`Topics.id`, or the voter's ranking is discarded for those questions. Both joins
are plain string equality with no referential integrity, so the app now checks
them at load time and reports the offending cell by name — see the spreadsheet
diagnostics in `src/lib/sheets.ts`.

`Candidates` columns:

```
id | name | party | photo | bio | link_url | link_text
```

Question types: `agree_5`, `support_3`, `binary_choice`, `pick_1_3`,
`pick_1_4`, `pick_1_5`, `multiple_choice`.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which publishes the
static site to GitHub Pages at <https://quizthevote.github.io/votequiz/>.

Deployment is gated on a `verify` job that runs `npm run check` and the Playwright
suite. Pull requests run `verify` without deploying. The build itself fails if any
prerendered link 404s.

## Archive

`archive/` holds 24 superseded documents. Common reasons they are wrong now:
they describe a five-tab sheet layout (`Questions` and `CandidateAnswers` as
separate tabs), a `website` column, Tabletop.js as the data loader,
comma-separated multiple choice, or the retired `absolutevan.github.io` /
`evanwyloge.github.io` URLs.

`archive/UPDATED_APPS_SCRIPT_WITH_LINK_TEXT.md` is the exception worth knowing
about: it is the document `apps-script/Code.gs` was extracted from, kept as
provenance.
