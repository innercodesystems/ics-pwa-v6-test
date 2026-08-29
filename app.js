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
const userBirthDateKey = 'ICS_USER_BIRTHDATE';

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

let currentViewName = null;
const viewHistory = [];

function openView(name, addToHistory = true) {
  if (
    addToHistory &&
    currentViewName &&
    currentViewName !== name
  ) {
    viewHistory.push(currentViewName);
  }

  appViews.forEach((view) => {
    view.classList.toggle('active', view.id === `view-${name}`);
  });

  navItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.view === name);
  });

  currentViewName = name;

  if (name === 'meinics') {
  renderLatestEnergyForMeinIcs();
}

  window.scrollTo(0, 0);
}

function goBackView(fallback = 'welten') {
  const previousView = viewHistory.pop();

  openView(previousView || fallback, false);
}

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    openView(item.dataset.view);
  });
});

const requestedView =
  new URLSearchParams(window.location.search).get('view');

if (requestedView === 'meinics') {
  openView('meinics', false);
}

const returnView =
  new URLSearchParams(window.location.search).get('return');

if (returnView) {
  window.history.replaceState({}, document.title, window.location.pathname);
}

const savedUserName = getIcsUserName();

if (savedUserName) {
  applyIcsUserName();

  if (requestedView === 'meinics') {
    openView('meinics', false);
  } else if (returnView === 'innercode') {
    openView('innercode', false);
  } else {
    openView('heute');
  }

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

const latestBeliefInsight =
  document.getElementById('latestBeliefInsight');

const latestJournalInsight =
  document.getElementById('latestJournalInsight');

const openReports = document.getElementById('openReports');
const meinIcsBackToToday = document.getElementById('meinIcsBackToToday');

const todayToNachschlagewerk =
  document.getElementById('todayToNachschlagewerk');

const nachschlagewerkToKoerpersignale =
  document.getElementById('nachschlagewerkToKoerpersignale');

const backFromNachschlagewerk =
  document.getElementById('backFromNachschlagewerk');

const backFromReports = document.getElementById('backFromReports');
const openGedankenLoslassen = document.getElementById('openGedankenLoslassen');
const backFromGedankenLoslassen = document.getElementById('backFromGedankenLoslassen');
const openGedankenLoslassenMeditation = document.getElementById('openGedankenLoslassenMeditation');
const backFromGedankenLoslassenMeditation = document.getElementById('backFromGedankenLoslassenMeditation');
const openKoerperWahrnehmen = document.getElementById('openKoerperWahrnehmen');
const backFromKoerperWahrnehmen = document.getElementById('backFromKoerperWahrnehmen');
const openKoerperWahrnehmenMeditation = document.getElementById('openKoerperWahrnehmenMeditation');
const backFromKoerperWahrnehmenMeditation = document.getElementById('backFromKoerperWahrnehmenMeditation');
const openNeueWahrheit = document.getElementById('openNeueWahrheit');
const backFromNeueWahrheit = document.getElementById('backFromNeueWahrheit');
const backFromNeueWahrheitDetail = document.getElementById('backFromNeueWahrheitDetail');
const newTruthGrid = document.getElementById('newTruthGrid');
const newTruthDetailTitle = document.getElementById('newTruthDetailTitle');
const newTruthDetailImage = document.getElementById('newTruthDetailImage');
const newTruthReflection = document.getElementById('newTruthReflection');
const newTruthIntegration = document.getElementById('newTruthIntegration');

const openMeditations = document.getElementById('openMeditations');
const backFromMeditations = document.getElementById('backFromMeditations');

const openImpulse = document.getElementById('openImpulse');
const backFromImpulse = document.getElementById('backFromImpulse');

const openInnerImpulse = document.getElementById('openInnerImpulse');
const backFromInnerImpulse = document.getElementById('backFromInnerImpulse');
const openBodyImpulse = document.getElementById('openBodyImpulse');
const openActionImpulse = document.getElementById('openActionImpulse');
const openResetImpulse = document.getElementById('openResetImpulse');
const backFromBodyImpulse = document.getElementById('backFromBodyImpulse');
const backFromActionImpulse = document.getElementById('backFromActionImpulse');
const backFromResetImpulse = document.getElementById('backFromResetImpulse');

const openResetBibliothek = document.getElementById('openResetBibliothek');
const backFromResetBibliothek = document.getElementById('backFromResetBibliothek');

const openResetMeditation = document.getElementById('openResetMeditation');
const backFromResetMeditation = document.getElementById('backFromResetMeditation');

const resetMeditationNextStepAction =
  document.getElementById('resetMeditationNextStepAction');

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

openImpulse?.addEventListener('click', () => {
  openView('impulse');
});

backFromImpulse?.addEventListener('click', () => {
  goBackView('welten');
});

openInnerImpulse?.addEventListener('click', () => {
  returnToTruthAfterRelatedImpulse = false;
  openView('innerimpulse');
});

openBodyImpulse?.addEventListener('click', () => {
  returnToTruthAfterRelatedImpulse = false;
  openView('bodyimpulse');
});

openActionImpulse?.addEventListener('click', () => {
  returnToTruthAfterRelatedImpulse = false;
  openView('actionimpulse');
});

openResetImpulse?.addEventListener('click', () => {
  returnToTruthAfterRelatedImpulse = false;
  openView('resetimpulse');
});

function backFromCodeImpulse() {
  if (returnToTruthAfterRelatedImpulse) {
    returnToTruthAfterRelatedImpulse = false;
    openView('innercode');
    return;
  }

  goBackView('impulse');
}

backFromBodyImpulse?.addEventListener('click', backFromCodeImpulse);

backFromActionImpulse?.addEventListener('click', backFromCodeImpulse);

backFromResetImpulse?.addEventListener('click', backFromCodeImpulse);

backFromInnerImpulse?.addEventListener('click', backFromCodeImpulse);

openResetBibliothek?.addEventListener('click', () => {
  openView('resetbibliothek');
});

backFromResetBibliothek?.addEventListener('click', () => {
  goBackView('resetcode');
});

openResetMeditation?.addEventListener('click', () => {
  openView('resetmeditation');
});

resetMeditationNextStepAction?.addEventListener('click', () => {
  openView('journal');
});

backFromResetMeditation?.addEventListener('click', () => {
  goBackView('resetcode');
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
  renderLatestBeliefInsight();
  renderLatestJournalInsight();
  openView('erkenntnisse');
});

backFromErkenntnisse?.addEventListener('click', () => {
  openView('meinics');
});

openReports?.addEventListener('click', () => {
  openView('reports');
});

openReports?.addEventListener('click', () => {
  openView('reports');
});

meinIcsBackToToday?.addEventListener('click', () => {
  openView('heute');
});

todayToNachschlagewerk?.addEventListener('click', () => {
  openView('nachschlagewerk');
});

nachschlagewerkToKoerpersignale?.addEventListener('click', () => {
  openView('koerpersignale');
});

backFromNachschlagewerk?.addEventListener('click', () => {
  openView('heute');
});

backFromReports?.addEventListener('click', () => {
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
  goBackView('bodycode');
});

openKoerperWahrnehmenMeditation?.addEventListener('click', () => {
  openView('koerperwahrnehmenmeditation');
});

backFromKoerperWahrnehmenMeditation?.addEventListener('click', () => {
  openView('koerperwahrnehmen');
});

// ---------------------------------------------------------
// NEUE WAHRHEIT
// ---------------------------------------------------------

const newTruths = [
  {
    image: 'NW_001_Ich_darf_Mensch_sein.png',
    title: 'Ich darf Mensch sein',
    reflection: 'Wo darfst du dir heute erlauben, einfach Mensch zu sein?',
    integration: 'Lege eine Hand auf dein Herz und atme dreimal bewusst ein und aus.'
  },
  {
    image: 'NW_002_Ich_bin_richtig_wertvoll_und_liebevoll.png',
    title: 'Ich bin richtig, wertvoll und liebevoll',
    reflection: 'Welche Eigenschaft an dir verdient heute deine Wertschätzung?',
    integration: 'Nenne dir laut eine Eigenschaft, die du an dir wertschätzt.'
  },
  {
    image: 'NW_003_Ich_darf_wachsen_und_lernen.png',
    title: 'Ich darf wachsen und lernen',
    reflection: 'Was darfst du heute noch nicht können und in Ruhe lernen?',
    integration: 'Notiere einen kleinen Lernschritt, den du heute ausprobieren kannst.'
  },
  {
    image: 'NW_004_Ich_wähle_mich_und_lebe_im_meiner_Wahrheit.png',
    title: 'Ich wähle mich und lebe in meiner Wahrheit',
    reflection: 'Bei welcher Entscheidung möchtest du heute ehrlicher zu dir sein?',
    integration: 'Sage einmal bewusst Nein zu etwas, das heute nicht zu dir passt.'
  },
  {
    image: 'NW_005_Ich_bin_genau_richtig_so_wie_ich_bin.png',
    title: 'Ich bin genau richtig, so wie ich bin',
    reflection: 'Welchen Teil von dir versuchst du noch zu verändern, statt ihn anzunehmen?',
    integration: 'Schau kurz in einen Spiegel und sage: Ich bin genau richtig.'
  },
  {
    image: 'NW_006_Erfolg_darf_leicht_erfüllt_und_im_Einklang_sein.png',
    title: 'Erfolg darf leicht, erfüllt und im Einklang sein',
    reflection: 'Wo könnte dein nächster Schritt leichter sein, als du denkst?',
    integration: 'Vereinfache eine heutige Aufgabe auf den kleinstmöglichen Schritt.'
  },
  {
    image: 'NW_007_Ich-entwickle_meine_Fähigkeiten_jeden_Tag_weiter.png',
    title: 'Ich entwickle meine Fähigkeiten jeden Tag weiter',
    reflection: 'Welche Fähigkeit hast du in letzter Zeit bereits weiterentwickelt?',
    integration: 'Übe diese Fähigkeit jetzt für zwei konzentrierte Minuten.'
  },
  {
    image: 'NW_008__Ich_darf_mir_Hilfe_holen_und_gemeinsam_größer_wachsen.png',
    title: 'Ich darf mir Hilfe holen und gemeinsam größer wachsen',
    reflection: 'Wobei würde Unterstützung dir gerade wirklich guttun?',
    integration: 'Schreibe einer vertrauten Person eine konkrete Bitte um Hilfe.'
  },
  {
    image: 'NW_009_Ich_bin_wertvoll_genau_so_wie_ich_bin.png',
    title: 'Ich bin wertvoll, genau so wie ich bin',
    reflection: 'Woran machst du deinen Wert fest, obwohl er längst in dir liegt?',
    integration: 'Schreibe den Satz „Mein Wert ist nicht verhandelbar“ einmal auf.'
  },
  {
    image: 'NW_010_Ich_nehme_mir_Zeit_für_mich_weil_ich_wichtig_bin.png',
    title: 'Ich nehme mir Zeit für mich, weil ich wichtig bin',
    reflection: 'Welchen Moment kannst du heute bewusst nur für dich reservieren?',
    integration: 'Trage jetzt eine zehnminütige Pause für dich in deinen Tag ein.'
  }
].map((truth, index) => ({
  ...truth,
  id: `NW_${String(index + 1).padStart(3, '0')}`,
  number: String(index + 1).padStart(3, '0')
}));

// Zentrale interne Verknüpfungsstruktur. Sie ist bewusst unabhängig von
// sichtbaren Titeln/Dateinamen, damit Mentor, Gegenpol, Tagesimpuls und
// Glaubenssatz-Logik später stabil darauf zugreifen können.
const icsEnergyFoundations = [
  { id: 'FOUND_01', title: 'Tageslicht', order: 1 },
  { id: 'FOUND_02', title: 'Trinken', order: 2 },
  { id: 'FOUND_03', title: 'Ernährung & Protein', order: 3 },
  { id: 'FOUND_04', title: 'Mikro-Bewegung', order: 4 },
  { id: 'FOUND_05', title: 'Bewegung nach dem Essen', order: 5 },
  { id: 'FOUND_06', title: 'Kraft & Muskulatur', order: 6 },
  { id: 'FOUND_07', title: 'Regeneration & Schlaf', order: 7 }
];

const icsContentLinks = {
  energyFoundations: icsEnergyFoundations,
  impulses: {
    IMP_001: { id: 'IMP_001', title: 'Du musst nicht alles heute lösen', view: 'actionimpulse' },
    IMP_002: { id: 'IMP_002', title: 'Wie viel ist gerade wirklich möglich?', view: 'bodyimpulse' },
    IMP_003: { id: 'IMP_003', title: 'Vertraue dem richtigen Timing', view: 'resetimpulse' },
    IMP_004: { id: 'IMP_004', title: 'Klarheit kommt durch Loslassen', view: 'innerimpulse' },
    IMP_005: { id: 'IMP_005', title: 'Du musst nicht jedem alles recht machen', view: 'bodyimpulse' },
    IMP_006: { id: 'IMP_006', title: 'Dein Fokus ist dein Kompass', view: 'actionimpulse' },
    IMP_007: { id: 'IMP_007', title: 'Veränderung beginnt in dir', view: 'resetimpulse' },
    IMP_008: { id: 'IMP_008', title: 'Vergleich dich nicht – dein Weg ist einzigartig', view: 'innerimpulse' },
    IMP_009: { id: 'IMP_009', title: 'Nicht alles muss perfekt sein', view: 'resetimpulse' },
    IMP_010: { id: 'IMP_010', title: 'Du bist nicht zu spät', view: 'innerimpulse' }
  },
  energyImpulses: {

    ENG_101: {
      id: 'ENG_101',
      focus: 'energy',
      duration: 1,
      title: 'Kreislauf freundlich aktivieren',
      instruction: 'Richte dich auf. Atme tief ein, strecke dich nach oben und bewege Arme und Schultern für eine Minute locker durch.',

      foundations: ['FOUND_04'],

      sourceContentId: 'IMP_002'
    },
    ENG_102: {
      id: 'ENG_102',
      focus: 'energy',
      duration: 3,
      title: 'Wasser und Bewegung',
      instruction: 'Trinke bewusst ein Glas Wasser. Stehe danach auf und bewege dich für ein paar Minuten locker im Raum.',

      foundations: ['FOUND_02', 'FOUND_04'],
      sourceContentId: 'IMP_002'
    },
    ENG_103: {
      id: 'ENG_103',
      focus: 'energy',
      duration: 10,
      title: 'Licht, Wasser und Bewegung',
      instruction: 'Trinke ein Glas Wasser. Gehe danach ans Tageslicht und bewege dich einige Minuten in deinem eigenen Tempo. Du musst nichts leisten – nur deinen Kreislauf freundlich einladen.',

      foundations: ['FOUND_01', 'FOUND_02', 'FOUND_04'],
      sourceContentId: 'IMP_002'
    },
    ENG_201: {
      id: 'ENG_201',
      focus: 'body',
      duration: 1,
      title: 'Spannung lösen',
      instruction: 'Kreise langsam deine Schultern. Löse deinen Kiefer und bewege deinen Nacken sanft von einer Seite zur anderen.',

      foundations: ['FOUND_04'],
      sourceContentId: 'IMP_002'
    },
    ENG_202: {
      id: 'ENG_202',
      focus: 'body',
      duration: 3,
      title: 'Mikro-Bewegung für deinen Körper',
      instruction: 'Stehe auf, gehe locker auf der Stelle und bewege Schultern, Arme und Hüfte so, dass sich dein Körper etwas freier anfühlt.',

      foundations: ['FOUND_04'],
      sourceContentId: 'IMP_002'
    },
    ENG_203: {
      id: 'ENG_203',
      focus: 'body',
      duration: 10,
      title: 'Deinen Körper in Bewegung bringen',
      instruction: 'Gehe zehn Minuten in einem angenehmen Tempo. Spüre dabei bewusst deine Füße, deine Atmung und deine Körperhaltung.',

      foundations: ['FOUND_04'],
      sourceContentId: 'IMP_002'
    },
    ENG_301: {
      id: 'ENG_301',
      focus: 'mind',
      duration: 1,
      title: 'Ein bewusster Atemzug nach dem anderen',
      instruction: 'Richte dich auf. Atme sechsmal ruhig durch die Nase ein und langsam durch den Mund aus. Lass mit jedem Ausatmen die Schultern etwas sinken.',

      foundations: ['FOUND_07'],
      sourceContentId: 'IMP_001'
    },
    ENG_302: {
      id: 'ENG_302',
      focus: 'mind',
      duration: 3,
      title: 'Kopf entlasten',
      instruction: 'Lege dein Handy kurz weg. Schaue aus dem Fenster oder in die Ferne und lasse deinen Blick drei Minuten ruhig werden.',

      foundations: ['FOUND_01', 'FOUND_07'],
      sourceContentId: 'IMP_001'
    },
    ENG_303: {
      id: 'ENG_303',
      focus: 'mind',
      duration: 10,
      title: 'Gedanken aus dem Kopf',
      instruction: 'Nimm Papier oder eine Notiz. Schreibe zehn Minuten ungefiltert auf, was gerade in deinem Kopf ist. Nichts lösen – nur sichtbar machen.',

      foundations: ['FOUND_07'],
      sourceContentId: 'IMP_001'
    }
  },
  relationships: [
    { truthId: 'NW_001', impulseId: 'IMP_009', contexts: ['mentor', 'gegenpol', 'tagesimpuls', 'glaubenssatz'] },
    { truthId: 'NW_002', impulseId: 'IMP_005', contexts: ['mentor', 'gegenpol', 'glaubenssatz'] },
    { truthId: 'NW_003', impulseId: 'IMP_010', contexts: ['mentor', 'tagesimpuls'] },
    { truthId: 'NW_004', impulseId: 'IMP_007', contexts: ['mentor', 'gegenpol', 'glaubenssatz'] },
    { truthId: 'NW_005', impulseId: 'IMP_008', contexts: ['mentor', 'gegenpol', 'glaubenssatz'] },
    { truthId: 'NW_006', impulseId: 'IMP_001', contexts: ['mentor', 'tagesimpuls'] },
    { truthId: 'NW_007', impulseId: 'IMP_006', contexts: ['mentor', 'tagesimpuls'] },
    { truthId: 'NW_009', impulseId: 'IMP_005', contexts: ['mentor', 'gegenpol', 'glaubenssatz'] },
    { truthId: 'NW_010', impulseId: 'IMP_002', contexts: ['mentor', 'tagesimpuls'] }
  ],
  getRelatedContent(contentId, context) {
    return this.relationships
      .filter(({ truthId, impulseId, contexts }) =>
        (truthId === contentId || impulseId === contentId) &&
        (!context || contexts.includes(context)))
      .map((relationship) => ({
        relationship,
        truth: newTruths.find(({ id }) => id === relationship.truthId),
        impulse: this.impulses[relationship.impulseId]
      }));
  }
};

let relatedImpulseView = null;
let relatedBox = null;
let relatedTitle = null;
let relatedButton = null;
let returnToTruthAfterRelatedImpulse = false;

function ensureRelatedImpulseUI() {
  if (relatedBox) return;

  const detailArticle = newTruthIntegration?.closest('article');
  if (!detailArticle) return;

  const style = document.createElement('style');
  style.textContent = `
    .new-truth-related{margin-top:28px;padding-top:20px;border-top:1px solid rgba(212,160,58,.2)}
    .new-truth-related small{color:var(--gold);letter-spacing:.16em}
    .new-truth-related button{width:100%;margin-top:10px;padding:12px 0;display:flex;align-items:center;justify-content:space-between;gap:16px;border:0;background:transparent;color:var(--cream);text-align:left}
    .new-truth-related button span{font-family:Georgia,"Times New Roman",serif;font-size:1.08rem}
    .new-truth-related button b{color:var(--gold);font-size:1.35rem}
  `;
  document.head.append(style);

  relatedBox = document.createElement('aside');
  relatedBox.className = 'new-truth-related';
  relatedBox.hidden = true;

  const label = document.createElement('small');
  label.textContent = 'PASSENDER IMPULS';

  relatedButton = document.createElement('button');
  relatedButton.type = 'button';

  relatedTitle = document.createElement('span');
  const arrow = document.createElement('b');
  arrow.textContent = '›';

  relatedButton.append(relatedTitle, arrow);
  relatedBox.append(label, relatedButton);
  detailArticle.append(relatedBox);

relatedButton.addEventListener('click', () => {
  if (!relatedImpulseView) return;

  returnToTruthAfterRelatedImpulse = true;
  openView(relatedImpulseView);
});
  
}

function openNewTruthDetail(truth) {
  if (!newTruthDetailTitle || !newTruthDetailImage ||
      !newTruthReflection || !newTruthIntegration) return;

  newTruthDetailTitle.textContent = truth.title;
  newTruthDetailImage.src = truth.image;
  newTruthDetailImage.alt = `Neue Wahrheit: ${truth.title}`;
  newTruthReflection.textContent = truth.reflection;
  newTruthIntegration.textContent = truth.integration;

  ensureRelatedImpulseUI();
  const relatedContent = icsContentLinks.getRelatedContent(truth.id)[0];
  relatedImpulseView = relatedContent?.impulse?.view || null;
  if (relatedTitle) relatedTitle.textContent = relatedContent?.impulse?.title || '';
  if (relatedBox) relatedBox.hidden = !relatedContent;

  openView('neuewahrheitdetail');
}

newTruths.forEach((truth, index) => {
  if (!newTruthGrid) return;

  const card = document.createElement('article');
  card.className = 'premium-card new-truth-card';

  const image = document.createElement('img');
  image.className = 'new-truth-image';
  image.src = truth.image;
  image.alt = `Neue Wahrheit ${index + 1}: ${truth.title}`;

  const title = document.createElement('h2');
  title.textContent = truth.title;

  const button = document.createElement('button');
  button.className = 'gold-button';
  button.type = 'button';
  button.textContent = 'Wahrheit öffnen';
  button.addEventListener('click', () => openNewTruthDetail(truth));

  card.append(image, title, button);
  newTruthGrid.append(card);
});

openNeueWahrheit?.addEventListener('click', () => {
  openView('neuewahrheit');
});

backFromNeueWahrheit?.addEventListener('click', () => {
  openView('innercode');
});

backFromNeueWahrheitDetail?.addEventListener('click', () => {
  if (returnToEnergyAfterRecommendation) {
    returnToEnergyAfterRecommendation = false;
    openView('icsenergy');
    return;
  }

  openView('neuewahrheit');
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

const showMoreJournal =
  document.getElementById('showMoreJournal');

let journalVisibleCount = 3;

let selectedJournalType = '';

document
  .querySelectorAll('.journal-choice')
  .forEach((choice) => {

    choice.addEventListener('click', () => {

      selectedJournalType = choice.dataset.type;

      document
        .querySelectorAll('.journal-choice')
        .forEach((item) => {
          item.classList.toggle('active', item === choice);
        });

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

    if (showMoreJournal) {
      showMoreJournal.hidden = true;
    }

    return;
  }

  const visibleEntries =
    entries.slice(0, journalVisibleCount);

  journalEntries.innerHTML = visibleEntries
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

  if (showMoreJournal) {

    if (entries.length <= 3) {
      showMoreJournal.hidden = true;
    } else {
      showMoreJournal.hidden = false;

      showMoreJournal.textContent =
        journalVisibleCount >= entries.length
          ? 'Weniger anzeigen'
          : 'Weitere Einträge anzeigen';
    }
  }
}

showMoreJournal?.addEventListener('click', () => {

  const entries = getJournalEntries();

  if (journalVisibleCount >= entries.length) {
    journalVisibleCount = 3;
  } else {
    journalVisibleCount += 3;
  }

  renderJournalEntries();
});

document
  .getElementById('saveJournal')
  ?.addEventListener('click', () => {

    const text =
      journalText?.value.trim() || '';

 if (
  !text &&
  !selectedJournalType
) {
      journalFeedback.textContent =
        'Wähle mindestens einen Bereich oder schreibe eine kurze Notiz.';

      return;
    }

    const entries = getJournalEntries();

    entries.unshift({
      id: Date.now(),
      date: new Date().toISOString(),
      types: selectedJournalType
  ? [selectedJournalType]
  : [],
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

    selectedJournalType = '';

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

const worldCoachingCta =
  document.getElementById('worldCoachingCta');

const worldOpenCta =
  document.getElementById('worldOpenCta');

const worldOpenButton =
  document.getElementById('worldOpenButton');

let selectedWorld = '';

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

      selectedWorld = world;

      if (worldMessage && worldMessages[world]) {
        worldMessage.textContent =
          worldMessages[world];
      }

if (worldCoachingCta && world) {
  worldCoachingCta.hidden = false;
}

      if (worldOpenCta && worldOpenButton && world) {
  worldOpenCta.hidden = false;

  const labels = {
    inner: 'Inner Code öffnen →',
    body: 'Body Code öffnen →',
    action: 'Action Code öffnen →',
    reset: 'RESET öffnen →'
  };

  worldOpenButton.textContent =
    labels[world] || 'Bereich öffnen →';
}

      if (worldOpenCta && worldOpenButton && world) {
  worldOpenCta.hidden = false;

  const labels = {
    inner: 'Inner Code öffnen →',
    body: 'Body Code öffnen →',
    action: 'Action Code öffnen →',
    reset: 'RESET öffnen →'
  };

  worldOpenButton.textContent =
    labels[world] || 'Bereich öffnen →';
}
      
    });

  });

worldOpenButton?.addEventListener('click', () => {

  const targets = {
    inner: 'innercode',
    body: 'bodycode',
    action: 'actioncode',
    reset: 'resetcode'
  };

  const target = targets[selectedWorld];

  if (target) {
    openView(target);
  }
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
  button.id === 'openImpulse' ||
  button.id === 'openNeueWahrheit' ||
  button.id === 'openIcsEnergy' ||
  button.id === 'openInnerImpulse' ||
  button.id === 'openResetBibliothek' ||
  button.id === 'openResetMeditation' ||
  button.id === 'openResetCheck' ||
  button.id === 'openAuswertung' ||
button.id === 'openGegenpolGenerator' ||
button.id === 'openErkenntnisse' ||
button.id === 'openReports' ||
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

  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();

    await deferredInstallPrompt.userChoice;

    deferredInstallPrompt = null;
    return;
  }

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

// ---------------------------------------------------------
// KONTEXT-AUSWERTUNG
// ---------------------------------------------------------

icsContentLinks.supportedContexts = ['mentor', 'gegenpol', 'tagesimpuls', 'glaubenssatz'];

function getContextRecommendation(contentId, context) {
  if (!icsContentLinks.supportedContexts.includes(context)) return null;

  const relatedContent = icsContentLinks.getRelatedContent(contentId, context)[0];
  if (!relatedContent) return null;

  const sourceIsTruth = relatedContent.relationship.truthId === contentId;
  const target = sourceIsTruth ? relatedContent.impulse : relatedContent.truth;

  return {
    sourceId: contentId,
    targetId: target.id,
    context,
    targetType: sourceIsTruth ? 'impulse' : 'truth',
    title: target.title,
    targetView: sourceIsTruth ? target.view : 'neuewahrheitdetail'
  };
}

function getIcsRecommendation({ contentId, context } = {}) {
  const recommendation = getContextRecommendation(contentId, context);
  if (!recommendation) return null;

  return {
    sourceId: recommendation.sourceId,
    context: recommendation.context,
    targetId: recommendation.targetId,
    targetType: recommendation.targetType,
    title: recommendation.title,
    targetView: recommendation.targetView,
    reason: recommendation.context
  };
}

function getBestIcsRecommendation(contentId, preferredContexts = []) {
  const contexts = Array.isArray(preferredContexts) && preferredContexts.length
    ? preferredContexts
    : icsContentLinks.supportedContexts;

  for (const context of contexts) {
    const recommendation = getIcsRecommendation({ contentId, context });
    if (recommendation) return recommendation;
  }

  return null;
}

// ---------------------------------------------------------
// ICS ENERGIE
// ---------------------------------------------------------

const openIcsEnergy = document.getElementById('openIcsEnergy');
const openFuehreMich = document.getElementById('openFuehreMich');
const backFromFuehreMich = document.getElementById('backFromFuehreMich');
const innerToImpulse = document.getElementById('innerToImpulse');
const innerToTruth = document.getElementById('innerToTruth');
const innerTo99Codes = document.getElementById('innerTo99Codes');
const innerToBeliefs = document.getElementById('innerToBeliefs');
const beliefInput = document.getElementById('beliefInput');
const analyzeBelief = document.getElementById('analyzeBelief');
const beliefResultCard = document.getElementById('beliefResultCard');
const beliefResultTitle = document.getElementById('beliefResultTitle');
const beliefResultText = document.getElementById('beliefResultText');
const beliefNewPerspective = document.getElementById('beliefNewPerspective');
const backFromBeliefs = document.getElementById('backFromBeliefs');
const saveBeliefResult = document.getElementById('saveBeliefResult');
const beliefSaveFeedback = document.getElementById('beliefSaveFeedback');

const startBeliefDesignMode =
  document.getElementById('startBeliefDesignMode');

const beliefDesignChoice =
  document.getElementById('beliefDesignChoice');

const beliefDesignInput =
  document.getElementById('beliefDesignInput');

const saveBeliefDesignChoice =
  document.getElementById('saveBeliefDesignChoice');

const beliefActionStep =
  document.getElementById('beliefActionStep');

const beliefActionInput =
  document.getElementById('beliefActionInput');

const saveBeliefActionStep =
  document.getElementById('saveBeliefActionStep');

const beliefNextStepRecommendation =
  document.getElementById('beliefNextStepRecommendation');

startBeliefDesignMode?.addEventListener('click', () => {
  if (beliefDesignChoice) {
    beliefDesignChoice.hidden = false;
  }
});

const beliefHistoryKey = 'ICS_BELIEF_HISTORY';

function getBeliefHistory() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(beliefHistoryKey) || '[]'
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveBeliefHistory(history) {
  localStorage.setItem(
    beliefHistoryKey,
    JSON.stringify(history.slice(0, 100))
  );
}

function renderLatestBeliefInsight() {
  if (!latestBeliefInsight) return;

  const beliefHistory = getBeliefHistory();
  const latest = beliefHistory[0];

  if (!latest) {
    latestBeliefInsight.innerHTML = `
      <p>Deine zuletzt gespeicherte Erkenntnis erscheint hier.</p>
    `;
    return;
  }

latestBeliefInsight.innerHTML = `
  <div style="margin-top:18px;">

    <div style="margin-top:18px;">
      <small>ERKANNTES MUSTER</small>
      <p>${latest.patternLabel || 'Erkenntnis'}</p>
    </div>

    <div style="margin-top:18px;">
      <small>GLAUBENSSATZ</small>
      <p>„${latest.belief}“</p>
    </div>

    <div style="margin-top:18px;">
      <small>NEUE PERSPEKTIVE</small>
      <p>${latest.perspective || '–'}</p>
    </div>

      <div style="margin-top:18px;">
        <small>MEINE NEUE WAHL</small>
        <p>${latest.designChoice || 'Noch nicht festgehalten.'}</p>
      </div>

      <div style="margin-top:18px;">
        <small>MEIN NÄCHSTER SCHRITT</small>
        <p>${latest.actionStep || 'Noch nicht festgehalten.'}</p>
      </div>
    </div>
  `;
}

function renderLatestJournalInsight() {
  if (!latestJournalInsight) return;

  const entries = getJournalEntries();
  const latest = entries[0];

  if (!latest) {
    latestJournalInsight.innerHTML = `
      <p>Dein zuletzt gespeicherter Journal-Eintrag erscheint hier.</p>
    `;
    return;
  }

  const typeLabels = {
    verstanden: 'VERSTANDEN',
    gespuert: 'GESPÜRT',
    umgesetzt: 'UMGESETZT'
  };

  const type =
    latest.types?.[0] || '';

  latestJournalInsight.innerHTML = `
    <div style="margin-top:18px;">
      <small>${typeLabels[type] || 'JOURNAL'}</small>

      <p style="margin-top:8px;">
        ${latest.text || 'Ohne zusätzliche Notiz gespeichert.'}
      </p>
    </div>
  `;
}

const backFromInnerCode = document.getElementById('backFromInnerCode');
const bodyToImpulse = document.getElementById('bodyToImpulse');

const bodyToKoerpersignale =
  document.getElementById('bodyToKoerpersignale');

const backFromKoerpersignale =
  document.getElementById('backFromKoerpersignale');

const koerpersignaleToBodyCode =
  document.getElementById('koerpersignaleToBodyCode');

const bodySignalSearch =
  document.getElementById('bodySignalSearch');

const bodySignalSearchCard =
  bodySignalSearch?.closest('.premium-card');

const backToBodySignalList =
  document.getElementById('backToBodySignalList');

const bodySignalFilters =
  document.getElementById('bodySignalFilters');

const bodySignalList =
  document.getElementById('bodySignalList');

const bodySignalDetail =
  document.getElementById('bodySignalDetail');

const bodySignalCategory =
  document.getElementById('bodySignalCategory');

const bodySignalTitle =
  document.getElementById('bodySignalTitle');

const bodySignalBody =
  document.getElementById('bodySignalBody');

const bodySignalInner =
  document.getElementById('bodySignalInner');

const bodySignalAction =
  document.getElementById('bodySignalAction');

const bodySignalReset =
  document.getElementById('bodySignalReset');

const bodySignalNextStepAction =
  document.getElementById('bodySignalNextStepAction');

const bodySignals = [
  {
    category: 'Kopf',
    title: 'Kopfschmerz',
    body: 'Wo sitzt der Druck oder Schmerz genau? Wie verändert er sich über den Tag?',
    inner: 'Welche Anforderungen, Reize oder Gedanken beanspruchen gerade besonders viel Raum?',
    action: '2 Minuten Licht, Wasser und Ruhe: Bildschirm weg, bewusst atmen und den Kiefer lockern.',
    reset: 'Ist die Intensität danach gleich, stärker oder etwas geringer?'
  },
  {
    category: 'Kopf',
    title: 'Kieferanspannung',
    body: 'Spürst du Druck, Pressen oder Müdigkeit im Kiefer?',
    inner: 'Was hältst du gerade zurück, kontrollierst du stark oder versuchst du durchzuhalten?',
    action: 'Zunge locker, Zähne voneinander lösen, 6 langsame Ausatmungen.',
    reset: 'Wo bemerkst du zuerst Entlastung – Kiefer, Gesicht, Nacken oder Atmung?'
  },
  {
    category: 'Kopf',
    title: 'Augenmüdigkeit',
    body: 'Sind die Augen trocken, schwer oder überreizt?',
    inner: 'Wie viel Bildschirm, Konzentration und visuelle Reize hattest du heute?',
    action: '20 Sekunden in die Ferne schauen, dann 10-mal bewusst blinzeln.',
    reset: 'Fühlen sich Augen und Kopf danach weiter oder ruhiger an?'
  },
  {
    category: 'Nacken & Schulter',
    title: 'Nackenanspannung',
    body: 'Ist der Nacken eher steif, ziehend oder druckempfindlich?',
    inner: 'Wo bist du innerlich angespannt oder permanent aufmerksam?',
    action: 'Schultern 5-mal hochziehen und bewusst fallen lassen; anschließend langsam den Blick links/rechts führen.',
    reset: 'Hat sich Beweglichkeit oder Spannung verändert?'
  },
  {
    category: 'Nacken & Schulter',
    title: 'Schulterlast',
    body: 'Welche Schulter fühlt sich schwerer oder höher an?',
    inner: 'Welche Verantwortung trägst du gerade – und was davon muss heute wirklich bei dir bleiben?',
    action: 'Eine Aufgabe notieren, die heute bewusst warten darf.',
    reset: 'Wie reagiert dein Körper auf die Entscheidung, etwas nicht sofort zu tragen?'
  },
  {
    category: 'Rücken',
    title: 'Oberer Rücken',
    body: 'Ist es Druck zwischen den Schulterblättern, Müdigkeit oder Ziehen?',
    inner: 'Wie lange sitzt oder hältst du dich heute schon in derselben Position?',
    action: '1–3 Minuten aufstehen, Arme öffnen, Brustkorb bewegen.',
    reset: 'Was verändert sich an Atmung und Aufrichtung?'
  },
  {
    category: 'Rücken',
    title: 'Unterer Rücken',
    body: 'Fühlt es sich steif, müde oder instabil an?',
    inner: 'Wie viel Sitzen, Heben, Stress oder fehlende Bewegung war zuletzt dabei?',
    action: 'Kurz gehen oder die Position wechseln; keine schmerzhaften Dehnungen erzwingen.',
    reset: 'Ist Bewegung gerade wohltuend oder braucht dein Körper eher Ruhe?'
  },
  {
    category: 'Brust & Atmung',
    title: 'Flache Atmung',
    body: 'Atmest du eher hoch in die Brust oder frei in den Bauchraum?',
    inner: 'Bist du gerade unter Zeitdruck, innerer Alarmbereitschaft oder ständiger Aktivität?',
    action: '5 Atemzüge mit längerer Ausatmung als Einatmung.',
    reset: 'Wird dein Körper ruhiger, wärmer oder bleibt er unverändert?'
  },
  {
    category: 'Brust & Atmung',
    title: 'Engegefühl',
    body: 'Wo genau nimmst du Enge wahr und wann tritt sie auf?',
    inner: 'Welche Situation löst gerade Anspannung oder emotionale Aktivierung aus?',
    action: 'Wenn medizinisch unauffällig: hinsetzen, Füße spüren, langsam ausatmen und Umgebung bewusst wahrnehmen.',
    reset: 'Kannst du den Zustand klarer beschreiben als vorher?'
  },
  {
    category: 'Bauch & Verdauung',
    title: 'Bauchanspannung',
    body: 'Ist der Bauch hart, nervös, aufgebläht oder empfindlich?',
    inner: 'Gab es Stress, hastiges Essen oder wenig Pausen?',
    action: 'Hand auf den Bauch, 60 Sekunden ruhig sitzen; nächste Mahlzeit langsamer essen.',
    reset: 'Was verändert sich durch Ruhe und bewusstes Tempo?'
  },
  {
    category: 'Bauch & Verdauung',
    title: 'Unruhige Verdauung',
    body: 'Wann fällt dir die Verdauungsreaktion besonders auf?',
    inner: 'Welche Nahrung, Tageszeit, Stresssituation oder Gewohnheit könnte mitwirken?',
    action: 'Heute ein kleines Beobachtungsprotokoll führen: Essen, Stress, Zeitpunkt, Reaktion.',
    reset: 'Erkennst du einen wiederkehrenden Zusammenhang?'
  },
  {
    category: 'Energie',
    title: 'Erschöpfung',
    body: 'Ist die Müdigkeit körperlich, geistig oder beides?',
    inner: 'Wie waren Schlaf, Trinken, Ernährung, Tageslicht und Bewegung in den letzten 24 Stunden?',
    action: 'Wähle nur eine Basis: Wasser, 3 Minuten Tageslicht oder 3 Minuten Bewegung.',
    reset: 'Wie verändert sich deine Energie auf einer Skala von 0–10?'
  },
  {
    category: 'Energie',
    title: 'Mittagstief',
    body: 'Wann beginnt dein Tief und was ging ihm voraus?',
    inner: 'War die Mahlzeit sehr groß, hattest du wenig Schlaf oder saßt du lange?',
    action: '5–10 Minuten leicht gehen, möglichst draußen.',
    reset: 'Wie klar ist dein Kopf danach auf einer Skala von 0–10?'
  },
  {
    category: 'Energie',
    title: 'Innere Unruhe',
    body: 'Wo spürst du Unruhe zuerst – Brust, Bauch, Beine, Gedanken?',
    inner: 'Was versucht deine Aufmerksamkeit gerade gleichzeitig zu lösen?',
    action: 'Eine Sache aufschreiben, die jetzt Priorität hat; den Rest parken.',
    reset: 'Wird deine innere Geschwindigkeit danach niedriger?'
  },
  {
    category: 'Schlaf',
    title: 'Einschlafprobleme',
    body: 'Ist dein Körper müde, während der Kopf weiterarbeitet?',
    inner: 'Welche offenen Gedanken, Bildschirmreize oder späten Aktivitäten halten dich aktiv?',
    action: 'Vor dem Schlafen 3 offene Punkte notieren und für morgen terminieren.',
    reset: 'Kann dein Kopf die Themen danach leichter loslassen?'
  },
  {
    category: 'Schlaf',
    title: 'Nächtliches Aufwachen',
    body: 'Zu welcher Uhrzeit wachst du auf und wie fühlst du dich dabei?',
    inner: 'Welche Faktoren könnten mitwirken: Temperatur, Alkohol, Stress, Licht, Geräusche oder Harndrang?',
    action: 'Für einige Nächte nur Zeitpunkt und mögliche Auslöser notieren.',
    reset: 'Entsteht ein erkennbares Muster?'
  },
  {
    category: 'Beine & Füße',
    title: 'Schwere Beine',
    body: 'Fühlen sich die Beine müde, gespannt oder unbeweglich an?',
    inner: 'Wie viel Bewegung und wie viel langes Sitzen oder Stehen gab es heute?',
    action: '3 Minuten gehen und die Fußgelenke bewegen.',
    reset: 'Werden die Beine danach leichter oder unverändert?'
  },
  {
    category: 'Beine & Füße',
    title: 'Unruhige Beine',
    body: 'Wann tritt die Unruhe auf – abends, in Ruhe oder nach langem Sitzen?',
    inner: 'Welche Gewohnheiten, Aktivität oder Tagesbelastung gehen dem voraus?',
    action: 'Kurze sanfte Bewegung und bewusstes Ausschütteln der Beine.',
    reset: 'Welche Veränderung bemerkst du?'
  },
  {
    category: 'Hände & Arme',
    title: 'Verspannte Unterarme',
    body: 'Sind Unterarme oder Hände müde, fest oder überbeansprucht?',
    inner: 'Wie viel Tippen, Handy, Werkzeug oder monotone Belastung hattest du?',
    action: 'Hände lockern, Finger spreizen, 60 Sekunden Pause von der Tätigkeit.',
    reset: 'Wie fühlt sich die Spannung danach an?'
  },
  {
    category: 'Hände & Arme',
    title: 'Kribbeln in Händen',
    body: 'Wann tritt das Kribbeln auf und in welchen Fingern?',
    inner: 'Welche Haltung oder Belastung geht dem voraus?',
    action: 'Position wechseln und beobachten. Wiederkehrendes oder anhaltendes Kribbeln medizinisch abklären lassen.',
    reset: 'Verschwindet es mit Positionswechsel oder bleibt es bestehen?'
  },
  {
    category: 'Ganzkörper',
    title: 'Muskelanspannung',
    body: 'Welche Bereiche halten gerade unbewusst Spannung?',
    inner: 'Bist du seit längerer Zeit in Konzentration, Stress oder körperlicher Belastung?',
    action: 'Körper kurz scannen: Stirn, Kiefer, Schultern, Hände, Bauch – jeden Bereich bewusst lockern.',
    reset: 'Wo lässt dein Körper zuerst los?'
  },
  {
    category: 'Ganzkörper',
    title: 'Kältegefühl',
    body: 'Ist dir allgemein kalt oder nur an Händen/Füßen?',
    inner: 'Wie sind Raumtemperatur, Bewegung, Essen, Schlaf und allgemeiner Zustand?',
    action: 'Kurz bewegen, warmes Getränk und Temperatur bewusst beobachten.',
    reset: 'Wird dir danach wärmer oder bleibt das Gefühl ungewöhnlich stark?'
  },
  {
    category: 'Ganzkörper',
    title: 'Überreizung',
    body: 'Sind Geräusche, Licht oder Menschen gerade zu viel?',
    inner: 'Wie lange hattest du heute ohne echte Pause Input?',
    action: '3 Minuten ohne Bildschirm, Sprache und neuen Input.',
    reset: 'Wie viel Reiz verträgst du danach wieder?'
  },
  {
    category: 'Stress',
    title: 'Gedankenkreisen',
    body: 'Welcher Gedanke wiederholt sich?',
    inner: 'Ist es ein Problem, das jetzt lösbar ist – oder nur gedanklich aktiv?',
    action: 'Schreibe den Gedanken auf und ergänze: „Der nächste konkrete Schritt ist …“',
    reset: 'Ist der Gedanke danach klarer oder weniger dominant?'
  },
  {
    category: 'Stress',
    title: 'Druckgefühl',
    body: 'Wo zeigt sich der Druck im Körper?',
    inner: 'Welche Erwartung erzeugt gerade das Gefühl, schneller oder mehr leisten zu müssen?',
    action: 'Eine Aufgabe verkleinern: Was ist die kleinste sinnvolle Version davon?',
    reset: 'Was passiert mit deinem Körper, wenn die Aufgabe kleiner wird?'
  },
  {
    category: 'Regeneration',
    title: 'Keine Lust auf Bewegung',
    body: 'Ist es echte Erschöpfung oder eher Startwiderstand?',
    inner: 'Wie viel wäre gerade wirklich möglich: 1, 3 oder 10 Minuten?',
    action: 'Nur die gewählte Minimalzeit bewegen – danach neu entscheiden.',
    reset: 'Hast du danach mehr, gleich viel oder weniger Energie?'
  },
  {
    category: 'Regeneration',
    title: 'Nach langem Sitzen steif',
    body: 'Welche Gelenke oder Muskeln fühlen sich unbeweglich an?',
    inner: 'Wie lange warst du ohne Positionswechsel?',
    action: '90 Sekunden gehen, strecken und die Gelenke sanft bewegen.',
    reset: 'Welche Stelle verändert sich am deutlichsten?'
  },
  {
    category: 'Regeneration',
    title: 'Gefühl von Leere',
    body: 'Wie zeigt sich Leere körperlich – Müdigkeit, Schwere, Distanz oder Ruhe?',
    inner: 'Was fehlt dir gerade eher: Pause, Kontakt, Bewegung, Essen, Natur oder Orientierung?',
    action: 'Wähle nur eine kleine Ressource und nutze sie 3 Minuten bewusst.',
    reset: 'Was ist danach anders – auch wenn es nur minimal ist?'
  },
  {
    category: 'Wahrnehmung',
    title: 'Körper kaum spürbar',
    body: 'Welche Körperstelle kannst du gerade am leichtesten wahrnehmen?',
    inner: 'War deine Aufmerksamkeit lange ausschließlich im Denken oder Außen?',
    action: 'Füße am Boden spüren und 30 Sekunden drei Körperempfindungen benennen.',
    reset: 'Kannst du jetzt mehr Details wahrnehmen?'
  },
  {
    category: 'Wahrnehmung',
    title: 'Unspezifisches Unwohlsein',
    body: 'Was genau bedeutet „unwohl“ – Druck, Müdigkeit, Nervosität, Schmerz, Wärme, Kälte?',
    inner: 'Wann begann es und was war unmittelbar davor?',
    action: 'Das Gefühl in drei konkrete Körperwörter übersetzen und Verlauf beobachten.',
    reset: 'Ist dein Zustand dadurch klarer beschreibbar geworden?'
  }
];

function renderBodySignals(list = bodySignals) {
  if (!bodySignalList) return;

  bodySignalList.innerHTML = '';

  if (list.length === 0) {
    bodySignalList.innerHTML = `
      <p class="empty-state">
        Kein passendes Körpersignal gefunden.
      </p>
    `;
    return;
  }

  list.forEach((signal, index) => {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'menu-card';

    button.innerHTML = `
      <div>
        <small>${signal.category}</small>
        <strong>${signal.title}</strong>
        <p>${signal.body}</p>
      </div>
      <b>›</b>
    `;

button.addEventListener('click', () => {
  bodySignalCategory.textContent = signal.category;
  bodySignalTitle.textContent = signal.title;
  bodySignalBody.textContent = signal.body;
  bodySignalInner.textContent = signal.inner;
  bodySignalAction.textContent = signal.action;
  bodySignalReset.textContent = signal.reset;

  if (bodySignalSearchCard) {
    bodySignalSearchCard.hidden = true;
  }

  bodySignalList.hidden = true;
  bodySignalFilters.hidden = true;
  bodySignalDetail.hidden = false;

  if (backToBodySignalList) {
    backToBodySignalList.hidden = false;
  }

  window.scrollTo(0, 0);
});

    bodySignalList.appendChild(button);
  });
}

backToBodySignalList?.addEventListener('click', () => {
  if (bodySignalSearchCard) {
    bodySignalSearchCard.hidden = false;
  }

  bodySignalDetail.hidden = true;
  bodySignalFilters.hidden = false;
  bodySignalList.hidden = false;
  backToBodySignalList.hidden = true;

  filterBodySignals();

  window.scrollTo(0, 0);
});

// HIER DIREKT WEITER:

let activeBodySignalCategory = 'Kopf';

function renderBodySignalFilters() {
  if (!bodySignalFilters) return;

  const categories = [
    'Alle',
    ...new Set(bodySignals.map((signal) => signal.category))
  ];

  bodySignalFilters.innerHTML = '';

  categories.forEach((category) => {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'energy-choice';

    if (category === activeBodySignalCategory) {
      button.classList.add('active');
    }

    button.textContent = category;

    button.addEventListener('click', () => {
      activeBodySignalCategory = category;
      renderBodySignalFilters();
      filterBodySignals();
    });

    bodySignalFilters.appendChild(button);
  });
}

function filterBodySignals() {
  const query =
    bodySignalSearch?.value.trim().toLowerCase() || '';

  const filteredSignals = bodySignals.filter((signal) => {

    const matchesCategory =
      activeBodySignalCategory === 'Alle' ||
      signal.category === activeBodySignalCategory;

    const searchableText = `
      ${signal.category}
      ${signal.title}
      ${signal.body}
      ${signal.inner}
      ${signal.action}
      ${signal.reset}
    `.toLowerCase();

    const matchesSearch =
      !query || searchableText.includes(query);

    return matchesCategory && matchesSearch;
  });

  renderBodySignals(filteredSignals);
}

bodySignalSearch?.addEventListener('input', () => {
  filterBodySignals();
});

renderBodySignalFilters();
filterBodySignals();

const bodyToPerception = document.getElementById('bodyToPerception');
const bodyToEnergy = document.getElementById('bodyToEnergy');
const backFromBodyCode = document.getElementById('backFromBodyCode');
const bodyBackToToday = document.getElementById('bodyBackToToday');
const actionToImpulse = document.getElementById('actionToImpulse');
const actionToFocus = document.getElementById('actionToFocus');
const actionToSteps = document.getElementById('actionToSteps');
const actionStepsList = document.getElementById('actionStepsList');
const actionStepsTotal = document.getElementById('actionStepsTotal');
const actionStepsDone = document.getElementById('actionStepsDone');
const actionStepsOpen = document.getElementById('actionStepsOpen');
const backFromActionSteps = document.getElementById('backFromActionSteps');
const actionToGegenpol = document.getElementById('actionToGegenpol');
const backFromActionCode = document.getElementById('backFromActionCode');
const actionBackToToday = document.getElementById('actionBackToToday');
const actionNextTopic = document.getElementById('actionNextTopic');
const actionCurrentStepCard =
  document.getElementById('actionCurrentStepCard');

const actionCurrentStepTopic =
  document.getElementById('actionCurrentStepTopic');

const actionCurrentStepText =
  document.getElementById('actionCurrentStepText');

const actionCurrentStepSize =
  document.getElementById('actionCurrentStepSize');

const completeActionCurrentStep =
  document.getElementById('completeActionCurrentStep');

function renderCurrentActionStep() {
  if (!actionCurrentStepCard) return;

  const steps = getActionNextSteps();
  const currentStep = steps.find((item) => !item.done);

  if (!currentStep) {
    actionCurrentStepCard.hidden = true;
    return;
  }

  const sizeLabels = {
    small: 'Ein kleiner Schritt',
    medium: 'Etwas mehr',
    big: 'Ich bin bereit'
  };

  actionCurrentStepTopic.textContent =
    `Thema: ${currentStep.topic}`;

  actionCurrentStepText.textContent =
    currentStep.step;

  actionCurrentStepSize.textContent =
    sizeLabels[currentStep.size] || currentStep.size;

  actionCurrentStepCard.dataset.stepId =
    currentStep.id;

  actionCurrentStepCard.hidden = false;
}

function renderActionSteps() {
  if (!actionStepsList) return;

  const steps = getActionNextSteps();
  const total = steps.length;
const done = steps.filter((item) => item.done).length;
const open = steps.filter((item) => !item.done).length;

if (actionStepsTotal) {
  actionStepsTotal.textContent = total;
}

if (actionStepsDone) {
  actionStepsDone.textContent = done;
}

if (actionStepsOpen) {
  actionStepsOpen.textContent = open;
}

  if (!steps.length) {
    actionStepsList.innerHTML = `
      <p class="empty-state">
        Noch keine gespeicherten Schritte.
      </p>
    `;
    return;
  }

  const sizeLabels = {
    small: 'Ein kleiner Schritt',
    medium: 'Etwas mehr',
    big: 'Ich bin bereit'
  };

  const latestSteps = steps.slice(0, 5);

  actionStepsList.innerHTML = latestSteps.map((item) => {
    const date = new Date(item.createdAt).toLocaleDateString('de-DE');

    return `
      <div class="action-history-item">
        <div style="display:flex; justify-content:space-between; gap:12px;">
          <small>${date}</small>
          <small>${item.done ? '✓ ERLEDIGT' : '○ OFFEN'}</small>
        </div>

        <p style="margin-top:10px;">
          ${item.topic}
        </p>

        <p style="margin-top:8px;">
          <strong>${item.step}</strong>
        </p>

        <small>
          ${sizeLabels[item.size] || item.size}
        </small>
      </div>
    `;
  }).join('');
}

const actionNextStep = document.getElementById('actionNextStep');
const saveActionNextStep = document.getElementById('saveActionNextStep');
const actionNextFeedback = document.getElementById('actionNextFeedback');
const backFromActionNext = document.getElementById('backFromActionNext');
const actionNextStepsKey = 'ICS_ACTION_NEXT_STEPS';

let selectedActionSize = 'small';

function getActionNextSteps() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(actionNextStepsKey) || '[]'
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveActionNextSteps(steps) {
  localStorage.setItem(
    actionNextStepsKey,
    JSON.stringify(steps.slice(0, 100))
  );
}

document.querySelectorAll('.action-next-size').forEach((button) => {
  button.addEventListener('click', () => {
    selectedActionSize = button.dataset.actionSize;

    document.querySelectorAll('.action-next-size').forEach((choice) => {
      choice.classList.toggle('active', choice === button);
    });
  });
});

saveActionNextStep?.addEventListener('click', () => {
  const topic = actionNextTopic?.value.trim() || '';
  const step = actionNextStep?.value.trim() || '';

  if (!topic || !step) {
    if (actionNextFeedback) {
      actionNextFeedback.textContent =
        'Bitte beschreibe kurz, was dich beschäftigt und welchen Schritt du gehen möchtest.';
    }
    return;
  }

  const steps = getActionNextSteps();

  const record = {
    id: globalThis.crypto?.randomUUID?.() || `ACTION_${Date.now()}`,
    createdAt: new Date().toISOString(),
    topic,
    size: selectedActionSize,
    step,
    done: false
  };

  steps.unshift(record);
  saveActionNextSteps(steps);
  renderCurrentActionStep();

  if (actionNextFeedback) {
    actionNextFeedback.textContent =
      'Dein nächster Schritt wurde gespeichert. ✓';
  }

  actionNextTopic.value = '';
  actionNextStep.value = '';

  selectedActionSize = 'small';

  document.querySelectorAll('.action-next-size').forEach((button) => {
    button.classList.toggle(
      'active',
      button.dataset.actionSize === 'small'
    );
  });
});

renderCurrentActionStep();

completeActionCurrentStep?.addEventListener('click', () => {
  const stepId = actionCurrentStepCard?.dataset.stepId;

  if (!stepId) return;

  const steps = getActionNextSteps();

  const updatedSteps = steps.map((item) => {
    if (item.id !== stepId) return item;

    return {
      ...item,
      done: true,
      completedAt: new Date().toISOString()
    };
  });

  saveActionNextSteps(updatedSteps);
  renderCurrentActionStep();

  if (actionNextFeedback) {
    actionNextFeedback.textContent =
      'Schritt erledigt. ✓ Nimm kurz wahr, was sich dadurch verändert hat.';
  }
});

const resetToImpulse = document.getElementById('resetToImpulse');
const resetToBibliothek = document.getElementById('resetToBibliothek');
const resetToMeditation = document.getElementById('resetToMeditation');
const backFromResetCode = document.getElementById('backFromResetCode');
const resetBackToToday = document.getElementById('resetBackToToday');

const openWaehleMeinenWeg =
  document.getElementById('openWaehleMeinenWeg');

const backFromWaehleMeinenWeg =
  document.getElementById('backFromWaehleMeinenWeg');

const backFromIcsEnergy = document.getElementById('backFromIcsEnergy');

const openEnergyHistory = document.getElementById('openEnergyHistory');
const icsLatestEnergy = document.getElementById('icsLatestEnergy');
const icsLifeCycleOverview =
  document.getElementById('icsLifeCycleOverview');
const icsBirthDate =
  document.getElementById('icsBirthDate');

const saveIcsBirthDate =
  document.getElementById('saveIcsBirthDate');
function loadIcsBirthDate() {
  const savedBirthDate = localStorage.getItem(userBirthDateKey);

  if (icsBirthDate && savedBirthDate) {
    icsBirthDate.value = savedBirthDate;
  }
}

saveIcsBirthDate?.addEventListener('click', () => {
  const birthDate = icsBirthDate?.value;

  if (!birthDate) return;

  localStorage.setItem(userBirthDateKey, birthDate);

  const cycle = calculateSevenYearCycle(birthDate);

  if (!cycle || !icsLifeCycleOverview) return;

  icsLifeCycleOverview.innerHTML = `
    <small>DEINE AKTUELLE LEBENSPHASE</small>
    <p style="margin:10px 0 0;">
      ${cycle.cycleStart}–${cycle.cycleEnd} Jahre
      · Jahr ${cycle.yearInCycle} deines Zyklus
    </p>
  `;
});

loadIcsBirthDate();
function calculateSevenYearCycle(birthDateValue) {
  if (!birthDateValue) return null;

  const [year, month, day] = birthDateValue
    .split('-')
    .map(Number);

  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const birthdayThisYear = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );

  if (today < birthdayThisYear) {
    age -= 1;
  }

  if (age < 0) return null;

  const cycleStart = Math.floor(age / 7) * 7;
  const cycleEnd = cycleStart + 7;
  const yearInCycle = age - cycleStart + 1;

  return {
    age,
    cycleStart,
    cycleEnd,
    yearInCycle
  };
}

const backFromEnergyHistory = document.getElementById('backFromEnergyHistory');

const energyRecommendation = document.getElementById('energyRecommendation');
const energyRecommendationButton = document.getElementById('energyRecommendationButton');
const energyRecommendationTitle = document.getElementById('energyRecommendationTitle');
const energyDeepening =
  document.getElementById('energyDeepening');

const energyRecoveryNextStep =
  document.getElementById('energyRecoveryNextStep');

const openEnergyRecoveryHistory =
  document.getElementById('openEnergyRecoveryHistory');

const startEnergyDeepening =
  document.getElementById('startEnergyDeepening');

const repeatEnergyRecommendation =
  document.getElementById('repeatEnergyRecommendation');

openEnergyRecoveryHistory?.addEventListener('click', () => {
  renderFullEnergyHistory();
  openView('energyhistory');
});

startEnergyDeepening?.addEventListener('click', () => {
  if (beliefInput) {
    beliefInput.value = '';
  }

  if (beliefResultCard) {
    beliefResultCard.hidden = true;
  }

  if (beliefSaveFeedback) {
    beliefSaveFeedback.textContent = '';
  }

  const beliefDesignMode =
    document.getElementById('beliefDesignMode');

  if (beliefDesignMode) {
    beliefDesignMode.hidden = true;
  }

  if (beliefDesignChoice) {
    beliefDesignChoice.hidden = true;
  }

  if (beliefDesignInput) {
    beliefDesignInput.value = '';
  }

  if (beliefActionStep) {
    beliefActionStep.hidden = true;
  }

  if (beliefActionInput) {
    beliefActionInput.value = '';
  }

  if (saveBeliefDesignChoice) {
    saveBeliefDesignChoice.disabled = false;
    saveBeliefDesignChoice.textContent = 'Neue Wahl festhalten';
  }

  if (saveBeliefActionStep) {
    saveBeliefActionStep.disabled = false;
    saveBeliefActionStep.textContent =
      'Meinen nächsten Schritt festhalten';
  }

if (beliefNextStepRecommendation) {
  beliefNextStepRecommendation.hidden = true;
}
  
  currentBeliefResult = null;

  openView('beliefs');
});
let returnToEnergyAfterRecommendation = false;

const energyHistoryKey = 'ICS_ENERGY_HISTORY';
const energyHistoryLimit = 100;

const icsStateRouter = {
  kopfVoll: {
    label: 'Kopf voll',
    focus: 'mind'
  },

  erschoepft: {
    label: 'Erschöpft',
    focus: 'energy'
  },

  angespannt: {
    label: 'Angespannt',
    focus: 'body'
  },

  unruhig: {
    label: 'Unruhig',
    focus: 'mind'
  },

  festgefahren: {
    label: 'Festgefahren',
    focus: 'mind'
  },

  energielos: {
    label: 'Energielos',
    focus: 'energy'
  }
};

const icsNextStep =
  document.getElementById('icsNextStep');

const icsNextStepTitle =
  document.getElementById('icsNextStepTitle');

const icsNextStepText =
  document.getElementById('icsNextStepText');

const icsNextStepAction =
  document.getElementById('icsNextStepAction');

function showIcsNextStepForState(stateKey) {
  if (!icsNextStep) return;

if (
  stateKey === 'energielos' ||
  stateKey === 'erschoepft'
) {
  icsNextStep.hidden = true;
}

if (stateKey === 'festgefahren') {
  icsNextStepTitle.textContent =
    'Du musst gerade nicht noch mehr nachdenken.';

  icsNextStepText.textContent =
    'Wenn du feststeckst, kann es helfen, zuerst das aktive Muster sichtbar zu machen und einen neuen Gegenpol zu wählen.';

  icsNextStepAction.textContent =
    'Mein Muster verstehen →';

  icsNextStep.hidden = false;
}

if (stateKey === 'angespannt') {
  icsNextStepTitle.textContent =
    'Dein Körper macht gerade auf etwas aufmerksam.';

  icsNextStepText.textContent =
    'Statt die Anspannung nur wegzudrücken, kannst du zuerst schauen, was dein Körper dir gerade zeigt.';

  icsNextStepAction.textContent =
    'Körpersignal nachschlagen →';

  icsNextStep.hidden = false;
}

if (stateKey === 'unruhig') {
  icsNextStepTitle.textContent =
    'Dein System braucht gerade etwas Ruhe und Orientierung.';

  icsNextStepText.textContent =
    'Wenn innerlich viel gleichzeitig läuft, hilft oft kein weiteres Denken. Ein kurzer RESET kann dir helfen, wieder bei dir anzukommen.';

  icsNextStepAction.textContent =
    'Kurzen RESET starten →';

  icsNextStep.hidden = false;
}

if (stateKey === 'kopfVoll') {
  icsNextStepTitle.textContent =
    'Dein Kopf braucht gerade Entlastung.';

  icsNextStepText.textContent =
    'Du musst nicht alles gleichzeitig sortieren. Nimm dir einen kurzen Moment, um Gedanken aus dem Kopf zu bringen und wieder klarer zu werden.';

  icsNextStepAction.textContent =
    'Kopf entlasten →';

  icsNextStep.hidden = false;
}
  
}

icsNextStepAction?.addEventListener('click', () => {
  if (selectedIcsState === 'festgefahren') {
    openView('beliefs');
    return;
  }

  if (selectedIcsState === 'angespannt') {
    openView('koerpersignale');
    return;
  }

  if (selectedIcsState === 'unruhig') {
    openView('resetmeditation');
  }

if (selectedIcsState === 'kopfVoll') {
  if (!selectedIcsDuration) {
    icsNextStepText.textContent =
      'Wähle zuerst, wie viel gerade wirklich möglich ist: 1, 3 oder 10 Minuten.';
    return;
  }

  startIcsStateJourney();
}

if (
  selectedIcsState === 'energielos' ||
  selectedIcsState === 'erschoepft'
) {
  if (!selectedIcsDuration) {
    icsNextStepText.textContent =
      'Wähle zuerst, wie viel gerade wirklich möglich ist: 1, 3 oder 10 Minuten.';
    return;
  }

  startIcsStateJourney();
}
  
});

const icsStateButtons =
  document.querySelectorAll('.ics-state-button');

let selectedIcsState = null;

icsStateButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const stateKey = button.dataset.icsState;
    const state = icsStateRouter[stateKey];

    if (!state) return;

    selectedIcsState = stateKey;

    icsStateButtons.forEach((item) => {
      item.classList.remove('is-selected');
      item.setAttribute('aria-pressed', 'false');
    });

    button.classList.add('is-selected');
    button.setAttribute('aria-pressed', 'true');
  });
});

const icsDurationButtons =
  document.querySelectorAll('.ics-duration-button');

let selectedIcsDuration = null;

icsDurationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const duration = Number(button.dataset.icsDuration);

    if (![1, 3, 10].includes(duration)) return;

    selectedIcsDuration = duration;

    icsDurationButtons.forEach((item) => {
      item.classList.remove('is-selected');
      item.setAttribute('aria-pressed', 'false');
    });

    button.classList.add('is-selected');
    button.setAttribute('aria-pressed', 'true');
  });
});

