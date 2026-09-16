// =========================================================
// ICS · HEUTE PERSONAL
// Echte Cloud-Daten: Erkenntnis, Zustand und aktuell offene ACTION.
// Integrierte ACTIONS werden nicht erneut als offen angezeigt.
// =========================================================
(() => {
  const GOLD = '#b8924f';
  const CREAM = '#f6f1e7';
  const STATE_LABELS = {
    kopfVoll: 'Kopf voll', erschoepft: 'Erschöpft', angespannt: 'Angespannt',
    unruhig: 'Unruhig', festgefahren: 'Festgefahren', energielos: 'Energielos'
  };

  function esc(value) {
    return String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
      .replaceAll('"','&quot;').replaceAll("'",'&#039;');
  }
  function first(r, keys) {
    for (const key of keys) {
      const value = r?.[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return '';
  }
  function short(value, max=120) {
    const text = String(value || '').replace(/\s+/g,' ').trim();
    return text.length > max ? `${text.slice(0,max-1).trim()}…` : text;
  }
  function findLatest(items, toolId) {
    return items.find(item => item.tool_id === toolId) || null;
  }
  function findOpenAction(items) {
    const integrations = items.filter(item => item.tool_id === 'action_integration');
    const integratedIds = new Set(integrations.map(item => first(item.result || {}, ['local_action_id'])).filter(Boolean));
    const integratedSteps = new Set(integrations.map(item => first(item.result || {}, ['step'])).filter(Boolean));

    return items.find(item => {
      if (item.tool_id !== 'action_next_step' || item?.result?.done === true) return false;
      const r = item.result || {};
      const localId = first(r, ['local_id','id']);
      const step = first(r, ['step','action','text']);
      if (localId && integratedIds.has(localId)) return false;
      if (!localId && step && integratedSteps.has(step)) return false;
      return true;
    }) || null;
  }
  function getName() {
    const local = localStorage.getItem('ICS_USER_NAME') || localStorage.getItem('icsUserName') || '';
    return local.trim();
  }
  function card(label, title, text, actionLabel, actionView) {
    return `<article style="padding:16px;border:1px solid rgba(184,146,79,.28);border-radius:15px;background:rgba(184,146,79,.035);">
      <small style="display:block;color:${GOLD};letter-spacing:.09em;font-weight:700;">${esc(label)}</small>
      <strong style="display:block;margin-top:6px;color:${CREAM};font-size:1.04rem;line-height:1.35;">${esc(short(title,90))}</strong>
      ${text ? `<p style="margin:7px 0 0;opacity:.7;line-height:1.5;">${esc(short(text,150))}</p>` : ''}
      ${actionLabel ? `<button type="button" data-today-view="${esc(actionView)}" style="margin-top:13px;border:0;background:none;color:${GOLD};padding:0;cursor:pointer;font:inherit;font-weight:700;">${esc(actionLabel)} →</button>` : ''}
    </article>`;
  }

  function ensureTarget() {
    const today = document.getElementById('view-heute');
    if (!today) return null;
    let target = document.getElementById('icsTodayPersonal');
    if (target) return target;
    const oldWelcome = today.querySelector('.welcome-card');
    target = document.createElement('section');
    target.id = 'icsTodayPersonal';
    target.className = 'premium-card';
    target.style.marginTop = '24px';
    target.innerHTML = '<small style="opacity:.65;">Dein persönlicher Tagesbereich wird geladen…</small>';
    if (oldWelcome) {
      oldWelcome.hidden = true;
      oldWelcome.style.display = 'none';
      oldWelcome.insertAdjacentElement('afterend', target);
    } else {
      const daily = today.querySelector('.daily-card');
      if (daily) daily.insertAdjacentElement('afterend', target); else today.appendChild(target);
    }
    return target;
  }

  async function renderToday() {
    const target = ensureTarget();
    if (!target || typeof window.icsGetToolResults !== 'function') return false;
    const response = await window.icsGetToolResults({ limit: 100 });
    if (!response?.ok) return false;
    const items = response.data || [];
    const trigger = findLatest(items,'trigger_kompass');
    const integration = findLatest(items,'action_integration');
    const energy = findLatest(items,'energy_check');
    const action = findOpenAction(items);
    const name = getName();

    const tr = trigger?.result || {}, ir = integration?.result || {}, er = energy?.result || {}, ar = action?.result || {};
    const insightTitle = first(ir,['learning','takeaway','integration']) || first(tr,['newCode','new_code']) || first(tr,['trigger','theme']) || 'Dein Weg entsteht mit deiner Nutzung.';
    const insightText = first(ir,['changed','change','reflection']) || (first(tr,['trigger']) ? `Zuletzt sichtbar: ${first(tr,['trigger'])}` : 'Deine gespeicherten Erkenntnisse werden hier für heute verdichtet.');
    const state = STATE_LABELS[er.routerState] || first(er,['selectedState','state','topic']) || (er.focus === 'mind' ? 'Kopf' : er.focus === 'body' ? 'Körper' : er.focus === 'energy' ? 'Energie' : 'Noch kein Check');
    const changes = [];
    if (er.before?.energy != null && er.after?.energy != null) changes.push(`Energie ${er.before.energy} → ${er.after.energy}`);
    if (er.before?.body != null && er.after?.body != null) changes.push(`Körper ${er.before.body} → ${er.after.body}`);
    if (er.before?.mind != null && er.after?.mind != null) changes.push(`Kopf ${er.before.mind} → ${er.after.mind}`);

    const actionTitle = first(ar,['step','action','text']) || 'Für heute ist kein nächster Schritt offen.';
    const actionText = action ? (first(ar,['topic','theme']) || 'Dein nächster gespeicherter Schritt.') : 'Deine zuletzt integrierte ACTION ist abgeschlossen. Ein neuer Schritt erscheint hier, sobald du ihn festlegst.';

    target.innerHTML = `<p class="section-kicker">DEIN HEUTE</p>
      <h2 style="margin-bottom:6px;">${esc(name ? `Willkommen zurück, ${name}.` : 'Dein persönlicher Tag.')}</h2>
      <p style="margin-top:0;opacity:.7;">Nicht alles auf einmal. Das ist aus deinem ICS gerade relevant.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin-top:20px;">
        ${card('WAS SICH ZEIGT', insightTitle, insightText, 'Entwicklung ansehen', 'development')}
        ${card('LETZTER ZUSTAND', state, changes.join(' · ') || 'Noch keine Veränderungswerte gespeichert.', 'Zustand öffnen', 'energy')}
        ${card('DEINE ACTION', actionTitle, actionText, action ? 'ACTION öffnen' : '', 'action')}
      </div>`;
    return true;
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-today-view]');
    if (!button) return;
    const detail = button.dataset.todayView;
    if (typeof window.openView === 'function') window.openView('meinics');
    window.setTimeout(() => document.querySelector(`[data-ics-detail="${detail}"]`)?.click(),120);
  });

  const timer = window.setInterval(() => {
    if (document.getElementById('view-heute') && window.icsGetToolResults) {
      window.clearInterval(timer); ensureTarget(); renderToday();
    }
  },100);
  window.setTimeout(() => window.clearInterval(timer),15000);
  window.addEventListener('ics:energy-cloud-saved',renderToday);
  window.addEventListener('ics:energy-cloud-restored',renderToday);
  window.addEventListener('ics:action-integrated',renderToday);
  window.icsRenderTodayPersonal = renderToday;
})();