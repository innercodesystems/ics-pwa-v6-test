// =========================================================
// ICS · ACTION COCKPIT BRIDGE
// Zeigt in Mein ICS → Deine ACTION zuerst den aktuell offenen Schritt
// und darunter die zuletzt umgesetzte & integrierte ACTION.
// Die bestehende ACTION-Logik bleibt die Quelle der Wahrheit.
// =========================================================
(() => {
  let placeholder = null;

  function ensurePlaceholder(card) {
    if (placeholder?.isConnected) return;
    placeholder = document.createElement('span');
    placeholder.id = 'icsActionCurrentStepPlaceholder';
    placeholder.hidden = true;
    card.parentNode?.insertBefore(placeholder, card);
  }

  function prepareIntegration(content, card) {
    const integration = document.getElementById('icsLatestActionIntegration');
    if (!integration || integration === card) return;

    // Falls das Cockpit die Integration bereits in die Detailansicht verschoben hat,
    // bleibt sie dort und bekommt nur die richtige visuelle Reihenfolge.
    if (integration.parentElement !== content) content.appendChild(integration);
    integration.style.marginTop = card && !card.hidden ? '28px' : '0';
    integration.style.paddingTop = card && !card.hidden ? '24px' : '';
    integration.style.borderTop = card && !card.hidden ? '1px solid rgba(184,146,79,.28)' : '';
  }

  function moveCurrentActionIntoDetail() {
    const detail = document.getElementById('icsCockpitDetail');
    const content = detail?.querySelector('#icsCockpitDetailContent');
    const card = document.getElementById('actionCurrentStepCard');
    if (!content || !card || detail.hidden) return false;

    ensurePlaceholder(card);

    // Die bestehende App-Core-Logik hat den aktuell offenen Schritt bereits gerendert.
    // Ist kein Schritt offen, bleibt die Karte verborgen und die Integration steht allein.
    if (!card.hidden) {
      content.insertBefore(card, content.firstChild);
      card.style.marginTop = '0';
    }

    prepareIntegration(content, card);
    return true;
  }

  function restoreCurrentAction() {
    const card = document.getElementById('actionCurrentStepCard');
    if (!card || !placeholder?.isConnected) return;
    placeholder.parentNode.insertBefore(card, placeholder.nextSibling);
    card.style.marginTop = '24px';
  }

  // Capture: vor dem Cockpit-Back-Handler zurück an den ursprünglichen Platz legen.
  document.addEventListener('click', (event) => {
    if (event.target.closest('#icsCockpitBack')) restoreCurrentAction();
  }, true);

  // Nach dem Öffnen der ACTION-Detailseite die vorhandene aktuelle ACTION nach oben setzen.
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-ics-detail="action"]');
    if (!button) return;
    window.setTimeout(moveCurrentActionIntoDetail, 40);
  });

  // HEUTE öffnet Mein ICS und klickt anschließend ebenfalls die ACTION-Karte.
  window.icsShowCurrentActionInCockpit = moveCurrentActionIntoDetail;
})();