function startIcsStateJourney() {
  if (!selectedIcsState || !selectedIcsDuration) return;

  const state = icsStateRouter[selectedIcsState];

  if (!state) return;

  resetEnergyJourney();

  energyJourneyState.routerFocus = state.focus;
  energyJourneyState.routerState = selectedIcsState;
  energyJourneyState.duration = selectedIcsDuration;

  const impulse = Object.values(icsContentLinks.energyImpulses)
    .find((item) =>
      item.focus === state.focus &&
      item.duration === selectedIcsDuration
    );

  if (!impulse) return;

  energyJourneyState.impulseId = impulse.id;

  document.querySelectorAll('[data-energy-duration]').forEach((button) => {
    const selected =
      Number(button.dataset.energyDuration) === selectedIcsDuration;

    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });

  const energyDurationChoice =
    document.getElementById('energyDurationChoice');

  if (energyDurationChoice) {
    energyDurationChoice.hidden = true;
  }
  
  openView('icsenergy');
}

document
  .getElementById('startIcsStateJourney')
  ?.addEventListener('click', startIcsStateJourney);

icsStateButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const stateKey = button.dataset.icsState;
    const state = icsStateRouter[stateKey];

    if (!state) return;

    selectedIcsState = stateKey;

    showIcsNextStepForState(stateKey);
    
    icsStateButtons.forEach((item) => {
      item.classList.remove('is-selected');
      item.setAttribute('aria-pressed', 'false');
    });

    button.classList.add('is-selected');
    button.setAttribute('aria-pressed', 'true');
  });
});

