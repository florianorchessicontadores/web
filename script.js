/* Florián Orchessi & Asociados — interacciones mínimas (sin dependencias) */
(function () {
  var d = document;
  d.documentElement.classList.remove('no-js');

  // Menú móvil accesible
  var b = d.querySelector('.burger'), m = d.querySelector('.menu');
  if (b && m) {
    var set = function (o) {
      m.classList.toggle('open', o); b.classList.toggle('open', o);
      b.setAttribute('aria-expanded', o); d.body.style.overflow = o ? 'hidden' : '';
    };
    b.addEventListener('click', function () { set(!m.classList.contains('open')); });
    m.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    window.addEventListener('resize', function () { if (innerWidth > 820) set(false); });
  }

  // Línea inferior del navbar al hacer scroll
  var nav = d.querySelector('.nav');
  var onScroll = function () { if (nav) nav.classList.toggle('scrolled', scrollY > 8); };
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  // Animaciones de entrada discretas
  var els = d.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  } else { els.forEach(function (e) { e.classList.add('in'); }); }

  // Formulario de contacto (FormSubmit vía AJAX; sin JS funciona como envío normal)
  var f = d.getElementById('contact-form');
  if (f) {
    var st = d.getElementById('form-status'), btn = f.querySelector('button[type=submit]');
    var label = btn.textContent, t0 = Date.now(), busy = false, sent = false;
    var show = function (type, html) { st.className = 'form-msg ' + type; st.innerHTML = html; st.hidden = false; };
    var WA = '<a href="https://wa.me/51949943032" target="_blank" rel="noopener">WhatsApp</a>';
    var MAIL = '<a href="mailto:gerencia@florianorchessi.com">gerencia@florianorchessi.com</a>';
    var done = function () { busy = false; btn.disabled = sent; btn.textContent = sent ? 'Enviado' : label; };
    f.addEventListener('input', function () { if (sent) { sent = false; btn.disabled = false; btn.textContent = label; } });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (busy || sent) return;                                   // evita envíos dobles
      if (!f.checkValidity()) { f.reportValidity(); return; }     // campos obligatorios y formato de correo
      if (f.elements._honey && f.elements._honey.value) return;   // trampa anti-spam: los bots la rellenan
      if (Date.now() - t0 < 2500) { show('err', 'Por favor, revise los datos e inténtelo nuevamente en unos segundos.'); return; }
      busy = true; btn.disabled = true; btn.textContent = 'Enviando…'; st.hidden = true;
      var data = {}; new FormData(f).forEach(function (v, k) { data[k] = v; });
      var ctl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 20000);
      fetch(f.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data), signal: ctl ? ctl.signal : undefined
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (x) {
          clearTimeout(timer);
          if (x.ok && (x.j.success === true || x.j.success === 'true')) {
            sent = true; f.reset(); show('ok', '<strong>¡Gracias!</strong> Hemos recibido su solicitud. Un consultor se pondrá en contacto con usted.');
          } else {
            show('err', 'No pudimos enviar su mensaje en este momento. Inténtelo nuevamente o escríbanos por ' + WA + ' o a ' + MAIL + '.');
          }
          done();
        })
        .catch(function () {
          clearTimeout(timer);
          show('err', 'No pudimos enviar su mensaje (revise su conexión). Inténtelo nuevamente o escríbanos por ' + WA + ' o a ' + MAIL + '.');
          done();
        });
    });
  }
})();
