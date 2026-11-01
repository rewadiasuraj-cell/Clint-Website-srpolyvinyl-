(function () {
  'use strict';

  /* -------------------------------------------------------------
     1. Navigation Mega-Menu (Hover & Click & Keyboard)
     ------------------------------------------------------------- */
  var menu = document.querySelector('.products-menu');
  var toggle = document.querySelector('.mega-toggle');
  var menuLink = menu ? menu.querySelector('a') : null;
  var hoverTimer = null;

  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close product menu' : 'Open product menu');
    }
  }

  if (menu) {
    if (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        setMenu(!menu.classList.contains('is-open'));
      });
    }

    // Desktop hover handling with debounce
    if (window.matchMedia('(min-width: 901px)').matches) {
      menu.addEventListener('mouseenter', function () {
        clearTimeout(hoverTimer);
        setMenu(true);
      });
      menu.addEventListener('mouseleave', function () {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(function () {
          setMenu(false);
        }, 180);
      });
    }

    // Global click & escape key
    document.addEventListener('click', function (event) {
      if (!menu.contains(event.target)) {
        setMenu(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        setMenu(false);
        if (toggle) toggle.focus();
      }
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
  var layers = document.querySelectorAll('.parallax-image, .parallax-layer');

  if (!reduced && layers.length) {
    var queued = false;
    function paint() {
      queued = false;
      var vh = window.innerHeight;

      layers.forEach(function (layer) {
        var rect = layer.parentElement.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < vh) {
          // Smooth normalized vertical travel
          var speed = parseFloat(layer.dataset.parallaxSpeed) || 0.14;
          var offset = Math.max(-80, Math.min(80, (rect.top - vh / 2) * -speed));
          layer.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
        }
      });
    }

    window.addEventListener('scroll', function () {
      if (!queued) {
        queued = true;
        requestAnimationFrame(paint);
      }
    }, { passive: true });
    paint();
  }

  /* -------------------------------------------------------------
     4. Video Banner Controls
     ------------------------------------------------------------- */
  document.querySelectorAll('video[data-src-mp4]').forEach(function (video) {
    // Avoid double creation if already present
    if (video.parentElement.querySelector('.rev-video-control')) return;

    var button = document.createElement('button');
    button.className = 'rev-video-control';
    button.type = 'button';
    button.textContent = reduced ? 'Play Video' : 'Pause Video';
    button.setAttribute('aria-label', 'Toggle background video playback');
    video.parentElement.appendChild(button);

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
})();
