# Candidate survey flow

The 🗳️ Quiz Tools menu can generate a Google Form, collect candidate answers,
and write them back into `Quiz_Data`. This is the least-tested part of the
toolkit (it is U5 in [UNKNOWNS.md](UNKNOWNS.md)); this note describes how it
works, what was hardened on 2026-08-25, and the breakpoints to avoid.

## The three steps

1. **Generate Candidate Survey** (run from the `Quiz_Data` tab).
   - Creates a Google Form titled "Candidate Survey - <sheet name>".
   - Adds fixed fields first: Candidate Name (required), Email Address
     (required), Campaign Contact (optional).
   - Adds one form item per **active** question, using the question text as the
     item title and a widget matched to the question `Type`:
     - `agree_5` → 1–5 scale
     - `support_3` → 1–3 scale
     - `binary_choice`, `pick_1_3/4/5` → multiple choice (one answer)
     - `multiple_choice` → checkboxes (many answers)
   - Links the form to this spreadsheet and renames the response sheet Google
     creates to `Survey_Responses`.
2. **Email Survey to Candidates** — displays a copyable form URL and a suggested
   email. It does **not** send mail (documented so no one assumes it did).
3. **Sync Survey Responses** (run from the `Quiz_Data` tab).
   - Reads `Survey_Responses`, and for each row writes that candidate's answers
     into their `Quiz_Data` column, creating the column if needed (max 6, K–P).

## What changed on 2026-08-25

- **Sync now matches by question text, not position.** Previously answers were
  written into active questions in order, so reordering `Quiz_Data`, adding or
  removing a question, or a candidate skipping a non-required item shifted every
  later answer into the wrong row — with no warning. Sync now looks up each
  response column by the question wording (exact, then a whitespace/case-tolerant
  match) and writes to that question's row.
- **`multiple_choice` is joined with `|`.** Google Forms stores multiple
  checkbox selections comma-joined in one cell; the quiz app parses candidate
  `multiple_choice` answers on `|`. Sync now converts, so both agree.
- **The response sheet is found reliably.** The generator used to insert an empty
  `Survey_Responses` sheet *and* let `setDestination` create a second one, so
  sync could read the empty decoy. It now renames the sheet Google actually
  creates.
- **Blanks no longer clobber data.** A skipped optional question leaves the cell
  untouched rather than blanking an existing answer.

## Breakpoints — what still needs care

- **Do not edit a question's wording between generating the survey and syncing.**
  The form item title is a snapshot of the wording at generation time. If you
  change the `Quiz_Data` text afterwards, the tolerant match may still miss and
  that question is reported as unmatched. Regenerate the survey after wording
  changes.
- **An option that itself contains a comma** will be split incorrectly for
  `multiple_choice`, because Forms comma-joins selections. Avoid commas inside
  `multiple_choice` option text.
- **Candidate name is the key.** The name a candidate types into the form becomes
  (or matches) their `Quiz_Data` column header. If they type it differently from
  the `Candidates` tab, they will get a new column that does not match — exactly
  the mismatch the health check now flags. Tell candidates the exact name to use,
  or reconcile columns after syncing and re-run Check Template Health.
- **Six candidates maximum** (columns K–P), a limit of the write-back only.

## Still to verify with a Google login (U5)

This flow has never been observed end to end. On a scratch copy of the template:

1. Quiz Tools → Generate Candidate Survey. Confirm a form is created and a
   `Survey_Responses` sheet appears (not an empty one plus a "Form Responses 1").
2. Open the form, submit one response as a fake candidate, including a
   `multiple_choice` question with two boxes ticked.
3. Quiz Tools → Sync Survey Responses. Confirm:
   - the answers land in the correct rows for that candidate,
   - the `multiple_choice` cell reads `A|B`, not `A, B`,
   - the confirmation dialog reports 1 synced and 0 unmatched.
4. Reorder two `Quiz_Data` rows and sync again; confirm answers still land
   correctly (this is the regression the positional bug caused).

Record the outcome and any error dialogs here.
