// =========================================================
// ICS · MEIN ICS COCKPIT
// Ruhige Startzentrale: Überblick zuerst, Details erst nach Klick.
// Lebensphase und aktueller Zustand sind getrennte Detailansichten.
// =========================================================
(() => {
  const GOLD = '#b8924f';
  const CREAM = '#f6f1e7';

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }

  function readText(id, fallback = '') {
    const node = document.getElementById(id);
    const text = node?.innerText?.replace(/\s+/g, ' ').trim();
    return text || fallback;
  }

  function compact(value, max = 92) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    return text.length > max ? `${text.slice(0, max - 1).trim()}…` : text;
  }

  function getLifePhaseSummary() {
    const node = document.getElementById('icsLifeCycleOverview');
    if (!node) return { title: 'Lebensphase', text: 'Deine aktuelle Orientierung ansehen.' };
    const headings = [...node.querySelectorAll('h3, strong')].map(el => el.textContent.trim()).filter(Boolean);
    return { title: headings[0] || 'Aktuelle Lebensphase', text: headings[1] || 'Deine aktuelle Orientierung ansehen.' };
  }

  function getTriggerSummary() {
    const node = document.getElementById('icsLatestTrigger');
    if (!node) return { title: 'Trigger & Muster', text: 'Deine Erkenntnisse ansehen.' };
    const heading = node.querySelector('h3, strong');
    const paragraphs = [...node.querySelectorAll('p')].map(p => p.textContent.trim()).filter(Boolean);
    return { title: heading?.textContent?.trim() || 'Trigger & Muster', text: paragraphs[0] || 'Deine Erkenntnisse ansehen.' };
  }

  function getActionSummary() {
    const node = document.getElementById('icsLatestActionIntegration');
    if (!node) return { title: 'Dein nächster Schritt', text: 'ACTION öffnen und bewusst handeln.' };
    const heading = node.querySelector('h3, strong');
    const paragraphs = [...node.querySelectorAll('p')].map(p => p.textContent.trim()).filter(Boolean);
    return { title: heading?.textContent?.trim() || 'Handlung & Integration', text: paragraphs[0] || 'Deine Umsetzung und Integration ansehen.' };
  }

  function card(icon, label, title, text, detail) {
    return `<button type="button" data-ics-detail="${detail}" style="width:100%;text-align:left;cursor:pointer;border:1px solid rgba(184,146,79,.34);border-radius:16px;background:rgba(184,146,79,.035);padding:16px;color:${CREAM};font:inherit;">
      <div style="display:flex;gap:12px;align-items:flex-start;">
        <span aria-hidden="true" style="width:34px;height:34px;flex:0 0 34px;border-radius:50%;display:grid;place-items:center;background:rgba(184,146,79,.15);color:${GOLD};font-size:1.05rem;">${icon}</span>
        <span style="min-width:0;display:block;">
          <small style="display:block;color:${GOLD};letter-spacing:.08em;text-transform:uppercase;">${label}</small>
          <strong style="display:block;margin-top:5px;color:${CREAM};font-size:1.02rem;line-height:1.25;">${escapeHtml(compact(title, 54))}</strong>
          <span style="display:block;margin-top:6px;opacity:.68;font-size:.88rem;line-height:1.4;">${escapeHtml(compact(text, 86))}</span>
          <span style="display:block;margin-top:11px;color:${GOLD};font-size:.86rem;font-weight:700;">Öffnen →</span>
        </span>
      </div>
    </button>`;
  }

  function setOverviewOnlyMode(isDetail) {
    const overview = document.getElementById('icsPersonalOverview');
    const originalTitle = overview?.querySelector(':scope > strong');
    if (originalTitle) {
      originalTitle.hidden = true;
      originalTitle.style.display = 'none';
    }

    document.querySelectorAll('#view-meinics > .tool-list').forEach(node => {
      node.style.display = isDetail ? 'none' : '';
    });
  }

  function createShell() {
    const overview = document.getElementById('icsPersonalOverview');
    if (!overview) return null;
    let shell = document.getElementById('icsCockpitShell');
    if (shell) return shell;

    const originalTitle = overview.querySelector(':scope > strong');
    if (originalTitle) {
      originalTitle.hidden = true;
      originalTitle.style.display = 'none';
    }

    shell = document.createElement('div');
    shell.id = 'icsCockpitShell';
    shell.innerHTML = `<div id="icsCockpitHome">
      <small style="display:block;color:${GOLD};letter-spacing:.11em;text-transform:uppercase;">DEIN PERSÖNLICHES SYSTEM</small>
      <h2 style="margin:8px 0 0;color:${CREAM};font-size:clamp(1.8rem,5vw,2.35rem);">Dein Bild im Moment</h2>
      <p style="margin:7px 0 0;opacity:.72;">Wo du gerade stehst. Was sich zeigt. Was dein nächster Schritt ist.</p>
      <div id="icsCockpitCards" style="margin-top:22px;"></div>
    </div><div id="icsCockpitDetail" hidden></div>`;
    overview.prepend(shell);
    return shell;
  }

  function ensureVault() {
    let vault = document.getElementById('icsCockpitVault');
    if (vault) return vault;
    vault = document.createElement('div');
    vault.id = 'icsCockpitVault';
    vault.hidden = true;
    document.body.appendChild(vault);
    return vault;
  }

  function storeExistingDetails() {
    const vault = ensureVault();
    ['icsLifeCycleOverview','icsLatestEnergy','icsLatestCloudActivity','icsLatestTrigger','icsLatestMentorInsight','icsLatestActionIntegration','icsNextStep','icsRepeatedPattern']
      .forEach(id => {
        const node = document.getElementById(id);
        if (node && node.parentElement !== vault && !node.closest('#icsCockpitDetailContent')) vault.appendChild(node);
      });
    const state = document.querySelector('#view-meinics > .ics-state-entry');
    if (state && state.parentElement !== vault && !state.closest('#icsCockpitDetailContent')) vault.appendChild(state);
  }

  function renderHome() {
    const shell = createShell();
    if (!shell) return false;
    storeExistingDetails();
    setOverviewOnlyMode(false);

    const life = getLifePhaseSummary();
    const trigger = getTriggerSummary();
    const action = getActionSummary();
    const energy = compact(readText('icsLatestEnergy', 'Deinen aktuellen Zustand ansehen.'), 82);
    const journal = compact(readText('icsLatestCloudActivity', 'Deinen letzten Check-in ansehen.'), 82);
    const mentor = compact(readText('icsLatestMentorInsight', 'Deine letzte Mentor-Erkenntnis ansehen.'), 82);
    const cards = document.getElementById('icsCockpitCards');
    if (!cards) return false;

    cards.innerHTML = `<section>
      <small style="color:${GOLD};letter-spacing:.10em;">JETZT</small>
      <h3 style="margin:6px 0 4px;color:${CREAM};">Wo du gerade stehst</h3>
      <p style="margin:0 0 13px;opacity:.64;font-size:.9rem;">Deine aktuelle Orientierung und dein nächster Schritt.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;">
        ${card('◌','Lebensphase',life.title,life.text,'life')}
        ${card('▥','Aktueller Zustand','Wie geht es dir gerade?',energy,'energy')}
        ${card('➜','Handlung',action.title,action.text,'action')}
      </div>
    </section>
    <section style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(184,146,79,.24);">
      <small style="color:${GOLD};letter-spacing:.10em;">WAS SICH ZEIGT</small>
      <h3 style="margin:6px 0 4px;color:${CREAM};">Erkenntnisse & Muster</h3>
      <p style="margin:0 0 13px;opacity:.64;font-size:.9rem;">Nur das Wesentliche. Details öffnest du bei Bedarf.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;">
        ${card('◎','Trigger-Kompass',trigger.title,trigger.text,'trigger')}
        ${card('✎','Journal','Dein letzter Check-in',journal,'journal')}
        ${card('✦','Mentor','Letzte Erkenntnis',mentor,'mentor')}
      </div>
    </section>
    <section style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(184,146,79,.24);">
      <small style="color:${GOLD};letter-spacing:.10em;">WAS DU VERÄNDERST</small>
      <h3 style="margin:6px 0 4px;color:${CREAM};">Handlung & Integration</h3>
      <p style="margin:0 0 13px;opacity:.64;font-size:.9rem;">Was du umgesetzt hast und was daraus in dir entsteht.</p>
      ${card('✓','Integration',action.title,action.text,'integration')}
    </section>`;

    document.getElementById('icsCockpitHome').hidden = false;
    document.getElementById('icsCockpitDetail').hidden = true;
    return true;
  }

  function detailTitle(type) {
    return ({life:'Deine Lebensphase',energy:'Wie geht es dir gerade?',trigger:'Trigger & Muster',journal:'Dein Journal-Impuls',mentor:'Deine Mentor-Erkenntnis',action:'Deine ACTION',integration:'Handlung & Integration'})[type] || 'Dein ICS';
  }

  function appendDetailContent(type, target) {
    const ids = ({
      life:['icsLifeCycleOverview'],
      energy:['icsLatestEnergy'],
      trigger:['icsLatestTrigger'],
      journal:['icsLatestCloudActivity'],
      mentor:['icsLatestMentorInsight'],
      action:['icsLatestActionIntegration'],
      integration:['icsLatestActionIntegration']
    })[type] || [];
    ids.forEach(id => { const node = document.getElementById(id); if (node) target.appendChild(node); });

    if (type === 'energy') {
      const state = document.querySelector('.ics-state-entry');
      if (state) target.appendChild(state);
      ['icsNextStep','icsRepeatedPattern'].forEach(id => { const node = document.getElementById(id); if (node) target.appendChild(node); });
    }

    if (type === 'life') {
      const life = document.getElementById('icsLifeCycleOverview');
      const hasResult = life && life.querySelector('h3');
      const input = life?.querySelector('.ics-birthdate-input');
      if (input && hasResult) input.style.display = 'none';

      const chronik = document.createElement('div');
      chronik.id = 'icsLifeChronicleEntry';
      chronik.style.cssText = 'margin-top:32px;padding-top:24px;padding-bottom:8px;border-top:1px solid rgba(184,146,79,.28);';
      chronik.innerHTML = `<small style="display:block;color:${GOLD};letter-spacing:.10em;text-transform:uppercase;">DEINE GESAMTE LEBENSLINIE</small>
        <h3 style="margin:8px 0 8px;color:${CREAM};">Mehr als die aktuelle Phase</h3>
        <p style="margin:0 0 18px;opacity:.72;line-height:1.55;">Öffne deine ausführliche ICS Lebenschronik mit Lebenslinie, Mustern und deinem nächsten Kapitel.</p>
        <button type="button" id="icsOpenLifeChronicle" class="gold-button" style="margin-bottom:8px;">Meine gesamte Lebenschronik öffnen →</button>`;
      target.appendChild(chronik);
    }
  }

  function openDetail(type) {
    const shell = createShell();
    const home = document.getElementById('icsCockpitHome');
    const detail = document.getElementById('icsCockpitDetail');
    if (!shell || !home || !detail) return;

    storeExistingDetails();
    setOverviewOnlyMode(true);
    detail.innerHTML = `<button type="button" id="icsCockpitBack" style="border:0;background:none;color:${GOLD};padding:0;cursor:pointer;font:inherit;font-weight:700;">← Zurück zu Mein ICS</button>
      <small style="display:block;margin-top:24px;color:${GOLD};letter-spacing:.10em;text-transform:uppercase;">DEIN PERSÖNLICHES SYSTEM</small>
      <h2 style="margin:7px 0 24px;color:${CREAM};">${escapeHtml(detailTitle(type))}</h2>
      <div id="icsCockpitDetailContent"></div>`;
    appendDetailContent(type, detail.querySelector('#icsCockpitDetailContent'));
    home.hidden = true;
    detail.hidden = false;
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function backHome() {
    const detail = document.getElementById('icsCockpitDetail');
    const vault = ensureVault();
    const content = detail?.querySelector('#icsCockpitDetailContent');
    if (content) [...content.children].forEach(node => {
      if (node.id !== 'icsLifeChronicleEntry') vault.appendChild(node);
    });
    setOverviewOnlyMode(false);
    renderHome();
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function openRequestedReturnDetail() {
    const detail = sessionStorage.getItem('ICS_RETURN_DETAIL');
    if (!detail) return false;
    sessionStorage.removeItem('ICS_RETURN_DETAIL');
    if (detail === 'life') {
      if (typeof window.openView === 'function') window.openView('meinics');
      openDetail('life');
      return true;
    }
    return false;
  }

  document.addEventListener('click', event => {
    const detailButton = event.target.closest('[data-ics-detail]');
    if (detailButton) { openDetail(detailButton.dataset.icsDetail); return; }
    if (event.target.closest('#icsCockpitBack')) { backHome(); return; }
    if (event.target.closest('#icsOpenLifeChronicle')) {
      sessionStorage.setItem('ICS_RETURN_DETAIL', 'life');
      window.location.href = './ics-lebenschronik.html';
      return;
    }
    if (event.target.closest('[data-view="meinics"]')) window.setTimeout(renderHome,180);
  });

  const timer = window.setInterval(() => {
    if (renderHome()) {
      window.clearInterval(timer);
      window.setTimeout(openRequestedReturnDetail, 80);
    }
  },300);
  window.setTimeout(() => window.clearInterval(timer),15000);
  window.icsOrganizeMeinIcsCockpit = renderHome;
})();