const mentorHistoryKey = 'ICS_MENTOR_HISTORY';
const mentorHistoryLimit = 100;

function saveMentorChoice(record) {
  try {
    const history = JSON.parse(
      localStorage.getItem(mentorHistoryKey) || '[]'
    );

    history.unshift(record);

    localStorage.setItem(
      mentorHistoryKey,
      JSON.stringify(history.slice(0, mentorHistoryLimit))
    );

    return true;
  } catch {
    return false;
  }
}

const energySteps = {
  check: document.getElementById('energyCheckStep'),
  impulse: document.getElementById('energyImpulseStep'),
  after: document.getElementById('energyAfterStep'),
  result: document.getElementById('energyResultStep')
};

const energyJourneyState = {
  duration: 1,
  impulseId: null,
  before: {},
  after: {},
  noticedAt: null,
  mentorState: null,
  routerFocus: null,
  routerState: null,
  linkedRecommendation: null,
  completedRecordId: null
};

function isValidEnergyHistoryRecord(record) {
  const ratingKeys = ['energy', 'body', 'mind'];
  return Boolean(
    record &&
    typeof record.id === 'string' &&
    typeof record.createdAt === 'string' &&
    ratingKeys.every((key) => Number.isFinite(record.before?.[key])) &&
    ratingKeys.every((key) => Number.isFinite(record.after?.[key])) &&
    ratingKeys.every((key) => Number.isFinite(record.delta?.[key])) &&
    ['energy', 'body', 'mind'].includes(record.focus) &&
    (record.routerState === null || typeof record.routerState === 'string') &&
    [1, 3, 10].includes(record.duration) &&
    typeof record.impulseId === 'string' &&
    typeof record.impulseTitle === 'string' &&
    Boolean(icsContentLinks.energyImpulses[record.impulseId]) &&
    Array.isArray(record.foundations) &&
    record.foundations.length > 0 &&
    record.foundations.every((foundationId) =>
      icsContentLinks.energyFoundations.some(({ id }) => id === foundationId)) &&
    typeof record.noticedAt === 'string'
  );
}

function getEnergyHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(energyHistoryKey) || '[]');
    return Array.isArray(history) && history.every(isValidEnergyHistoryRecord)
      ? history
      : [];
  } catch {
    return [];
  }
}

function countRecentRouterState(stateKey, limit = 10) {
  if (!stateKey) return 0;

  return getEnergyHistory()
    .slice(0, limit)
    .filter((record) => record.routerState === stateKey)
    .length;
}

function hasRepeatedRouterState(stateKey) {
  return countRecentRouterState(stateKey, 10) >= 3;
}

function renderLatestEnergyForMeinIcs() {
  if (!icsLatestEnergy) return;

  const history = getEnergyHistory();
  const latest = history[0];

  if (!latest) {
    icsLatestEnergy.innerHTML =
      '<small>Dein erster abgeschlossener Energie-Check erscheint hier.</small>';
    return;
  }

  const focusLabels = {
    energy: 'Energie',
    body: 'Körper',
    mind: 'Kopf'
  };

  const date = new Date(latest.createdAt);

  icsLatestEnergy.innerHTML = `
    <small>
      ${date.toLocaleDateString('de-DE')} ·
      ${latest.duration} Min ·
      ${focusLabels[latest.focus]}
    </small>
    <p style="margin:10px 0 0;">
      Energie ${latest.before.energy} → ${latest.after.energy}
      · Körper ${latest.before.body} → ${latest.after.body}
      · Kopf ${latest.before.mind} → ${latest.after.mind}
    </p>
  `;
}

