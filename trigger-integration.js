// =========================================================
// ICS TRIGGER-KOMPASS · MEIN ICS INTEGRATION
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

  async function renderLatestTrigger() {
    const target = getTriggerTarget();
    if (!target || typeof window.icsGetLatestToolResult !== 'function') return false;

    const latest = await window.icsGetLatestToolResult('trigger_kompass');
    if (!latest.ok) {
      target.innerHTML = '<small>Trigger-Auswertung konnte gerade nicht geladen werden.</small>';
      return true;
    }
    if (!latest.data) {
      target.innerHTML = '<small>Noch keine Trigger-Auswertung in deiner Cloud gespeichert.</small>';
      return true;
    }

    const r = latest.data.result || {};
    target.innerHTML = `
      <small style="display:block;color:#b8924f;letter-spacing:.08em;text-transform:uppercase;">Letzte Erkenntnis · Trigger-Kompass</small>
      <strong style="display:block;margin-top:8px;color:#f6f1e7;">${escapeHtml(r.theme || r.trigger || 'Trigger erkannt')}</strong>
      ${r.trigger ? `<p style="margin:7px 0 0;">Trigger: ${escapeHtml(r.trigger)}${r.need ? ` · Bedürfnis: ${escapeHtml(r.need)}` : ''}</p>` : ''}
      ${r.newCode ? `<div style="margin-top:10px;padding-left:12px;border-left:2px solid #b8924f;"><small style="color:#b8924f;">DEIN NEUER CODE</small><p style="margin:5px 0 0;"><strong>${escapeHtml(r.newCode)}</strong></p></div>` : ''}
      ${r.nextStep ? `<p style="margin:10px 0 0;"><small>ACTION</small><br>${escapeHtml(r.nextStep)}</p>` : ''}
    `;
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