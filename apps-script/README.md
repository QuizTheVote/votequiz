# Apps Script — `🗳️ Quiz Tools` menu

`Code.gs` is the Google Apps Script bound to the Base Template spreadsheet. It
adds the `🗳️ Quiz Tools` menu newsrooms use to validate and publish their quiz.

## Why this file exists here

The script lives in Google's editor, which has no usable version history and
no connection to this repo. Before this file was committed, the only record of
it was a set of markdown documents that had drifted into five competing
versions, with no way to tell which one was actually installed.

`Code.gs` is a **verbatim** extraction of the JavaScript block in
`../docs/archive/UPDATED_APPS_SCRIPT_WITH_LINK_TEXT.md` (dated 2025-10-14, the
newest of those versions). It is byte-identical to that source and passes a
syntax check. It has *not* been diffed against what is currently installed in
the template sheet — see below.

## Menu contents

```
📋 Check Template Health          🎨 Apply Standard Formatting
🔧 Reset Validation Rules         📊 Generate Summary
📝 Generate Candidate Survey      📧 Email Survey to Candidates
🔄 Sync Survey Responses          🚀 Prepare for Publishing
💾 Create Backup                  ❓ Get Help
```

14 functions. Note that `emailSurveyToCandidates()` displays a template and
URL for manual sending; it does not actually send email.

## Deploying a change

There is no automated deployment. To update the live template:

1. Open the Base Template spreadsheet.
2. **Extensions → Apps Script.**
3. Replace the contents of the script file with `Code.gs`.
4. Save, then reload the spreadsheet and confirm the `🗳️ Quiz Tools` menu appears.
5. Run **📋 Check Template Health** to confirm the script can read the sheet.

Any edit made in Google's editor must be copied back into this file, or the two
will diverge again.

## Verifying this matches production

Worth doing once, since it has never been checked: open the script editor,
copy its full contents, and diff against `Code.gs`. If they differ, the
installed version wins — commit it here and note what changed.

Longer term, [`clasp`](https://github.com/google/clasp) can pull and push the
script from the command line, which would make this a real two-way sync instead
of a manual copy.
