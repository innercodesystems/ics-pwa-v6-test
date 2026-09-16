// =========================================================
// ICS TRIGGER-KOMPASS · ACTION BRIDGE
// Übernimmt die im Trigger-Kompass formulierte ACTION zusätzlich
// in den bestehenden Bereich „Mein nächster Schritt“.
// =========================================================
(() => {
  const ACTION_KEY = 'ICS_ACTION_NEXT_STEPS';
  const originalSaveResult = window.saveResult;

  if (typeof originalSaveResult !== 'function') return;

  function readSteps() {
    try {
      const saved = JSON.parse(localStorage.getItem(ACTION_KEY) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  function createId() {
    return globalThis.crypto?.randomUUID?.() || `ACTION_${Date.now()}`;
  }

  window.saveResult = async function saveResultWithActionBridge() {
    await originalSaveResult();

    const message = document.getElementById('saveMsg');
    if (!message?.textContent?.startsWith('Gespeichert ✓')) return;

    const step = String(result?.nextStep || '').trim();
    if (!step) return;

    const id = createId();
    const createdAt = new Date().toISOString();
    const topic = result?.theme
      ? `Trigger-Kompass · ${result.theme}`
      : `Trigger-Kompass · ${result?.trigger || 'Erkenntnis'}`;

    const steps = readSteps();
    steps.unshift({
      id,
      createdAt,
      topic,
      size: 'small',
      step,
      done: false,
      source: 'trigger_kompass',
      trigger: result?.trigger || '',
      newCode: result?.newCode || ''
    });

    localStorage.setItem(ACTION_KEY, JSON.stringify(steps.slice(0, 100)));

    try {
      const { data: sessionData } = await client.auth.getSession();
      const user = sessionData?.session?.user;

      if (user?.id) {
        const { error } = await client.from('tool_results').insert({
          user_id: user.id,
          tool_id: 'action_next_step',
          tool_name: 'ICS Action - Mein nächster Schritt',
          result: {
            local_id: id,
            created_at: createdAt,
            topic,
            size: 'small',
            step,
            done: false,
            completed_at: null,
            source: 'trigger_kompass',
            trigger: result?.trigger || '',
            new_code: result?.newCode || ''
          }
        });

        if (error) {
          console.warn('ICS Trigger ACTION Cloud Speicherung:', error.message);
        }
      }
    } catch (error) {
      console.warn('ICS Trigger ACTION Bridge:', error);
    }

    message.textContent = 'Gespeichert ✓ Deine Erkenntnis ist in Mein ICS und deine ACTION wurde als nächster Schritt übernommen.';
  };
})();