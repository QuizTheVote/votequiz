(function(){
  var BASE="https://quizthevote.github.io/votequiz/";
  function extractId(u){u=(u||"").trim();var m;
    m=u.match(/\/spreadsheets\/d\/e\/([\w-]+)/); if(m)return m[1];
    m=u.match(/\/spreadsheets\/d\/([\w-]+)/);   if(m)return m[1];
    m=u.match(/[?&]sheet=([\w-]+)/);            if(m)return m[1];
    if(/^[\w-]{20,}$/.test(u))return u; return null;}
  function srcFor(id){return BASE+"?sheet="+id+"&svo=true";}
  var $=function(i){return document.getElementById(i);};
  var url=$("qtv-url"),gen=$("qtv-gen"),err=$("qtv-err"),res=$("qtv-results"),
      direct=$("qtv-direct"),embed=$("qtv-embed"),test=$("qtv-test"),
      height=$("qtv-height"),hval=$("qtv-hval"),frame=$("qtv-frame");
  function render(){
    var id=extractId(url.value);
    if(!id){err.style.display="block";return;}
    err.style.display="none";
    var h=height.value, src=srcFor(id);
    direct.value=src; test.href=src;
    embed.value='<iframe src="'+src+'" width="100%" height="'+h+'" frameborder="0" scrolling="yes" style="border:none;border-radius:8px;"></iframe>';
    frame.src=src; frame.height=h; res.classList.remove("hidden");
  }
  gen.addEventListener("click",render);
  url.addEventListener("keydown",function(e){if(e.key==="Enter")render();});
  height.addEventListener("input",function(){hval.textContent=height.value+"px";if(!res.classList.contains("hidden"))render();});
  document.querySelectorAll(".qtvgen [data-copy]").forEach(function(b){
    b.addEventListener("click",function(){
      var el=$(b.getAttribute("data-copy")); el.select();
      var done=function(){var t=b.textContent;b.textContent="Copied!";setTimeout(function(){b.textContent=t;},1400);};
      if(navigator.clipboard){navigator.clipboard.writeText(el.value).then(done,done);}else{document.execCommand("copy");done();}
    });
  });
})();
