# WordPress embed generator

The page at `quizthevote.com/build-your-quiz/` is where newsrooms turn a Google
Sheet URL into an iframe snippet. It is the entry point to the whole product, and
until now its code existed only inside WordPress, with no history and no review.

## Files

| File | What it is |
| --- | --- |
| `build-your-quiz.live-capture.js` | The generator script exactly as served from the live page on 2026-07-31. A record of what is actually running, not something to edit. |
| `build-your-quiz.live-capture.html` | The markup the script binds to, captured at the same time. Element ids matter: `qtv-url`, `qtv-gen`, `qtv-err`, `qtv-results`, `qtv-direct`, `qtv-embed`, `qtv-test`, `qtv-height`, `qtv-hval`, `qtv-frame`. |
| `build-your-quiz.fixed.js` | A drop-in replacement that fixes the published-URL bug. Not yet deployed. |

These were recovered by fetching the public page, so they are a faithful record
of the output but not necessarily of the source. See U8 in
[../docs/UNKNOWNS.md](../docs/UNKNOWNS.md): the snippet reportedly lives in a
Headers and Footers plugin, and exporting it from WP admin would confirm whether
anything else is wrapped around it.

## What the live generator does

- Base URL: `https://quizthevote.github.io/votequiz/`
- Emits `?sheet=<id>&svo=true`, always. It never sets `demo`, `header` or `title`.
- Height slider: 600 to 1200, default 900.
- Adds a "Powered by QuizTheVote" line outside the iframe.

## The bug in the live version

`extractId` tests the published-to-web pattern first:

```js
m=u.match(/\/spreadsheets\/d\/e\/([\w-]+)/); if(m)return m[1];
m=u.match(/\/spreadsheets\/d\/([\w-]+)/);   if(m)return m[1];
```

The `/d/e/` form is the "Publish to web" URL and carries an opaque `2PACX` token
instead of the sheet id. Those tokens run to roughly 89 characters and the app
requires 30 to 50, so the quiz fails with a generic message that gives no clue
what went wrong.

This matters because the setup instructions ask newsrooms to publish their
`Quiz_Data` tab. Having just done so, the publish dialog's URL is the one in
their clipboard. Every instruction document has to warn against pasting it, which
is a sign the tool should simply reject it.

`build-your-quiz.fixed.js` reverses the order, names the mistake, and also checks
the id length so the failure is caught in the builder rather than in the quiz.

## Deploying a change

1. WP admin, the Headers and Footers plugin, the `build-your-quiz` snippet.
2. Replace the script contents with `build-your-quiz.fixed.js`.
3. Test all of these in the builder before leaving:
   - a normal sheet URL, `https://docs.google.com/spreadsheets/d/1B08mC5.../edit`
   - a published URL containing `2PACX`, which must be refused with an explanation
   - a bare sheet id
   - nonsense text
4. Copy whatever you saved back into this directory so the two stay in step.

Note there is a third implementation of this same logic in the app itself, at
`src/routes/newsroom/+page.svelte`. Three copies of one string concatenation will
drift; consolidating them is worth doing.
