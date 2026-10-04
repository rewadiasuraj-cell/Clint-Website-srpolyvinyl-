/* S. R. Polyvinyl Ltd. — site behaviour */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.remove("no-js");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) doc.classList.add("reduced");

  /* Sticky header */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    // hysteresis: shrink past 40px, grow back only near the top
    var y = window.scrollY;
    if (y > 40) header.classList.add("is-sticky");
    else if (y < 8) header.classList.remove("is-sticky");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var burger = document.querySelector(".hamburger");
  var nav = document.querySelector(".nav-wrap");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.classList.toggle("active", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.classList.remove("active");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
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
      if (!reduced && !paused && slides.length > 1) timer = setInterval(function () { go(current + 1); }, 6500);
    }
    var hero = document.querySelector(".hero");
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
  var watched = document.querySelectorAll("[data-anim], [data-count], .band");
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
    var CYCLE = 32; // seconds for one full set of cards
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
