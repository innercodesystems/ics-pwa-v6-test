// ICS bootstrap: Supabase login first, existing app second.
(() => {
  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  (async () => {
    try {
      await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
      await loadScript('supabase-auth.js?v=20260916-2');
      await loadScript('cloud-sync.js');
      await loadScript('life-phase.js?v=20260916-5');
      await loadScript('trigger-integration.js');
      await loadScript('action-integration.js?v=20260916-2');
      await loadScript('energy-cloud-sync.js?v=20260916-2');
      await loadScript('development-journey.js?v=20260916-3');
      await loadScript('mein-ics-cockpit.js?v=20260916-3');
      await loadScript('mein-ics-ui-fix.js?v=20260916-2');
      await loadScript('today-personal.js?v=20260916-3');
      await loadScript('action-cockpit.js?v=20260916-2');
    } catch (error) {
      console.error('ICS Startfehler:', error);
      document.body.insertAdjacentHTML('afterbegin', '<div style="padding:18px;text-align:center;background:#1a1815;color:#f6f1e7">ICS konnte die sichere Anmeldung nicht laden. Bitte Seite neu laden.</div>');
    }
  })();
})();