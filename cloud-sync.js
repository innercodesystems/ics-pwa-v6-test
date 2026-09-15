// =========================================================
// ICS CLOUD SYNC
// Journal + ACTION sicher dem eingeloggten Nutzer zuordnen
// =========================================================

(() => {
  const JOURNAL_KEY = 'ICS_APP_V6_NEU_JOURNAL';
  const ACTION_KEY = 'ICS_ACTION_NEXT_STEPS';

  let journalInstalled = false;
  let actionInstalled = false;

  let lastSyncedJournalId = null;
  let lastSyncedActionId = null;

  async function saveToolResult(toolId, toolName, result) {
    const client = window.icsSupabase;

    if (!client) {
      return { ok: false };
    }

    const { data: sessionData, error: sessionError } =
      await client.auth.getSession();

    if (sessionError) {
      console.warn(
        'ICS Sitzung konnte nicht gelesen werden:',
        sessionError.message
      );
      return { ok: false };
    }

    const user = sessionData?.session?.user;

    if (!user?.id) {
      return { ok: false };
    }

    const { data, error } = await client
      .from('tool_results')
      .insert({
        user_id: user.id,
        tool_id: toolId,
        tool_name: toolName,
        result
      })
      .select()
      .single();

    if (error) {
      console.warn(
        'ICS Cloud Speicherung:',
        error.message
      );

      return {
        ok: false,
        error
      };
    }

    return {
      ok: true,
      data
    };
  }

  // Zentrale Schnittstelle für weitere ICS Bereiche
  window.icsSaveToolResult = saveToolResult;

  function readLocalArray(key) {
    try {
      const data = JSON.parse(
        localStorage.getItem(key) || '[]'
      );

      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  // -------------------------------------------------------
  // JOURNAL
  // -------------------------------------------------------

  function installJournalSync() {
    if (journalInstalled) {
      return true;
    }

    const button =
      document.getElementById('saveJournal');

    if (!button) {
      return false;
    }

    journalInstalled = true;

    button.addEventListener('click', () => {
      setTimeout(async () => {
        const entry =
          readLocalArray(JOURNAL_KEY)[0];

        if (
          !entry?.id ||
          entry.id === lastSyncedJournalId
        ) {
          return;
        }

        lastSyncedJournalId = entry.id;

        const saved =
          await saveToolResult(
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
          lastSyncedJournalId = null;
        }
      }, 0);
    });

    return true;
  }

  // -------------------------------------------------------
  // ACTION · MEIN NÄCHSTER SCHRITT
  // -------------------------------------------------------

  function installActionSync() {
    if (actionInstalled) {
      return true;
    }

    const button =
      document.getElementById(
        'saveActionNextStep'
      );

    if (!button) {
      return false;
    }

    actionInstalled = true;

    button.addEventListener('click', () => {
      setTimeout(async () => {
        const entry =
          readLocalArray(ACTION_KEY)[0];

        if (
          !entry?.id ||
          entry.id === lastSyncedActionId
        ) {
          return;
        }

        lastSyncedActionId = entry.id;

        const saved =
          await saveToolResult(
            'action_next_step',
            'ICS Action - Mein nächster Schritt',
            {
              local_id: entry.id,
              created_at: entry.createdAt,
              topic: entry.topic || '',
              size: entry.size || 'small',
              step: entry.step || '',
              done: Boolean(entry.done),
              completed_at:
                entry.completedAt || null
            }
          );

        if (!saved.ok) {
          lastSyncedActionId = null;
        }
      }, 0);
    });

    return true;
  }

  // -------------------------------------------------------
  // INSTALLATION
  // app-core.js wird dynamisch geladen.
  // Deshalb warten wir kurz auf seine Buttons.
  // -------------------------------------------------------

  const timer = window.setInterval(() => {
    const journalReady =
      installJournalSync();

    const actionReady =
      installActionSync();

    if (journalReady && actionReady) {
      window.clearInterval(timer);
    }
  }, 250);

  window.setTimeout(() => {
    window.clearInterval(timer);
  }, 15000);
})();
