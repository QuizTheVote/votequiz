# Strategy memo: capturing quiz-taker data (and whether to monetize it)

Status: strategy, not built. Nothing in this memo has been implemented. It exists
to think through item 5 of the next-phase plan honestly before any code is
written, because this is the one idea that changes the project's architecture and
its risk profile.

## The core constraint

Today QuizTheVote has **no server of its own**. The app is a static site on
GitHub Pages that reads a Google Sheet in the browser. Nothing is stored; nothing
is logged; there is no database and no backend to attack, subpoena, or leak.
That is a feature, not an accident — it is why the tool is cheap, fast, and
trustworthy to newsrooms.

Capturing quiz-taker results breaks that constraint. Every option below adds a
place where voter data lives. So the first question is not "how" but "is the
value worth giving up the no-data-liability position." This memo assumes the
answer might be yes for aggregate, non-identifying data, and no for anything that
profiles individuals.

## What could be captured, in ascending order of sensitivity

1. **Aggregate outcomes** — "across N takers of the Springfield quiz, the top
   match was Candidate A 38% of the time." No individual record. Lowest risk,
   and probably most of the sellable value.
2. **Per-response records** — each completed quiz's answers and resulting match,
   with no identity. Useful for cross-tabs ("people who answered X on transit
   tended to match Candidate B"). Medium risk: still not identifying on its own,
   but a full answer set plus timing can be quasi-identifying in a small race.
3. **Identified or demographic records** — answers tied to self-reported
   demographics (age band, ZIP, etc.) or to an identity. Highest value for the
   "preferences across demographic profiles" idea, and by far the highest legal,
   ethical, and reputational risk for a nonpartisan election tool.

Recommendation: **design for level 1, allow level 2 behind a clear notice, and
treat level 3 as a separate decision requiring legal review and explicit
consent** — not something to slide into.

## Collection options (the "how")

All of these need the app to send data somewhere on quiz completion.

- **A serverless collector we run.** A single endpoint (e.g. a Cloudflare Worker
  writing to Workers KV or D1, or a small function on any host) receives a POST
  when a voter finishes. Most control, lowest per-event cost at low volume, and
  the data is ours. Cost: it is now infrastructure we own, secure, and pay for,
  and it is the thing that ends the "no backend" property.
- **A Google Apps Script web app writing to a Sheet.** Stays inside the Google
  world the project already lives in, needs no new vendor, and a newsroom could
  even own their own collection sheet. Cost: Apps Script quotas are low, it is
  slow, and a public web-app endpoint is easy to abuse without care.
- **A third-party analytics/collection SaaS.** Privacy-respecting product
  analytics (e.g. Plausible, or PostHog if self-hosted) gives aggregate counts
  and funnels with near-zero build. Great for level 1, poor for level 2/3 because
  you do not own the raw records and their models are not built for
  answer-level survey data. A form/collection SaaS is the inverse: good for
  records, another data processor to vet.

Recommendation for a first step: a **privacy-first analytics SaaS for level 1
aggregates** (fastest, keeps the no-database property mostly intact), and only
build the serverless collector if level-2 records prove to have buyers.

## Dedupe: what is actually achievable

The requirement "so multiple quiz takers wouldn't skew the data" is harder than
it sounds on an anonymous public quiz:

- **`localStorage` flag** stops the same browser counting twice. Trivial, but
  cleared cookies, incognito, and a second device all defeat it. Good enough to
  damp casual double-submits; not a real unique count.
- **Coarse fingerprint** (IP + user-agent, hashed) catches more repeats but is
  approximate, has privacy implications of its own, and collides for people
  behind shared networks (a whole newsroom, a campus).
- **True dedupe needs identity** — a login, an email confirmation, or similar.
  That is level 3 territory and changes the product.

Honest position: you can get an **approximate** unique count cheaply, and you
should describe it to buyers as approximate. Anyone who needs a defensible unique
count needs identity, which most voters will refuse on an election quiz.

## Privacy, legal, and reputational exposure

This is a nonpartisan tool used by newsrooms, so the bar is higher than for a
typical app:

- **Consent and notice.** Even for aggregates, the quiz should say what is
  collected before the voter answers. For per-response records, an explicit,
  plain-language notice is mandatory; for anything identifying, affirmative
  consent.
- **PII avoidance by default.** Do not collect names, emails, or precise
  location unless a specific, consented purpose requires it. Political opinions
  are a **special category** under GDPR and similar regimes; combining them with
  identity is exactly the sensitive case those laws police. US state privacy laws
  (CCPA/CPRA and successors) add sale/opt-out obligations if data is sold.
- **Newsroom agreements.** Partners will (rightly) ask who owns data collected
  through their quiz, on their page, from their readers. Selling reader-derived
  data without the newsroom's blessing would be a trust-ending move. Any
  monetization must be contractual and, ideally, benefit the newsroom.
- **Nonpartisan integrity.** The moment QTV is seen profiting from profiling
  voters' politics, its neutrality is questioned. This risk is not legal but it
  is existential for the brand.

## Monetization framing

Ordered from most defensible to most fraught:

1. **Aggregate benchmark reports back to the newsroom that ran the quiz** —
   "here is what your readers thought," as a value-add or paid tier. Aligns
   incentives, needs only level-1 data, and the newsroom is the customer, not the
   product.
2. **Anonymized, aggregated cross-race trends** sold or published as research
   ("civic engagement benchmarks"). Defensible if truly aggregate and
   consented.
3. **Individual or demographic profiles sold to third parties** — highest
   theoretical value, and the option most likely to destroy the tool's
   credibility and invite regulatory attention. Recommend against.

On demographics specifically: any "preferences by demographic" conclusion needs
**self-reported** demographics (an optional post-quiz question), never covert
inference, and a real sample. As a rule of thumb you need on the order of
**several hundred completed responses per segment** before a cross-tab is more
than noise — and small local races may never reach that, which limits the idea to
larger or aggregated contests.

## Recommended smallest first experiment

Do the cheapest thing that answers "is there signal here at all," without
building a backend or touching identity:

1. Add **privacy-first, aggregate-only analytics** (no PII, no cross-site
   cookies) that records quiz starts, completions, and completion rate.
2. Add a short, honest notice on the welcome screen describing exactly that.
3. Run it for one election cycle across live newsroom quizzes.
4. Review with a partner newsroom: does the aggregate picture interest them
   enough to pay for a benchmark report?

If yes, that justifies building the serverless collector for level-2 records
under a proper consent flow and a newsroom data agreement. If no, you have
learned that cheaply and kept the no-database property. Either way, defer levels
2 and 3 until this experiment gives a reason to take on their risk.
