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
