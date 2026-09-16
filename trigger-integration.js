// =========================================================
// ICS TRIGGER-KOMPASS · MEIN ICS INTEGRATION
// Letzte Erkenntnis + Entwicklung + Verlauf
// =========================================================
(() => {
  let installed = false;

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function installTriggerCard() {
    if (document.getElementById('openTriggerKompass')) return true;
    const list = document.querySelector('#view-meinics .tool-list');
    if (!list) return false;

    const button = document.createElement('button');
    button.className = 'tool-card';
    button.id = 'openTriggerKompass';
    button.innerHTML = `
      <span>✦</span>
      <div>
        <strong>Trigger-Kompass</strong>
        <small>Erkenne deinen Trigger und wähle einen neuen Code.</small>
      </div>
      <b>›</b>
    `;
    list.prepend(button);
    button.addEventListener('click', () => {
      window.location.href = './trigger-kompass-app.html';
    });
    return true;
  }

  function getTriggerTarget() {
    let target = document.getElementById('icsLatestTrigger');
    if (target) return target;

    const overview = document.getElementById('icsPersonalOverview');
    const cloud = document.getElementById('icsLatestCloudActivity');
    if (!overview) return null;

    target = document.createElement('div');
    target.id = 'icsLatestTrigger';
    target.style.marginTop = '16px';
    target.style.paddingTop = '16px';
    target.style.borderTop = '1px solid rgba(184,146,79,.28)';
    target.innerHTML = '<small>Noch keine Trigger-Auswertung in deiner Cloud gespeichert.</small>';

    if (cloud) cloud.insertAdjacentElement('afterend', target);
    else overview.appendChild(target);
    return target;
  }

  function countValues(rows, key) {
    const counts = new Map();
    rows.forEach(row => {
      const value = String(row?.result?.[key] || '').trim();
      if (!value) return;
      counts.set(value, (counts.get(value) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }

  function developmentHtml(rows) {
    if (rows.length < 2) {
      return `
        <div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(184,146,79,.18);">
          <small style="color:#b8924f;letter-spacing:.06em;text-transform:uppercase;">Deine Entwicklung</small>
          <p style="margin:7px 0 0;opacity:.78;">Mit deiner nächsten Trigger-Auswertung können erste Wiederholungen und Veränderungen sichtbar werden.</p>
        </div>
      `;
    }

    const triggers = countValues(rows, 'trigger');
    const needs = countValues(rows, 'need');
    const beliefs = countValues(rows, 'belief');
    const topTrigger = triggers[0];
    const topNeed = needs[0];
    const topBelief = beliefs[0];
    const repeated = [topTrigger, topNeed, topBelief].some(item => item && item[1] >= 2);

    let pattern = 'Deine bisherigen Auswertungen zeigen unterschiedliche Themen. Das ist ebenfalls Entwicklung: Du sammelst ein genaueres Bild davon, was dich in verschiedenen Situationen bewegt.';
    if (repeated) {
      const parts = [];
      if (topTrigger?.[1] >= 2) parts.push(`Trigger „${escapeHtml(topTrigger[0])}“ ${topTrigger[1]}×`);
      if (topNeed?.[1] >= 2) parts.push(`Bedürfnis „${escapeHtml(topNeed[0])}“ ${topNeed[1]}×`);
      if (topBelief?.[1] >= 2) parts.push(`innerer Satz „${escapeHtml(topBelief[0])}“ ${topBelief[1]}×`);
      pattern = `Das fällt auf: ${parts.join(' · ')}. Diese Wiederholung ist eine Beobachtung aus deinen gespeicherten Auswertungen – keine Bewertung.`;
    }

    const intensities = rows
      .map(row => Number(row?.result?.intensity))
      .filter(value => Number.isFinite(value));
    let intensityLine = '';
    if (intensities.length >= 2) {
      const newest = intensities[0];
      const oldest = intensities[intensities.length - 1];
      intensityLine = `<p style="margin:7px 0 0;opacity:.78;">Intensität: älteste gespeicherte Auswertung ${escapeHtml(oldest)}/10 → aktuell ${escapeHtml(newest)}/10.</p>`;
    }

    return `
      <div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(184,146,79,.18);">
        <small style="color:#b8924f;letter-spacing:.06em;text-transform:uppercase;">Deine Entwicklung · ${rows.length} Auswertungen</small>
        <p style="margin:7px 0 0;">${pattern}</p>
        ${intensityLine}
      </div>
    `;
  }

  function historyHtml(rows) {
    const items = rows.map((row, index) => {
      const r = row.result || {};
      const date = formatDate(row.created_at);
      return `
        <div style="padding:13px 0;${index ? 'border-top:1px solid rgba(184,146,79,.16);' : ''}">
          <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
            <strong style="color:#f6f1e7;">${escapeHtml(r.theme || r.trigger || 'Trigger erkannt')}</strong>
            ${date ? `<small style="white-space:nowrap;opacity:.62;">${escapeHtml(date)}</small>` : ''}
          </div>
          ${r.trigger ? `<p style="margin:5px 0 0;">Trigger: ${escapeHtml(r.trigger)}${r.need ? ` · Bedürfnis: ${escapeHtml(r.need)}` : ''}${r.intensity ? ` · ${escapeHtml(r.intensity)}/10` : ''}</p>` : ''}
          ${r.newCode ? `<p style="margin:7px 0 0;"><small style="color:#b8924f;">NEUER CODE</small><br><strong>${escapeHtml(r.newCode)}</strong></p>` : ''}
          ${r.nextStep ? `<p style="margin:7px 0 0;"><small>ACTION</small><br>${escapeHtml(r.nextStep)}</p>` : ''}
        </div>
      `;
    }).join('');

    return `
      <button id="icsToggleTriggerHistory" type="button" aria-expanded="false" style="margin-top:14px;width:100%;padding:11px 14px;border:1px solid rgba(184,146,79,.55);border-radius:14px;background:transparent;color:#d4a03a;font:inherit;font-weight:700;cursor:pointer;">
        Alle ${rows.length} Auswertungen anzeigen ↓
      </button>
      <div id="icsTriggerHistory" hidden style="margin-top:10px;padding:4px 14px;border:1px solid rgba(184,146,79,.24);border-radius:14px;background:rgba(255,255,255,.015);">
        ${items}
      </div>
    `;
  }

  function bindHistoryToggle(rows) {
    const button = document.getElementById('icsToggleTriggerHistory');
    const history = document.getElementById('icsTriggerHistory');
    if (!button || !history) return;

    button.addEventListener('click', () => {
      const willOpen = history.hidden;
      history.hidden = !willOpen;
      button.setAttribute('aria-expanded', String(willOpen));
      button.textContent = willOpen
        ? 'Auswertungen schließen ↑'
        : `Alle ${rows.length} Auswertungen anzeigen ↓`;
    });
  }

  async function renderLatestTrigger() {
    const target = getTriggerTarget();
    if (!target || typeof window.icsGetToolResults !== 'function') return false;

    const history = await window.icsGetToolResults({ toolId: 'trigger_kompass', limit: 20 });
    if (!history.ok) {
      target.innerHTML = '<small>Trigger-Auswertung konnte gerade nicht geladen werden.</small>';
      return true;
    }
    if (!history.data.length) {
      target.innerHTML = '<small>Noch keine Trigger-Auswertung in deiner Cloud gespeichert.</small>';
      return true;
    }

    const latest = history.data[0];
    const r = latest.result || {};
    target.innerHTML = `
      <small style="display:block;color:#b8924f;letter-spacing:.08em;text-transform:uppercase;">Letzte Erkenntnis · Trigger-Kompass</small>
      <strong style="display:block;margin-top:8px;color:#f6f1e7;">${escapeHtml(r.theme || r.trigger || 'Trigger erkannt')}</strong>
      ${r.trigger ? `<p style="margin:7px 0 0;">Trigger: ${escapeHtml(r.trigger)}${r.need ? ` · Bedürfnis: ${escapeHtml(r.need)}` : ''}</p>` : ''}
      ${r.newCode ? `<div style="margin-top:10px;padding-left:12px;border-left:2px solid #b8924f;"><small style="color:#b8924f;">DEIN NEUER CODE</small><p style="margin:5px 0 0;"><strong>${escapeHtml(r.newCode)}</strong></p></div>` : ''}
      ${r.nextStep ? `<p style="margin:10px 0 0;"><small>ACTION</small><br>${escapeHtml(r.nextStep)}</p>` : ''}
      ${developmentHtml(history.data)}
      ${historyHtml(history.data)}
    `;
    bindHistoryToggle(history.data);
    return true;
  }

  function install() {
    const cardReady = installTriggerCard();
    const targetReady = Boolean(getTriggerTarget());
    if (!cardReady || !targetReady) return false;

    if (!installed) {
      installed = true;
      document.addEventListener('click', (event) => {
        if (!event.target.closest('[data-view="meinics"]')) return;
        setTimeout(renderLatestTrigger, 80);
      });
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'meinics') setTimeout(renderLatestTrigger, 120);
    return true;
  }

  const timer = setInterval(() => {
    if (install()) clearInterval(timer);
  }, 250);
  setTimeout(() => clearInterval(timer), 15000);

  window.icsRenderLatestTrigger = renderLatestTrigger;
})();