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
  var watched = document.querySelectorAll("[data-anim], [data-count], .band, .reveal-mask");
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

  /* Enquiry form: validation + success state (static site: hands off to email / WhatsApp) */
  var form = document.getElementById("enquiryForm");
  if (form) {
    var success = document.getElementById("formSuccess");
    var rules = {
      name: function (v) { return v.trim().length > 1; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      phone: function (v) { return v.replace(/[^0-9]/g, "").length >= 8; },
      requirement: function (v) { return !!v; },
      message: function (v) { return v.trim().length > 4; }
    };
    function check(field) {
      var rule = rules[field.name];
      if (!rule) return true;
      var ok = rule(field.value);
      field.parentNode.classList.toggle("invalid", !ok);
      field.setAttribute("aria-invalid", ok ? "false" : "true");
      return ok;
    }
    Object.keys(rules).forEach(function (n) {
      var f = form.elements[n];
      if (!f) return;
      f.addEventListener("blur", function () { if (f.value) check(f); });
      f.addEventListener("input", function () { if (f.parentNode.classList.contains("invalid")) check(f); });
    });
    function validate() {
      var first = null;
      Object.keys(rules).forEach(function (n) {
        var f = form.elements[n];
        if (f && !check(f) && !first) first = f;
      });
      if (first) first.focus();
      return !first;
    }
    function compose() {
      var d = new FormData(form);
      return [
        "Name: " + (d.get("name") || ""),
        "Company: " + (d.get("company") || ""),
        "Email: " + (d.get("email") || ""),
        "Phone: " + (d.get("phone") || ""),
        "Product / material: " + (d.get("product") || ""),
        "Requirement: " + (d.get("requirement") || ""),
        "",
        String(d.get("message") || "")
      ].join("\n");
    }
    function openWhatsApp() {
      window.open("https://wa.me/" + form.getAttribute("data-whatsapp") +
        "?text=" + encodeURIComponent(compose()), "_blank", "noopener");
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;
      var d = new FormData(form);
      var subject = "Website enquiry - " + (d.get("product") || d.get("requirement") || "General");
      window.location.href = "mailto:" + form.getAttribute("data-email") +
        "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(compose());
      if (success) {
        var nm = String(d.get("name") || "").trim().split(" ")[0];
        var slot = success.querySelector("[data-success-name]");
        if (slot) slot.textContent = nm ? ", " + nm : "";
        form.hidden = true;
        success.classList.add("show");
        success.focus();
      }
    });
    var wa = document.getElementById("sendWhatsApp");
    if (wa) wa.addEventListener("click", function () { if (validate()) openWhatsApp(); });
    var wa2 = document.getElementById("successWhatsApp");
    if (wa2) wa2.addEventListener("click", openWhatsApp);
    var again = document.getElementById("newEnquiry");
    if (again) again.addEventListener("click", function () {
      form.reset(); form.hidden = false; success.classList.remove("show");
      form.elements.name.focus();
    });
    var pre = new URLSearchParams(location.search).get("product");
    if (pre) {
      var sel = form.elements.product;
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].text.toLowerCase() === pre.toLowerCase()) { sel.selectedIndex = i; break; }
      }
    }
  }

  /* Product explorer: category tabs, search and filters */
  document.querySelectorAll(".px").forEach(function (px) {
    var cards = [].slice.call(px.querySelectorAll(".pcard"));
    var limit = parseInt(px.getAttribute("data-limit"), 10) || 0;
    var tabs = [].slice.call(px.querySelectorAll(".px-tabs button"));
    var q = px.querySelector('input[type="search"]');
    var selects = [].slice.call(px.querySelectorAll("select[data-filter]"));
    var count = px.querySelector(".px-count");
    var empty = px.querySelector(".px-empty");
    var more = px.querySelector(".px-more");
    var cat = "";
    function apply() {
      var term = (q.value || "").trim().toLowerCase();
      var active = !!(cat || term || selects.some(function (s) { return s.value; }));
      var shown = 0, matches = 0;
      cards.forEach(function (c) {
        var ok = (!cat || c.getAttribute("data-cat") === cat) &&
          (!term || c.getAttribute("data-search").indexOf(term) > -1) &&
          selects.every(function (s) {
            return !s.value || (c.getAttribute("data-" + s.getAttribute("data-filter")) || "").split("|").indexOf(s.value) > -1;
          });
        if (ok) matches++;
        var show = ok && (active || !limit || shown < limit);
        c.hidden = !show;
        if (show) shown++;
      });
      count.textContent = matches + (matches === 1 ? " product" : " products") + (active ? " match" : " in the catalogue");
      empty.hidden = matches !== 0;
      if (more) more.hidden = active;
    }
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        cat = t.getAttribute("data-cat");
        tabs.forEach(function (o) { o.setAttribute("aria-pressed", o === t ? "true" : "false"); });
        apply();
      });
    });
    q.addEventListener("input", apply);
    selects.forEach(function (s) { s.addEventListener("change", apply); });
    px.querySelector(".px-reset").addEventListener("click", function () {
      cat = ""; q.value = ""; selects.forEach(function (s) { s.value = ""; });
      tabs.forEach(function (o, i) { o.setAttribute("aria-pressed", i === 0 ? "true" : "false"); });
      apply();
    });
    apply();
  });

  /* Gentle hero parallax */
  var heroImg = document.querySelector(".hx-media img");
  if (heroImg && !reduced) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 800);
        heroImg.style.transform = "translate3d(0," + (y * 0.12).toFixed(1) + "px,0)";
        ticking = false;
      });
    }, { passive: true });
  }

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
