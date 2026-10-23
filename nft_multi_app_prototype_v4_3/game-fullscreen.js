(() => {
  'use strict';

  const preventNativeSelection = (event) => event.preventDefault();
  ['contextmenu', 'selectstart', 'dragstart'].forEach((eventName) => {
    document.addEventListener(eventName, preventNativeSelection, { capture: true });
  });
  document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) selection.removeAllRanges();
  });

  function fullscreenElement(doc) {
    return doc.fullscreenElement || doc.webkitFullscreenElement || null;
  }

  function isMobileGameViewport() {
    return window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 760;
  }

  function parentIsFullscreen() {
    if (window.parent === window) return false;
    try {
      return Boolean(fullscreenElement(window.parent.document));
    } catch (_error) {
      return false;
    }
  }

  function collapseBrowserUi() {
    const nudge = () => window.scrollTo(0, 1);
    window.requestAnimationFrame(nudge);
    window.setTimeout(nudge, 250);
  }

  function enter() {
    if (!isMobileGameViewport()) return Promise.resolve(false);
    if (navigator.standalone === true || fullscreenElement(document) || parentIsFullscreen()) {
      return Promise.resolve(true);
    }

    const target = document.documentElement;
    const standardRequest = target.requestFullscreen;
    const prefixedRequest = target.webkitRequestFullscreen || target.webkitRequestFullScreen;
    if (!standardRequest && !prefixedRequest) {
      collapseBrowserUi();
      return Promise.resolve(false);
    }

    try {
      const request = standardRequest
        ? standardRequest.call(target, { navigationUI: 'hide' })
        : prefixedRequest.call(target);
      return Promise.resolve(request).then(() => true, () => {
        collapseBrowserUi();
        return false;
      });
    } catch (_error) {
      collapseBrowserUi();
      return Promise.resolve(false);
    }
  }

  window.GameFullscreen = { enter };
})();
