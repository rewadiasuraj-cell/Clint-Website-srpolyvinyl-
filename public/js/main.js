/* S. R. Polyvinyl Ltd. — site behaviour */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.remove("no-js");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) doc.classList.add("reduced");

  /* Pinned header & dynamic hero boundary transition */
  var header = document.querySelector(".site-header");
  function updateHeaderState() {
    if (!header) return;
    var hero = document.querySelector(".hero.tricon-hero, .hero-overlay");
    if (hero) {
      var headerH = header.offsetHeight || 70;
      var heroRect = hero.getBoundingClientRect();
      var isPast = heroRect.bottom <= headerH;
      header.classList.toggle("is-past-hero", isPast);
      header.classList.toggle("is-sticky", isPast);
    } else {
      header.classList.add("is-sticky", "is-past-hero");
    }
  }
  window.addEventListener("scroll", updateHeaderState, { passive: true });
  window.addEventListener("resize", updateHeaderState, { passive: true });
  window.addEventListener("orientationchange", updateHeaderState, { passive: true });
  window.addEventListener("pageshow", updateHeaderState);
  document.addEventListener("DOMContentLoaded", updateHeaderState);
  updateHeaderState();

  /* -------------------------------------------------------------
     Mobile Navigation Drawer & Submenu Interaction
     ------------------------------------------------------------- */
  var burger = document.querySelector(".hamburger");
  var nav = document.querySelector(".nav-wrap");
  var closeBtn = document.querySelector(".mobile-drawer-close");

  function openMobileNav() {
    if (!nav) return;
    nav.classList.add("open");
    if (burger) {
      burger.classList.add("active");
      burger.setAttribute("aria-expanded", "true");
    }
    document.body.classList.add("mobile-nav-open");
    document.documentElement.classList.add("mobile-nav-open");
  }

  function closeMobileNav() {
    if (!nav) return;
    nav.classList.remove("open");
    if (burger) {
      burger.classList.remove("active");
      burger.setAttribute("aria-expanded", "false");
    }
    document.body.classList.remove("mobile-nav-open");
    document.documentElement.classList.remove("mobile-nav-open");
  }

  if (burger) {
    burger.addEventListener("click", function (e) {
      e.stopPropagation();
      if (nav && nav.classList.contains("open")) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeMobileNav();
    });
  }

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav && nav.classList.contains("open")) {
      closeMobileNav();
      if (burger) burger.focus();
    }
  });

  // Mobile Products Submenu Accordion Toggle
  document.querySelectorAll(".mobile-submenu-toggle").forEach(function (toggle) {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var parentMenu = toggle.closest(".products-menu");
      var submenu = document.getElementById(toggle.getAttribute("aria-controls")) || 
                    (parentMenu ? parentMenu.querySelector(".mobile-submenu") : null);
      if (!parentMenu) return;

      var isExpanded = parentMenu.classList.toggle("is-submenu-open");
      toggle.setAttribute("aria-expanded", String(isExpanded));
      if (submenu) {
        submenu.setAttribute("aria-hidden", String(!isExpanded));
      }
    });
  });

  // Clicking any destination link closes the drawer and allows navigation
  if (nav) {
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMobileNav();
      });
    });
  }

  /* Hero slider */
  var slides = document.querySelectorAll(".hero .slide");
  var dotsWrap = document.querySelector(".slider-dots");
  if (slides.length) {
    var current = 0;
    var timer;
    var dots = [];
    slides.forEach(function (_, i) {
      if (!dotsWrap) return;
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Slide " + (i + 1));
      b.addEventListener("click", function () { go(i); restart(); });
      dotsWrap.appendChild(b);
      dots.push(b);
    });
    function go(i) {
      slides[current].classList.remove("active");
      if (dots[current]) dots[current].classList.remove("active");
      current = (i + slides.length) % slides.length;
      slides[current].classList.add("active");
      if (dots[current]) dots[current].classList.add("active");
    }
    var paused = false;
    function restart() {
      clearInterval(timer);
      if (!reduced && !paused && !userPaused && slides.length > 1) timer = setInterval(function () { go(current + 1); }, 3000);
    }
    var userPaused = false;
    var hero = document.querySelector(".hero");
    var pauseButton = hero.querySelector('.hero-pause');
    if (pauseButton) {
      if (reduced) pauseButton.hidden = true;
      pauseButton.addEventListener('click', function () {
        userPaused = !userPaused;
        pauseButton.textContent = userPaused ? 'Play slides' : 'Pause slides';
        pauseButton.setAttribute('aria-pressed', String(userPaused));
        restart();
      });
    }
    var prev = hero.querySelector(".slider-arrow.prev");
    var next = hero.querySelector(".slider-arrow.next");
    if (prev) prev.addEventListener("click", function () { go(current - 1); restart(); });
    if (next) next.addEventListener("click", function () { go(current + 1); restart(); });

    // Pause while the visitor is pointing at or focused inside the slider.
    function pause() { paused = true; clearInterval(timer); }
    function resume() { paused = false; restart(); }
    if (window.matchMedia && window.matchMedia("(hover: hover)").matches) {
      hero.addEventListener("mouseenter", pause);
      hero.addEventListener("mouseleave", resume);
    }
    hero.addEventListener("focusin", function (e) {
      if (e.target.matches && e.target.matches(":focus-visible")) pause();
    });
    hero.addEventListener("focusout", function () { if (paused) resume(); });

    // Swipe on touch screens.
    var startX = null, startY = null;
    hero.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    hero.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      startX = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        go(dx < 0 ? current + 1 : current - 1);
        restart();
      }
    }, { passive: true });

    hero.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { go(current - 1); restart(); }
      if (e.key === "ArrowRight") { go(current + 1); restart(); }
    });
    // Start with no slide active so the first one animates in.
    slides[0].classList.remove("active");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { go(0); restart(); });
    });
  }

  /* Scroll reveal (animate.css classes) + counters + line drawing */
  function reveal(el) {
    var name = el.getAttribute("data-anim");
    if (name) {
      var delay = el.getAttribute("data-delay");
      if (delay) el.style.animationDelay = delay;
      el.classList.add("animate__animated", "animate__" + name);
      // drop the animation classes when done so hover transforms work again
      el.addEventListener("animationend", function done(e) {
        if (e.target !== el) return;
        el.classList.remove("animate__animated", "animate__" + name);
        el.style.animationDelay = "";
        el.removeEventListener("animationend", done);
      });
    }
    if (el.hasAttribute("data-count")) countUp(el);
    el.classList.add("in-view");
  }
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var from = parseFloat(el.getAttribute("data-from")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduced) { el.textContent = target + suffix; return; }
    var start = null;
    var dur = 1800;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (target - from) * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var watched = document.querySelectorAll("[data-anim], [data-count], .band, .pr-sec, .pd-item, .pd-div");
  if ("IntersectionObserver" in window && !reduced) {
    // Counters start from zero so they don't flash the final value first.
    document.querySelectorAll("[data-count]").forEach(function (el) {
      el.textContent = (el.getAttribute("data-from") || "0") + (el.getAttribute("data-suffix") || "");
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    watched.forEach(function (el) { io.observe(el); });
  } else {
    watched.forEach(reveal);
  }

  /* Product images drift a few pixels inside their cards while scrolling */
  var prImgs = document.querySelectorAll(".pr-img img");
  if (prImgs.length && !reduced) {
    var prTick = false;
    var prMax = window.matchMedia("(max-width: 560px)").matches ? 3 : 6;
    function prDrift() {
      prTick = false;
      var vh = window.innerHeight;
      prImgs.forEach(function (img) {
        var r = img.parentNode.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var t = ((r.top + r.height / 2) - vh / 2) / vh; // -0.5 .. 0.5 while on screen
        img.style.setProperty("--py", (Math.max(-1, Math.min(1, t * 2)) * -prMax).toFixed(2) + "px");
      });
    }
    window.addEventListener("scroll", function () {
      if (!prTick) { prTick = true; requestAnimationFrame(prDrift); }
    }, { passive: true });
    prDrift();
  }

  /* Products page: highlight the pill of the section in view */
  var pills = document.querySelector(".pd-pills");
  if (pills) {
    var links = Array.prototype.slice.call(pills.querySelectorAll("a"));
    var targets = links.map(function (l) { return document.querySelector(l.getAttribute("href")); });
    var activeLink = null;
    function setActive(l) {
      if (l === activeLink) return;
      if (activeLink) activeLink.classList.remove("active");
      activeLink = l;
      if (!l) return;
      l.classList.add("active");
      if (pills.scrollWidth > pills.clientWidth) { // keep it in view on the swipe bar
        var left = l.offsetLeft - (pills.clientWidth - l.offsetWidth) / 2;
        pills.scrollTo({ left: left, behavior: reduced ? "auto" : "smooth" });
      }
    }
    var spyTick = false;
    function spy() {
      spyTick = false;
      var line = pills.getBoundingClientRect().bottom + 160, pick = null;
      targets.forEach(function (t, i) {
        if (t && t.getBoundingClientRect().top <= line) pick = links[i];
      });
      setActive(pick || links[0]);
    }
    window.addEventListener("scroll", function () {
      if (!spyTick) { spyTick = true; requestAnimationFrame(spy); }
    }, { passive: true });
    links.forEach(function (l) { l.addEventListener("click", function () { setActive(l); }); });
    spy();
  }

  /* Background videos: load only when near the screen, smaller file on phones,
     play only while visible; poster stays for reduced motion */
  document.querySelectorAll("video[data-src-mp4]").forEach(function (v) {
    if (reduced) return;
    var loaded = false;
    function load() {
      if (loaded) return;
      loaded = true;
      var phone = window.matchMedia("(max-width: 760px)").matches && v.dataset.srcMobileMp4;
      [["Webm", "video/webm"], ["Mp4", "video/mp4"]].forEach(function (t) {
        var url = v.dataset[(phone ? "srcMobile" : "src") + t[0]];
        if (!url) return;
        var src = document.createElement("source");
        src.src = url; src.type = t[1];
        v.appendChild(src);
      });
      v.load();
    }
    if (!("IntersectionObserver" in window)) { load(); v.play().catch(function () {}); return; }
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      if (e.isIntersecting && v.dataset.userPaused !== 'true') { load(); var pr = v.play(); if (pr) pr.catch(function () {}); }
      else if (loaded) v.pause();
    }, { rootMargin: "200px 0px" }).observe(v);
  });

  /* Distributor section: pellet textures drift at different speeds while scrolling */
  var distSec = document.querySelector(".dist-sec");
  if (distSec && !reduced) {
    var layers = [
      [distSec.querySelector(".dist-deco--bl"), -70],  // moves up as you scroll down
      [distSec.querySelector(".dist-deco--tr"), 55],   // moves down
      [distSec.querySelector(".dist-grid"), -18]       // cards float a little
    ].filter(function (l) { return l[0]; });
    var distTick = false;
    function distPar() {
      distTick = false;
      var r = distSec.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      var t = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2); // -1 .. 1 across the pass
      var k = window.matchMedia("(max-width: 760px)").matches ? .8 : 1;
      layers.forEach(function (l) { l[0].style.transform = "translate3d(0," + (t * l[1] * k).toFixed(1) + "px,0)"; });
    }
    window.addEventListener("scroll", function () {
      if (!distTick) { distTick = true; requestAnimationFrame(distPar); }
    }, { passive: true });
    window.addEventListener("resize", distPar);
    distPar();
  }

  /* 3D tilt on cards (mouse devices only) */
  if (!reduced && window.matchMedia && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", (x * 8).toFixed(2) + "deg");
        card.style.setProperty("--rx", (-y * 8).toFixed(2) + "deg");
      });
      card.addEventListener("mouseleave", function () {
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      });
    });
  }

  /* Client marquee: one row drifting right to left, looping without a jump */
  document.querySelectorAll("[data-marquee]").forEach(function (box) {
    var viewport = box.querySelector(".cm-viewport");
    var track = box.querySelector(".cm-track");
    var originals = Array.prototype.slice.call(track.children);
    if (!originals.length) return;
    var CYCLE = 16; // seconds for one full set of cards
    var setW = 0, pos = 0, speed = 0, target = reduced ? 0 : 1;
    var hovering = false, dragging = false, visible = true;
    var nudge = null, last = null;

    function cloneSet() {
      originals.forEach(function (el) {
        var c = el.cloneNode(true);
        c.setAttribute("aria-hidden", "true");
        track.appendChild(c);
      });
    }
    function measure() {
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      var first = originals[0].offsetLeft;
      var lastEl = originals[originals.length - 1];
      var w = lastEl.offsetLeft + lastEl.offsetWidth + gap - first;
      // keep enough copies so the row never runs out while looping
      while (track.scrollWidth < w * 2 + viewport.clientWidth) cloneSet();
      if (setW) pos = pos / setW * w;
      setW = w;
    }
    function wrap() {
      if (!setW) return;
      pos = ((pos % setW) + setW) % setW;
    }
    function paint() {
      track.style.transform = "translate3d(" + (-pos).toFixed(2) + "px,0,0)";
    }
    function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

    function frame(ts) {
      var dt = last === null ? 0 : Math.min((ts - last) / 1000, 0.05);
      last = ts;
      var want = hovering || dragging ? 0 : target;
      speed += (want - speed) * Math.min(1, dt * 3); // glide to a stop and back
      if (!dragging) pos += speed * (setW / CYCLE) * dt;
      if (nudge) {
        var p = Math.min((ts - nudge.start) / nudge.dur, 1);
        var e = ease(p);
        pos += (e - nudge.done) * nudge.dist;
        nudge.done = e;
        if (p >= 1) nudge = null;
      }
      wrap();
      paint();
      if (visible) requestAnimationFrame(frame);
      else last = null;
    }

    measure();
    paint();
    requestAnimationFrame(frame);
    window.addEventListener("resize", function () { measure(); wrap(); paint(); });
    window.addEventListener("load", function () { measure(); wrap(); paint(); });

    // stop the loop while the row is off screen
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var was = visible;
        visible = entries[0].isIntersecting;
        if (visible && !was) requestAnimationFrame(frame);
      }).observe(box);
    }

    if (window.matchMedia && window.matchMedia("(hover: hover)").matches) {
      box.addEventListener("mouseenter", function () { hovering = true; });
      box.addEventListener("mouseleave", function () { hovering = false; });
    }

    // drag with mouse, swipe with touch; vertical page scroll still works
    var startX = 0, startY = 0, startPos = 0, pid = null, decided = false;
    viewport.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      pid = e.pointerId; startX = e.clientX; startY = e.clientY; startPos = pos; decided = e.pointerType === "mouse";
      if (decided) { dragging = true; nudge = null; viewport.classList.add("is-dragging"); viewport.setPointerCapture(pid); }
    });
    viewport.addEventListener("pointermove", function (e) {
      if (e.pointerId !== pid) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      if (!decided) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        decided = true;
        if (Math.abs(dx) <= Math.abs(dy)) { pid = null; return; }
        dragging = true; nudge = null; speed = 0;
        viewport.classList.add("is-dragging");
        viewport.setPointerCapture(pid);
      }
      if (dragging) { pos = startPos - dx; wrap(); }
    });
    function release(e) {
      if (e.pointerId !== pid) return;
      pid = null;
      if (dragging) { dragging = false; speed = 0; viewport.classList.remove("is-dragging"); }
    }
    viewport.addEventListener("pointerup", release);
    viewport.addEventListener("pointercancel", release);

    // arrows glide one card, on top of the running drift
    function step(dir) {
      var card = originals[0].offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 0);
      var rest = nudge ? (1 - nudge.done) * nudge.dist : 0;
      nudge = { start: performance.now(), dur: 650, dist: dir * card + rest, done: 0 };
    }
    var prev = box.querySelector(".cm-arrow.prev");
    var next = box.querySelector(".cm-arrow.next");
    if (prev) prev.addEventListener("click", function () { step(-1); });
    if (next) next.addEventListener("click", function () { step(1); });
  });

  /* Read more toggle */
  document.querySelectorAll("[data-toggle]").forEach(function (btn) {
    var target = document.getElementById(btn.getAttribute("data-toggle"));
    if (!target) return;
    btn.addEventListener("click", function () {
      var open = target.classList.toggle("open");
      btn.firstChild.nodeValue = open ? "Read less " : "Read more ";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* Enquiry form: send by e-mail or WhatsApp (static hosting, no server) */
  var form = document.getElementById("enquiryForm");
  if (form) {
    function compose() {
      var d = new FormData(form);
      return [
        "Name: " + (d.get("name") || ""),
        "Company: " + (d.get("company") || ""),
        "Phone: " + (d.get("phone") || ""),
        "Email: " + (d.get("email") || ""),
        "Product: " + (d.get("product") || ""),
        "Enquiry type: " + (d.get("purpose") || ""),
        "Quantity: " + (d.get("quantity") || ""),
        "Delivery city: " + (d.get("location") || ""),
        "",
        String(d.get("message") || "")
      ].join("\n");
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var subject = "Website enquiry - " + (new FormData(form).get("product") || "General");
      window.location.href = "mailto:" + form.getAttribute("data-email") +
        "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(compose());
    });
    var wa = document.getElementById("sendWhatsApp");
    if (wa) {
      wa.addEventListener("click", function () {
        if (!form.reportValidity()) return;
        window.open("https://wa.me/" + form.getAttribute("data-whatsapp") +
          "?text=" + encodeURIComponent(compose()), "_blank", "noopener");
      });
    }
  }

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
