# Health check audit: the Sheet's check vs the app's check

Audited 2026-08-25 by reading both validators. The point of this note is to
explain, in plain terms, why the "Check Template Health" button inside the Google
Sheet can say a quiz is healthy while the quiz still scores wrongly, and to list
exactly what to change.

There are two validators, and they were written for different jobs:

- **The app's check** (`diagnoseSheet` in [../src/lib/sheets.ts](../src/lib/sheets.ts))
  runs every time a voter loads the quiz. It looks for the mistakes that make the
  results *wrong* — the ones nobody can see by eye.
- **The Sheet's check** (`checkTemplateHealth` in [../apps-script/Code.gs](../apps-script/Code.gs))
  runs when the quiz-maker clicks 🗳️ Quiz Tools → Check Template Health. It only
  looks at whether the column headers are named and positioned the way the
  template ships.

A newsroom builds its quiz in the Sheet, and the Sheet's check is the one they
actually run. So the check they trust is the one that misses the bugs that
matter.

## What each one checks

### The app's check (`diagnoseSheet`) — catches wrong results

- A candidate's name in the `Candidates` tab has no exactly-matching column in
  `Quiz_Data`. This is the big one: that candidate is scored against nothing and
  shows 0% or lands in "did not respond". It even spots a near-miss (a
  capitalisation or spacing difference) and names both sides.
- A `Quiz_Data` "Topic" value that is not an id in the `Topics` tab, so the
  voter's ranking of that topic is silently thrown away.
- The `Candidates` tab still uses the old `website` column instead of
  `link_url`, so no candidate link appears anywhere.
- Missing required columns (`Question`; `id` and `name` on Candidates).
- Every question is inactive, so the quiz has nothing to ask.
- A topic offered on the ranking screen that no active question uses (a notice —
  it does not corrupt results).

### The Sheet's check (`checkTemplateHealth`) — catches formatting only

- The four tabs `Quiz_Data`, `Candidates`, `Topics`, `Instructions` exist.
- The first ten `Quiz_Data` headers are exactly `Question, Topic, Type,
  Priority, Active` then `Option1..Option5`, **in those positions**.
- At least one candidate column exists in columns 11–16.
- The `Candidates` headers are exactly `id, name, party, photo, bio, link_url,
  link_text`, in order.
- Counts of total/active questions and candidates with an id and name.

## What the Sheet check misses (the bugs that actually bite)

Every one of these leaves `checkTemplateHealth` reporting "TEMPLATE IS HEALTHY"
while the quiz is broken:

1. **Candidate name does not match its `Quiz_Data` column.** The single most
   common silent failure. The Sheet check counts candidate columns but never
   checks that their headers equal the names in the `Candidates` tab, so a typo
   like "Alex Rivera " (trailing space) or "alex rivera" passes.
2. **A `Topic` value is not a `Topics.id`.** The voter ranks it, the ranking is
   discarded, and nothing warns anyone.
3. **The old `website` column.** The Sheet check *requires* `link_url` in
   position 6, so this is arguably caught — but only as a generic "wrong header"
   message, not "your candidate links will not appear".
4. **All questions inactive.** The Sheet check reports "No active questions" as a
   ⚠️ line but still counts it as an issue only weakly; worth keeping but it
   should be unambiguous.

## What the Sheet check over-reports (false alarms)

The app is deliberately tolerant; the Sheet check is not, so it warns about
things that work fine:

1. **Column order and an exact 10-header block.** The app reads columns by name,
   in any order, and ignores extra columns. The Sheet check flags any deviation
   from the exact positions, so a perfectly working sheet with a reordered or
   extra column is called broken.
2. **A required `Instructions` tab.** The app never reads `Instructions`. Its
   absence changes nothing for voters, yet the Sheet check calls it a missing
   required sheet.
3. **A hard cap of six candidates (columns 11–16).** The app has no such limit.
4. **`Active` must be exactly `TRUE`/`FALSE`.** The app accepts `true`, `yes`,
   `1`, and a missing column (all active). The Sheet check's counts assume the
   strict form.

## The fix (shipped alongside this note)

`checkTemplateHealth` was rewritten to mirror `diagnoseSheet`:

- It now reads candidate names from the `Candidates` tab and checks each one has
  an exactly-matching `Quiz_Data` column, naming near-misses — the same wording
  the app uses.
- It checks every active question's `Topic` against the `Topics` ids.
- It calls out the `website`-vs-`link_url` rename in plain language.
- It validates the optional `Settings` tab's `completion_button_url` and
  `share_url` as http(s).
- It stops treating column *order*, an `Instructions` tab, and a six-candidate
  cap as problems, and reads `Active` tolerantly, matching the app.

The guiding rule is the same severity split the app uses: an **issue** means the
results a voter sees will be wrong or missing; a **note** means the owner should
tidy something up but scoring is correct.

## Still to do with a Google login (unblocks the "reproduce" step)

This audit is from reading the code. To confirm it against a live sheet, on a
scratch copy of the template (see the handoff steps in [UNKNOWNS.md](UNKNOWNS.md)):

1. Rename one candidate column so it no longer matches the `Candidates` name.
   Run Check Template Health. Before the fix it says healthy; after, it names the
   mismatch.
2. Change one question's `Topic` to a value not in `Topics`. Confirm the check
   now flags it.
3. Reorder a `Quiz_Data` column or delete the `Instructions` tab. Confirm the
   check no longer false-alarms.

Record the before/after dialog text here when that login is available.
