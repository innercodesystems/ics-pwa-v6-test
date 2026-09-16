// =========================================================
// ICS ACTION · RÜCKBLICK & INTEGRATION
// Erledigt -> reflektieren -> Cloud -> Mein ICS
// =========================================================
(() => {
  const ACTION_KEY = 'ICS_ACTION_NEXT_STEPS';
  let installed = false;
  let pendingStep = null;

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function readSteps() {
    try {
      const data = JSON.parse(localStorage.getItem(ACTION_KEY) || '[]');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function writeSteps(steps) {
    localStorage.setItem(ACTION_KEY, JSON.stringify(steps.slice(0, 100)));
  }

  function getReflectionCard() {
    let card = document.getElementById('icsActionIntegrationCard');
    if (card) return card;

    const currentCard = document.getElementById('actionCurrentStepCard');
    if (!currentCard) return null;

    card = document.createElement('section');
    card.className = 'premium-card';
    card.id = 'icsActionIntegrationCard';
    card.hidden = true;
    card.style.marginTop = '24px';
    currentCard.insertAdjacentElement('afterend', card);
    return card;
  }

  function showReflection(step) {
    const card = getReflectionCard();
    if (!card || !step) return;

    pendingStep = step;
    card.innerHTML = `
      <p class="section-kicker">4 · INTEGRATION</p>
      <h2>Was hat sich verändert?</h2>
      <p style="margin-top:8px;opacity:.82;">
        Du hast deinen Schritt als erledigt markiert. Nimm dir einen Moment und mache sichtbar, was du daraus mitnimmst.
      </p>
      <div style="margin-top:18px;padding:14px;border-left:2px solid #b8924f;background:rgba(184,146,79,.06);">
        <small style="color:#b8924f;">DEIN SCHRITT</small>
        <p style="margin:6px 0 0;"><strong>${escapeHtml(step.step)}</strong></p>
      </div>
      <label for="icsActionChanged" style="display:block;margin-top:20px;">Was hat sich durch diesen Schritt verändert?</label>
      <textarea id="icsActionChanged" maxlength="500" placeholder="Zum Beispiel: Ich war klarer, ruhiger, mutiger …" style="width:100%;min-height:100px;margin-top:9px;"></textarea>
      <label for="icsActionLearning" style="display:block;margin-top:18px;">Was möchtest du daraus mitnehmen?</label>
      <textarea id="icsActionLearning" maxlength="500" placeholder="Meine Erkenntnis daraus …" style="width:100%;min-height:90px;margin-top:9px;"></textarea>
      <button type="button" class="gold-button" id="icsSaveActionIntegration" style="margin-top:20px;">Integration speichern</button>
      <p id="icsActionIntegrationFeedback" style="margin-top:12px;"></p>
    `;
    card.hidden = false;
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('icsSaveActionIntegration')?.addEventListener('click', saveIntegration);
  }

  async function saveIntegration() {
    if (!pendingStep?.id) return;

    const changed = document.getElementById('icsActionChanged')?.value.trim() || '';
    const learning = document.getElementById('icsActionLearning')?.value.trim() || '';
    const feedback = document.getElementById('icsActionIntegrationFeedback');

    if (!changed) {
      if (feedback) feedback.textContent = 'Bitte halte kurz fest, was sich verändert hat.';
      return;
    }

    const integratedAt = new Date().toISOString();
    const steps = readSteps();
    const updated = steps.map(item => item.id === pendingStep.id ? {
      ...item,
      integration: { changed, learning, integratedAt }
    } : item);
    writeSteps(updated);

    let cloudSaved = false;
    if (typeof window.icsSaveToolResult === 'function') {
      const saved = await window.icsSaveToolResult(
        'action_integration',
        'ICS Action - Integration',
        {
          local_action_id: pendingStep.id,
          topic: pendingStep.topic || '',
          step: pendingStep.step || '',
          size: pendingStep.size || 'small',
          completed_at: pendingStep.completedAt || integratedAt,
          changed,
          learning,
          integrated_at: integratedAt
        }
      );
      cloudSaved = Boolean(saved?.ok);
    }

    if (feedback) {
      feedback.textContent = cloudSaved
        ? 'Integration gespeichert ✓ Deine Erfahrung fließt jetzt in Mein ICS ein.'
        : 'Integration auf diesem Gerät gespeichert. Die Cloud konnte gerade nicht erreicht werden.';
    }

    const button = document.getElementById('icsSaveActionIntegration');
    if (button) {
      button.disabled = true;
      button.textContent = 'In Mein ICS gespeichert ✓';
    }

    renderLatestIntegrationForMeinIcs();
  }

  function getMeinIcsTarget() {
    let target = document.getElementById('icsLatestActionIntegration');
    if (target) return target;

    const overview = document.getElementById('icsPersonalOverview');
    if (!overview) return null;

    target = document.createElement('div');
    target.id = 'icsLatestActionIntegration';
    target.style.marginTop = '16px';
    target.style.paddingTop = '16px';
    target.style.borderTop = '1px solid rgba(184,146,79,.28)';

    const trigger = document.getElementById('icsLatestTrigger');
    if (trigger) trigger.insertAdjacentElement('afterend', target);
    else overview.appendChild(target);
    return target;
  }

  async function renderLatestIntegrationForMeinIcs() {
    const target = getMeinIcsTarget();
    if (!target || typeof window.icsGetLatestToolResult !== 'function') return;

    const latest = await window.icsGetLatestToolResult('action_integration');
    if (!latest?.ok || !latest.data) {
      target.innerHTML = '<small>Deine nächste umgesetzte ACTION und Integration erscheint hier.</small>';
      return;
    }

    const r = latest.data.result || {};
    target.innerHTML = `
      <small style="display:block;color:#b8924f;letter-spacing:.08em;text-transform:uppercase;">Umgesetzt & integriert · ACTION</small>
      ${r.topic ? `<strong style="display:block;margin-top:8px;color:#f6f1e7;">${escapeHtml(r.topic)}</strong>` : ''}
      ${r.step ? `<p style="margin:7px 0 0;">Schritt: ${escapeHtml(r.step)}</p>` : ''}
      ${r.changed ? `<div style="margin-top:10px;padding-left:12px;border-left:2px solid #b8924f;"><small style="color:#b8924f;">WAS SICH VERÄNDERT HAT</small><p style="margin:5px 0 0;"><strong>${escapeHtml(r.changed)}</strong></p></div>` : ''}
      ${r.learning ? `<p style="margin:10px 0 0;"><small>DEINE ERKENNTNIS</small><br>${escapeHtml(r.learning)}</p>` : ''}
    `;
  }

  function install() {
    if (installed) return true;
    const completeButton = document.getElementById('completeActionCurrentStep');
    if (!completeButton || !getReflectionCard()) return false;

    installed = true;

    completeButton.addEventListener('click', () => {
      const stepId = document.getElementById('actionCurrentStepCard')?.dataset.stepId;
      if (!stepId) return;
      const step = readSteps().find(item => item.id === stepId);
      if (!step) return;

      setTimeout(() => {
        const completed = readSteps().find(item => item.id === stepId) || step;
        showReflection(completed);
      }, 40);
    }, true);

    document.addEventListener('click', event => {
      if (!event.target.closest('[data-view="meinics"]')) return;
      setTimeout(renderLatestIntegrationForMeinIcs, 120);
    });

    if (new URLSearchParams(window.location.search).get('view') === 'meinics') {
      setTimeout(renderLatestIntegrationForMeinIcs, 180);
    }

    return true;
  }

  const timer = setInterval(() => {
    if (install()) clearInterval(timer);
  }, 250);
  setTimeout(() => clearInterval(timer), 15000);

  window.icsRenderLatestActionIntegration = renderLatestIntegrationForMeinIcs;
})();