function getLatestMentorEnergyExperience() {
  const history = getEnergyHistory();

  return history.find((record) =>
    record.source === 'mentor' &&
    record.mentorState === 'energy'
  ) || null;
}

function getMentorEnergyExperiences() {
  return getEnergyHistory().filter((record) =>
    record.source === 'mentor' &&
    record.mentorState === 'energy'
  );
}

function getMentorEnergyPattern() {
  const experiences = getMentorEnergyExperiences();

  if (experiences.length < 3) {
    return null;
  }

  const totalEnergyChange = experiences.reduce(
    (sum, record) => sum + (record.delta?.energy || 0),
    0
  );

  const averageEnergyChange =
    totalEnergyChange / experiences.length;

  return {
    count: experiences.length,
    averageEnergyChange
  };
}

function getEnergyInsight(history) {
  if (!history.length) {
    return 'Starte deinen ersten Energie-Check. Mit jedem Eintrag wird dein persönliches Muster sichtbarer.';
  }

  if (history.length < 3) {
    return 'Dein Verlauf beginnt sich aufzubauen. Nach einigen weiteren Checks kann ICS erste Muster vergleichen.';
  }

  const recent = history.slice(0, 3);

  const averageDelta = (key) =>
    recent.reduce((sum, record) => sum + record.delta[key], 0) / recent.length;

  const energyDelta = averageDelta('energy');
  const bodyDelta = averageDelta('body');
  const mindDelta = averageDelta('mind');

  const strongest = [
    { key: 'energy', label: 'deine Energie', value: energyDelta },
    { key: 'body', label: 'dein Körpergefühl', value: bodyDelta },
    { key: 'mind', label: 'deine mentale Klarheit', value: mindDelta }
  ].sort((a, b) => b.value - a.value)[0];

  const notices = recent
    .map((record) => record.noticedAt)
    .filter(Boolean);

  const noticeCounts = notices.reduce((counts, notice) => {
    counts[notice] = (counts[notice] || 0) + 1;
    return counts;
  }, {});

  const commonNotice = Object.entries(noticeCounts)
    .sort((a, b) => b[1] - a[1])[0];

  if (strongest.value <= 0) {
    return 'Deine letzten Checks zeigen noch keine eindeutige Veränderung. Das ist ebenfalls wertvoll: Beobachte weiter, welche Impulse dir wirklich guttun.';
  }

  if (commonNotice && commonNotice[1] >= 2) {
    return `In deinen letzten Checks verändert sich besonders ${strongest.label}. Du bemerkst Veränderungen häufig zuerst bei „${commonNotice[0]}“.`;
  }

  return `In deinen letzten Checks zeigt sich die stärkste Veränderung bei ${strongest.label}. Beobachte weiter, ob sich dieses Muster bestätigt.`;
}

