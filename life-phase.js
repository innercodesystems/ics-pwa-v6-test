// =========================================================
// ICS LEBENSPHASE · AUSFÜHRLICHE AUSWERTUNG
// Behält Eingabe + Button nach jeder Auswertung sichtbar.
// =========================================================

(() => {
  const BIRTHDATE_KEY = 'ICS_USER_BIRTHDATE';

  const yearProfiles = {
    1: {
      title: 'Neu ausrichten',
      focus: 'Orientierung · Loslassen · neue Richtung',
      text: 'Das erste Jahr eines neuen 7-Jahres-Zyklus steht im ICS-Modell für Übergang und Neuausrichtung. Altes darf überprüft werden, während eine neue Richtung erst sichtbar wird.',
      impulse: 'Du musst noch nicht alles wissen. Entscheidend ist, wahrzunehmen, was nicht mehr zu deiner nächsten Lebensphase gehört.'
    },
    2: {
      title: 'Fundament und innere Ausrichtung',
      focus: 'Stabilisieren · wählen · verkörpern',
      text: 'Im zweiten Jahr geht es im ICS-Modell weniger um einen spektakulären Neustart als darum, die neue Richtung tragfähig zu machen. Was im Übergang sichtbar wurde, möchte jetzt im Alltag verankert werden.',
      impulse: 'Prüfe nicht nur, was du erreichen willst. Prüfe, welche Entscheidungen, Beziehungen, Räume und Gewohnheiten deine neue Richtung wirklich tragen.'
    },
    3: {
      title: 'Ausdruck und Bewegung',
      focus: 'Sichtbar werden · ausprobieren · handeln',
      text: 'Das dritte Jahr lädt dazu ein, die innere Ausrichtung stärker nach außen zu bringen. Erfahrungen werden wichtiger als weiteres gedankliches Vorbereiten.',
      impulse: 'Wo weißt du bereits genug und könntest beginnen, deine Richtung konkreter zu leben?'
    },
    4: {
      title: 'Vertiefen und ordnen',
      focus: 'Struktur · Standards · Verbindlichkeit',
      text: 'In der Mitte des Zyklus wird sichtbar, was Substanz hat. Jetzt geht es darum, Strukturen zu schaffen, die Entwicklung nicht nur ermöglichen, sondern dauerhaft tragen.',
      impulse: 'Welche Standards brauchst du, damit das Wichtige nicht immer wieder vom Dringenden verdrängt wird?'
    },
    5: {
      title: 'Erweitern und korrigieren',
      focus: 'Entwicklung · Kurskorrektur · neue Möglichkeiten',
      text: 'Das fünfte Jahr kann zeigen, wo Wachstum entstanden ist und wo eine Korrektur sinnvoll wird. Nicht jede frühere Entscheidung muss unverändert weitergeführt werden.',
      impulse: 'Was darf größer werden – und wo wäre eine bewusste Kurskorrektur stimmiger als bloßes Durchhalten?'
    },
    6: {
      title: 'Ernten und integrieren',
      focus: 'Wirkung · Verbindung · Integration',
      text: 'Im sechsten Jahr rückt stärker in den Blick, was aus den vergangenen Jahren tatsächlich entstanden ist. Erfahrungen wollen verbunden und Erkenntnisse in das eigene Leben integriert werden.',
      impulse: 'Was ist heute Teil von dir, das zu Beginn dieses Zyklus noch nicht selbstverständlich war?'
    },
    7: {
      title: 'Vollenden und freigeben',
      focus: 'Bilanz · Abschluss · Vorbereitung',
      text: 'Das siebte Jahr bildet im ICS-Modell den Abschluss des Zyklus. Es geht nicht darum, alles fertig zu haben, sondern klarer zu erkennen, was mit in die nächste Phase gehört und was abgeschlossen werden darf.',
      impulse: 'Was möchtest du bewusst vollenden, würdigen oder loslassen, bevor der nächste Zyklus beginnt?'
    }
  };

  function calculateCycle(value) {
    if (!value) return null;

    const [year, month, day] = value.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    if (Number.isNaN(birthDate.getTime())) return null;

    let age = today.getFullYear() - birthDate.getFullYear();
    const birthday = new Date(today.getFullYear(), month - 1, day);

    if (today < birthday) age -= 1;
    if (age < 0) return null;

    const cycleStart = Math.floor(age / 7) * 7;
    const cycleEnd = cycleStart + 7;
    const yearInCycle = age - cycleStart + 1;

    return { age, cycleStart, cycleEnd, yearInCycle };
  }

  function birthDateControls(value) {
    return `
      <div class="ics-birthdate-input" style="margin-top:20px;">
        <label for="icsBirthDate">Geburtsdatum</label>
        <input type="date" id="icsBirthDate" value="${value || ''}">
        <button type="button" class="gold-button" id="saveIcsBirthDate">
          Lebensphase anzeigen
        </button>
      </div>
    `;
  }

  function renderLifePhase(value) {
    const target = document.getElementById('icsLifeCycleOverview');
    const cycle = calculateCycle(value);

    if (!target || !cycle) return;

    const profile = yearProfiles[cycle.yearInCycle] || yearProfiles[1];

    target.innerHTML = `
      <div style="padding-top:4px;">
        <small style="color:#b8924f; letter-spacing:.10em; text-transform:uppercase;">
          Deine aktuelle Lebensphase
        </small>

        <h3 style="margin:10px 0 4px; color:#f6f1e7; font-size:1.35rem;">
          ${cycle.cycleStart}–${cycle.cycleEnd} Jahre · Jahr ${cycle.yearInCycle} deines Zyklus
        </h3>

        <p style="margin:8px 0 0; color:#b8924f;">
          <strong>${profile.title}</strong>
        </p>

        <p style="margin:5px 0 0; opacity:.76;">
          ${profile.focus}
        </p>

        <div style="margin-top:20px; padding-top:18px; border-top:1px solid rgba(184,146,79,.28);">
          <small style="color:#b8924f; letter-spacing:.08em;">WORUM ES IN DIESER PHASE GEHEN KANN</small>
          <p style="margin:10px 0 0; line-height:1.6;">${profile.text}</p>
        </div>

        <div style="margin-top:18px; padding:16px 18px; border-left:2px solid #b8924f; background:rgba(184,146,79,.05);">
          <small style="color:#b8924f; letter-spacing:.08em;">ICS IMPULS</small>
          <p style="margin:9px 0 0; line-height:1.55;"><strong>${profile.impulse}</strong></p>
        </div>

        <div style="margin-top:18px; padding-top:18px; border-top:1px solid rgba(184,146,79,.20);">
          <small style="color:#b8924f; letter-spacing:.08em;">DEINE REFLEXION</small>
          <p style="margin:10px 0 0;">Was möchte in dieser Lebensphase weniger werden?</p>
          <p style="margin:7px 0 0;">Was möchte stärker gelebt werden?</p>
          <p style="margin:7px 0 0;">Welche Entscheidung würde deine nächste Entwicklungsstufe unterstützen?</p>
        </div>

        <p style="margin:18px 0 0; font-size:.82rem; opacity:.58; line-height:1.45;">
          Die 7-Jahres-Zyklen sind ein ICS-Reflexionsmodell zur persönlichen Orientierung – keine wissenschaftliche Prognose oder festgelegte Lebensdeutung.
        </p>

        ${birthDateControls(value)}
      </div>
    `;
  }

  // Den Wert sichern, dann die bestehende Kurz-Auswertung in app-core.js
  // vollständig auslaufen lassen. Anschließend rendert ICS zuverlässig
  // die ausführliche Auswertung inklusive Eingabe und Button neu.
  document.addEventListener('click', (event) => {
    const button = event.target.closest('#saveIcsBirthDate');
    if (!button) return;

    const input = document.getElementById('icsBirthDate');
    const value = input?.value || '';
    if (!value) return;

    localStorage.setItem(BIRTHDATE_KEY, value);
    window.setTimeout(() => renderLifePhase(value), 20);
  }, true);

  const timer = window.setInterval(() => {
    const input = document.getElementById('icsBirthDate');
    const target = document.getElementById('icsLifeCycleOverview');

    if (!target) return;

    const saved = localStorage.getItem(BIRTHDATE_KEY);

    if (!input && saved) {
      target.innerHTML = `
        <small>Deine aktuelle Lebensphase erscheint hier.</small>
        ${birthDateControls(saved)}
      `;
    } else if (input && saved && !input.value) {
      input.value = saved;
    }

    window.clearInterval(timer);
  }, 250);

  window.setTimeout(() => window.clearInterval(timer), 15000);
})();
