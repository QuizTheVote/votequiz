<script>
  import '../app.css';
</script>

<!--
  The layout deliberately renders nothing but the page.

  Each route owns its own header and its own <main>: the quiz uses the minimal
  Navbar, because it is embedded in an iframe on a newsroom's site and must not
  offer links that navigate the reader away, while the public pages use SiteNav
  with the full link set. Rendering a header here as well gave the public pages
  two stacked headers and every page a <main> nested inside another <main>.
-->
<slot />