function getEnergyPersonalRecommendation(history) {
  if (!history.length) {
    return {
      title: 'Starte mit deinem ersten Check',
      text: 'Je mehr du wahrnimmst und festhältst, desto besser kann ICS erkennen, welche kleinen Schritte dich tatsächlich unterstützen.'
    };
  }

  if (history.length < 3) {
    return {
      impulseId: null,
      title: 'Dein Muster entsteht gerade',
      text: 'Mach noch einige Energie-Checks. Danach kann ICS vergleichen, welche Impulse bei dir besonders gut wirken.'
    };
  }

  const latestFocus = history[0]?.focus;

const recent = history
  .filter((record) => record.focus === latestFocus)
  .slice(0, 10);

  const impulseStats = {};

  recent.forEach((record) => {
    if (!record.impulseId) return;

    if (!impulseStats[record.impulseId]) {
      impulseStats[record.impulseId] = {
        impulseId: record.impulseId,
        title: record.impulseTitle,
        count: 0,
        totalChange: 0
      };
    }

    const totalChange =
      record.delta.energy +
      record.delta.body +
      record.delta.mind;

    impulseStats[record.impulseId].count += 1;
    impulseStats[record.impulseId].totalChange += totalChange;
  });

  const rankedImpulses = Object.values(impulseStats)
    .map((item) => ({
      ...item,
      averageChange: item.totalChange / item.count
    }))
    .sort((a, b) => b.averageChange - a.averageChange);

  const bestImpulse = rankedImpulses[0];

  if (!bestImpulse || bestImpulse.averageChange <= 0) {
    return {
      impulseId: null,
      title: 'Weiter beobachten statt mehr machen',
      text: 'Dein Verlauf zeigt noch keinen Impuls, der sich deutlich abhebt. Bleib bei kleinen Schritten und beobachte, was sich wirklich verändert.'
    };
  }

  if (bestImpulse.count >= 2) {
    return {
      impulseId: bestImpulse.impulseId,
      title: 'Das scheint dir besonders gutzutun',
      text: `„${bestImpulse.title}“ zeigt in deinen bisherigen Checks wiederholt eine positive Veränderung. Dieser Impuls kann für dich ein guter erster Schritt sein, wenn deine Energie wieder sinkt.`
    };
  }

  return {
    impulseId: bestImpulse.impulseId,
    title: 'Ein erster Hinweis wird sichtbar',
    text: `„${bestImpulse.title}“ hat in deinem bisherigen Verlauf eine positive Veränderung gezeigt. Beobachte bei weiteren Checks, ob sich dieses Muster bestätigt.`
  };
}

function renderEnergyHistory() {
  const container = document.getElementById('energyHistoryList');
  if (!container) return;

  const history = getEnergyHistory();

  const insightText = document.getElementById('energyInsightText');

if (insightText) {
  insightText.textContent = getEnergyInsight(history);
}

  const personalRecommendation =
  getEnergyPersonalRecommendation(history);

const recommendationTitle =
  document.getElementById('energyPersonalRecommendationTitle');

const recommendationText =
  document.getElementById('energyPersonalRecommendationText');

if (recommendationTitle) {
  recommendationTitle.textContent =
    personalRecommendation.title;
}

if (recommendationText) {
  recommendationText.textContent =
    personalRecommendation.text;
}

  if (repeatEnergyRecommendation) {
  if (personalRecommendation.impulseId) {
    repeatEnergyRecommendation.hidden = false;
    repeatEnergyRecommendation.dataset.impulseId =
      personalRecommendation.impulseId;
  } else {
    repeatEnergyRecommendation.hidden = true;
    delete repeatEnergyRecommendation.dataset.impulseId;
  }
}

  if (!history.length) {
    container.innerHTML =
      '<p class="empty-state">Dein erster abgeschlossener Energie-Check erscheint hier.</p>';
    return;
  }

  const labels = {
    energy: 'Energie',
    body: 'Körper',
    mind: 'Kopf'
  };

  const foundationTitles = new Map(
    icsContentLinks.energyFoundations.map(({ id, title }) => [id, title])
  );

  container.innerHTML = history
    .slice()
    .sort((first, second) =>
      new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
    .slice(0, 3)
    .map((record) => {
      const date = new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(record.createdAt));

      const values = Object.keys(labels)
        .map((key) => {
          const change = record.delta[key];
          const sign = change > 0 ? '+' : '';

          return `
            <div class="energy-history-value">
              <small>${labels[key]}</small>
              <strong>
                ${record.before[key]} → ${record.after[key]}
                (${sign}${change})
              </strong>
            </div>
          `;
        })
        .join('');

      const foundations = record.foundations
        .map((foundationId) => foundationTitles.get(foundationId))
        .filter(Boolean)
        .join(' · ');

      const duration = `${record.duration} ${record.duration === 1 ? 'Minute' : 'Minuten'}`;

      return `
        <article class="energy-history-item">
          <small class="energy-history-date">${date}</small>

          <p class="energy-history-focus">
            <strong>Schwerpunkt:</strong> ${labels[record.focus]}
          </p>

          <div class="energy-history-values">
            ${values}
          </div>

          <div class="energy-history-details">
            <p><strong>Impuls:</strong> ${escapeHtml(record.impulseTitle)}</p>
            <p><strong>Dauer:</strong> ${duration}</p>
            <p><strong>Zuerst bemerkt:</strong> ${escapeHtml(record.noticedAt)}</p>
            <p><strong>Unterstützte Grundlagen:</strong> ${escapeHtml(foundations)}</p>
          </div>
        </article>
      `;
    })
    .join('');
}

function saveEnergyCheck(record) {
  if (!isValidEnergyHistoryRecord(record)) return false;

  const history = getEnergyHistory();
  if (history.some(({ id }) => id === record.id)) return false;

  try {
    localStorage.setItem(
      energyHistoryKey,
      JSON.stringify([record, ...history].slice(0, energyHistoryLimit))
    );
    return true;
  } catch {
    return false;
  }
}

function createEnergyCheckRecord() {
  const impulse = icsContentLinks.energyImpulses[energyJourneyState.impulseId];
  const ratingKeys = ['energy', 'body', 'mind'];
  const hasCompleteRatings = ['before', 'after'].every((phase) =>
    ratingKeys.every((key) => Number.isFinite(energyJourneyState[phase][key]))
  );

  if (!impulse || !energyJourneyState.noticedAt || !hasCompleteRatings) return null;

  const delta = Object.fromEntries(ratingKeys.map((key) => [
    key,
    energyJourneyState.after[key] - energyJourneyState.before[key]
  ]));
  const uniquePart = globalThis.crypto?.randomUUID?.()
    || Math.random().toString(36).slice(2);

return {
  id: `ENERGY_${Date.now()}_${uniquePart}`,
  createdAt: new Date().toISOString(),
  before: { ...energyJourneyState.before },
  after: { ...energyJourneyState.after },
  delta,
  focus: energyJourneyState.routerFocus || getEnergyFocus(energyJourneyState.before),
  routerState: energyJourneyState.routerState || null,
  duration: energyJourneyState.duration,
  impulseId: impulse.id,
  impulseTitle: impulse.title,
  foundations: [...impulse.foundations],
  noticedAt: energyJourneyState.noticedAt,

  source: energyJourneyState.mentorState ? 'mentor' : 'direct',
  mentorState: energyJourneyState.mentorState || null
};
}

