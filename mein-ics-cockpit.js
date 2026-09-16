// =========================================================
// ICS · MEIN ICS COCKPIT
// Ordnet bestehende Inhalte, ohne deren Logik oder Daten zu verändern.
// =========================================================
(() => {
  let installed = false;

  function createSection(id, kicker, title, text) {
    const section = document.createElement('section');
    section.id = id;
    section.style.marginTop = '22px';
    section.style.paddingTop = '18px';
    section.style.borderTop = '1px solid rgba(184,146,79,.28)';
    section.innerHTML = `
      <small style="display:block;color:#b8924f;letter-spacing:.10em;text-transform:uppercase;">${kicker}</small>
      <h3 style="margin:8px 0 0;color:#f6f1e7;font-size:1.2rem;">${title}</h3>
      <p style="margin:6px 0 0;opacity:.68;font-size:.92rem;">${text}</p>
      <div class="ics-cockpit-content" style="margin-top:14px;"></div>
    `;
    return section;
  }

  function getContent(id) {
    return document.querySelector(`#${id} .ics-cockpit-content`);
  }

  function moveIfPresent(nodeId, sectionId) {
    const node = document.getElementById(nodeId);
    const target = getContent(sectionId);
    if (!node || !target || node.parentElement === target) return;
    target.appendChild(node);
  }

  function installCockpit() {
    const overview = document.getElementById('icsPersonalOverview');
    if (!overview) return false;

    if (!document.getElementById('icsCockpitIntro')) {
      const originalTitle = overview.querySelector(':scope > strong');
      if (originalTitle) originalTitle.hidden = true;

      const intro = document.createElement('div');
      intro.id = 'icsCockpitIntro';
      intro.innerHTML = `
        <small style="display:block;color:#b8924f;letter-spacing:.11em;text-transform:uppercase;">DEIN PERSÖNLICHES SYSTEM</small>
        <h2 style="margin:8px 0 0;color:#f6f1e7;">Dein Bild im Moment</h2>
        <p style="margin:7px 0 0;opacity:.76;">Was gerade wichtig ist, was sich zeigt und was du bereits veränderst.</p>
      `;
      overview.prepend(intro);
    }

    if (!document.getElementById('icsCockpitNow')) {
      overview.appendChild(createSection(
        'icsCockpitNow',
        'JETZT',
        'Wo du gerade stehst',
        'Deine aktuelle Orientierung und die letzten Signale aus deinem ICS.'
      ));
    }

    if (!document.getElementById('icsCockpitShows')) {
      overview.appendChild(createSection(
        'icsCockpitShows',
        'WAS SICH ZEIGT',
        'Erkenntnisse & Muster',
        'Beobachtungen aus deinen gespeicherten Reflexionen und Tools.'
      ));
    }

    if (!document.getElementById('icsCockpitChanges')) {
      overview.appendChild(createSection(
        'icsCockpitChanges',
        'WAS DU VERÄNDERST',
        'Handlung & Integration',
        'Was du umgesetzt hast und welche Erfahrung daraus entstanden ist.'
      ));
    }

    moveIfPresent('icsLifeCycleOverview', 'icsCockpitNow');
    moveIfPresent('icsLatestEnergy', 'icsCockpitNow');
    moveIfPresent('icsLatestCloudActivity', 'icsCockpitShows');
    moveIfPresent('icsLatestTrigger', 'icsCockpitShows');
    moveIfPresent('icsLatestMentorInsight', 'icsCockpitShows');
    moveIfPresent('icsLatestActionIntegration', 'icsCockpitChanges');

    installed = true;
    return true;
  }

  const timer = window.setInterval(() => {
    installCockpit();
  }, 300);

  window.setTimeout(() => {
    window.clearInterval(timer);
  }, 15000);

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-view="meinics"]')) return;
    window.setTimeout(installCockpit, 180);
  });

  window.icsOrganizeMeinIcsCockpit = installCockpit;
})();
