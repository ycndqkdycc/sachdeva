/* ============================================================
   BEHL COLLECTION — interactions & animations
   ============================================================ */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined';
  if (hasGSAP && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  /* ---------------- preloader ---------------- */
  var preloader = document.querySelector('.preloader');
  var countEl = document.querySelector('.preloader__count');
  var barEl = document.querySelector('.preloader__bar span');

  function revealHero() {
    if (!hasGSAP || reduceMotion) return;
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero__word', { yPercent: 118, duration: 1.25, stagger: 0.12 }, 0)
      .from('.hero__eyebrow .line > span', { yPercent: 120, duration: 0.9, stagger: 0.08 }, 0.25)
      .from('.hero__sub .line > span', { yPercent: 120, duration: 0.95, stagger: 0.08 }, 0.45)
      .from('.hero__cta .btn', { y: 34, opacity: 0, duration: 0.85, stagger: 0.1 }, 0.7)
      .from('.hero__float', { y: 90, opacity: 0, rotate: function (i) { return i % 2 ? 4 : -4; }, duration: 1.4, stagger: 0.14 }, 0.35)
      .from('.hero__scroll, .hero__edge', { opacity: 0, duration: 1 }, 1.1)
      .from('.nav', { y: -60, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.5);
  }

  function finishLoad() {
    document.documentElement.classList.remove('is-loading');
    document.body.classList.remove('is-loading');
    if (!preloader) return;
    if (!hasGSAP || reduceMotion) { preloader.classList.add('is-done'); revealHero(); return; }
    var tl = gsap.timeline({
      onComplete: function () { preloader.classList.add('is-done'); }
    });
    tl.to('.preloader__inner', { opacity: 0, y: -26, duration: 0.55, ease: 'power2.in' })
      .to('.preloader__panel--l', { xPercent: -101, duration: 1.05, ease: 'power4.inOut' }, 0.28)
      .to('.preloader__panel--r', { xPercent: 101, duration: 1.05, ease: 'power4.inOut' }, 0.28)
      .add(revealHero, 0.62);
  }

  if (preloader && hasGSAP && !reduceMotion) {
    var progress = { v: 0 };
    gsap.to(progress, {
      v: 100, duration: 1.7, ease: 'power2.inOut',
      onUpdate: function () {
        var p = Math.round(progress.v);
        countEl.textContent = p < 10 ? '00' + p : p < 100 ? '0' + p : p;
        barEl.style.width = progress.v + '%';
      },
      onComplete: finishLoad
    });
  } else {
    setTimeout(finishLoad, reduceMotion ? 0 : 600);
  }

  /* ---------------- custom cursor ---------------- */
  var cursor = document.querySelector('.cursor');
  if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches && hasGSAP) {
    var dot = cursor.querySelector('.cursor__dot');
    var ring = cursor.querySelector('.cursor__ring');
    var xD = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power2.out' });
    var yD = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power2.out' });
    var xR = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    var yR = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
    window.addEventListener('mousemove', function (e) {
      xD(e.clientX); yD(e.clientY); xR(e.clientX); yR(e.clientY);
    });
    document.querySelectorAll('[data-cursor="hover"]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('is-hover'); });
    });
    document.querySelectorAll('[data-cursor="view"]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('is-view'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('is-view'); });
    });
  }

  /* ---------------- magnetic buttons ---------------- */
  if (hasGSAP && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      var xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      var yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.32);
        yTo((e.clientY - r.top - r.height / 2) * 0.42);
      });
      el.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
    });
  }

  /* ---------------- nav: hide on scroll down ---------------- */
  var nav = document.getElementById('nav');
  var lastY = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    nav.classList.toggle('is-solid', y > 60);
    if (y > lastY && y > 260) nav.classList.add('is-hidden');
    else nav.classList.remove('is-hidden');
    lastY = y;
  }, { passive: true });

  /* ---------------- mobile menu ---------------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  var menuOpen = false;
  function setMenu(open) {
    menuOpen = open;
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (hasGSAP && !reduceMotion) {
      if (open) {
        gsap.timeline()
          .to('.menu__bg', { scaleY: 1, duration: 0.6, ease: 'power4.inOut' })
          .to('.menu__links a', { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out' }, 0.3)
          .to('.menu__foot', { opacity: 1, duration: 0.6 }, 0.6);
      } else {
        gsap.timeline()
          .to('.menu__links a', { opacity: 0, y: 30, duration: 0.3, ease: 'power2.in' })
          .to('.menu__foot', { opacity: 0, duration: 0.25 }, 0)
          .to('.menu__bg', { scaleY: 0, duration: 0.5, ease: 'power4.inOut', transformOrigin: 'bottom' }, 0.15)
          .set('.menu__bg', { transformOrigin: 'top' });
      }
    } else {
      menu.querySelector('.menu__bg').style.transform = open ? 'scaleY(1)' : 'scaleY(0)';
      menu.querySelectorAll('.menu__links a').forEach(function (a) { a.style.opacity = open ? 1 : 0; a.style.transform = 'none'; });
      menu.querySelector('.menu__foot').style.opacity = open ? 1 : 0;
    }
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(!menuOpen); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }

  /* ---------------- split text into words ---------------- */
  function splitWords(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var words = node.textContent.split(/(\s+)/);
      var frag = document.createDocumentFragment();
      words.forEach(function (w) {
        if (!w) return;
        if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
        var outer = document.createElement('span');
        outer.className = 'w';
        var inner = document.createElement('i');
        inner.textContent = w;
        outer.appendChild(inner);
        frag.appendChild(outer);
      });
      node.parentNode.replaceChild(frag, node);
    });
    return el.querySelectorAll('.w > i');
  }

  /* ---------------- scroll reveals ---------------- */
  if (hasGSAP && typeof ScrollTrigger !== 'undefined' && !reduceMotion) {
    document.querySelectorAll('[data-split]').forEach(function (el) {
      var parts = splitWords(el);
      gsap.from(parts, {
        yPercent: 115, duration: 1, ease: 'power4.out', stagger: 0.035,
        scrollTrigger: { trigger: el, start: 'top 82%' }
      });
    });

    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%' }
      });
    });

    document.querySelectorAll('[data-reveal-card]').forEach(function (el, i) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: (i % 4) * 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    document.querySelectorAll('[data-reveal-img]').forEach(function (el) {
      var img = el.querySelector('img');
      var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%' } });
      tl.to(el, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power4.inOut' })
        .to(img, { scale: 1, duration: 1.5, ease: 'power3.out' }, 0);
    });

    /* counters */
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: function () {
          gsap.to(obj, {
            v: target, duration: 2, ease: 'power2.out',
            onUpdate: function () {
              el.textContent = Math.round(obj.v).toLocaleString('en-IN') + suffix;
            }
          });
        }
      });
    });

    /* hero floats: parallax on scroll + gentle mouse drift */
    gsap.utils.toArray('.hero__float').forEach(function (el, i) {
      gsap.to(el, {
        yPercent: (i + 1) * -14, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    });
    var heroEl = document.querySelector('.hero');
    if (heroEl && window.matchMedia('(hover: hover)').matches) {
      heroEl.addEventListener('mousemove', function (e) {
        var cx = e.clientX / window.innerWidth - 0.5;
        var cy = e.clientY / window.innerHeight - 0.5;
        document.querySelectorAll('.hero__float').forEach(function (el, i) {
          var d = (i + 1) * 9;
          gsap.to(el, { x: cx * d, rotate: cx * (i % 2 ? 1.4 : -1.4), duration: 1.1, ease: 'power2.out', overwrite: 'auto' });
        });
        gsap.to('.hero__glow', { x: cx * 40, y: cy * 30, duration: 1.4, ease: 'power2.out', overwrite: 'auto' });
      });
    }

    /* gold shimmer on hero title */
    gsap.to('.hero__word:not(.hero__word--it)', {
      backgroundPosition: '-220% 0', duration: 4.5, ease: 'sine.inOut', repeat: -1, delay: 2
    });

    /* generic parallax elements */
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var amt = parseFloat(el.getAttribute('data-parallax'));
      gsap.to(el, {
        y: amt, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* lookbook horizontal pin (desktop only) */
    var mm = gsap.matchMedia();
    mm.add('(min-width: 761px)', function () {
      var rail = document.getElementById('rail');
      if (!rail) return;
      var scrollLen = function () { return rail.scrollWidth - window.innerWidth + 120; };
      gsap.to(rail, {
        x: function () { return -scrollLen(); },
        ease: 'none',
        scrollTrigger: {
          trigger: '.lookbook',
          start: 'top top',
          end: function () { return '+=' + scrollLen(); },
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
      gsap.utils.toArray('.lb').forEach(function (fig) {
        gsap.from(fig, {
          opacity: 0, y: 70, duration: 0.9, ease: 'power3.out',
          scrollTrigger: {
            trigger: fig, containerAnimation: gsap.getProperty(rail, 'x') !== undefined ? undefined : undefined,
            start: 'left 95%'
          },
          delay: 0.05
        });
      });
    });

    /* marquee speed reacts to scroll direction */
    var track = document.querySelector('.marquee__track');
    if (track) {
      var lastScroll = 0;
      window.addEventListener('scroll', function () {
        var dy = window.scrollY - lastScroll;
        lastScroll = window.scrollY;
        var dir = dy >= 0 ? 1 : -1;
        track.style.animationDirection = dir > 0 ? 'normal' : 'reverse';
      }, { passive: true });
    }

    /* footer parallax flourish */
    gsap.from('.footer__top', {
      y: 60, opacity: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.footer', start: 'top 90%' }
    });
  } else {
    /* no GSAP / reduced motion — ensure everything is visible */
    document.querySelectorAll('[data-reveal], [data-reveal-card]').forEach(function (el) {
      el.style.opacity = 1; el.style.transform = 'none';
    });
    document.querySelectorAll('[data-reveal-img]').forEach(function (el) {
      el.style.clipPath = 'none';
    });
    document.querySelectorAll('[data-count]').forEach(function (el) {
      el.textContent = parseInt(el.getAttribute('data-count'), 10).toLocaleString('en-IN') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* smooth anchor offset for fixed nav */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - (id === '#top' ? 0 : 20);
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
})();
