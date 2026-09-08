/**
 * Exhibit section navigation — progressive enhancement.
 *
 * The <html> element is marked `umd-js` by a synchronous head script before
 * first paint, so the CSS collapses submenus and shows the mobile toggle from
 * the start; without JS the nav renders expanded and in-flow, fully reachable.
 * This script only flips state: submenu open/close is the disclosure button's
 * aria-expanded (CSS reveals the open one via the adjacent-sibling rule), and
 * the mobile bar is the nav's `section-nav--open` class. No element is hidden by
 * this script, so there is nothing to un-hide and no [hidden] to manage.
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var nav = document.querySelector('.section-nav');
    if (!nav) {
      return;
    }

    var disclosures = Array.prototype.slice.call(
      nav.querySelectorAll('.section-nav__disclosure')
    );
    var toggle = nav.querySelector('.section-nav__toggle');

    function setExpanded(btn, open) {
      btn.setAttribute('aria-expanded', String(open));
    }

    function closeSubmenus(except) {
      disclosures.forEach(function (btn) {
        if (btn !== except) {
          setExpanded(btn, false);
        }
      });
    }

    function closeBar() {
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('section-nav--open');
      }
    }

    disclosures.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        if (!open) {
          closeSubmenus(btn); // one submenu open at a time
        }
        setExpanded(btn, !open);
      });
    });

    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        nav.classList.toggle('section-nav--open', !open);
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') {
        return;
      }
      // Only act when focus is inside the nav. The active-trail parent ships
      // open, so an expanded disclosure always exists on a child page; without
      // this guard, Escape anywhere on the page would steal focus to the nav.
      if (!nav.contains(document.activeElement)) {
        return;
      }
      var openBtn = nav.querySelector('.section-nav__disclosure[aria-expanded="true"]');
      if (openBtn) {
        setExpanded(openBtn, false);
        openBtn.focus();
        return;
      }
      if (nav.classList.contains('section-nav--open')) {
        closeBar();
        if (toggle) {
          toggle.focus();
        }
      }
    });

    document.addEventListener('click', function (e) {
      if (nav.contains(e.target)) {
        return;
      }
      closeSubmenus();
      closeBar();
    });
  });
})();
