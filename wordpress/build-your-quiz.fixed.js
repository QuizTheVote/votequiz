/**
 * Replacement for the embed generator on quizthevote.com/build-your-quiz/.
 *
 * Paste this over the existing snippet in WP admin. It differs from
 * build-your-quiz.live-capture.js in one behaviour and is otherwise identical.
 *
 * The live version tests the "Publish to web" URL pattern first:
 *
 *     m=u.match(/\/spreadsheets\/d\/e\/([\w-]+)/); if(m)return m[1];
 *
 * That pattern captures a 2PACX token rather than the sheet id. The setup
 * instructions tell newsrooms to publish their Quiz_Data tab, so that URL is
 * right there to be copied, and pasting it produced an id the app rejects and a
 * generic "failed to load" message with no hint at the cause.
 *
 * This version refuses that URL and says which one to use instead.
 */
(function () {
  var BASE = 'https://quizthevote.github.io/votequiz/';

  function isPublishedUrl(u) {
    return /\/spreadsheets\/d\/e\//.test(u) || u.indexOf('2PACX') !== -1;
  }

  function extractId(u) {
    u = (u || '').trim();
    var m;
    m = u.match(/\/spreadsheets\/d\/([\w-]+)/);
    if (m) return m[1];
    m = u.match(/[?&]sheet=([\w-]+)/);
    if (m) return m[1];
    if (/^[\w-]{20,}$/.test(u)) return u;
    return null;
  }

  function srcFor(id) {
    return BASE + '?sheet=' + id + '&svo=true';
  }

  var $ = function (i) {
    return document.getElementById(i);
  };
  var url = $('qtv-url'),
    gen = $('qtv-gen'),
    err = $('qtv-err'),
    res = $('qtv-results'),
    direct = $('qtv-direct'),
    embed = $('qtv-embed'),
    test = $('qtv-test'),
    height = $('qtv-height'),
    hval = $('qtv-hval'),
    frame = $('qtv-frame');

  function fail(message) {
    err.textContent = message;
    err.style.display = 'block';
    res.classList.add('hidden');
  }

  function render() {
    var raw = (url.value || '').trim();

    if (isPublishedUrl(raw)) {
      fail(
        'That is the "Publish to web" link, which does not contain your sheet ID. ' +
          'Open your sheet normally and copy the URL from your browser address bar, ' +
          'the part between /d/ and /edit.'
      );
      return;
    }

    var id = extractId(raw);
    if (!id) {
      fail(
        'That does not look like a Google Sheets URL. It should look like ' +
          'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit'
      );
      return;
    }

    // The app requires 30 to 50 characters, so catch a short id here rather
    // than letting the quiz fail with a generic message.
    if (id.length < 30 || id.length > 50) {
      fail(
        'The ID found in that URL is ' +
          id.length +
          ' characters long, and Google Sheet IDs are about 44. Please check the URL.'
      );
      return;
    }

    err.style.display = 'none';
    var h = height.value,
      src = srcFor(id);
    direct.value = src;
    test.href = src;
    embed.value =
      '<iframe src="' +
      src +
      '" width="100%" height="' +
      h +
      '" frameborder="0" scrolling="yes" style="border:none;border-radius:8px;"></iframe>';
    frame.src = src;
    frame.height = h;
    res.classList.remove('hidden');
  }

  gen.addEventListener('click', render);
  url.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') render();
  });
  height.addEventListener('input', function () {
    hval.textContent = height.value + 'px';
    if (!res.classList.contains('hidden')) render();
  });
  document.querySelectorAll('.qtvgen [data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var el = $(b.getAttribute('data-copy'));
      el.select();
      var done = function () {
        var t = b.textContent;
        b.textContent = 'Copied!';
        setTimeout(function () {
          b.textContent = t;
        }, 1400);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(el.value).then(done, done);
      } else {
        document.execCommand('copy');
        done();
      }
    });
  });
})();
