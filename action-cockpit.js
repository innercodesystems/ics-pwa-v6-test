// =========================================================
// ICS · ACTION COCKPIT BRIDGE
// Zeigt in Mein ICS → Deine ACTION zuerst den aktuell offenen Schritt
// und darunter die letzte Integration direkt aus den Cloud-Daten.
// =========================================================
(() => {
  let placeholder = null;
  const GOLD = '#b8924f';
  const CREAM = '#f6f1e7';

  function esc(value) {
    return String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
      .replaceAll('"','&quot;').replaceAll("'",'&#039;');
  }
  function first(result, keys) {
    for (const key of keys) {
      const value = result?.[key];
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return '';
  }

  function ensurePlaceholder(card) {
    if (placeholder?.isConnected) return;
    placeholder = document.createElement('span');
    placeholder.id = 'icsActionCurrentStepPlaceholder';
    placeholder.hidden = true;
    card.parentNode?.insertBefore(placeholder, card);
  }

  async function renderLatestIntegration(content, hasCurrentAction) {
    let block = document.getElementById('icsActionCloudIntegration');
    if (!block) {
      block = document.createElement('section');
      block.id = 'icsActionCloudIntegration';
    }
    block.style.cssText = `margin-top:${hasCurrentAction ? '28px' : '0'};padding-top:${hasCurrentAction ? '24px' : '0'};border-top:${hasCurrentAction ? '1px solid rgba(184,146,79,.28)' : '0'};`;
    block.innerHTML = '<small style="opacity:.6;">Letzte Integration wird geladen…</small>';
    content.appendChild(block);

    if (typeof window.icsGetToolResults !== 'function') {
      block.remove();
      return;
    }
    const response = await window.icsGetToolResults({ toolId: 'action_integration', limit: 1 });
    const item = response?.ok ? response.data?.[0] : null;
    const r = item?.result || {};
    if (!item) {
      block.remove();
      return;
    }

    const topic = first(r,['topic','theme']) || 'ACTION';
    const step = first(r,['step','action','text']);
    const changed = first(r,['changed','change','reflection']);
    const learning = first(r,['learning','takeaway','integration']);

    block.innerHTML = `<small style="display:block;color:${GOLD};letter-spacing:.08em;text-transform:uppercase;">ZULETZT UMGESETZT &amp; INTEGRIERT · ACTION</small>
      <h3 style="margin:8px 0 0;color:${CREAM};">${esc(topic)}</h3>
      ${step ? `<p style="margin:7px 0 0;opacity:.72;line-height:1.5;">Schritt: ${esc(step)}</p>` : ''}
      ${changed ? `<div style="margin-top:15px;padding-left:12px;border-left:1px solid ${GOLD};"><small style="color:${GOLD};">WAS SICH VERÄNDERT HAT</small><strong style="display:block;margin-top:5px;color:${CREAM};font-size:1.05rem;line-height:1.4;">${esc(changed)}</strong></div>` : ''}
      ${learning ? `<small style="display:block;margin-top:14px;color:${GOLD};">DEINE ERKENNTNIS</small><p style="margin:7px 0 0;opacity:.75;line-height:1.5;">${esc(learning)}</p>` : ''}`;
  }

  async function moveCurrentActionIntoDetail() {
    const detail = document.getElementById('icsCockpitDetail');
    const content = detail?.querySelector('#icsCockpitDetailContent');
    const card = document.getElementById('actionCurrentStepCard');
    if (!content || !card || detail.hidden) return false;

    ensurePlaceholder(card);
    const hasCurrentAction = !card.hidden;
    if (hasCurrentAction) {
      content.insertBefore(card, content.firstChild);
      card.style.marginTop = '0';
    }

    // Das alte verschobene Integrationselement wird in dieser Ansicht nicht mehr benötigt.
    const oldIntegration = document.getElementById('icsLatestActionIntegration');
    if (oldIntegration && oldIntegration.parentElement === content) oldIntegration.remove();

    await renderLatestIntegration(content, hasCurrentAction);
    return true;
  }

  function restoreCurrentAction() {
    const card = document.getElementById('actionCurrentStepCard');
    if (!card || !placeholder?.isConnected) return;
    placeholder.parentNode.insertBefore(card, placeholder.nextSibling);
    card.style.marginTop = '24px';
  }

  document.addEventListener('click', event => {
    if (event.target.closest('#icsCockpitBack')) restoreCurrentAction();
  }, true);

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-ics-detail="action"]');
    if (!button) return;
    window.setTimeout(moveCurrentActionIntoDetail, 50);
  });

  window.icsShowCurrentActionInCockpit = moveCurrentActionIntoDetail;
})();