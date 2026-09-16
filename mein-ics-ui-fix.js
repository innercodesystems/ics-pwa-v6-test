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