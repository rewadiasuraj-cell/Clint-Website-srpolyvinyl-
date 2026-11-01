(function () {
  'use strict';

  /* -------------------------------------------------------------
     1. Zenith Split Product Mega-Menu (Tabs, Hover & Keyboard)
     ------------------------------------------------------------- */
  var menu = document.querySelector('.products-menu');
  var siteHeader = document.querySelector('.site-header');
  var hoverTimer = null;

  function setMegaMenu(open) {
    if (!menu) return;
    if (window.innerWidth < 992) return; // Desktop mega-menu only
    menu.classList.toggle('is-open', open);
    if (siteHeader) {
      siteHeader.classList.toggle('has-open-menu', open);
    }
  }

  if (menu) {
    // Desktop hover handling with debounce
    menu.addEventListener('mouseenter', function () {
      if (window.innerWidth >= 992) {
        clearTimeout(hoverTimer);
        setMegaMenu(true);
      }
    });
    menu.addEventListener('mouseleave', function () {
      if (window.innerWidth >= 992) {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(function () {
          setMegaMenu(false);
        }, 220);
      }
    });

    // Global click & escape key for desktop mega-menu
    document.addEventListener('click', function (event) {
      if (window.innerWidth >= 992 && !menu.contains(event.target)) {
        setMegaMenu(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && window.innerWidth >= 992 && menu.classList.contains('is-open')) {
        setMegaMenu(false);
      }
    });

    // Zenith Tab Switching (Instantaneous Hover & Click)
    var catButtons = menu.querySelectorAll('.zenith-cat-btn');
    var tabPanels = menu.querySelectorAll('.zenith-tab-panel');

    function activateZenithTab(btn) {
      if (!btn) return;
      var tabId = btn.getAttribute('data-tab');
      if (!tabId) return;

      catButtons.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      tabPanels.forEach(function (p) {
        p.classList.remove('is-active');
      });

      var targetPanel = document.getElementById('panel-' + tabId);
      if (targetPanel) {
        targetPanel.classList.add('is-active');
      }
    }

    catButtons.forEach(function (btn) {
      btn.addEventListener('mouseenter', function () {
        activateZenithTab(btn);
      });
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        activateZenithTab(btn);
      });
      btn.addEventListener('focus', function () {
        activateZenithTab(btn);
      });
    });
  }

  /* -------------------------------------------------------------
     2. Products Catalogue: Live Search & Grid / Table View Switcher
     ------------------------------------------------------------- */
  var catalogContainer = document.getElementById('catalog-container');
  var search = document.getElementById('product-search');
  var viewButtons = document.querySelectorAll('.view-btn');
  var catalogGrid = document.querySelector('.catalog-grid');
  var catalogTableWrap = document.querySelector('.catalog-table-wrap');

  // Layout View Switcher
  if (viewButtons.length && catalogGrid && catalogTableWrap) {
    viewButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.dataset.view;
        viewButtons.forEach(function (b) { b.classList.toggle('is-active', b === btn); });

        if (mode === 'table') {
          catalogGrid.style.display = 'none';
          catalogTableWrap.style.display = 'block';
        } else {
          catalogGrid.style.display = 'grid';
          catalogTableWrap.style.display = 'none';
        }
      });
    });
  }

  // Live Instant Search (filters both grid cards and table rows)
  if (search) {
    var cards = Array.from(document.querySelectorAll('.catalog-card, .rev-specialty .mini'));
    var tableRows = Array.from(document.querySelectorAll('.catalog-table tbody tr'));

    search.addEventListener('input', function () {
      var query = search.value.trim().toLowerCase();
      var count = 0;

      cards.forEach(function (card) {
        var match = card.textContent.toLowerCase().includes(query);
        card.hidden = !match;
        if (match) count++;
      });

      tableRows.forEach(function (row) {
        var match = row.textContent.toLowerCase().includes(query);
        row.hidden = !match;
      });

      var countEl = document.getElementById('product-count');
      if (countEl) {
        countEl.textContent = query
          ? count + ' product category' + (count === 1 ? '' : 'ies') + ' matching "' + search.value.trim() + '"'
          : 'Browse all product categories and specialty materials below.';
      }

      var noResults = document.getElementById('no-products');
      if (noResults) {
        noResults.hidden = count > 0;
      }
    });
  }

  /* -------------------------------------------------------------
     3. Comprehensive Scroll Parallax Treatment (Images & Sections)
     ------------------------------------------------------------- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var layers = document.querySelectorAll('.parallax-image, .parallax-layer, [data-parallax-speed]');
  var zenithSec = document.getElementById('infrastructure-facility');
  var zenithBgImg = zenithSec ? zenithSec.querySelector('.zenith-parallax-bg img') : null;
  var zenithCards = zenithSec ? Array.from(zenithSec.querySelectorAll('.zenith-card')) : [];

  // Goldstab Scroll & Logo Color Transition Hook
  var siteHeader = document.querySelector('.site-header');

  var queued = false;
  function updateScrollVisuals() {
    queued = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var scrollY = window.scrollY || window.pageYOffset;
    var isMobile = window.innerWidth < 768;

    // Transparent-to-Solid Sticky Navbar Transition based on actual hero boundary
    if (siteHeader) {
      var hero = document.querySelector('.hero.tricon-hero, .hero-overlay');
      if (hero) {
        var headerH = siteHeader.offsetHeight || 70;
        var heroRect = hero.getBoundingClientRect();
        var isPast = heroRect.bottom <= headerH;
        siteHeader.classList.toggle('is-past-hero', isPast);
        siteHeader.classList.toggle('is-sticky', isPast);
      } else {
        siteHeader.classList.add('is-past-hero', 'is-sticky');
      }
    }

    if (reduced) return;

    // 1. Hero Section Subtle Cinematic Slide Background Parallax
    var heroSec = document.querySelector('.hero.tricon-hero');
    if (heroSec && scrollY < vh * 1.2) {
      var heroShift = scrollY * (isMobile ? 0.15 : 0.28);
      var activeBg = heroSec.querySelector('.tricon-slide.active .tricon-slide-bg');
      if (activeBg) {
        activeBg.style.transform = 'translate3d(0, ' + heroShift.toFixed(1) + 'px, 0)';
      }
    }

    // 2. Page Hero Headers on Inner Pages (.ph .ph-bg)
    var pageHeros = document.querySelectorAll('.ph');
    pageHeros.forEach(function (ph) {
      var rect = ph.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < vh) {
        var bg = ph.querySelector('.ph-bg');
        if (bg) {
          var phProgress = (vh - rect.top) / (vh + rect.height);
          var phShift = (phProgress - 0.5) * (isMobile ? 22 : 48);
          bg.style.transform = 'translate3d(0, ' + phShift.toFixed(1) + 'px, 0)';
        }
      }
    });

    // 3. PVC Raw Materials / About Section Image & Elements
    var aboutSec = document.getElementById('about') || document.querySelector('.intro2');
    if (aboutSec) {
      var abRect = aboutSec.getBoundingClientRect();
      if (abRect.bottom > 0 && abRect.top < vh) {
        var abProgress = (vh - abRect.top) / (vh + abRect.height);
        var abShift = (abProgress - 0.5) * (isMobile ? 16 : 38);
        var visImg = aboutSec.querySelector('.i2-vis img');
        if (visImg) {
          if (isMobile) {
            var xOffset = window.innerWidth <= 480 ? -14 : -12;
            var scale = window.innerWidth <= 480 ? 1.1 : 1.08;
            visImg.style.transform = 'translate3d(' + xOffset + 'px, ' + abShift.toFixed(1) + 'px, 0) scale(' + scale + ')';
          } else {
            visImg.style.transform = 'translate3d(0, ' + abShift.toFixed(1) + 'px, 0)';
          }
        }
        var trustStrip = aboutSec.querySelector('.i2-trust');
        if (trustStrip) {
          var trustShift = (abProgress - 0.5) * (isMobile ? -8 : -18);
          trustStrip.style.transform = 'translate3d(0, ' + trustShift.toFixed(1) + 'px, 0)';
        }
      }
    }

    // 4. Standard Parallax Layers (Video banner, etc.)
    layers.forEach(function (layer) {
      var parent = layer.parentElement || layer;
      var rect = parent.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < vh) {
        var speed = parseFloat(layer.dataset.parallaxSpeed) || 0.12;
        var offset = Math.max(-45, Math.min(45, (rect.top - vh / 2) * -speed));
        layer.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      }
    });

    // 5. Zenith Industrial Section Smooth Multi-Layer Parallax
    if (zenithSec && zenithBgImg) {
      var zRect = zenithSec.getBoundingClientRect();
      if (zRect.top < vh && zRect.bottom > 0) {
        var progress = (vh - zRect.top) / (vh + zRect.height);
        var offset = (progress - 0.5) * 110;
        zenithBgImg.style.transform = 'translate3d(0, ' + offset.toFixed(1) + 'px, 0) scale(1.08)';

        // Subtle Card Parallax Depth
        zenithCards.forEach(function (card, idx) {
          var cardShift = (progress - 0.5) * (14 + idx * 6);
          card.style.transform = 'translate3d(0, ' + (-cardShift.toFixed(1)) + 'px, 0)';
        });
      }
    }

    // 6. Principal Distributors Section (BPCL, Chemplast, Payal depth)
    var distSec = document.getElementById('distributors');
    if (distSec) {
      var dRect = distSec.getBoundingClientRect();
      if (dRect.bottom > 0 && dRect.top < vh) {
        var dProgress = (vh - dRect.top) / (vh + dRect.height);
        var distCards = distSec.querySelectorAll('.dist-card');
        distCards.forEach(function (card, i) {
          var offsetMultiplier = (i === 0 ? -1 : (i === 2 ? 1 : 0));
          var cardShift = (dProgress - 0.5) * (isMobile ? 6 : 14) * offsetMultiplier;
          card.style.transform = 'translate3d(0, ' + cardShift.toFixed(1) + 'px, 0)';
        });
      }
    }

    // 7. Industries We Serve (Pellets image + card depth)
    var indSec = document.getElementById('industries') || document.querySelector('.ind2');
    if (indSec) {
      var indRect = indSec.getBoundingClientRect();
      if (indRect.top < vh && indRect.bottom > 0) {
        var indProgress = (vh - indRect.top) / (vh + indRect.height);
        var maxTravel = isMobile ? 18 : 44;
        var shift = (indProgress - 0.5) * maxTravel;
        var parallaxImg = indSec.querySelector('.ind2-parallax-img');
        if (parallaxImg) {
          parallaxImg.style.transform = 'translate3d(0, ' + shift.toFixed(2) + 'px, 0)';
        }
        var indCards = indSec.querySelectorAll('.ind2-card');
        indCards.forEach(function (c, ci) {
          if (c.classList.contains('is-revealed') || !c.hasAttribute('data-anim')) {
            var cMultiplier = (ci % 2 === 0 ? -1 : 1);
            var cShift = (indProgress - 0.5) * (isMobile ? 5 : 12) * cMultiplier;
            c.style.transform = 'translate3d(0, ' + cShift.toFixed(1) + 'px, 0)';
          }
        });
      }
    }

    // 8. Why S. R. Polyvinyl Section (.wh-art + value columns)
    var whySec = document.getElementById('why') || document.querySelector('.why-home');
    if (whySec) {
      var wRect = whySec.getBoundingClientRect();
      if (wRect.bottom > 0 && wRect.top < vh) {
        var wProgress = (vh - wRect.top) / (vh + wRect.height);
        var whArt = whySec.querySelector('.wh-art');
        if (whArt && !isMobile) {
          var artShift = (wProgress - 0.5) * 50;
          whArt.style.transform = 'translateY(calc(-50% + ' + artShift.toFixed(1) + 'px))';
        }
        var whVals = whySec.querySelectorAll('.wh-val');
        whVals.forEach(function (v, vi) {
          var vShift = (wProgress - 0.5) * (isMobile ? 4 : 10) * (vi - 1);
          v.style.transform = 'translate3d(0, ' + vShift.toFixed(1) + 'px, 0)';
        });
      }
    }

    // 9. About Page Picture
    var aboutPic = document.querySelector('.about-picture img');
    if (aboutPic) {
      var apParent = aboutPic.closest('.about-picture') || aboutPic;
      var apRect = apParent.getBoundingClientRect();
      if (apRect.bottom > 0 && apRect.top < vh) {
        var apProgress = (vh - apRect.top) / (vh + apRect.height);
        var apShift = (apProgress - 0.5) * (isMobile ? 16 : 38);
        aboutPic.style.transform = 'translate3d(0, ' + apShift.toFixed(1) + 'px, 0)';
      }
    }

    // 10. Call-To-Action (CTA) Background Parallax
    var ctaBgs = document.querySelectorAll('.cta-bg');
    ctaBgs.forEach(function (cBg) {
      var cParent = cBg.closest('.cta') || cBg.parentElement;
      var cRect = cParent.getBoundingClientRect();
      if (cRect.bottom > 0 && cRect.top < vh) {
        var cProgress = (vh - cRect.top) / (vh + cRect.height);
        var cShift = (cProgress - 0.5) * (isMobile ? 24 : 55);
        cBg.style.transform = 'translate3d(0, ' + cShift.toFixed(1) + 'px, 0)';
      }
    });
  }

  window.addEventListener('scroll', function () {
    if (!queued) {
      queued = true;
      requestAnimationFrame(updateScrollVisuals);
    }
  }, { passive: true });
  updateScrollVisuals();

  /* -------------------------------------------------------------
     4. Video Banner Controls
     ------------------------------------------------------------- */
  document.querySelectorAll('video[data-src-mp4]').forEach(function (video) {
    var host = video.closest('.band') || video.closest('section') || video.parentElement;
    if (host.querySelector('.rev-video-control')) return;

    var button = document.createElement('button');
    button.className = 'rev-video-control';
    button.type = 'button';
    button.textContent = reduced ? 'Play Video' : 'Pause Video';
    button.setAttribute('aria-label', 'Toggle background video playback');
    host.appendChild(button);

    button.addEventListener('click', function () {
      if (video.paused) {
        video.dataset.userPaused = 'false';
        if (!video.querySelector('source') && !video.getAttribute('src')) {
          video.src = video.dataset.srcMp4;
        }
        video.play().then(function () {
          button.textContent = 'Pause Video';
        }).catch(function () {
          button.textContent = 'Play Video';
        });
      } else {
        video.dataset.userPaused = 'true';
        video.pause();
        button.textContent = 'Play Video';
      }
    });

    video.addEventListener('play', function () { button.textContent = 'Pause Video'; });
    video.addEventListener('pause', function () { button.textContent = 'Play Video'; });
  });

  /* -------------------------------------------------------------
     5. Contact & Enquiry Helpers
     ------------------------------------------------------------- */
  // Auto-fill from data-enquiry triggers
  document.querySelectorAll('[data-enquiry]').forEach(function (el) {
    el.addEventListener('click', function () {
      var purposeInput = document.getElementById('f-purpose');
      if (purposeInput) {
        purposeInput.value = el.dataset.enquiry;
      }
    });
  });

  // URL Query Parameters Parsing (?partner=, ?product=, ?purpose=)
  var params = new URLSearchParams(window.location.search);
  var partnerParam = params.get('partner');
  var productParam = params.get('product');
  var purposeParam = params.get('purpose');

  var msgBox = document.getElementById('f-message');
  var purposeSelect = document.getElementById('f-purpose');
  var productSelect = document.getElementById('f-product');

  if (partnerParam && msgBox) {
    msgBox.value = 'I would like to enquire about authorized sourcing for ' + partnerParam + ' materials.\n';
  }
  if (purposeParam && purposeSelect) {
    for (var i = 0; i < purposeSelect.options.length; i++) {
      if (purposeSelect.options[i].text.toLowerCase().includes(purposeParam.toLowerCase())) {
        purposeSelect.selectedIndex = i;
        break;
      }
    }
  }
  if (productParam && productSelect) {
    for (var j = 0; j < productSelect.options.length; j++) {
      if (productSelect.options[j].text.toLowerCase().includes(productParam.toLowerCase())) {
        productSelect.selectedIndex = j;
        break;
      }
    }
  }

  // Enhanced WhatsApp & Email Form Formatter
  var form = document.getElementById('enquiryForm');
  if (form) {
    function composeMessage() {
      var d = new FormData(form);
      return [
        'S. R. POLYVINYL LTD. — WEBSITE ENQUIRY',
        '-------------------------------------',
        'Enquiry Type: ' + (d.get('purpose') || 'General Enquiry'),
        'Product: ' + (d.get('product') || 'Not specified'),
        'Packaging: ' + (d.get('packaging') || 'Standard'),
        'Quantity: ' + (d.get('quantity') || 'Not specified'),
        'Delivery City: ' + (d.get('location') || 'Not specified'),
        'Timeline: ' + (d.get('urgency') || 'Normal'),
        '',
        'Name: ' + (d.get('name') || ''),
        'Company: ' + (d.get('company') || ''),
        'Phone: ' + (d.get('phone') || ''),
        'Email: ' + (d.get('email') || ''),
        '',
        'Message:',
        String(d.get('message') || '')
      ].join('\n');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var d = new FormData(form);
      var subject = 'Raw Material Enquiry - ' + (d.get('product') || d.get('purpose') || 'General');
      var email = form.getAttribute('data-email') || 'info@srpolyvinyl.com';

      window.location.href = 'mailto:' + email +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(composeMessage());
    });

    var waBtn = document.getElementById('sendWhatsApp');
    if (waBtn) {
      waBtn.addEventListener('click', function () {
        if (!form.reportValidity()) return;
        var phone = form.getAttribute('data-whatsapp') || '918586980901';
        window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(composeMessage()), '_blank', 'noopener');
      });
    }
  }


  /* -------------------------------------------------------------
     TRICON Industrial Hero Slider (4 Slides, Auto-Play, Keyboard)
     ------------------------------------------------------------- */
  var triconHero = document.querySelector('.hero.tricon-hero');
  if (triconHero) {
    var slides = Array.from(triconHero.querySelectorAll('.tricon-slide'));
    var bars = Array.from(triconHero.querySelectorAll('.tricon-bar'));
    var counter = document.getElementById('tricon-current');
    var prevBtn = triconHero.querySelector('.tricon-arrow.prev');
    var nextBtn = triconHero.querySelector('.tricon-arrow.next');
    var pauseBtn = triconHero.querySelector('.tricon-pause');

    var currentIdx = 0;
    var totalSlides = slides.length || 4;
    var slideTimer = null;
    var isPaused = false;
    var duration = 3000; // 3 seconds per slide (autoplay)

    function showSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIdx = index;

      slides.forEach(function (slide, i) {
        var active = (i === currentIdx);
        if (active) {
          slide.classList.remove('active');
          void slide.offsetWidth; // Force reflow to replay CSS keyframe entrance animations cleanly
          slide.classList.add('active');
          slide.setAttribute('aria-hidden', 'false');
        } else {
          slide.classList.remove('active');
          slide.setAttribute('aria-hidden', 'true');
        }
      });

      bars.forEach(function (bar, i) {
        var active = (i === currentIdx);
        bar.classList.toggle('active', active);
        bar.setAttribute('aria-selected', String(active));
      });

      if (counter) {
        counter.textContent = String(currentIdx + 1).padStart(2, '0');
      }
    }

    function nextSlide() {
      showSlide(currentIdx + 1);
    }

    function prevSlide() {
      showSlide(currentIdx - 1);
    }

    function startTimer() {
      stopTimer();
      if (!isPaused && !reduced) {
        slideTimer = setInterval(nextSlide, duration);
      }
    }

    function stopTimer() {
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextSlide();
        startTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prevSlide();
        startTimer();
      });
    }

    bars.forEach(function (bar) {
      bar.addEventListener('click', function () {
        var idx = parseInt(bar.dataset.slide, 10);
        if (!isNaN(idx)) {
          showSlide(idx);
          startTimer();
        }
      });
    });

    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () {
        isPaused = !isPaused;
        pauseBtn.setAttribute('aria-pressed', String(isPaused));
        var icon = pauseBtn.querySelector('i');
        var text = pauseBtn.querySelector('span');

        if (isPaused) {
          stopTimer();
          if (icon) icon.className = 'fa-solid fa-play';
          if (text) text.textContent = 'PLAY';
        } else {
          startTimer();
          if (icon) icon.className = 'fa-solid fa-pause';
          if (text) text.textContent = 'PAUSE';
        }
      });
    }

    // Keyboard navigation
    triconHero.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        nextSlide();
        startTimer();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        startTimer();
      }
    });

    // Pause on hover
    triconHero.addEventListener('mouseenter', stopTimer);
    triconHero.addEventListener('mouseleave', function () {
      if (!isPaused) startTimer();
    });

    // Initial start
    showSlide(0);
    startTimer();
  }


  // Industries Staggered Card Reveal with IntersectionObserver
  var indCards = Array.from(document.querySelectorAll('.ind2-card'));
  if (indCards.length && 'IntersectionObserver' in window && !reduced) {
    var indCardObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          indCardObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    indCards.forEach(function (card, idx) {
      card.style.transitionDelay = (idx * 0.09) + 's';
      indCardObs.observe(card);
    });
  } else {
    indCards.forEach(function (card) {
      card.classList.add('is-revealed');
    });
  }

  /* -------------------------------------------------------------
     Unified Viewport Content Group Reveal (Home, About, Products,
     Industries, Clientele, Contact)
     ------------------------------------------------------------- */
  function initSectionScrollReveal() {
    if (reduced || !('IntersectionObserver' in window)) {
      return;
    }

    document.documentElement.classList.add('js-reveal-ready');

    var revealSelectors = [
      'main h2',
      'main h3',
      'main .section-desc',
      'main .section-head',
      'main .lead',
      'main .ph-text',
      'main .title-wrp',
      'main .wh-card',
      'main .ind2-card',
      'main .client-card',
      'main .cat-card',
      'main .stat-card',
      'main .catalog-card',
      'main .catalog-toolbar',
      'main article.industry',
      'main article.client-card',
      'main article',
      'main .pd-item',
      'main .pd-card',
      'main .contact-card',
      'main .contact-form',
      'main .info-card',
      'main .value-card',
      'main .timeline-card',
      'main .team-card',
      'main .cert-card',
      'main .testimonial-card',
      'main .band-copy',
      'main .cta-banner .cta-content',
      'main .table-wrap',
      'main ul.wh-list',
      'main ul.feature-list',
      'main ul.grades'
    ].join(', ');

    var elements = Array.from(document.querySelectorAll(revealSelectors));
    elements = elements.filter(function (el) {
      return !el.closest('.hero') && !el.closest('.site-header') && !el.closest('.nav-wrap');
    });

    var groupObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          groupObs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    });

    elements.forEach(function (el) {
      el.classList.add('reveal-group');
      groupObs.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSectionScrollReveal);
  } else {
    initSectionScrollReveal();
  }

})();