function readEnergyRatings(phase) {
  const suffix = phase === 'before' ? 'Before' : 'After';
  return {
    energy: Number(document.getElementById(`energy${suffix}`).value),
    body: Number(document.getElementById(`body${suffix}`).value),
    mind: Number(document.getElementById(`mind${suffix}`).value)
  };
}

function showEnergyStep(stepName) {
  Object.entries(energySteps).forEach(([name, step]) => {
    step.hidden = name !== stepName;
  });
  energySteps[stepName]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getEnergyFocus(beforeRatings) {
  return ['energy', 'body', 'mind'].reduce((lowestFocus, focus) =>
    beforeRatings[focus] < beforeRatings[lowestFocus] ? focus : lowestFocus
  );
}

function getEnergyFoundationsForImpulse(impulseId) {
  const foundationIds = icsContentLinks.energyImpulses[impulseId]?.foundations;
  if (!foundationIds) return [];

  return foundationIds
    .map((foundationId) => icsContentLinks.energyFoundations
      .find(({ id }) => id === foundationId))
    .filter(Boolean)
    .sort((first, second) => first.order - second.order);
}

function getEnergyImpulse(beforeRatings, duration) {
const focus =
  energyJourneyState.routerFocus ||
  getEnergyFocus(beforeRatings);
  const impulse = Object.values(icsContentLinks.energyImpulses)
    .find((item) => item.focus === focus && item.duration === duration);
  if (!impulse) return null;

  return {
    ...impulse,
    linkedRecommendation: getBestIcsRecommendation(
      impulse.sourceContentId,
      ['tagesimpuls', 'mentor']
    )
  };
}

document.querySelectorAll('.energy-ratings input').forEach((range) => {
  range.addEventListener('input', () => {
    const output = range.closest('label')?.querySelector('output');
    if (output) output.value = range.value;
  });
});

document.querySelectorAll('[data-energy-duration]').forEach((button) => {
  button.addEventListener('click', () => {
    energyJourneyState.duration = Number(button.dataset.energyDuration);
    document.querySelectorAll('[data-energy-duration]').forEach((choice) => {
      const selected = choice === button;
      choice.classList.toggle('active', selected);
      choice.setAttribute('aria-pressed', String(selected));
    });
  });
});

document.getElementById('startEnergyImpulse')?.addEventListener('click', () => {
  const beforeRatings = readEnergyRatings('before');
  const impulse = getEnergyImpulse(beforeRatings, energyJourneyState.duration);
  if (!impulse) return;

  energyJourneyState.before = beforeRatings;
  energyJourneyState.impulseId = impulse.id;
  energyJourneyState.linkedRecommendation = impulse.linkedRecommendation;
if (energyJourneyState.linkedRecommendation) {

  if (energyRecommendationTitle) {
    energyRecommendationTitle.textContent =
      energyJourneyState.linkedRecommendation.title;
  }

  if (energyRecommendation) {
    energyRecommendation.hidden = false;
  }

} else {

  if (energyRecommendation) {
    energyRecommendation.hidden = true;
  }

}
  
  document.getElementById('energyImpulseId').textContent = `ENERGIE-IMPULS · ${impulse.id}`;
  document.getElementById('energyImpulseTitle').textContent = impulse.title;
  document.getElementById('energyImpulseText').textContent = impulse.instruction;
  document.getElementById('energyImpulseDuration').textContent = `${impulse.duration} ${impulse.duration === 1 ? 'Minute' : 'Minuten'}`;

  document.getElementById('energyImpulseFoundations').textContent =
    getEnergyFoundationsForImpulse(impulse.id)
      .map(({ title }) => title)
      .join(' · ');

const recommendationButton =
  document.getElementById('energyRecommendationButton');

if (recommendationButton) {
  recommendationButton.onclick = openEnergyRecommendation;
}
  
  showEnergyStep('impulse');
});

function openEnergyRecommendation() {
  const recommendation = energyJourneyState.linkedRecommendation;
  if (!recommendation) return;

  returnToEnergyAfterRecommendation = true;

  if (backFromNeueWahrheitDetail) {
  backFromNeueWahrheitDetail.textContent = '← Zurück zu ICS Energie';
}

  if (recommendation.targetType === 'truth') {
    const truth = newTruths.find(({ id }) => id === recommendation.targetId);

    if (truth) {
      openNewTruthDetail(truth);
    }

    return;
  }

  if (recommendation.targetView) {
    openView(recommendation.targetView);
  }
}

document.getElementById('finishEnergyImpulse')?.addEventListener('click', () => {
  const values = energyJourneyState.before;
  [['energyAfter', values.energy], ['bodyAfter', values.body], ['mindAfter', values.mind]]
    .forEach(([id, value]) => {
      const range = document.getElementById(id);
      range.value = value;
      range.closest('label').querySelector('output').value = value;
    });
  showEnergyStep('after');
});

document.querySelectorAll('[data-energy-notice]').forEach((button) => {
  button.addEventListener('click', () => {
    energyJourneyState.noticedAt = button.dataset.energyNotice;
    document.querySelectorAll('[data-energy-notice]').forEach((choice) => {
      choice.classList.toggle('active', choice === button);
    });
    document.getElementById('completeEnergyCheck').disabled = false;
  });
});

document.getElementById('completeEnergyCheck')?.addEventListener('click', () => {

  if (energyJourneyState.completedRecordId) return;


  energyJourneyState.after = readEnergyRatings('after');
  const labels = { energy: 'Energie', body: 'Körper', mind: 'Kopf' };
  const deltas = document.getElementById('energyDeltas');
  deltas.replaceChildren();

  Object.keys(labels).forEach((key) => {
    const change = energyJourneyState.after[key] - energyJourneyState.before[key];
    const item = document.createElement('div');
    const label = document.createElement('small');
    const value = document.createElement('strong');
    label.textContent = labels[key];
    value.textContent = `${energyJourneyState.before[key]} → ${energyJourneyState.after[key]} (${change > 0 ? '+' : ''}${change})`;
    item.append(label, value);
    deltas.append(item);
  });

  document.getElementById('energyNoticeResult').textContent =
    `Zuerst bemerkt: ${energyJourneyState.noticedAt}`;

const record = createEnergyCheckRecord();

if (record && energyJourneyState.mentorState) {
  record.mentorState = energyJourneyState.mentorState;
  record.source = 'mentor';
}

if (record && saveEnergyCheck(record)) {
  energyJourneyState.completedRecordId = record.id;
  renderEnergyHistory();

if (energyDeepening) {
energyDeepening.hidden =
  selectedIcsState === 'erschoepft' ||
  selectedIcsState === 'energielos';
}

if (energyRecoveryNextStep) {
  energyRecoveryNextStep.hidden =
    selectedIcsState !== 'erschoepft' &&
    selectedIcsState !== 'energielos';
}

}
  
showEnergyStep('result');
});

function renderFullEnergyHistory() {
  const container = document.getElementById('energyHistoryFullList');
  if (!container) return;

  const history = getEnergyHistory();

  if (!history.length) {
    container.innerHTML =
      '<p class="empty-state">Noch keine gespeicherten Energie-Checks.</p>';
    return;
  }

  const labels = {
    energy: 'Energie',
    body: 'Körper',
    mind: 'Kopf'
  };

  container.innerHTML = history
    .map((record) => {
      const date = new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(record.createdAt));

      const values = Object.keys(labels)
        .map((key) => {
          const change = record.delta[key];
          const sign = change > 0 ? '+' : '';

          return `
            <div class="energy-history-value">
              <small>${labels[key]}</small>
              <strong>
                ${record.before[key]} → ${record.after[key]}
                (${sign}${change})
              </strong>
            </div>
          `;
        })
        .join('');

      return `
        <article class="energy-history-item">
          <small class="energy-history-date">${date}</small>

          <div class="energy-history-values">
            ${values}
          </div>

          <p><strong>Impuls:</strong> ${record.impulseTitle}</p>
          <p><strong>Zuerst bemerkt:</strong> ${record.noticedAt}</p>
        </article>
      `;
    })
    .join('');
}
                                                                 
function resetEnergyJourney() {
  energyJourneyState.impulseId = null;
  energyJourneyState.before = {};
  energyJourneyState.after = {};
  energyJourneyState.noticedAt = null;
  energyJourneyState.linkedRecommendation = null;
  
  if (energyRecommendation) {
  energyRecommendation.hidden = true;
}

if (energyRecommendationTitle) {
  energyRecommendationTitle.textContent = '';
}
  energyJourneyState.completedRecordId = null;

  document.querySelectorAll('[data-energy-notice]').forEach((choice) => choice.classList.remove('active'));
  document.getElementById('completeEnergyCheck').disabled = true;
  showEnergyStep('check');
}

repeatEnergyRecommendation?.addEventListener('click', () => {
  const impulseId = repeatEnergyRecommendation.dataset.impulseId;
  if (!impulseId) return;

  const impulse = icsContentLinks.energyImpulses[impulseId];
  if (!impulse) return;

  resetEnergyJourney();

  energyJourneyState.duration = impulse.duration;

  document.querySelectorAll('[data-energy-duration]').forEach((button) => {
    const selected =
      Number(button.dataset.energyDuration) === impulse.duration;

    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });

  showEnergyStep('check');
});

openFuehreMich?.addEventListener('click', () => {
  openView('fuehremich');
});

backFromFuehreMich?.addEventListener('click', () => {
  openView('welten');
});

openWaehleMeinenWeg?.addEventListener('click', () => {
  openView('waehlemeinenweg');
});

backFromWaehleMeinenWeg?.addEventListener('click', () => {
  openView('welten');
});

document.querySelectorAll('.choose-path').forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.pathTarget;

    if (!target) return;

    if (target === 'icsenergy') {
      openView('icsenergy');
      resetEnergyJourney();
      renderEnergyHistory();
      return;
    }

    openView(target);
  });
});

// ---------------------------------------------------------
// INNER CODE HUB
// ---------------------------------------------------------

innerToImpulse?.addEventListener('click', () => {
  openView('innerimpulse');
});

innerToTruth?.addEventListener('click', () => {
  openView('neuewahrheit');
});

innerTo99Codes?.addEventListener('click', () => {
  sessionStorage.setItem('ICS_RETURN_VIEW', 'innercode');
  window.location.href = './99-inner-codes.html';
});

innerToBeliefs?.addEventListener('click', () => {
  openView('beliefs');
});

backFromBeliefs?.addEventListener('click', () => {
  openView('innercode');
});

function detectBeliefPattern(belief) {
  const text = belief
    .toLowerCase()
    .trim()
    .replace(/[.!?]+$/g, '');

const patterns = [
  {
    id: 'permission',
    label: 'Erlaubnis & Begrenzung',
    matches: [
      /^ich darf nicht\b/,
      /^ich darf kein(?:e|en|em|er)?\b/,
      /^ich darf mir nicht\b/,
      /^ich darf mir kein(?:e|en|em|er)?\b/,
      /darf ich nicht/,
      /darf mir keine/,
      /darf mir keinen/
    ],
    title: 'Wer hat diese Grenze gesetzt?',
    reflection:
      'Ist diese Grenze heute wirklich noch notwendig? Was würdest du dir erlauben, wenn du niemandem etwas beweisen müsstest?',
    perspective:
      'Ich darf neu entscheiden, was für mich heute möglich und stimmig ist.'
  },

  {
    id: 'perfectionism',
    label: 'Perfektionismus',
    matches: [
      /perfekt/,
      /keine fehler/,
      /keinen fehler/,
      /alles richtig machen/,
      /nichts falsch machen/,
      /darf nichts falsch/
    ],
    title: 'Was wäre, wenn gut genug wirklich genug wäre?',
    reflection:
      'Was versuchst du durch Perfektion zu vermeiden? Was wäre in dieser Situation ein menschlicher und realistischer Maßstab?',
    perspective:
      'Ich darf lernen, ausprobieren und Fehler machen, ohne dadurch weniger wert zu sein.'
  },

  {
    id: 'worth',
    label: 'Selbstwert',
    matches: [
      /nicht gut genug/,
      /nicht liebenswert/,
      /nicht wertvoll/,
      /wertlos/,
      /mich beweisen/,
      /beweisen müssen/,
      /anerkennung/,
      /niemand braucht mich/
    ],
    title: 'Wovon machst du deinen Wert abhängig?',
    reflection:
      'Was müsste geschehen, damit du dich wertvoll fühlst? Und was verändert sich, wenn dein Wert nicht erst verdient werden müsste?',
    perspective:
      'Mein Wert beginnt nicht bei Leistung, Perfektion oder Bestätigung von außen.'
  },

  {
    id: 'control',
    label: 'Kontrolle',
    matches: [
      /unter kontrolle/,
      /kontrollieren/,
      /alles im griff/,
      /nichts darf passieren/,
      /muss alles wissen/,
      /sicherheit haben/
    ],
    title: 'Was möchtest du gerade unbedingt kontrollieren?',
    reflection:
      'Was liegt tatsächlich in deinem Einfluss – und was versuchst du festzuhalten, obwohl du es nicht vollständig kontrollieren kannst?',
    perspective:
      'Ich darf Verantwortung übernehmen, ohne alles kontrollieren zu müssen.'
  },

  {
    id: 'identity',
    label: 'Selbstbild',
    matches: [
      /^ich bin nicht\b/,
      /ich bin zu/,
      /so bin ich eben/,
      /ich bin falsch/,
      /ich bin schwach/
    ],
    title: 'Ist das wirklich deine Identität?',
    reflection:
      'Beschreibst du hier wirklich dich – oder eine Bewertung über dich? Welche Erfahrungen sprechen vielleicht bereits gegen diesen Satz?',
    perspective:
      'Ich bin mehr als die Bewertung, die ich über mich gelernt habe.'
  },

  {
    id: 'possibility',
    label: 'Möglichkeit',
    matches: [
      /^ich kann nicht\b/,
      /^ich kann das nicht\b/,
      /^ich kann es nicht\b/,
      /das schaffe ich nicht/,
      /das geht nicht/,
      /das werde ich nie schaffen/
    ],
    title: 'Kannst du es nicht – oder noch nicht?',
    reflection:
      'Was genau erscheint dir unmöglich? Welcher kleinste Teil davon wäre vielleicht heute schon möglich?',
    perspective:
      'Ich muss noch nicht den ganzen Weg können. Ich darf mit dem beginnen, was heute möglich ist.'
  },

  {
    id: 'pressure',
    label: 'Innerer Druck',
    matches: [
      /^ich muss\b/,
      /^ich sollte\b/,
      /immer funktionieren/,
      /alles schaffen/,
      /für alle da sein/,
      /stark sein/
    ],
    title: 'Woher kommt dieses Müssen?',
    reflection:
      'Was glaubst du, würde passieren, wenn du diesem inneren Druck nicht folgen würdest? Welche Erwartung steckt möglicherweise dahinter?',
    perspective:
      'Ich darf prüfen, was ich wirklich will – statt nur dem inneren Müssen zu folgen.'
  }
];

  const match = patterns.find((pattern) =>
    pattern.matches.some((rule) => rule.test(text))
  );

  return match || {
    id: 'general',
    label: 'Allgemeiner Glaubenssatz',
    title: 'Schau einen Moment genauer hin',
    reflection:
      'Ist dieser Gedanke wirklich immer wahr – oder ist er eine Sichtweise, die du irgendwann entwickelt oder übernommen hast?',
    perspective:
      'Ich darf diesen Gedanken hinterfragen und eine neue Perspektive wählen.'
  };
}

