// =========================================================
// ICS APP V6 NEU
// Inner Code Systems
// =========================================================

// ---------------------------------------------------------
// TAB NAVIGATION
// ---------------------------------------------------------

const navItems = [...document.querySelectorAll('.nav-item')];
const appViews = [...document.querySelectorAll('.app-view')];

const userNameKey = 'ICS_USER_NAME';

const icsUserName = document.getElementById('icsUserName');
const saveIcsUserName = document.getElementById('saveIcsUserName');
const welcomeHeadline = document.querySelector('.welcome-card h2');

function getIcsUserName() {
  return localStorage.getItem(userNameKey) || '';
}

function applyIcsUserName() {
  const name = getIcsUserName();

  if (welcomeHeadline && name) {
    welcomeHeadline.textContent = `Willkommen zurück, ${name}.`;
  }
}

function openView(name) {
  appViews.forEach((view) => {
    view.classList.toggle('active', view.id === `view-${name}`);
  });

  navItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.view === name);
  });

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    openView(item.dataset.view);
  });
});

const savedUserName = getIcsUserName();

if (savedUserName) {
  applyIcsUserName();
  openView('heute');
} else {
  openView('welcome');
}

saveIcsUserName?.addEventListener('click', () => {
  const name = icsUserName?.value.trim();

  if (!name) return;

  localStorage.setItem(userNameKey, name);
  applyIcsUserName();
  openView('heute');
});

// ---------------------------------------------------------
// DATUM
// ---------------------------------------------------------

const todayDate = document.getElementById('todayDate');

if (todayDate) {
  todayDate.textContent = new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  }).format(new Date());
}


// ---------------------------------------------------------
// TAGESCODE / 99 INNER CODES
// ---------------------------------------------------------

const openDailyCode = document.getElementById('openDailyCode');
const open99Codes = document.getElementById('open99Codes');
const openResetCheck = document.getElementById('openResetCheck');
const openAuswertung = document.getElementById('openAuswertung');
const openGegenpolGenerator = document.getElementById('openGegenpolGenerator');
const openErkenntnisse = document.getElementById('openErkenntnisse');
const backFromErkenntnisse = document.getElementById('backFromErkenntnisse');
const openGedankenLoslassen = document.getElementById('openGedankenLoslassen');
const backFromGedankenLoslassen = document.getElementById('backFromGedankenLoslassen');
const openGedankenLoslassenMeditation = document.getElementById('openGedankenLoslassenMeditation');
const backFromGedankenLoslassenMeditation = document.getElementById('backFromGedankenLoslassenMeditation');
const openKoerperWahrnehmen = document.getElementById('openKoerperWahrnehmen');
const backFromKoerperWahrnehmen = document.getElementById('backFromKoerperWahrnehmen');
const openKoerperWahrnehmenMeditation = document.getElementById('openKoerperWahrnehmenMeditation');
const backFromKoerperWahrnehmenMeditation = document.getElementById('backFromKoerperWahrnehmenMeditation');

const openMeditations = document.getElementById('openMeditations');
const backFromMeditations = document.getElementById('backFromMeditations');

const openResetBibliothek = document.getElementById('openResetBibliothek');
const backFromResetBibliothek = document.getElementById('backFromResetBibliothek');

const openResetMeditation = document.getElementById('openResetMeditation');
const backFromResetMeditation = document.getElementById('backFromResetMeditation');

const openZurRuheKommen = document.getElementById('openZurRuheKommen');
const backFromZurRuheKommen = document.getElementById('backFromZurRuheKommen');
const openAnkommenMeditation = document.getElementById('openAnkommenMeditation');
const backFromAnkommenMeditation = document.getElementById('backFromAnkommenMeditation');

openMeditations?.addEventListener('click', () => {
  openView('meditationen');
});

backFromMeditations?.addEventListener('click', () => {
  openView('mehr');
});

openResetBibliothek?.addEventListener('click', () => {
  openView('resetbibliothek');
});

backFromResetBibliothek?.addEventListener('click', () => {
  openView('meditationen');
});

