// =========================================================
// ICS · ENTWICKLUNGSLINIE
// Verdichtet vorhandene persönliche Cloud-Daten zu einer ruhigen Journey.
// Keine Scores, keine künstliche Gamification – nur echte gespeicherte Schritte.
// =========================================================
(() => {
  const GOLD = '#b8924f';
  const CREAM = '#f6f1e7';
  const TOOL_IDS = ['trigger_kompass', 'action_next_step', 'action_integration', 'energy_check', 'journal'];

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }

  function compact(value, max = 118) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    return text.length > max ? `${text.slice(0, max - 1).trim()}…` : text;
  }

  function firstValue(result, keys) {
    for (const key of keys) {
      const value = result?.[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return '';
  }

  function formatDate(value) {
    const date = new Date(value || '');
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  }

  function describe(item) {
    const r = item?.result || {};
    const date = formatDate(item?.created_at || r?.date || r?.createdAt || r?.completedAt);

    if (item.tool_id === 'trigger_kompass') {
      const shown = firstValue(r, ['trigger', 'situation', 'theme']);
      const code = firstValue(r, ['newCode', 'new_code']);
      return { stage: 'ERKANNT', title: shown || 'Ein Trigger wurde sichtbar', text: code ? `Neuer Code: ${code}` : firstValue(r, ['need', 'belief']), date };
    }

    if (item.tool_id === 'action_next_step') {
      return { stage: 'ENTSCHIEDEN', title: firstValue(r, ['step', 'action', 'text']) || 'Ein nächster Schritt wurde gewählt', text: firstValue(r, ['topic', 'theme']), date };
    }

    if (item.tool_id === 'action_integration') {
      return { stage: 'INTEGRIERT', title: firstValue(r, ['changed', 'change', 'reflection']) || 'Eine Veränderung wurde wahrgenommen', text: firstValue(r, ['learning', 'takeaway', 'integration']), date };
    }

    if (item.tool_id === 'energy_check') {
      const state = firstValue(r, ['state', 'topic', 'selectedState', 'focus']);
      const before = r?.before || {};
      const after = r?.after || {};
      const values = [];
      if (before.energy != null && after.energy != null) values.push(`Energie ${before.energy} → ${after.energy}`);
      if (before.body != null && after.body != null) values.push(`Körper ${before.body} → ${after.body}`);
      if (before.head != null && after.head != null) values.push(`Kopf ${before.head} → ${after.head}`);
      return { stage: 'WAHRGENOMMEN', title: state ? `Zustand: ${state}` : 'Dein Zustand wurde bewusst wahrgenommen', text: values.join(' · '), date };
    }

    if (item.tool_id === 'journal') {
      return { stage: 'REFLEKTIERT', title: firstValue(r, ['title', 'question', 'prompt']) || 'Ein Journal-Impuls wurde festgehalten', text: firstValue(r, ['text', 'answer', 'content', 'note']), date };
    }

    return null;
  }

  function ensureTarget() {
    let target = document.getElementById('icsDevelopmentJourney');
    if (target) return target;
    const overview = document.getElementById('icsPersonalOverview');
    if (!overview) return null;
    target = document.createElement('div');
    target.id = 'icsDevelopmentJourney';
    target.innerHTML = '<small>Deine Entwicklung wird aus deinen gespeicherten ICS-Schritten aufgebaut.</small>';
    overview.appendChild(target);
    return target;
  }

  async function loadJourney() {
    const target = ensureTarget();
    const getResults = window.icsGetToolResults;
    if (!target || typeof getResults !== 'function') return false;

    const response = await getResults({ limit: 100 });
    if (!response?.ok) return false;

    const entries = (response.data || [])
      .filter(item => TOOL_IDS.includes(item.tool_id))
      .map(item => ({ item, view: describe(item) }))
      .filter(entry => entry.view)
      .slice(0, 12);

    if (!entries.length) {
      target.innerHTML = `<div style="padding:18px;border:1px solid rgba(184,146,79,.28);border-radius:16px;background:rgba(184,146,79,.035);">
        <small style="color:${GOLD};letter-spacing:.10em;">DEINE ENTWICKLUNG</small>
        <h3 style="margin:7px 0 6px;color:${CREAM};">Deine Linie beginnt hier</h3>
        <p style="margin:0;opacity:.68;line-height:1.5;">Sobald du ICS nutzt, verbinden sich Erkenntnisse, Entscheidungen, Handlungen und Integration zu deiner persönlichen Entwicklung.</p>
      </div>`;
      return true;
    }

    target.innerHTML = `<div style="padding:18px;border:1px solid rgba(184,146,79,.28);border-radius:16px;background:rgba(184,146,79,.035);">
      <small style="display:block;color:${GOLD};letter-spacing:.10em;">DEINE ENTWICKLUNG</small>
      <h3 style="margin:7px 0 6px;color:${CREAM};">Was sich bereits bewegt</h3>
      <p style="margin:0 0 20px;opacity:.68;line-height:1.5;">Deine letzten gespeicherten Schritte – nicht als Bewertung, sondern als sichtbarer Weg.</p>
      <div>${entries.map((entry, index) => {
        const v = entry.view;
        return `<div style="position:relative;padding:0 0 ${index === entries.length - 1 ? '0' : '18px'} 24px;">
          <span style="position:absolute;left:0;top:5px;width:9px;height:9px;border-radius:50%;background:${GOLD};box-shadow:0 0 0 4px rgba(184,146,79,.10);"></span>
          ${index === entries.length - 1 ? '' : '<span style="position:absolute;left:4px;top:17px;bottom:0;width:1px;background:rgba(184,146,79,.25);"></span>'}
          <div style="display:flex;gap:10px;justify-content:space-between;align-items:baseline;">
            <small style="color:${GOLD};letter-spacing:.08em;font-weight:700;">${escapeHtml(v.stage)}</small>
            <small style="opacity:.45;">${escapeHtml(v.date)}</small>
          </div>
          <strong style="display:block;margin-top:5px;color:${CREAM};line-height:1.35;">${escapeHtml(compact(v.title, 110))}</strong>
          ${v.text ? `<p style="margin:5px 0 0;opacity:.68;line-height:1.45;">${escapeHtml(compact(v.text, 150))}</p>` : ''}
        </div>`;
      }).join('')}</div>
    </div>`;
    return true;
  }

  const timer = window.setInterval(() => {
    if (window.icsGetToolResults && document.getElementById('icsPersonalOverview')) {
      window.clearInterval(timer);
      loadJourney();
    }
  }, 300);
  window.setTimeout(() => window.clearInterval(timer), 15000);

  window.addEventListener('ics:energy-cloud-saved', loadJourney);
  window.addEventListener('ics:energy-cloud-restored', loadJourney);
  window.icsLoadDevelopmentJourney = loadJourney;
})();