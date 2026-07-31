# Base Template spreadsheet

The Base Template is what newsrooms copy to build a quiz. It lives in Google
Drive; the files here are snapshots for reference and history only. **Editing
them has no effect on anything** — the live template is the Google Sheet.

## The live template

Copy link handed out to newsrooms:

```
https://docs.google.com/spreadsheets/d/1B08mC5xl_crFRbNnOIKnPWvlSl1U9v_NDeLq73wa3o4/copy
```

As of 2026-07-31 it holds 10 questions — 5 `Essential` and 5 `Additional` —
all set to `Active = TRUE`, covering all seven question types.

The Apps Script bound to it is tracked at `../apps-script/Code.gs`.

## Files

| File | Notes |
| --- | --- |
| `Quiz-The-Vote-Base-Template-CURRENT.xlsx` | Newest snapshot (was `Quiz The Vote - Base Template (3).xlsx`, 2025-10-14) |
| `archive/Quiz The Vote - Base Template.xlsx` | 2025-08-26 |
| `archive/Quiz The Vote - Base Template (1).xlsx` | 2025-10-08 |
| `archive/Quiz The Vote - Base Template (2).xlsx` | 2025-10-13 |
| `archive/SVO Election Quiz Template - Master.xlsx` | 2025-08-13, pre-rename ("Master" → "Base") |
| `archive/At-Large Copy of Quiz The Vote - Base Template (1).xlsx` | Derived working copy for an at-large contest |
| `archive/Copy of fish election quiz 2025 0908.xlsx` | Example of a real filled-in quiz |

Dates are file modification times, not anything recorded inside the documents.

## Structure

See `../docs/README.md` for the tab and column reference, and
`../docs/SIMPLIFIED_TEMPLATE_INSTRUCTIONS.md` for the newsroom-facing guide.

## Caution

Setting any `Quiz_Data` row to `Active = FALSE` currently causes the app's
results screen to render blank. See issue 1 in `../docs/KNOWN_ISSUES.md`.
Until that is fixed, delete unwanted rows rather than deactivating them.
