/* Blog de Florián Orchessi & Asociados — sin dependencias.
   Lee blog/lista.txt (un nombre de archivo .md por línea) y muestra las noticias.
   - recursos.html  -> tarjetas (#blog-lista) con filtros (#blog-filtros)
   - noticia.html   -> noticia completa (?p=nombre-del-archivo) */
(function () {
  var BASE = "blog/";
  var MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  var $ = function (s) { return document.querySelector(s); };
  var sinTilde = function (s) { return s.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); };
  var esc = function (s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); };

  function safeUrl(u) { u = u.trim(); return /^(https?:\/\/|mailto:|#|[\w\-\/.%]+$)/i.test(u) ? u : "#"; }

  function inline(s) {
    s = esc(s);
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, function (m, a, u) { return "<img src=\"" + safeUrl(u) + "\" alt=\"" + a + "\" loading=\"lazy\">"; });
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, t, u) {
      var x = safeUrl(u), ext = /^https?:/i.test(x);
      return "<a href=\"" + x + "\"" + (ext ? " target=\"_blank\" rel=\"noopener\"" : "") + ">" + t + "</a>";
    });
    return s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  }

  /* Markdown básico: ## título, ### subtítulo, - listas, **negrita**, *cursiva*, [texto](enlace), ![alt](imagen) */
  function md(src) {
    var out = [], p = [], l = [];
    function fp() { if (p.length) { out.push("<p>" + inline(p.join(" ")) + "</p>"); p = []; } }
    function fl() { if (l.length) { out.push("<ul>" + l.map(function (x) { return "<li>" + inline(x) + "</li>"; }).join("") + "</ul>"); l = []; } }
    src.replace(/\r/g, "").split("\n").forEach(function (r) {
      var t = r.trim(), m;
      if (!t) { fp(); fl(); return; }
      if ((m = t.match(/^(#{2,3})\s+(.*)/))) { fp(); fl(); out.push("<h" + m[1].length + ">" + inline(m[2]) + "</h" + m[1].length + ">"); return; }
      if ((m = t.match(/^[-*]\s+(.*)/))) { fp(); l.push(m[1]); return; }
      fl(); p.push(t);
    });
    fp(); fl();
    return out.join("\n");
  }

  function parse(txt) {
    txt = txt.replace(/^\uFEFF/, "").replace(/\r/g, "").replace(/^---\n/, "");
    var i = txt.indexOf("\n---"), head = i < 0 ? "" : txt.slice(0, i), body = i < 0 ? txt : txt.slice(i + 4), m = {};
    head.split("\n").forEach(function (ln) {
      var k = sinTilde(ln).match(/^([a-z]+)\s*:\s*(.*)$/i);
      if (k) m[k[1].toLowerCase()] = ln.slice(ln.indexOf(":") + 1).trim();
    });
    m.body = body.replace(/^\s*\n/, "");
    return m;
  }

  function hoy() { var d = new Date(), z = function (n) { return (n < 10 ? "0" : "") + n; }; return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()); }
  function fechaBonita(f) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(f || ""); return m ? (+m[3]) + " de " + MESES[+m[2] - 1] + " de " + m[1] : (f || ""); }

  function cargar() {
    return fetch(BASE + "lista.txt").then(function (r) { if (!r.ok) throw new Error("lista"); return r.text(); }).then(function (t) {
      var nombres = t.replace(/\r/g, "").split("\n").map(function (x) { return x.trim(); }).filter(function (x) { return x && x.charAt(0) !== "#"; });
      return Promise.all(nombres.map(function (n) {
        return fetch(BASE + encodeURI(n)).then(function (r) { if (!r.ok) throw 0; return r.text(); })
          .then(function (c) { var p = parse(c); p.slug = n.replace(/\.md$/i, ""); return p; }).catch(function () { return null; });
      }));
    }).then(function (ps) {
      return ps.filter(function (p) { return p && p.titulo && (!p.fecha || p.fecha <= hoy()); })   /* fecha futura = programada, no se muestra aún */
        .sort(function (a, b) { return (b.fecha || "").localeCompare(a.fecha || ""); });
    });
  }

  function lista(ps) {
    var cont = $("#blog-lista"), fil = $("#blog-filtros"), vacio = $("#blog-vacio");
    if (!ps.length) { vacio.hidden = false; return; }
    var cats = []; ps.forEach(function (p) { if (p.categoria && cats.indexOf(p.categoria) < 0) cats.push(p.categoria); });
    function pintar(cat) {
      cont.innerHTML = ps.filter(function (p) { return !cat || p.categoria === cat; }).map(function (p) {
        return "<a class=\"post\" href=\"noticia.html?p=" + encodeURIComponent(p.slug) + "\">" +
          (p.imagen ? "<div class=\"post-img\"><img src=\"" + safeUrl(p.imagen) + "\" alt=\"\" loading=\"lazy\"></div>" : "") +
          "<div class=\"post-body\"><span class=\"post-meta\">" + esc(fechaBonita(p.fecha)) + (p.categoria ? " · " + esc(p.categoria) : "") + "</span>" +
          "<h3>" + esc(p.titulo) + "</h3>" + (p.resumen ? "<p>" + esc(p.resumen) + "</p>" : "") +
          "<span class=\"more\">Leer más</span></div></a>";
      }).join("");
    }
    if (cats.length > 1) {
      fil.innerHTML = ["Todos"].concat(cats).map(function (c, i) { return "<button type=\"button\" class=\"chip\" data-c=\"" + (i ? esc(c) : "") + "\" aria-pressed=\"" + (i === 0) + "\">" + esc(c) + "</button>"; }).join("");
      fil.addEventListener("click", function (e) {
        var b = e.target.closest(".chip"); if (!b) return;
        fil.querySelectorAll(".chip").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        pintar(b.getAttribute("data-c"));
      });
    }
    pintar("");
  }

  function noticia(ps) {
    var slug = new URLSearchParams(location.search).get("p"), p = ps.filter(function (x) { return x.slug === slug; })[0], c = $("#n-cuerpo");
    if (!p) { c.innerHTML = "<p>No encontramos esta noticia. Puede que haya sido retirada.</p>"; return; }
    document.title = p.titulo + " | Florián Orchessi & Asociados";
    var d = $("meta[name=description]"); if (d && p.resumen) d.setAttribute("content", p.resumen);
    $("#n-titulo").textContent = p.titulo;
    $("#n-cat").textContent = p.categoria || "Noticia";
    $("#n-fecha").textContent = fechaBonita(p.fecha);
    c.innerHTML = (p.imagen ? "<img class=\"n-img\" src=\"" + safeUrl(p.imagen) + "\" alt=\"" + esc(p.titulo) + "\">" : "") + md(p.body);
  }

  var esLista = $("#blog-lista"), esNoticia = $("#n-cuerpo");
  if (!esLista && !esNoticia) return;
  cargar().then(function (ps) { esLista ? lista(ps) : noticia(ps); }).catch(function () {
    var e = $("#blog-error") || $("#n-cuerpo");
    if (e) { e.hidden = false; e.innerHTML = "<p>No se pudo cargar el blog. Si abriste el archivo con doble clic, publícalo en GitHub Pages o usa un servidor local.</p>"; }
  });
})();
