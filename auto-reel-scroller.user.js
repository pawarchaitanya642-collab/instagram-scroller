(() => {
  const BUTTON_ID = 'auto-reel-scroll-toggle';
  const STYLE_ID = 'auto-reel-scroll-style';

  const state = {
    enabled: false,
    pausedByTouch: false,
    observedVideos: new WeakSet(),
  };

  const setStatus = () => {
    const button = document.getElementById(BUTTON_ID);
    if (!button) {
      return;
    }

    if (!state.enabled) {
      button.textContent = 'Auto Scroll: OFF';
      button.dataset.state = 'off';
      return;
    }

    if (state.pausedByTouch) {
      button.textContent = 'Auto Scroll: PAUSED';
      button.dataset.state = 'paused';
      return;
    }

    button.textContent = 'Auto Scroll: ON';
    button.dataset.state = 'on';
  };

  const getReelContainer = (node) => {
    if (!node) {
      return null;
    }

    return node.closest('article, [role="presentation"], div[style*="transform"], li');
  };

  const findNextReelContainer = (currentContainer) => {
    if (!currentContainer || !currentContainer.parentElement) {
      return null;
    }

    let cursor = currentContainer.nextElementSibling;

    while (cursor) {
      if (cursor.querySelector('video')) {
        return cursor;
      }
      cursor = cursor.nextElementSibling;
    }

    return null;
  };

  const scrollToNextReel = (endedVideo) => {
    const currentContainer = getReelContainer(endedVideo);
    const nextContainer = findNextReelContainer(currentContainer);

    if (!nextContainer) {
      return;
    }

    nextContainer.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const onVideoEnded = (event) => {
    if (!state.enabled || state.pausedByTouch) {
      return;
    }

    scrollToNextReel(event.currentTarget);
  };

  const onVideoPlay = () => {
    if (!state.enabled) {
      return;
    }

    if (state.pausedByTouch) {
      state.pausedByTouch = false;
      setStatus();
    }
  };

  const observeVideo = (video) => {
    if (!(video instanceof HTMLVideoElement) || state.observedVideos.has(video)) {
      return;
    }

    state.observedVideos.add(video);
    video.addEventListener('ended', onVideoEnded);
    video.addEventListener('play', onVideoPlay);
  };

  const scanForVideos = (root = document) => {
    root.querySelectorAll('video').forEach(observeVideo);
  };

  const createToggle = () => {
    if (document.getElementById(BUTTON_ID)) {
      return;
    }

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${BUTTON_ID} {
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 999999;
        border: none;
        border-radius: 999px;
        padding: 10px 14px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        color: #fff;
        transition: opacity 0.2s ease;
      }

      #${BUTTON_ID}[data-state="off"] {
        background: rgba(210, 35, 42, 0.9);
      }

      #${BUTTON_ID}[data-state="on"] {
        background: rgba(28, 181, 80, 0.9);
      }

      #${BUTTON_ID}[data-state="paused"] {
        background: rgba(255, 149, 0, 0.95);
      }

      #${BUTTON_ID}:active {
        opacity: 0.8;
      }
    `;

    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.type = 'button';
    button.addEventListener('click', () => {
      state.enabled = !state.enabled;
      if (!state.enabled) {
        state.pausedByTouch = false;
      }
      setStatus();
    });

    document.head.appendChild(style);
    document.body.appendChild(button);
    setStatus();
  };

  const onTouchStart = () => {
    if (!state.enabled) {
      return;
    }

    state.pausedByTouch = true;
    setStatus();
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) {
          return;
        }

        if (node.matches('video')) {
          observeVideo(node);
        }

        scanForVideos(node);
      });
    });
  });

  const init = () => {
    createToggle();
    scanForVideos();

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    document.addEventListener('touchstart', onTouchStart, { passive: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
