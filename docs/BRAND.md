# Brand assets in the quiz app

Everything here traces back to the client brand package at `~/elex-quiz-app/Client Files`,
which is not in this repository. This file records where each value came from so
that the next person does not have to re-derive it.

## Colours

Taken from `QuizTheVote_BrandGuide.pdf`, page 5, and cross-checked two ways: the
designer's WordPress build files in `Client Files/web-build/`, and the CSS that
quizthevote.com serves. All three agreed, which is why the values below are
stated without hedging.

| Guide name | Hex | Tailwind class |
|---|---|---|
| Deep blue-gray (primary) | `#283A47` | `ink-900` |
| Soft gray (primary) | `#50555B` | `ink-600` |
| Teal (primary) | `#008C95` | `brand-500` |
| Warm accent | `#BF9160` | `sand-500` |

The guide supplies three stops per family, a mid plus a lighter and a darker.
Everything else in each ramp is interpolated. The interpolation was arranged so
the shades the interface leans on hardest land on real brand values rather than
on invented ones; see the comment at the top of `tailwind.config.ts`.

Note one discrepancy, in case it resurfaces. The guide's warm accent is `#BF9160`,
a tan. The designer's web build instead used `#C0492B`, a rust red, in a few
places. This app follows the guide.

### Where red survives

Exactly one place: the banner shown when the spreadsheet cannot be loaded. Red is
reserved for genuine failure. It is deliberately *not* used for weak candidate
matches, for the "Competitive" value orientation, or for the newsroom setup
callout, all of which used to be red and none of which are failures. See
`KNOWN_ISSUES.md` for the reasoning.

## Fonts

Bonnie for display, Plus Jakarta Sans for interface text. The brand guide
positions Jakarta as the face for "interface design, longer-form content, and
environments where performance and accessibility are key", which is what most of
this app is.

Both are self-hosted from `static/fonts/`. They are deliberately not loaded from
Google: the quiz runs in an iframe on newsroom sites, and a third-party font
request would attach a newsroom's readers to another party's logs on that
newsroom's own page.

- Bonnie `woff2` files came ready-made in `Client Files/web-fonts/`. That folder
  also holds `qtv-bonnie-embedded.css`, a 300 KB file with the fonts inlined as
  base64. It is not used here; the plain `woff2` files are smaller and cacheable.
- Plus Jakarta Sans is a Google font and the package only ships desktop `ttf`
  files, so the `woff2` subsets were fetched from Google and committed. Latin,
  Latin Extended and **Vietnamese** are included; Vietnamese matters because
  candidate names in US local races need it.

Every face uses `font-display: swap`, and browsers only download a face that
something on the page actually renders in.

## Logo

`static/favicon.svg` and `src/lib/components/BrandMark.svelte` hold the same two
paths, the Q and its teal dot. Both were converted from
`Client Files/Logos/QuizTheVote_Favicon_A.eps`.

The mark is inlined as a Svelte component rather than loaded as a file so it
paints with the first render; as a separate request the header flashes empty on a
slow embed.

### Regenerating it

The package ships `eps`, `jpg` and `png` but no `svg`. To redo the conversion:

```sh
brew install ghostscript pdf2svg
gs -dNOPAUSE -dBATCH -dSAFER -sDEVICE=pdfwrite -dEPSCrop \
   -sOutputFile=mark.pdf "Client Files/Logos/QuizTheVote_Favicon_A.eps"
pdf2svg mark.pdf mark.svg
```

Then **re-pin the fill colours by hand**. Ghostscript converts the EPS's CMYK
through its own profile and lands near the brand values but not on them: the
teal came out `#1F9DA3` against a true `#008C95`, and the navy `#283E4E` against
a true `#283A47`. Close enough to look right in isolation and wrong beside
anything else on brand.

The tab icon PNGs are generated from the same source by the Pillow snippet in the
commit that added them.

## Not yet used

The package also contains halftone and vintage-grain textures, a primary logo, a
secondary logo and a wordmark, all in `Client Files/`. None are in the app. The
halftone patterns echo the button shape inside the Q and would suit section
backgrounds if the public pages ever want more depth.
