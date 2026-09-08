/*
 * Gallery lightbox.
 *
 * Replaces `fancybox`, the most widely shared component in the legacy
 * exhibits. No dependency: jQuery is present on Omeka pages but nothing here
 * needs it, and a theme that can drop its last jQuery use later is worth more
 * than three saved lines now.
 *
 * Progressive enhancement. The markup it binds to is already a grid of links
 * to item pages, so with JS off or this file missing the gallery still works
 * and every image is still reachable — it just navigates instead of overlaying.
 *
 * The overlay is assembled with createElement rather than an innerHTML
 * template. Everything variable — caption text, image source — arrives from
 * page data, and building nodes keeps the safe path the only path: captions go
 * through textContent, never markup.
 *
 * Accessibility, since WCAG 2.1 AA is a per-tier prerequisite rather than a
 * nice-to-have:
 *   - the overlay is a modal dialog with a label and a close control
 *   - focus moves into it on open and returns to the invoking link on close
 *   - focus is trapped while open, so Tab cannot wander behind the overlay
 *   - Escape closes; Left/Right move through the gallery
 *   - the page behind is inert to scroll
 */
(function () {
  'use strict';

  /*
   * The theme loads this through headScript(), so it executes inside <head>
   * with no body yet. Querying immediately found zero galleries and returned
   * silently — the overlay was never built and every thumbnail just navigated
   * to its item page, which looks exactly like "the lightbox template wasn't
   * applied". Wait for the DOM rather than relying on load order.
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {

  var galleries = document.querySelectorAll('[data-umd-lightbox]');
  if (!galleries.length) {
    return;
  }

  var overlay, imgEl, capEl, counterEl, prevBtn, nextBtn, closeBtn;
  var links = [];
  var index = 0;
  var lastFocused = null;

  function el(tag, className, attrs) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  function build() {
    overlay = el('div', 'umd-lightbox', {
      role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Image viewer'
    });
    overlay.hidden = true;

    closeBtn = el('button', 'umd-lightbox__close', { type: 'button', 'aria-label': 'Close image viewer' });
    closeBtn.textContent = '×';

    prevBtn = el('button', 'umd-lightbox__nav umd-lightbox__nav--prev', { type: 'button', 'aria-label': 'Previous image' });
    prevBtn.textContent = '‹';

    nextBtn = el('button', 'umd-lightbox__nav umd-lightbox__nav--next', { type: 'button', 'aria-label': 'Next image' });
    nextBtn.textContent = '›';

    var figure = el('figure', 'umd-lightbox__figure');
    imgEl = el('img', 'umd-lightbox__img', { alt: '' });
    var caption = el('figcaption', 'umd-lightbox__caption');
    capEl = el('span', 'umd-lightbox__cap-text');
    counterEl = el('span', 'umd-lightbox__counter');
    caption.appendChild(capEl);
    caption.appendChild(document.createTextNode(' '));
    caption.appendChild(counterEl);
    figure.appendChild(imgEl);
    figure.appendChild(caption);

    overlay.appendChild(closeBtn);
    overlay.appendChild(prevBtn);
    overlay.appendChild(figure);
    overlay.appendChild(nextBtn);
    document.body.appendChild(overlay);

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { step(-1); });
    nextBtn.addEventListener('click', function () { step(1); });
    overlay.addEventListener('click', function (e) {
      // Backdrop only: clicking the image itself should not dismiss.
      if (e.target === overlay) { close(); }
    });
  }

  function show(i) {
    index = (i + links.length) % links.length;
    var link = links[index];
    imgEl.src = link.getAttribute('data-umd-full');
    // The caption carries the title, so the image is decorative here — an alt
    // repeating the caption would be announced twice.
    imgEl.alt = '';
    capEl.textContent = link.getAttribute('data-umd-caption') || '';
    counterEl.textContent = links.length > 1 ? (index + 1) + ' of ' + links.length : '';
    prevBtn.hidden = nextBtn.hidden = links.length < 2;
  }

  function step(delta) { show(index + delta); }

  function open(gallery, i) {
    links = Array.prototype.slice.call(
      gallery.querySelectorAll('.card--link[data-umd-full]')
    );
    if (!links.length) { return; }
    lastFocused = document.activeElement;
    show(i);
    overlay.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    closeBtn.focus();
    document.addEventListener('keydown', onKey, true);
  }

  function close() {
    overlay.hidden = true;
    document.documentElement.style.overflow = '';
    document.removeEventListener('keydown', onKey, true);
    if (lastFocused && lastFocused.focus) { lastFocused.focus(); }
  }

  function onKey(e) {
    if (overlay.hidden) { return; }
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); return; }
    if (e.key !== 'Tab') { return; }
    // Trap: without this, Tab walks into the page behind the overlay, where a
    // sighted keyboard user cannot see what is focused.
    var focusable = Array.prototype.filter.call(
      overlay.querySelectorAll('button'), function (b) { return !b.hidden; }
    );
    if (!focusable.length) { return; }
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  build();

  Array.prototype.forEach.call(galleries, function (gallery) {
    gallery.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('.card--link[data-umd-full]') : null;
      if (!link || !gallery.contains(link)) { return; }
      // Modified clicks stay ordinary navigation, so "open in new tab" still
      // reaches the item page.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) { return; }
      e.preventDefault();
      var all = Array.prototype.slice.call(
        gallery.querySelectorAll('.card--link[data-umd-full]')
      );
      open(gallery, all.indexOf(link));
    });
  });

  } // init
})();