let currentBeliefResult = null;

analyzeBelief?.addEventListener('click', () => {
  const belief = beliefInput?.value.trim();

  if (!belief) {
    showToast('Schreib zuerst einen Gedanken oder Glaubenssatz auf.');
    return;
  }

  const result = detectBeliefPattern(belief);

  currentBeliefResult = {
    belief,
    patternId: result.id,
    patternLabel: result.label,
    reflection: result.reflection,
    perspective: result.perspective
  };

  if (beliefResultTitle) {
    beliefResultTitle.textContent = result.title;
  }

  if (beliefResultText) {
    beliefResultText.textContent =
      `Du hast geschrieben: „${belief}“ ${result.reflection}`;
  }

  if (beliefNewPerspective) {
    beliefNewPerspective.textContent = result.perspective;
  }

  if (beliefResultCard) {
    beliefResultCard.dataset.pattern = result.id;
    beliefResultCard.hidden = false;

    beliefResultCard.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  if (beliefSaveFeedback) {
    beliefSaveFeedback.textContent = '';
  }
});

saveBeliefResult?.addEventListener('click', () => {
  if (!currentBeliefResult) return;

  const beliefHistory = getBeliefHistory();

  const beliefRecord = {
    id: globalThis.crypto?.randomUUID?.() || `BELIEF_${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...currentBeliefResult
  };

  beliefHistory.unshift(beliefRecord);
  saveBeliefHistory(beliefHistory);

  if (beliefSaveFeedback) {
    beliefSaveFeedback.textContent =
      'Deine Erkenntnis wurde gespeichert. ✓';
  }

  const beliefDesignMode =
    document.getElementById('beliefDesignMode');

  if (beliefDesignMode) {
    beliefDesignMode.hidden = false;
  }
});

saveBeliefDesignChoice?.addEventListener('click', () => {
  const newChoice = beliefDesignInput?.value.trim();

  if (!newChoice) return;

  const beliefHistory = getBeliefHistory();
  const latestBelief = beliefHistory[0];

  if (!latestBelief) return;

  latestBelief.designChoice = newChoice;

  saveBeliefHistory(beliefHistory);
  
  saveBeliefDesignChoice.textContent = 'Neue Wahl gespeichert ✓';
  saveBeliefDesignChoice.disabled = true;

if (beliefActionStep) {
  beliefActionStep.hidden = false;
}
});

saveBeliefActionStep?.addEventListener('click', () => {
  const actionStep = beliefActionInput?.value.trim();

  if (!actionStep) return;

  const beliefHistory = getBeliefHistory();
  const latestBelief = beliefHistory[0];

  if (!latestBelief) return;

  latestBelief.actionStep = actionStep;

  saveBeliefHistory(beliefHistory);

  saveBeliefActionStep.textContent = 'Nächster Schritt gespeichert ✓';
  saveBeliefActionStep.disabled = true;

if (beliefNextStepRecommendation) {
  beliefNextStepRecommendation.hidden = false;
}
});

backFromInnerCode?.addEventListener('click', () => {
  openView('waehlemeinenweg');
});

const innerBackToToday = document.getElementById('innerBackToToday');

innerBackToToday?.addEventListener('click', () => {
  openView('heute');
});

// ---------------------------------------------------------
// BODY CODE HUB
// ---------------------------------------------------------

bodyToImpulse?.addEventListener('click', () => {
  openView('bodyimpulse');
});

bodyToKoerpersignale?.addEventListener('click', () => {
  openView('koerpersignale');
});

backFromKoerpersignale?.addEventListener('click', () => {
  openView('nachschlagewerk', false);
});

koerpersignaleToBodyCode?.addEventListener('click', () => {
  openView('bodycode', false);
});

bodySignalNextStepAction?.addEventListener('click', () => {
  openView('bodycode');
});

bodyToPerception?.addEventListener('click', () => {
  openView('koerperwahrnehmen');
});

bodyToEnergy?.addEventListener('click', () => {
  openView('icsenergy');
  resetEnergyJourney();
  renderEnergyHistory();
});

backFromBodyCode?.addEventListener('click', () => {
  openView('waehlemeinenweg');
});

bodyBackToToday?.addEventListener('click', () => {
  openView('heute');
});

// ---------------------------------------------------------
// ACTION CODE HUB
// ---------------------------------------------------------

actionToImpulse?.addEventListener('click', () => {
  openView('actionimpulse');
});

actionToFocus?.addEventListener('click', () => {
  openView('actionnext');
});

actionToSteps?.addEventListener('click', () => {
  renderActionSteps();
  openView('actionsteps');
});

backFromActionSteps?.addEventListener('click', () => {
  goBackView('actioncode');
});

backFromActionNext?.addEventListener('click', () => {
  goBackView('actioncode');
});

actionToGegenpol?.addEventListener('click', () => {
  window.location.href =
    'https://innercodesystems.github.io/ics-auswertungstool/ics-gegenpol-generator.html';
});

actionToGegenpol?.addEventListener('click', () => {
  openView('gegenpol');
});

actionBackToToday?.addEventListener('click', () => {
  openView('heute');
});

// ---------------------------------------------------------
// RESET HUB
// ---------------------------------------------------------

resetToImpulse?.addEventListener('click', () => {
  openView('resetimpulse');
});

backFromResetCode?.addEventListener('click', () => {
  openView('waehlemeinenweg');
});

resetBackToToday?.addEventListener('click', () => {
  openView('heute');
});

resetToBibliothek?.addEventListener('click', () => {
  openView('resetbibliothek');
});

resetToMeditation?.addEventListener('click', () => {
  openView('resetmeditation');
});

backFromActionCode?.addEventListener('click', () => {
  openView('waehlemeinenweg');
});

const guideRecommendation =
  document.getElementById('guideRecommendation');

const guideRecommendationTitle =
  document.getElementById('guideRecommendationTitle');

const guideLastExperience =
  document.getElementById('guideLastExperience');

const guideEnergyPattern =
  document.getElementById('guideEnergyPattern');

const guideEnergyPatternText =
  document.getElementById('guideEnergyPatternText');

const guideLastExperienceTitle =
  document.getElementById('guideLastExperienceTitle');

const guideLastExperienceResult =
  document.getElementById('guideLastExperienceResult');

const guideLastExperienceNotice =
  document.getElementById('guideLastExperienceNotice');

const guideRecommendationText =
  document.getElementById('guideRecommendationText');

const guideRecommendationArea =
  document.getElementById('guideRecommendationArea');

const startGuideRecommendation =
  document.getElementById('startGuideRecommendation');

let selectedGuideTarget = null;

const guideRecommendations = {
  energy: {
    title: 'Deine Energie braucht gerade Aufmerksamkeit.',
    text: 'Du musst gerade nicht mehr leisten. Nimm zuerst wahr, wie es dir wirklich geht und welcher kleine Schritt jetzt möglich ist.',
    area: 'ICS Energie',
    target: 'icsenergy'
  },

body: {
  title: 'Dein Körper möchte gerade wahrgenommen werden.',
  text: 'Schau zuerst hin, was dein Körper dir gerade zeigt. Im Körpersignale-Nachschlagewerk kannst du dein aktuelles Signal auswählen und bewusst reflektieren.',
  area: 'ICS Körpersignale',
  target: 'koerpersignale'
},
  
  mind: {
    title: 'Dein Kopf braucht gerade etwas Abstand.',
    text: 'Du brauchst nicht noch mehr Gedanken. Richte deine Aufmerksamkeit zuerst auf Klarheit und eine neue Perspektive.',
    area: 'Inner Code · Klarheit',
    target: 'innerimpulse'
  },

  pressure: {
    title: 'Du darfst den inneren Druck unterbrechen.',
    text: 'Bevor du weiter versuchst, etwas zu lösen, darfst du dich neu ausrichten und aus der automatischen Reaktion aussteigen.',
    area: 'RESET · Neuausrichtung',
    target: 'resetimpulse'
  },

  orientation: {
    title: 'Du brauchst gerade nicht den ganzen Weg.',
    text: 'Richte deine Aufmerksamkeit auf einen einzigen nächsten Schritt. Klarheit entsteht oft erst durch Bewegung.',
    area: 'Action Code · nächster Schritt',
    target: 'actionimpulse'
  },

  impulse: {
    title: 'Lass dich für einen Moment inspirieren.',
    text: 'Du musst gerade nichts analysieren. Ein passender Gedanke kann genügen, um deine Aufmerksamkeit neu auszurichten.',
    area: 'ICS Impulse',
    target: 'impulse'
  }
};

document.querySelectorAll('.guide-choice').forEach((button) => {
  button.addEventListener('click', () => {
    const state = button.dataset.guideState;
    const recommendation = guideRecommendations[state];

    if (!recommendation) return;

    document.querySelectorAll('.guide-choice').forEach((choice) => {
  choice.classList.toggle('active', choice === button);
});

    selectedGuideTarget = recommendation.target;

    guideRecommendationTitle.textContent =
      recommendation.title;

    guideRecommendationText.textContent =
      recommendation.text;

    guideRecommendationArea.textContent =
      recommendation.area;

    if (guideLastExperience) {
  guideLastExperience.hidden = true;
}

if (state === 'energy') {
  const experience = getLatestMentorEnergyExperience();

  if (experience && guideLastExperience) {
    guideLastExperienceTitle.textContent =
      experience.impulseTitle;

    guideLastExperienceResult.textContent =
      `Energie: ${experience.before.energy} → ${experience.after.energy}`;

    guideLastExperienceNotice.textContent =
      `Zuerst bemerkt: ${experience.noticedAt}`;

    guideLastExperience.hidden = false;
  }
}

    if (guideEnergyPattern) {
  guideEnergyPattern.hidden = true;
}

if (state === 'energy') {
  const pattern = getMentorEnergyPattern();

  if (pattern && guideEnergyPattern) {
    const average =
      pattern.averageEnergyChange.toFixed(1);

    guideEnergyPatternText.textContent =
      `In ${pattern.count} bisherigen Erfahrungen hat sich deine Energie durchschnittlich um ${average > 0 ? '+' : ''}${average} Punkte verändert.`;

    guideEnergyPattern.hidden = false;
  }
}

    guideRecommendation.hidden = false;

    guideRecommendation.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

startGuideRecommendation?.addEventListener('click', () => {
  if (!selectedGuideTarget) return;

  const selectedState =
    document.querySelector('.guide-choice.active')?.dataset.guideState || '';

  const recommendation =
    guideRecommendations[selectedState];

  if (recommendation) {
    saveMentorChoice({
      id:
        globalThis.crypto?.randomUUID?.() ||
        `MENTOR_${Date.now()}`,

      createdAt: new Date().toISOString(),

      state: selectedState,
      title: recommendation.title,
      area: recommendation.area,
      target: recommendation.target
    });
  }

if (selectedGuideTarget === 'icsenergy') {
  resetEnergyJourney();
  energyJourneyState.mentorState = 'energy';

  openView('icsenergy');
  renderEnergyHistory();
  return;
}

  openView(selectedGuideTarget);
});

document.getElementById('restartEnergyCheck')?.addEventListener('click', resetEnergyJourney);
openIcsEnergy?.addEventListener('click', () => {
  openView('icsenergy');
  resetEnergyJourney();

const energyDurationChoice =
  document.getElementById('energyDurationChoice');

if (energyDurationChoice) {
  energyDurationChoice.hidden = false;
}
  
  renderEnergyHistory();
});

openEnergyHistory?.addEventListener('click', () => {
  renderFullEnergyHistory();
  openView('energyhistory');
});

backFromEnergyHistory?.addEventListener('click', () => {
  openView('icsenergy');
  renderEnergyHistory();
});

backFromIcsEnergy?.addEventListener('click', () => {
  goBackView('welten');
});
