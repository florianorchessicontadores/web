/* Genera las tarjetas de Recursos y del Blog a partir de recursos-data.js y blog-data.js.
   No requiere edición: solo se modifican los archivos de datos. */
(function () {
  var d = document;
  var MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

  function el(tag, cls, text) { var e = d.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function str(v) { return typeof v === 'string' ? v.trim() : ''; }

  // true salvo que el servidor confirme que el archivo no existe (404/410). En file:// no se verifica.
  function exists(url) {
    if (location.protocol === 'file:' || !window.fetch) return Promise.resolve(true);
    return fetch(url, { method: 'HEAD', cache: 'no-cache' })
      .then(function (r) { return !(r.status === 404 || r.status === 410); })
      .catch(function () { return true; });
  }

  function fechaLarga(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    return m ? parseInt(m[3], 10) + ' de ' + MESES[parseInt(m[2], 10) - 1] + ' de ' + m[1] : '';
  }

  function chips(host, cats, onPick) {
    host.textContent = '';
    if (cats.length < 2) return;
    var all = ['Todos'].concat(cats), btns = [];
    all.forEach(function (c, i) {
      var b = el('button', 'chip', c); b.type = 'button'; b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        onPick(i === 0 ? null : c);
      });
      btns.push(b); host.appendChild(b);
    });
  }

  /* ---------- Recursos descargables ---------- */
  var rHost = d.getElementById('res-lista');
  if (rHost) {
    var carpeta = window.RECURSOS_CARPETA || 'recursos-archivos/';
    var items = (window.RECURSOS || []).filter(function (r) {
      return r && r.activo !== false && str(r.titulo) && str(r.archivo);
    }).map(function (r) {
      var cat = str(r.categoria) || 'Herramientas empresariales';
      var ext = (str(r.archivo).split('.').pop() || '').toUpperCase();
      var url = (str(r.carpeta) || carpeta).replace(/\/?$/, '/') + encodeURIComponent(str(r.archivo));
      return { t: str(r.titulo), d: str(r.descripcion), c: cat, url: url, file: str(r.archivo), btn: str(r.boton) || ('Descargar ' + (str(r.tipo) || ext)) };
    });

    Promise.all(items.map(function (i) { return exists(i.url); })).then(function (ok) {
      items = items.filter(function (_, k) { return ok[k]; });
      var order = (window.RECURSOS_CATEGORIAS || []).slice();
      items.forEach(function (i) { if (order.indexOf(i.c) < 0) order.push(i.c); });
      var cats = order.filter(function (c) { return items.some(function (i) { return i.c === c; }); });
      var chipHost = d.getElementById('res-filtros'), list = d.getElementById('res-lista');

      function draw(filter) {
        list.textContent = '';
        if (!items.length) { list.appendChild(el('p', 'res-empty', 'Próximamente publicaremos nuevas plantillas y herramientas descargables.')); return; }
        cats.forEach(function (c) {
          if (filter && filter !== c) return;
          var g = el('div', 'res-group'); g.appendChild(el('span', 'kicker', c));
          items.filter(function (i) { return i.c === c; }).forEach(function (i) {
            var row = el('div', 'res-row'), txt = el('div');
            txt.appendChild(el('h3', null, i.t)); if (i.d) txt.appendChild(el('p', null, i.d));
            var a = el('a', 'btn line', i.btn); a.href = i.url; a.setAttribute('download', i.file);
            row.appendChild(txt); row.appendChild(el('small', null, i.c)); row.appendChild(a); g.appendChild(row);
          });
          list.appendChild(g);
        });
      }
      if (chipHost) chips(chipHost, cats, draw);
      draw(null);
    });
  }

  /* ---------- Blog ---------- */
  var bHost = d.getElementById('blog-lista');
  if (bHost) {
    var posts = (window.BLOG_ARTICULOS || []).filter(function (p) {
      return p && str(p.titulo) && str(p.archivo) && str(p.resumen) && fechaLarga(str(p.fecha));
    }).sort(function (a, b) { return str(b.fecha).localeCompare(str(a.fecha)); });

    Promise.all(posts.map(function (p) { return exists(str(p.archivo)); })).then(function (ok) {
      posts = posts.filter(function (_, k) { return ok[k]; });
      var cats = [];
      posts.forEach(function (p) { var c = str(p.categoria); if (c && cats.indexOf(c) < 0) cats.push(c); });
      var chipHost = d.getElementById('blog-filtros');

      function draw(filter) {
        bHost.textContent = '';
        if (!posts.length) {
          bHost.className = 'blog-empty';
          bHost.textContent = 'Próximamente compartiremos artículos sobre actualidad tributaria, normativa de SUNAT, legislación laboral y obligaciones empresariales.';
          return;
        }
        bHost.className = 'post-grid';
        posts.forEach(function (p) {
          if (filter && str(p.categoria) !== filter) return;
          var art = el('article', 'post'), meta = el('div', 'post-meta');
          if (str(p.categoria)) meta.appendChild(el('span', 'tag', str(p.categoria)));
          var t = el('time', null, fechaLarga(str(p.fecha))); t.setAttribute('datetime', str(p.fecha)); meta.appendChild(t);
          var a = el('a', 'more', 'Leer artículo'); a.href = str(p.archivo); a.setAttribute('aria-label', 'Leer artículo: ' + str(p.titulo));
          art.appendChild(meta); art.appendChild(el('h3', null, str(p.titulo))); art.appendChild(el('p', null, str(p.resumen))); art.appendChild(a);
          var li = el('div'); li.appendChild(art); bHost.appendChild(li);
        });
      }
      if (chipHost) chips(chipHost, cats, draw);
      draw(null);
    });
  }
})();
