(function () {
  'use strict';
  var menu = document.querySelector('.products-menu');
  var toggle = document.querySelector('.mega-toggle');
  function setMenu(open) {
    if (!menu || !toggle) return;
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close product categories' : 'Open product categories');
  }
  if (toggle) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('click', function (event) { if (!menu.contains(event.target)) setMenu(false); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); toggle.focus(); } });
    menu.addEventListener('focusout', function (event) { if (!menu.contains(event.relatedTarget)) setMenu(false); });
  }
  var search = document.getElementById('product-search');
  if (search) {
    var cards = Array.from(document.querySelectorAll('.catalog-card, .rev-specialty .mini'));
    search.addEventListener('input', function () {
      var query = search.value.trim().toLowerCase(), count = 0;
      cards.forEach(function (card) { card.hidden = !card.textContent.toLowerCase().includes(query); if (!card.hidden) count++; });
      document.getElementById('product-count').textContent = count + ' product categories found';
      document.getElementById('no-products').hidden = count > 0;
    });
  }
  document.querySelectorAll('[data-enquiry]').forEach(function (link) {
    link.addEventListener('click', function () { document.getElementById('f-purpose').value = link.dataset.enquiry; });
  });
  var partner = new URLSearchParams(location.search).get('partner');
  if (partner && document.getElementById('f-message')) document.getElementById('f-message').value = 'I would like to enquire about ' + partner + ' materials.\n';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var layers = document.querySelectorAll('.parallax-image');
  if (!reduced && layers.length) {
    var queued = false;
    function paint() {
      queued = false;
      layers.forEach(function (image) { var rect = image.parentElement.getBoundingClientRect(); if (rect.bottom > 0 && rect.top < innerHeight) image.style.transform = 'translateY(' + Math.max(-65,Math.min(65,-rect.top * 0.12)) + 'px)'; });
    }
    addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(paint); } }, {passive:true});
    paint();
  }
  // Give existing decorative video banners an explicit pause control.
  document.querySelectorAll('video[data-src-mp4]').forEach(function(video) {
    var button = document.createElement('button');
    button.className = 'rev-video-control';
    button.type = 'button';
    button.textContent = reduced ? 'Play video' : 'Pause video';
    video.parentElement.appendChild(button);
    button.addEventListener('click', function() {
      if (video.paused) {
        video.dataset.userPaused = 'false';
        if (!video.querySelector('source') && !video.getAttribute('src')) video.src = video.dataset.srcMp4;
        video.play().then(function(){button.textContent='Pause video';}).catch(function(){button.textContent='Play video';});
      } else { video.dataset.userPaused = 'true'; video.pause(); button.textContent='Play video'; }
    });
    video.addEventListener('play', function(){button.textContent='Pause video';});
    video.addEventListener('pause', function(){button.textContent='Play video';});
  });
})();
