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
     3. Parallax Treatment (Zenith & Goldstab Inspired)
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

    // Standard Parallax Layers (Video banner, etc.)
    layers.forEach(function (layer) {
      var parent = layer.parentElement || layer;
      var rect = parent.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < vh) {
        var speed = parseFloat(layer.dataset.parallaxSpeed) || 0.12;
        var offset = Math.max(-45, Math.min(45, (rect.top - vh / 2) * -speed));
        layer.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      }
    });

    // Zenith Industrial Section Smooth Multi-Layer Parallax
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

    // Industries We Serve Scroll Parallax (Single image inside stationary clipped frame)
    var indSec = document.getElementById('industries') || document.querySelector('.ind2');
    if (indSec && !reduced) {
      var indRect = indSec.getBoundingClientRect();
      if (indRect.top < vh && indRect.bottom > 0) {
        var indProgress = (vh - indRect.top) / (vh + indRect.height); // 0 to 1 through viewport
        var isMobile = window.innerWidth < 768;
        var maxTravel = isMobile ? 18 : 44; // ~40-44px desktop, ~18px mobile
        var shift = (indProgress - 0.5) * maxTravel; // Smooth displacement lagging scroll
        var parallaxImg = indSec.querySelector('.ind2-parallax-img');
        if (parallaxImg) {
          parallaxImg.style.transform = 'translate3d(0, ' + shift.toFixed(2) + 'px, 0)';
        }
      }
    }
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
    var duration = 6000; // 6 seconds per slide

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