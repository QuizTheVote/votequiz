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
| WordPress embed generator | quizthevote.com WP admin | not yet tracked |

Before October 2025 only the web app was under version control, which is why
the docs drifted. The Apps Script and template snapshot now live here too.

## Current documentation

| Document | What it covers |
| --- | --- |
| `SIMPLIFIED_TEMPLATE_INSTRUCTIONS.md` | Short newsroom-facing setup guide (newest, Oct 19 2025) |
| `UPDATED_TEMPLATE_INSTRUCTIONS_v2.4.md` | Full text for the sheet's Instructions tab (Oct 14 2025) |
| `QUIZ_UPDATE_SUMMARY_v2.4.md` | Feature changelog for the v2.4 app release (Oct 14 2025) |
| `BASE_TEMPLATE_STRUCTURE.md` | Sheet structure reference (Sep 8 2025 — see caveat below) |
| `KNOWN_ISSUES.md` | Verified bugs and open work |
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

| Parameter | Effect |
| --- | --- |
| `sheet=<ID>` | Load a newsroom's Google Sheet (the production path) |
| `svo=true` | Use the SVO parser and scorer — required for real sheets |
| `demo=true` | Ignore `sheet` and use the built-in sample data |
| `title=<text>` | Override the header text |
| `header=false` | Hide the header entirely |

### Sheet tabs the app reads

`Quiz_Data` (required), `Candidates` (required), `Topics` (optional).

`Quiz_Data` columns:

```
Question | Topic | Type | Priority | Active | Option1..Option5 | <one column per candidate>
```

Candidate answer column headers must match `Candidates.name` exactly, or that
candidate scores zero.

`Candidates` columns:

```
id | name | party | photo | bio | link_url | link_text
```

Question types: `agree_5`, `support_3`, `binary_choice`, `pick_1_3`,
`pick_1_4`, `pick_1_5`, `multiple_choice`.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
static site and publishes it to GitHub Pages at
<https://quizthevote.github.io/votequiz/>. There is currently no test or
typecheck gate on that workflow — see `KNOWN_ISSUES.md`.

## Archive

`archive/` holds 24 superseded documents. Common reasons they are wrong now:
they describe a five-tab sheet layout (`Questions` and `CandidateAnswers` as
separate tabs), a `website` column, Tabletop.js as the data loader,
comma-separated multiple choice, or the retired `absolutevan.github.io` /
`evanwyloge.github.io` URLs.

`archive/UPDATED_APPS_SCRIPT_WITH_LINK_TEXT.md` is the exception worth knowing
about: it is the document `apps-script/Code.gs` was extracted from, kept as
provenance.
