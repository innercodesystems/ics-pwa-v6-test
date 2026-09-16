// =========================================================
// ICS · MEIN ICS UI FIX
// Öffnet das Cockpit ohne sichtbare Verzögerung und hält
// Detailansichten frei von fremden Zurück-Buttons.
// =========================================================
(() => {
  const hiddenButtons = new Set();

  function isMeinIcsDetailOpen() {
    const detail = document.getElementById('icsCockpitDetail');
    return Boolean(detail && !detail.hidden);
  }

  function styleSecondaryPatternButton() {
    document.querySelectorAll('button').forEach((button) => {
      const text = button.textContent.replace(/\s+/g, ' ').trim();
      if (text !== 'Für heute reicht es') return;

      button.style.setProperty('appearance', 'none');
      button.style.setProperty('-webkit-appearance', 'none');
      button.style.setProperty('border', '1px solid rgba(184,146,79,.55)');
      button.style.setProperty('border-radius', '999px');
      button.style.setProperty('background', 'rgba(184,146,79,.06)');
      button.style.setProperty('color', '#f6f1e7');
      button.style.setProperty('padding', '12px 18px');
      button.style.setProperty('font', 'inherit');
      button.style.setProperty('font-weight', '700');
      button.style.setProperty('line-height', '1.2');
      button.style.setProperty('cursor', 'pointer');
      button.style.setProperty('min-height', '44px');
      button.style.setProperty('box-shadow', 'none');
    });
  }

  function cleanDetailButtons() {
    const detailOpen = isMeinIcsDetailOpen();

    document.querySelectorAll('button').forEach((button) => {
      const text = button.textContent.replace(/\s+/g, ' ').trim();
      if (text === '← Zurück zu Heute' && detailOpen) {
        if (!button.hidden) {
          button.hidden = true;
          hiddenButtons.add(button);
        }
      }
    });

    if (!detailOpen) {
      hiddenButtons.forEach((button) => {
        if (button?.isConnected) button.hidden = false;
      });
      hiddenButtons.clear();
    }

    styleSecondaryPatternButton();
  }

  document.addEventListener('click', (event) => {
    const navItem = event.target.closest('.nav-item[data-view="meinics"]');
    if (navItem && typeof window.icsOrganizeMeinIcsCockpit === 'function') {
      // Das Cockpit sofort aufbauen. Cloud-Inhalte dürfen danach aktualisieren.
      window.icsOrganizeMeinIcsCockpit();
    }

    if (event.target.closest('[data-ics-detail], #icsCockpitBack')) {
      window.setTimeout(cleanDetailButtons, 0);
    }
  }, true);

  const observer = new MutationObserver(cleanDetailButtons);
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['hidden']
  });

  window.addEventListener('load', () => {
    if (typeof window.icsOrganizeMeinIcsCockpit === 'function') {
      window.icsOrganizeMeinIcsCockpit();
    }
    cleanDetailButtons();
  });
})();