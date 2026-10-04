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
    if (header) header.classList.toggle("is-sticky", window.scrollY > 20);
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
    function restart() {
      clearInterval(timer);
      if (!reduced && slides.length > 1) timer = setInterval(function () { go(current + 1); }, 6500);
    }
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
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduced) { el.textContent = target + suffix; return; }
    var start = null;
    var dur = 1800;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var watched = document.querySelectorAll("[data-anim], [data-count], .band");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    watched.forEach(function (el) { io.observe(el); });
  } else {
    watched.forEach(reveal);
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