openResetMeditation?.addEventListener('click', () => {
  openView('resetmeditation');
});

backFromResetMeditation?.addEventListener('click', () => {
  openView('resetbibliothek');
});

openDailyCode?.addEventListener('click', () => {
  window.location.href = './99-inner-codes.html';
});

open99Codes?.addEventListener('click', () => {
  window.location.href = './99-inner-codes.html';
});

openResetCheck?.addEventListener('click', () => {
  window.location.href =
    'https://innercodesystems.github.io/ics-auswertungstool/ics-reset-check.html';
});

openAuswertung?.addEventListener('click', () => {
  window.location.href =
    'https://innercodesystems.github.io/ics-auswertungstool/ics-auswertung-tool.html';
});

openGegenpolGenerator?.addEventListener('click', () => {
  window.location.href =
    'https://innercodesystems.github.io/ics-auswertungstool/ics-gegenpol-generator.html';
});

openErkenntnisse?.addEventListener('click', () => {
  openView('erkenntnisse');
});

backFromErkenntnisse?.addEventListener('click', () => {
  openView('meinics');
});

openZurRuheKommen?.addEventListener('click', () => {
  openView('zurruhekommen');
});

backFromZurRuheKommen?.addEventListener('click', () => {
  openView('meditationen');
});

openAnkommenMeditation?.addEventListener('click', () => {
  openView('ankommenmeditation');
});

backFromAnkommenMeditation?.addEventListener('click', () => {
  openView('zurruhekommen');
});

openGedankenLoslassen?.addEventListener('click', () => {
  openView('gedankenloslassen');
});

backFromGedankenLoslassen?.addEventListener('click', () => {
  openView('meditationen');
});

openGedankenLoslassenMeditation?.addEventListener('click', () => {
  openView('gedankenloslassenmeditation');
});

backFromGedankenLoslassenMeditation?.addEventListener('click', () => {
  openView('gedankenloslassen');
});

openKoerperWahrnehmen?.addEventListener('click', () => {
  openView('koerperwahrnehmen');
});

backFromKoerperWahrnehmen?.addEventListener('click', () => {
  openView('meditationen');
});

openKoerperWahrnehmenMeditation?.addEventListener('click', () => {
  openView('koerperwahrnehmenmeditation');
});

backFromKoerperWahrnehmenMeditation?.addEventListener('click', () => {
  openView('koerperwahrnehmen');
});

// ---------------------------------------------------------
// DASHBOARD
// ---------------------------------------------------------

const dashboardKey = 'ICS_APP_V6_NEU_DASHBOARD';

const dashboardState = JSON.parse(
  localStorage.getItem(dashboardKey) ||
  JSON.stringify({
    energy: 7,
    actionDone: false,
    resetDone: false,
    progress: 36
  })
);

const energyRange = document.getElementById('energyRange');
const energyValue = document.getElementById('energyValue');
const actionStatus = document.getElementById('actionStatus');
const resetStatus = document.getElementById('resetStatus');
const progressValue = document.getElementById('progressValue');

function saveDashboard() {
  localStorage.setItem(
    dashboardKey,
    JSON.stringify(dashboardState)
  );
}

function renderDashboard() {
  if (energyRange) {
    energyRange.value = dashboardState.energy;
  }

  if (energyValue) {
    energyValue.textContent = dashboardState.energy;
  }

  if (actionStatus) {
    actionStatus.textContent =
      dashboardState.actionDone
        ? 'Heute erledigt ✓'
        : 'Heute noch offen';
  }

  if (resetStatus) {
    resetStatus.textContent =
      dashboardState.resetDone
        ? 'Heute durchgeführt ✓'
        : 'Noch nicht durchgeführt';
  }

  if (progressValue) {
    progressValue.textContent =
      `${Math.max(0, Math.min(100, dashboardState.progress))}%`;
  }
}

energyRange?.addEventListener('input', () => {
  dashboardState.energy = Number(energyRange.value);
  saveDashboard();
  renderDashboard();
});

