// Page shell: nav, footer, theme, progress bar, back-to-top, copy email, print.
(function () {
  const EMAIL = 'RichardPriest19@gmail.com';
  const SECTIONS = [
    ['#fit', 'Why me'],
    ['#proof', 'Track record'],
    ['#deals', 'M&A'],
    ['#year', 'First year'],
    ['#contact', 'Contact'],
  ];

  // theme first, so there is no flash
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  const saved = store.get('perch-theme');
  if (saved) document.documentElement.dataset.theme = saved;

  const nav = document.createElement('nav');
  nav.className = 'top';
  nav.innerHTML = `<div class="wrap">
    <a class="name" href="#">Richard Priest<small>IT Director · Perch Group</small></a>
    <div class="links" id="navLinks">${SECTIONS.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</div>
    <button class="iconbtn" id="printBtn" title="Print or save as PDF" aria-label="Print this page">⎙</button>
    <button class="iconbtn" id="themeBtn" title="Light / dark" aria-label="Switch light or dark mode">◐</button>
    <button class="iconbtn" id="menuBtn" aria-label="Menu" aria-expanded="false">☰</button>
  </div>`;
  const bar = document.createElement('div');
  bar.id = 'progress';
  document.body.prepend(nav);
  document.body.prepend(bar);

  const footer = document.createElement('footer');
  footer.className = 'site';
  footer.id = 'contact';
  footer.innerHTML = `<div class="wrap">
    <div class="eyebrow">Contact</div>
    <h2 style="margin-top:8px">Let's talk about Perch's IT.</h2>
    <p style="opacity:.85;margin:0">I'm based in the North West and happy with the hybrid pattern across Spinningfields and Blackpool, plus being the out-of-hours escalation point.</p>
    <div class="cols">
      <a class="btn primary" href="mailto:${EMAIL}?subject=IT%20Director%20-%20Perch%20Group">Email me</a>
      <button class="btn ghost" id="copyEmail" type="button">Copy email address</button>
      <a class="btn ghost" href="https://www.linkedin.com/in/richardpriest" target="_blank" rel="noopener">LinkedIn</a>
      <a class="btn ghost" href="assets/Richard_Priest_CV.docx" download>Download CV (Word)</a>
    </div>
    <p style="font-size:13px;opacity:.6;margin-top:28px">An independent candidate profile, not affiliated with or endorsed by Perch Group.</p>
  </div>`;
  document.body.append(footer);

  const top = document.createElement('button');
  top.id = 'toTop'; top.setAttribute('aria-label', 'Back to top'); top.textContent = '↑';
  const toast = document.createElement('div');
  toast.id = 'toast'; toast.setAttribute('role', 'status');
  document.body.append(top, toast);

  window.showToast = msg => {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => toast.classList.remove('show'), 1800);
  };

  document.getElementById('themeBtn').addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const nextTheme = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    store.set('perch-theme', nextTheme);
  });
  document.getElementById('printBtn').addEventListener('click', () => {
    document.querySelectorAll('details').forEach(d => d.open = true);
    print();
  });
  const menuBtn = document.getElementById('menuBtn'), links = document.getElementById('navLinks');
  menuBtn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  document.getElementById('copyEmail').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(EMAIL); showToast('Email address copied'); }
    catch (e) { showToast(EMAIL); }
  });

  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
    top.classList.toggle('show', scrollY > 600);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // wait for page scripts that render .reveal elements after this file loads
  document.addEventListener('DOMContentLoaded', () => {
    // the nav and page content are injected, so redo any #anchor jump once they exist
    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) addEventListener('load', () => target.scrollIntoView({ behavior: 'instant' }));
    }
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) return els.forEach(el => el.classList.add('in'));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  });
})();
