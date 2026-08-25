# Strategy memo: social sharing and a QuizTheVote brand presence

Status: strategy, not built. The share buttons on the results screen shipped
(see [KNOWN_ISSUES.md](KNOWN_ISSUES.md) once this lands, and the PR for the code).
This memo is about the larger question the share feature raises: should
QuizTheVote run its own accounts on the platforms voters share to, and what would
that take?

## What shipped, and why it does not depend on this memo

The MVP share control lets a voter post their result to X, Facebook, LinkedIn,
and Bluesky, or copy the link / use their phone's native share sheet. Every share
points at the newsroom's own page (the `share_url` in the Sheet's Settings tab),
falling back to quizthevote.com. It works with no QuizTheVote social accounts at
all: the voter shares to *their* followers, linking to the *newsroom's* quiz.

So none of the below is required for sharing to function. It is about whether QTV
wants to build an audience of its own on the back of that sharing.

## The decision

Sharing creates impressions of the QuizTheVote name (the "Powered by" line, and
soon the share copy). Two ways to treat that:

1. **Attribution only (current).** QTV is a tool. Shares drive traffic to
   newsrooms. No QTV social accounts to feed. Zero ongoing cost. The downside is
   that a curious voter who searches "Quiz The Vote" on X or Instagram finds
   nothing, which slightly undercuts credibility.
2. **Active presence.** QTV runs accounts that post between elections and amplify
   partner newsrooms during them. Shares can `@`-mention or tag QTV, which both
   lends legitimacy and slowly builds a first-party audience QTV controls (unlike
   newsroom traffic, which QTV never sees again).

The honest framing: option 2 is a **content-operations commitment**, not a code
task. An account that exists but never posts is worse than no account. So the
real question is whether someone will own posting.

## What each platform costs to run

Ordered by effort-to-value for a small civic tool.

- **Bluesky** — lowest friction, no ads to manage, an audience that skews civic
  and journalistic. Good first home. Posting is the only work.
- **X** — still where political conversation and journalists are, but reach for
  unpaid posts has fallen and API access for anything automated is now paid.
  Worth claiming the handle regardless, to prevent impersonation.
- **LinkedIn** — the right place to reach the *newsroom* buyers, not voters. A
  company page posting case studies ("how the Springfield Gazette used a quiz")
  supports sales more than voter engagement.
- **Facebook** — still large voter reach, especially local, but a Page needs
  regular posting to stay visible and the format rewards native video/images.
  Higher upkeep.
- **Instagram** — highest production cost (image/video first) and, notably, no
  web share-intent, which is why the share menu omits it. Only worth it if there
  is capacity to make graphics; otherwise skip.

Recommended if pursuing option 2: **claim every handle now** (cheap insurance
against impersonation), but **only actively run Bluesky plus one of X/LinkedIn**
to start, chosen by whether the near-term goal is voter reach (X) or newsroom
sales (LinkedIn).

## How deep-linked shares would tie back

If QTV runs accounts, the share copy can do double duty:

- Append a light attribution to the share text (e.g. a trailing `via @quizthevote`
  on X/Bluesky) so shares are discoverable and taggable. Keep it out of the URL
  so it never interferes with the newsroom's own analytics.
- Add a UTM tag to the fallback quizthevote.com URL (not the newsroom URL) so QTV
  can see how much traffic its own shares generate without touching partner data.
- Longer term, a per-quiz "share card" (Open Graph image showing the race and a
  teaser) makes shares look far better in feeds. That is a real project: it needs
  an image render per quiz, which a static site cannot do without either
  pre-rendering or a small image service — the same infrastructure question the
  data-capture memo raises.

## Recommendation

Ship the attribution-only MVP (done). Separately, and only if a named person will
own it: claim all handles, stand up **Bluesky first**, and revisit X vs LinkedIn
after one election cycle of the share feature being live, using whatever the
data-capture experiment reveals about where shares actually come from. Do not
open five accounts at once.