document
  .querySelectorAll('[data-action]')
  .forEach((button) => {

    button.addEventListener('click', () => {

      const action = button.dataset.action;

      if (action === 'action') {
        dashboardState.actionDone =
          !dashboardState.actionDone;

        dashboardState.progress +=
          dashboardState.actionDone ? 6 : -6;
      }

      if (action === 'reset') {
        dashboardState.resetDone =
          !dashboardState.resetDone;

        dashboardState.progress +=
          dashboardState.resetDone ? 8 : -8;
      }

      dashboardState.progress =
        Math.max(
          0,
          Math.min(100, dashboardState.progress)
        );

      saveDashboard();
      renderDashboard();

    });

  });

renderDashboard();


// ---------------------------------------------------------
// JOURNAL
// ---------------------------------------------------------

const journalKey = 'ICS_APP_V6_NEU_JOURNAL';

const journalText =
  document.getElementById('journalText');

const journalCount =
  document.getElementById('journalCount');

const journalFeedback =
  document.getElementById('journalFeedback');

const journalEntries =
  document.getElementById('journalEntries');

const selectedJournalTypes = new Set();

document
  .querySelectorAll('.journal-choice')
  .forEach((choice) => {

    choice.addEventListener('click', () => {

      const type = choice.dataset.type;

      if (selectedJournalTypes.has(type)) {
        selectedJournalTypes.delete(type);
        choice.classList.remove('active');
      } else {
        selectedJournalTypes.add(type);
        choice.classList.add('active');
      }

    });

  });

journalText?.addEventListener('input', () => {
  journalCount.textContent =
    `${journalText.value.length}/600`;
});


function getJournalEntries() {
  return JSON.parse(
    localStorage.getItem(journalKey) || '[]'
  );
}


function renderJournalEntries() {

  if (!journalEntries) return;

  const entries = getJournalEntries();

  if (!entries.length) {

    journalEntries.innerHTML = `
      <p class="empty-state">
        Dein erster gespeicherter Eintrag erscheint hier.
      </p>
    `;

    return;
  }

  journalEntries.innerHTML = entries
    .slice(0, 12)
    .map((entry) => {

      const date =
        new Intl.DateTimeFormat('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(new Date(entry.date));

      const types =
        entry.types
          .map((type) => {

            if (type === 'verstanden') return '🧠 Verstanden';
            if (type === 'gespuert') return '♥ Gespürt';
            if (type === 'umgesetzt') return '▲ Umgesetzt';

            return type;

          })
          .join(' · ');

      return `
        <article class="journal-entry">
          <small>${date}</small>
          <strong>${types || 'Dein Check-in'}</strong>
          <p>${escapeHtml(entry.text)}</p>
        </article>
      `;

    })
    .join('');
}


document
  .getElementById('saveJournal')
  ?.addEventListener('click', () => {

    const text =
      journalText?.value.trim() || '';

    if (
      !text &&
      selectedJournalTypes.size === 0
    ) {

      journalFeedback.textContent =
        'Wähle mindestens einen Bereich oder schreibe eine kurze Notiz.';

      return;
    }

    const entries = getJournalEntries();

    entries.unshift({
      id: Date.now(),
      date: new Date().toISOString(),
      types: [...selectedJournalTypes],
      text
    });

    localStorage.setItem(
      journalKey,
      JSON.stringify(entries.slice(0, 100))
    );

    dashboardState.progress =
      Math.min(
        100,
        dashboardState.progress + 5
      );

    saveDashboard();
    renderDashboard();

    if (journalText) {
      journalText.value = '';
    }

    if (journalCount) {
      journalCount.textContent = '0/600';
    }

    selectedJournalTypes.clear();

    document
      .querySelectorAll('.journal-choice')
      .forEach((choice) => {
        choice.classList.remove('active');
      });

    journalFeedback.textContent =
      'Dein Eintrag wurde gespeichert. ✓';

    renderJournalEntries();

  });


function escapeHtml(value = '') {

  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

}

renderJournalEntries();


// ---------------------------------------------------------
// ICS WELTEN
// ---------------------------------------------------------

const worldMessage =
  document.getElementById('worldMessage');

const worldMessages = {
  inner:
    'Inner Code – erkenne Gedanken, Erwartungen und Muster, die gerade wirken.',
  body:
    'Body Code – nimm wahr, was dein Körper dir gerade zeigt.',
  action:
    'Action Code – wähle den nächsten klaren Schritt und komm ins Tun.',
  reset:
    'RESET – unterbrich alte Reaktionen und richte dich bewusst neu aus.'
};

document
  .querySelectorAll('.world-bubble')
  .forEach((bubble) => {

    bubble.addEventListener('click', () => {

      document
        .querySelectorAll('.world-bubble')
        .forEach((item) => {
          item.classList.remove('selected');
        });

      bubble.classList.add('selected');

      let world = '';

      if (bubble.classList.contains('world-inner')) {
        world = 'inner';
      }

      if (bubble.classList.contains('world-body')) {
        world = 'body';
      }

      if (bubble.classList.contains('world-action')) {
        world = 'action';
      }

      if (bubble.classList.contains('world-reset')) {
        world = 'reset';
      }

      if (worldMessage && worldMessages[world]) {
        worldMessage.textContent =
          worldMessages[world];
      }

    });

  });

// ---------------------------------------------------------
// PLATZHALTER-BUTTONS
// ---------------------------------------------------------

const toast =
  document.getElementById('toast');

function showToast(message) {

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  window.clearTimeout(showToast.timer);

  showToast.timer =
    window.setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);

}

