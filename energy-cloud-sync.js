// =========================================================
// ICS ENERGY CLOUD SYNC
// Abgeschlossene Zustands- und Energie-Checks zusätzlich
// sicher dem eingeloggten Nutzer in Supabase zuordnen.
// Die bestehende lokale Energie-Logik bleibt unverändert.
// =========================================================

(() => {
  const ENERGY_KEY = 'ICS_ENERGY_HISTORY';
  const TOOL_ID = 'energy_check';
  const TOOL_NAME = 'ICS Zustands- und Energie-Check';

  let installed = false;
  let lastSyncedRecordId = null;

  function readLocalEnergyHistory() {
    try {
      const history = JSON.parse(
        localStorage.getItem(ENERGY_KEY) || '[]'
      );

      return Array.isArray(history) ? history : [];
    } catch {
      return [];
    }
  }

  async function syncLatestEnergyCheck() {
    const saveToolResult = window.icsSaveToolResult;

    if (typeof saveToolResult !== 'function') {
      return false;
    }

    const latest = readLocalEnergyHistory()[0];

    if (!latest?.id || latest.id === lastSyncedRecordId) {
      return false;
    }

    const existing =
      typeof window.icsGetToolResults === 'function'
        ? await window.icsGetToolResults({
            toolId: TOOL_ID,
            limit: 100
          })
        : { ok: false, data: [] };

    if (
      existing.ok &&
      existing.data.some((item) => item?.result?.id === latest.id)
    ) {
      lastSyncedRecordId = latest.id;
      return true;
    }

    const saved = await saveToolResult(
      TOOL_ID,
      TOOL_NAME,
      latest
    );

    if (saved.ok) {
      lastSyncedRecordId = latest.id;
      window.dispatchEvent(new CustomEvent('ics:energy-cloud-saved', {
        detail: { record: latest }
      }));
      return true;
    }

    return false;
  }

  function installEnergyCloudSync() {
    if (installed) return true;

    const completeButton =
      document.getElementById('completeEnergyCheck');

    if (!completeButton) return false;

    installed = true;

    completeButton.addEventListener('click', () => {
      // app-core.js speichert zuerst lokal. Danach wird exakt
      // dieser abgeschlossene Datensatz zusätzlich in die Cloud geschrieben.
      window.setTimeout(syncLatestEnergyCheck, 120);
    });

    return true;
  }

  const timer = window.setInterval(() => {
    if (installEnergyCloudSync()) {
      window.clearInterval(timer);
    }
  }, 300);

  window.setTimeout(() => {
    window.clearInterval(timer);
  }, 15000);
})();
