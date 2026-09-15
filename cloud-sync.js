// =========================================================
// ICS CLOUD SYNC
// =========================================================

(() => {
  const JOURNAL_KEY = 'ICS_APP_V6_NEU_JOURNAL';
  let installed = false;
  let lastSyncedId = null;

  async function saveToolResult(toolId, toolName, result) {
    const client = window.icsSupabase;
    if (!client) return { ok: false };

    const { data: sessionData } = await client.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user?.id) return { ok: false };

    const { data, error } = await client
      .from('tool_results')
      .insert({
        user_id: user.id,
        tool_id: toolId,
        tool_name: toolName,
        result: result
      })
      .select()
      .single();

    if (error) {
      console.warn('ICS Cloud Speicherung:', error.message);
      return { ok: false, error };
    }

    return { ok: true, data };
  }

  window.icsSaveToolResult = saveToolResult;

  function installJournalSync() {
    if (installed) return true;

    const button = document.getElementById('saveJournal');
    if (!button) return false;

    installed = true;

    button.addEventListener('click', () => {
      setTimeout(async () => {
        let entries = [];

        try {
          entries = JSON.parse(
            localStorage.getItem(JOURNAL_KEY) || '[]'
          );
        } catch {
          return;
        }

        const entry = entries[0];

        if (!entry?.id || entry.id === lastSyncedId) return;

        lastSyncedId = entry.id;

        const saved = await saveToolResult(
          'journal',
          'ICS Journal',
          {
            local_id: entry.id,
            date: entry.date,
            types: entry.types || [],
            text: entry.text || ''
          }
        );

        if (!saved.ok) {
          lastSyncedId = null;
        }
      }, 0);
    });

    return true;
  }

  const timer = setInterval(() => {
    if (installJournalSync()) {
      clearInterval(timer);
    }
  }, 250);

  setTimeout(() => clearInterval(timer), 15000);
})();