document
  .querySelectorAll('.tool-card, .menu-card')
  .forEach((button) => {

if (
  button.id === 'open99Codes' ||
  button.id === 'openAcademy' ||
  button.id === 'openMeditations' ||
  button.id === 'openResetBibliothek' ||
  button.id === 'openResetMeditation' ||
  button.id === 'openResetCheck' ||
  button.id === 'openAuswertung' ||
  button.id === 'openGegenpolGenerator' ||
  button.id === 'openErkenntnisse' ||
  button.id === 'openZurRuheKommen' ||
  button.id === 'openAnkommenMeditation' ||
  button.id === 'openGedankenLoslassen' ||
button.id === 'openGedankenLoslassenMeditation' ||
button.id === 'openKoerperWahrnehmen' ||
button.id === 'openKoerperWahrnehmenMeditation' ||
button.id === 'installApp'
) return;

    button.addEventListener('click', () => {

      const title =
        button.querySelector('strong')
        ?.textContent
        ?.trim();

      showToast(
        `${title || 'Dieser Bereich'} kommt als nächster Schritt.`
      );

    });

  });

// ---------------------------------------------------------
// APP INSTALLIEREN
// ---------------------------------------------------------

const installApp = document.getElementById('installApp');

let deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

installApp?.addEventListener('click', async () => {

  // Android / Chrome / Edge
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();

    await deferredInstallPrompt.userChoice;

    deferredInstallPrompt = null;
    return;
  }

  // iPhone / iPad
  const isIOS =
    /iphone|ipad|ipod/i.test(navigator.userAgent);

  if (isIOS) {
    alert(
      'So installierst du ICS auf dem iPhone:\n\n' +
      '1. Öffne ICS in Safari.\n' +
      '2. Tippe unten auf Teilen.\n' +
      '3. Wähle „Zum Home-Bildschirm“.\n' +
      '4. Tippe auf „Hinzufügen“.'
    );
    return;
  }

  // Falls bereits installiert oder Browser keinen Prompt anbietet
  alert(
    'ICS kann über das Browser-Menü auf deinem Gerät installiert bzw. zum Startbildschirm hinzugefügt werden.'
  );
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
});

// ---------------------------------------------------------
// SERVICE WORKER
// ---------------------------------------------------------

if ('serviceWorker' in navigator) {

  window.addEventListener('load', () => {

    navigator
      .serviceWorker
      .register('./service-worker.js')
      .catch(() => {
        // Lokal per file:// kann die Registrierung
        // je nach Browser blockiert werden.
      });

  });

}
