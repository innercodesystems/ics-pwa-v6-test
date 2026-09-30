// =========================================================
// ICS · MEIN ICS COCKPIT
// Ruhige Startzentrale: Überblick zuerst, Details erst nach Klick.
// Lebensphase und aktueller Zustand sind getrennte Detailansichten.
// =========================================================
(() => {
  const GOLD = '#b8924f';
  const CREAM = '#f6f1e7';

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }

  function readText(id, fallback = '') {
    const node = document.getElementById(id);
    const text = node?.innerText?.replace(/\s+/g, ' ').trim();
    return text || fallback;
  }

  function compact(value, max = 92) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    return text.length > max ? `${text.slice(0, max - 1).trim()}…` : text;
  }

  function getLifePhaseSummary() {
    const node = document.getElementById('icsLifeCycleOverview');
    if (!node) return { title: 'Lebensphase', text: 'Deine aktuelle Orientierung ansehen.' };
    const headings = [...node.querySelectorAll('h3, strong')].map(el => el.textContent.trim()).filter(Boolean);
    return { title: headings[0] || 'Aktuelle Lebensphase', text: headings[1] || 'Deine aktuelle Orientierung ansehen.' };
  }

  function getTriggerSummary() {
    const node = document.getElementById('icsLatestTrigger');
    if (!node) return { title: 'Trigger & Muster', text: 'Deine Erkenntnisse ansehen.' };
    const heading = node.querySelector('h3, strong');
    const paragraphs = [...node.querySelectorAll('p')].map(p => p.textContent.trim()).filter(Boolean);
    return { title: heading?.textContent?.trim() || 'Trigger & Muster', text: paragraphs[0] || 'Deine Erkenntnisse ansehen.' };
  }

  function getActionSummary() {
    const node = document.getElementById('icsLatestActionIntegration');
    if (!node) return { title: 'Dein nächster Schritt', text: 'ACTION öffnen und bewusst handeln.' };
    const heading = node.querySelector('h3, strong');
    const paragraphs = [...node.querySelectorAll('p')].map(p => p.textContent.trim()).filter(Boolean);
    return { title: heading?.textContent?.trim() || 'Handlung & Integration', text: paragraphs[0] || 'Deine Umsetzung und Integration ansehen.' };
  }

  function card(icon, label, title, text, detail) {
    return `<button type="button" data-ics-detail="${detail}" style="width:100%;text-align:left;cursor:pointer;border:1px solid rgba(184,146,79,.34);border-radius:16px;background:rgba(184,146,79,.035);padding:16px;color:${CREAM};font:inherit;">
      <div style="display:flex;gap:12px;align-items:flex-start;">
        <span aria-hidden="true" style="width:34px;height:34px;flex:0 0 34px;border-radius:50%;display:grid;place-items:center;background:rgba(184,146,79,.15);color:${GOLD};font-size:1.05rem;">${icon}</span>
        <span style="min-width:0;display:block;">
          <small style="display:block;color:${GOLD};letter-spacing:.08em;text-transform:uppercase;">${label}</small>
          <strong style="display:block;margin-top:5px;color:${CREAM};font-size:1.02rem;line-height:1.25;">${escapeHtml(compact(title, 54))}</strong>
          <span style="display:block;margin-top:6px;opacity:.68;font-size:.88rem;line-height:1.4;">${escapeHtml(compact(text, 86))}</span>
          <span style="display:block;margin-top:11px;color:${GOLD};font-size:.86rem;font-weight:700;">Öffnen →</span>
        </span>
      </div>
    </button>`;
  }

  function setOverviewOnlyMode(isDetail) {
    const overview = document.getElementById('icsPersonalOverview');
    const originalTitle = overview?.querySelector(':scope > strong');
    if (originalTitle) {
      originalTitle.hidden = true;
      originalTitle.style.display = 'none';
    }

    document.querySelectorAll('#view-meinics > .tool-list').forEach(node => {
      node.style.display = isDetail ? 'none' : '';
    });
  }

  function createShell() {
    const overview = document.getElementById('icsPersonalOverview');
    if (!overview) return null;
    let shell = document.getElementById('icsCockpitShell');
    if (shell) return shell;

    const originalTitle = overview.querySelector(':scope > strong');
    if (originalTitle) {
      originalTitle.hidden = true;
      originalTitle.style.display = 'none';
    }

    shell = document.createElement('div');
    shell.id = 'icsCockpitShell';
    shell.innerHTML = `<div id="icsCockpitHome">
      <small style="display:block;color:${GOLD};letter-spacing:.11em;text-transform:uppercase;">DEIN PERSÖNLICHES SYSTEM</small>
      <h2 style="margin:8px 0 0;color:${CREAM};font-size:clamp(1.8rem,5vw,2.35rem);">Dein Bild im Moment</h2>
      <p style="margin:7px 0 0;opacity:.72;">Wo du gerade stehst. Was sich zeigt. Was dein nächster Schritt ist.</p>
      <div id="icsWayfinderHost" style="margin-top:22px;"></div>
      <div id="icsCockpitCards" style="margin-top:22px;"></div>
    </div><div id="icsCockpitDetail" hidden></div>`;
    overview.prepend(shell);
    return shell;
  }

  function ensureVault() {
    let vault = document.getElementById('icsCockpitVault');
    if (vault) return vault;
    vault = document.createElement('div');
    vault.id = 'icsCockpitVault';
    vault.hidden = true;
    document.body.appendChild(vault);
    return vault;
  }

  function storeExistingDetails() {
    const vault = ensureVault();
    ['icsLifeCycleOverview','icsLatestEnergy','icsLatestCloudActivity','icsLatestTrigger','icsLatestMentorInsight','icsLatestActionIntegration','icsNextStep','icsRepeatedPattern','icsDevelopmentJourney']
      .forEach(id => {
        const node = document.getElementById(id);
        if (node && node.parentElement !== vault && !node.closest('#icsCockpitDetailContent')) vault.appendChild(node);
      });
    const state = document.querySelector('#view-meinics > .ics-state-entry');
    if (state && state.parentElement !== vault && !state.closest('#icsCockpitDetailContent')) vault.appendChild(state);
  }

  function importEvaluationFromUrl() {
    try {
      const url = new URL(window.location.href);
      const payload = url.searchParams.get('icsresult');
      if (!payload) return false;
      let b64 = payload.replace(/-/g,'+').replace(/_/g,'/');
      while (b64.length % 4) b64 += '=';
      const result = JSON.parse(decodeURIComponent(escape(atob(b64))));
      if (!result || result.tool !== 'ics-auswertung') return false;
      localStorage.setItem('ics_wayfinder_result_v1', JSON.stringify(result));
      localStorage.setItem('ics_auswertung_result_v1', JSON.stringify(result));
      url.searchParams.delete('icsresult');
      window.history.replaceState({}, '', url.pathname + (url.search ? url.search : '') + url.hash);
      return true;
    } catch(e) { return false; }
  }

  function applyBodyResultToWayfinder() {
    try {
      const br=JSON.parse(localStorage.getItem('ics_body_result_v1')||'null');
      const host=document.getElementById('icsWayfinderHost');
      if(!br||!br.title||!br.change||!host) return false;
      const label={geringer:'geringer',gleich:'gleich',stärker:'stärker'}[br.change]||br.change;
      let message='Dein kleiner Schritt ist abgeschlossen. Nimm wahr, wie sich dein Körpersignal weiterentwickelt.';
      let extra='';
      if(br.change==='geringer'){
        message='Dein kleiner Schritt hat etwas verändert. Nimm wahr, wie es sich weiterentwickelt.';
      } else if(br.change==='gleich'){
        message='Es ist im Moment gleich geblieben. Du kannst weiter wahrnehmen oder einen anderen passenden Weg wählen.';
        extra='<p style="margin:12px 0 0;color:'+GOLD+';">Mögliche nächste Wege: Körperarbeit · persönliches Gespräch · später erneut prüfen.</p>';
      } else if(br.change==='stärker'){
        message='Das Signal ist stärker geworden. Nimm es ernst und entscheide bewusst, ob Ruhe, Körperarbeit, ein Gespräch oder medizinische Abklärung passend ist.';
        extra='<p style="margin:12px 0 0;color:'+GOLD+';">Bei neuen, starken, anhaltenden oder unklaren Beschwerden bitte medizinisch abklären lassen.</p>';
      }
      host.innerHTML='<section style="padding:18px;border:1px solid rgba(184,146,79,.46);border-radius:18px;background:rgba(184,146,79,.09);">'
        +'<small style="display:block;color:'+GOLD+';letter-spacing:.10em;">DEIN AKTUELLER STAND</small>'
        +'<h3 style="margin:12px 0 7px;color:'+CREAM+';font-size:1.25rem;">'+escapeHtml(br.title)+' · '+escapeHtml(label)+'</h3>'
        +'<p style="margin:0;opacity:.72;line-height:1.5;">'+escapeHtml(message)+'</p>'+extra+'</section>';
      return true;
    }catch(e){return false;}
  }
  function applyMindResultToWayfinder() {
    try {
      const mr=JSON.parse(localStorage.getItem('ics_mind_last_step_v1')||'null');
      const host=document.getElementById('icsWayfinderHost');
      if(!mr||!mr.result||!host) return false;
      const result=String(mr.result);
      let message='Du hast bewusst Abstand zu deinen Gedanken geschaffen. Nimm wahr, wie sich dein innerer Zustand weiterentwickelt.';
      if(result==='Ruhiger') message='Du hast etwas Abstand geschaffen. Lass die neue Ruhe für jetzt genügen.';
      else if(result==='Gleich') message='Es ist im Moment gleich geblieben. Du musst nichts erzwingen; nimm weiter wahr, was du brauchst.';
      else if(result==='Unruhiger') message='Es ist gerade unruhiger. Beende den Weg für jetzt bewusst und wähle später nur dann einen weiteren Schritt, wenn er dir guttut.';
      host.innerHTML='<section style="padding:18px;border:1px solid rgba(184,146,79,.46);border-radius:18px;background:rgba(184,146,79,.09);">'
        +'<small style="display:block;color:'+GOLD+';letter-spacing:.10em;">DEIN AKTUELLER STAND</small>'
        +'<h3 style="margin:12px 0 7px;color:'+CREAM+';font-size:1.25rem;">Gedanken · '+escapeHtml(result.toLowerCase())+'</h3>'
        +'<p style="margin:0;opacity:.72;line-height:1.5;">'+escapeHtml(message)+'</p></section>';
      return true;
    }catch(e){return false;}
  }


  function applyEvaluationToWayfinder() {
    try {
      const ev = JSON.parse(localStorage.getItem('ics_wayfinder_result_v1') || localStorage.getItem('ics_auswertung_result_v1') || 'null');
      const host = document.getElementById('icsWayfinderHost');
      if (!ev || !ev.completed || !host) return false;

      const survival = Number(ev.survivalMode);
      const focusRaw = String(ev.weakestCodeLabel || ev.weakestCode || '').trim();
      const focus = focusRaw || 'deinem aktuellen Schwerpunkt';
      const themes = Array.isArray(ev.themes) ? ev.themes.filter(Boolean) : [];
      const counters = Array.isArray(ev.counterfields) ? ev.counterfields.filter(Boolean) : [];

      let title = 'ACTION · ein bewusster nächster Schritt';
      let description = 'Deine Auswertung ist jetzt die Grundlage. Wähle eine kleine konkrete Handlung, die deine neue Richtung im Alltag verankert.';
      let reason = 'Deine aktuelle Auswertung zeigt den Schwerpunkt ' + focus + (Number.isFinite(survival) ? ' bei ' + survival + '% Überlebensmodus' : '') + '. Deshalb führt dich ICS jetzt von der Analyse in eine kleine bewusste Handlung.';

      if (/inner/i.test(focusRaw)) {
        title = 'INNER · Klarheit schaffen';
        description = 'Deine Auswertung zeigt, dass zuerst innere Klarheit hilfreich ist. Schau auf das stärkste Muster, bevor du handelst.';
        reason = 'Der schwächste Bereich deiner aktuellen Auswertung ist INNER. Deshalb geht es zuerst um Wahrnehmen und Verstehen statt um Aktion.';
      } else if (/body/i.test(focusRaw)) {
        title = 'BODY · regulieren und spüren';
        description = 'Deine Auswertung zeigt, dass dein Körper jetzt Vorrang hat. Nimm zuerst Druck aus dem System und komm zurück ins Spüren.';
        reason = 'Der schwächste Bereich deiner aktuellen Auswertung ist BODY. Deshalb setzt ICS zuerst bei Regulation und Körperwahrnehmung an.';
      }

      host.innerHTML = '<section style="padding:18px;border:1px solid rgba(184,146,79,.46);border-radius:18px;background:rgba(184,146,79,.09);">'
        + '<small style="display:block;color:'+GOLD+';letter-spacing:.10em;">DEIN NÄCHSTER SCHRITT · AUS DEINER AUSWERTUNG</small>'
        + '<h3 style="margin:12px 0 7px;color:'+CREAM+';font-size:1.25rem;">'+escapeHtml(title)+'</h3>'
        + '<p style="margin:0;opacity:.72;line-height:1.5;">'+escapeHtml(description)+'</p>'
        + (themes.length ? '<p style="margin:14px 0 0;"><span style="opacity:.58;">Im Blick:</span> '+themes.map(escapeHtml).join(' · ')+'</p>' : '')
        + (counters.length ? '<p style="margin:7px 0 0;"><span style="opacity:.58;">Deine Richtung:</span> <strong style="color:'+GOLD+';">'+counters.map(escapeHtml).join(' · ')+'</strong></p>' : '')
        + '<details style="margin-top:14px;"><summary style="cursor:pointer;color:'+GOLD+';font-weight:700;">Warum schlägt ICS das vor?</summary><p style="margin:9px 0 0;opacity:.7;line-height:1.5;">'+escapeHtml(reason)+'</p></details>'
        + '</section>';
      return true;
    } catch(e) { return false; }
  }

  function importCreatorCodeFromUrl() {
    try {
      const params = new URLSearchParams(location.search);
      const raw = params.get('creatorcode');
      if (!raw) return;
      const b64 = raw.replace(/-/g,'+').replace(/_/g,'/');
      const padded = b64 + '='.repeat((4 - b64.length % 4) % 4);
      const data = JSON.parse(decodeURIComponent(escape(atob(padded))));
      if (data && data.creator) {
        let list = [];
        try { list = JSON.parse(localStorage.getItem('ics_creator_codes_v1') || '[]'); } catch(e) {}
        if (!Array.isArray(list)) list = [];
        if (!list.some(x => x.creator === data.creator && x.survival === data.survival)) list.push(data);
        localStorage.setItem('ics_creator_codes_v1', JSON.stringify(list));
        localStorage.setItem('ics_creator_code_v1', JSON.stringify(data));
      }
      params.delete('creatorcode');
      const qs = params.toString();
      history.replaceState({}, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    } catch(e) {}
  }

  function importCreatorCodesFromUrl() {
    try {
      const params = new URLSearchParams(location.search);
      const raw = params.get('creatorcodes');
      if (!raw) return;
      const b64 = raw.replace(/-/g,'+').replace(/_/g,'/');
      const padded = b64 + '='.repeat((4 - b64.length % 4) % 4);
      const incoming = JSON.parse(decodeURIComponent(escape(atob(padded))));
      if (Array.isArray(incoming)) {
        const list = incoming.filter(data => data && data.creator);
        localStorage.setItem('ics_creator_codes_v1', JSON.stringify(list));
        if (list.length) localStorage.setItem('ics_creator_code_v1', JSON.stringify(list[list.length - 1]));
        else localStorage.removeItem('ics_creator_code_v1');
      }
      params.delete('creatorcodes');
      const qs=params.toString();
      history.replaceState({},'',location.pathname+(qs?'?'+qs:'')+location.hash);
    } catch(e) {}
  }

  function importBodyResultFromUrl() {
    try {
      const params = new URLSearchParams(location.search);
      const raw = params.get('bodyresult');
      if (!raw) return null;
      let b64=raw.replace(/-/g,'+').replace(/_/g,'/'); while(b64.length%4)b64+='=';
      const data=JSON.parse(decodeURIComponent(escape(atob(b64))));
      if(data && data.title && data.change) localStorage.setItem('ics_body_result_v1',JSON.stringify(data));
      params.delete('bodyresult');
      const qs=params.toString(); history.replaceState({},'',location.pathname+(qs?'?'+qs:'')+location.hash);
      return data;
    } catch(e){ return null; }
  }

  function renderHome() {
    importEvaluationFromUrl();
    importCreatorCodeFromUrl();
    importCreatorCodesFromUrl();
    const incomingBodyResult = importBodyResultFromUrl();
    const shell = createShell();
    if (!shell) return false;
    storeExistingDetails();
    setOverviewOnlyMode(false);
    if (incomingBodyResult) {
      try {
        localStorage.removeItem('ics_guide_origin_v1');
        localStorage.removeItem('ics_wayfinder_v2');
      } catch(e) {}
    }

    // Completed guide results are current state; newest result wins.
    let bodySaved=0, mindSaved=0;
    try{ bodySaved=Date.parse(JSON.parse(localStorage.getItem('ics_body_result_v1')||'null')?.savedAt||0)||0; }catch(e){}
    try{ mindSaved=Date.parse(JSON.parse(localStorage.getItem('ics_mind_last_step_v1')||'null')?.savedAt||0)||0; }catch(e){}
    const hasBodyStatus = bodySaved>=mindSaved ? applyBodyResultToWayfinder() : false;
    const hasMindStatus = mindSaved>bodySaved ? applyMindResultToWayfinder() : false;
    if (hasBodyStatus || hasMindStatus) {
      try {
        localStorage.removeItem('ics_guide_origin_v1');
        localStorage.removeItem('ics_wayfinder_v2');
      } catch(e) {}
    }

    const life = getLifePhaseSummary();
    const trigger = getTriggerSummary();
    const action = getActionSummary();
    const energy = compact(readText('icsLatestEnergy', 'Deinen aktuellen Zustand ansehen.'), 82);
    const journal = compact(readText('icsLatestCloudActivity', 'Deinen letzten Check-in ansehen.'), 82);
    const mentor = compact(readText('icsLatestMentorInsight', 'Deine letzte Mentor-Erkenntnis ansehen.'), 82);
    const developmentTitle = 'Deine persönliche Entwicklungslinie';
    const developmentText = 'Sieh, was sich auf deinem bisherigen ICS-Weg bereits bewegt und verändert hat.';
    const cards = document.getElementById('icsCockpitCards');
    if (!cards) return false;

    let mindResultHtml = '';
    try {
      const mr=JSON.parse(localStorage.getItem('ics_mind_last_step_v1')||'null');
      if(mr&&mr.result){
        const when=mr.savedAt?new Date(mr.savedAt).toLocaleString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}):'';
        mindResultHtml='<section style="margin-bottom:18px;padding:18px;border:1px solid rgba(184,146,79,.42);border-radius:18px;background:rgba(184,146,79,.06);"><small style="color:'+GOLD+';letter-spacing:.10em;">INNER · DEIN LETZTER SCHRITT</small><h3 style="margin:8px 0;color:'+CREAM+';">Gedanken loslassen</h3><p style="margin:0;opacity:.72;">Bewusst Abstand zu den Gedanken geschaffen.</p><p style="margin:8px 0 0;color:'+GOLD+';"><strong>Veränderung: '+escapeHtml(mr.result)+'</strong></p>'+(when?'<small style="display:block;margin-top:8px;opacity:.5;">'+escapeHtml(when)+'</small>':'')+'</section>';
      }
    }catch(e){}

    let bodyResultHtml = '';
    try {
      const br=JSON.parse(localStorage.getItem('ics_body_result_v1')||'null');
      if(br&&br.title){
        const changeLabel={geringer:'Geringer',gleich:'Gleich',stärker:'Stärker'}[br.change]||br.change||'';
        const when=br.savedAt?new Date(br.savedAt).toLocaleString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}):'';
        bodyResultHtml='<section style="margin-bottom:18px;padding:18px;border:1px solid rgba(184,146,79,.42);border-radius:18px;background:rgba(184,146,79,.06);"><small style="color:'+GOLD+';letter-spacing:.10em;">BODY · DEIN LETZTER SCHRITT</small><h3 style="margin:8px 0;color:'+CREAM+';">'+escapeHtml(br.title)+'</h3><p style="margin:0;opacity:.72;">Kleinen ICS-Schritt durchgeführt.</p><p style="margin:8px 0 0;color:'+GOLD+';"><strong>Veränderung: '+escapeHtml(changeLabel)+'</strong></p>'+(when?'<small style="display:block;margin-top:8px;opacity:.5;">'+escapeHtml(when)+'</small>':'')+'</section>';
      }
    }catch(e){}

    let evaluationHtml = '';
    try {
      const ev = JSON.parse(localStorage.getItem('ics_wayfinder_result_v1') || localStorage.getItem('ics_auswertung_result_v1') || 'null');
      if (ev && ev.completed) {
        const survival = Number(ev.survivalMode), creator = Number(ev.creatorMode);
        const themes = Array.isArray(ev.themes) ? ev.themes.filter(Boolean) : [];
        const counters = Array.isArray(ev.counterfields) ? ev.counterfields.filter(Boolean) : [];
        const focus = ev.weakestCodeLabel || ev.weakestCode || '';
        evaluationHtml = '<section id="icsLatestEvaluation" style="margin-bottom:24px;padding:18px;border:1px solid rgba(184,146,79,.42);border-radius:18px;background:rgba(184,146,79,.06);">'
          + '<small style="color:'+GOLD+';letter-spacing:.10em;">DEINE LETZTE ICS-AUSWERTUNG</small>'
          + '<h3 style="margin:7px 0 12px;color:'+CREAM+';">Dein aktueller Stand</h3>'
          + (Number.isFinite(survival)&&Number.isFinite(creator) ? '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;"><strong style="color:'+CREAM+';">Überlebensmodus '+survival+'%</strong><span style="opacity:.45;">·</span><strong style="color:'+GOLD+';">Schöpfermodus '+creator+'%</strong></div>' : '')
          + (focus ? '<p style="margin:0 0 8px;"><span style="opacity:.62;">Schwerpunkt:</span> <strong style="color:'+CREAM+';">'+escapeHtml(focus)+'</strong></p>' : '')
          + (themes.length ? '<p style="margin:0 0 8px;"><span style="opacity:.62;">Was sich zeigt:</span> '+themes.map(escapeHtml).join(' · ')+'</p>' : '')
          + (counters.length ? '<p style="margin:0;"><span style="opacity:.62;">Neue Richtung:</span> <strong style="color:'+GOLD+';">'+counters.map(escapeHtml).join(' · ')+'</strong></p>' : '')
          + '</section>';
      }
    } catch(e) {}

    let creatorCodeHtml = '';
    try {
      let codes = [];
      try { codes = JSON.parse(localStorage.getItem('ics_creator_codes_v1') || '[]'); } catch(e) {}
      if (!Array.isArray(codes)) codes = [];
      if (!codes.length) {
        const legacy = JSON.parse(localStorage.getItem('ics_creator_code_v1') || 'null');
        if (legacy && legacy.creator) codes = [legacy];
      }
      if (codes.length) {
        creatorCodeHtml = '<section style="margin-bottom:20px;">'
          + card('✦','Schöpfer-Codes',codes.length+' aktive'+(codes.length===1?'r Code':' Codes'),'Deine gewählten neuen Ausrichtungen.','creatorcodes')
          + '</section>';
      }
    } catch(e) {}

    cards.innerHTML = mindResultHtml + bodyResultHtml + evaluationHtml + creatorCodeHtml + `<section>
      <small style="color:${GOLD};letter-spacing:.10em;">DEIN COCKPIT</small>
      <h3 style="margin:6px 0 4px;color:${CREAM};">Dein Weg auf einen Blick</h3>
      <p style="margin:0 0 14px;opacity:.64;font-size:.9rem;">Nur das Wesentliche hier. Alles Weitere öffnest du bei Bedarf.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;">
        ${card('◌','Stand','Wo du gerade stehst','Lebensphase, Zustand und Orientierung.','status')}
        ${card('◎','Erkennen','Erkenntnisse & Muster','Trigger, Journal und Mentor-Erkenntnisse.','insights')}
        ${card('✓','Handeln','Handlung & Integration','Deine nächsten Schritte und Umsetzungen.','integration')}
        ${card('↗','Weg','Deine Entwicklung','Was sich über deine ICS-Schritte verändert.','development')}
      </div>
    </section>`

    document.getElementById('icsCockpitHome').hidden = false;
    document.getElementById('icsCockpitDetail').hidden = true;
    return true;
  }

  function detailTitle(type) {
    return ({life:'Deine Lebensphase',energy:'Wie geht es dir gerade?',trigger:'Trigger & Muster',journal:'Dein Journal-Impuls',mentor:'Deine Mentor-Erkenntnis',action:'Deine ACTION',integration:'Handlung & Integration',development:'Deine Entwicklung',creatorcodes:'Meine Schöpfer-Codes',status:'Wo du gerade stehst',insights:'Erkenntnisse & Muster'})[type] || 'Dein ICS';
  }

  function appendDetailContent(type, target) {
    if (type === 'status') {
      target.innerHTML = '<div id="icsStatusCards" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;"></div>';
      const box=target.querySelector('#icsStatusCards');
      const life=readText('icsLifeCycleOverview','Aktuelle Lebensphase');
      const energy=readText('icsLatestEnergy','Noch kein aktueller Check-in');
      const action=readText('icsLatestActionIntegration','Noch kein nächster Schritt gespeichert');
      box.innerHTML=card('◌','Lebensphase',life.title,life.text,'life')+card('▥','Aktueller Zustand','Wie geht es dir gerade?',energy,'energy')+card('➜','Handlung',action.title,action.text,'action');
      return;
    }
    if (type === 'insights') {
      target.innerHTML = '<div id="icsInsightCards" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;"></div>';
      const box=target.querySelector('#icsInsightCards');
      const trigger=readText('icsLatestTrigger','Noch kein Trigger gespeichert');
      const journal=readText('icsLatestCloudActivity','Noch kein Journal-Eintrag');
      const mentor=readText('icsLatestMentorInsight','Noch keine Mentor-Erkenntnis');
      box.innerHTML=card('◎','Trigger-Kompass',trigger.title,trigger.text,'trigger')+card('✎','Journal','Dein letzter Check-in',journal,'journal')+card('✦','Mentor','Letzte Erkenntnis',mentor,'mentor');
      return;
    }
    if (type === 'creatorcodes') {
      let codes=[]; try { codes=JSON.parse(localStorage.getItem('ics_creator_codes_v1')||'[]'); } catch(e) {}
      if (!Array.isArray(codes)) codes=[];
      target.innerHTML = codes.length
        ? '<p style="margin:0 0 18px;opacity:.65;">Deine aktuell gewählten Ausrichtungen.</p>'+codes.map((cc,i)=>'<section style="padding:18px 0;'+(i?'border-top:1px solid rgba(184,146,79,.24);':'')+'"><small style="color:'+GOLD+';letter-spacing:.08em;">SCHÖPFERMODUS</small><h3 style="margin:7px 0;color:'+CREAM+';">„'+escapeHtml(cc.creator)+'“</h3>'+(cc.survival?'<p style="margin:8px 0 0;opacity:.58;">Aus dem Muster: „'+escapeHtml(cc.survival)+'“</p>':'')+'</section>').join('')
        : '<p>Aktuell sind keine Schöpfer-Codes gespeichert.</p>';
      return;
    }
    const ids = ({
      life:['icsLifeCycleOverview'],
      energy:['icsLatestEnergy'],
      trigger:['icsLatestTrigger'],
      journal:['icsLatestCloudActivity'],
      mentor:['icsLatestMentorInsight'],
      action:['icsLatestActionIntegration'],
      integration:['icsLatestActionIntegration'],
      development:['icsDevelopmentJourney']
    })[type] || [];
    ids.forEach(id => { const node = document.getElementById(id); if (node) target.appendChild(node); });

    if (type === 'energy') {
      const state = document.querySelector('.ics-state-entry');
      if (state) target.appendChild(state);
      ['icsNextStep','icsRepeatedPattern'].forEach(id => { const node = document.getElementById(id); if (node) target.appendChild(node); });
    }

    if (type === 'life') {
      const life = document.getElementById('icsLifeCycleOverview');
      const hasResult = life && life.querySelector('h3');
      const input = life?.querySelector('.ics-birthdate-input');
      if (input && hasResult) input.style.display = 'none';

      const chronik = document.createElement('div');
      chronik.id = 'icsLifeChronicleEntry';
      chronik.style.cssText = 'margin-top:32px;padding-top:24px;padding-bottom:8px;border-top:1px solid rgba(184,146,79,.28);';
      chronik.innerHTML = `<small style="display:block;color:${GOLD};letter-spacing:.10em;text-transform:uppercase;">DEINE GESAMTE LEBENSLINIE</small>
        <h3 style="margin:8px 0 8px;color:${CREAM};">Mehr als die aktuelle Phase</h3>
        <p style="margin:0 0 18px;opacity:.72;line-height:1.55;">Öffne deine ausführliche ICS Lebenschronik mit Lebenslinie, Mustern und deinem nächsten Kapitel.</p>
        <button type="button" id="icsOpenLifeChronicle" class="gold-button" style="margin-bottom:8px;">Meine gesamte Lebenschronik öffnen →</button>`;
      target.appendChild(chronik);
    }
  }

  function openDetail(type) {
    const shell = createShell();
    const home = document.getElementById('icsCockpitHome');
    const detail = document.getElementById('icsCockpitDetail');
    if (!shell || !home || !detail) return;

    storeExistingDetails();
    setOverviewOnlyMode(true);
    detail.innerHTML = `<button type="button" id="icsCockpitBack" style="border:0;background:none;color:${GOLD};padding:0;cursor:pointer;font:inherit;font-weight:700;">← Zurück zu Mein ICS</button>
      <small style="display:block;margin-top:24px;color:${GOLD};letter-spacing:.10em;text-transform:uppercase;">DEIN PERSÖNLICHES SYSTEM</small>
      <h2 style="margin:7px 0 24px;color:${CREAM};">${escapeHtml(detailTitle(type))}</h2>
      <div id="icsCockpitDetailContent"></div>`;
    appendDetailContent(type, detail.querySelector('#icsCockpitDetailContent'));
    home.hidden = true;
    detail.hidden = false;
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function backHome() {
    const detail = document.getElementById('icsCockpitDetail');
    const vault = ensureVault();
    const content = detail?.querySelector('#icsCockpitDetailContent');
    if (content) [...content.children].forEach(node => {
      if (node.id !== 'icsLifeChronicleEntry') vault.appendChild(node);
    });
    setOverviewOnlyMode(false);
    renderHome();
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function openRequestedReturnDetail() {
    const detail = sessionStorage.getItem('ICS_RETURN_DETAIL');
    if (!detail) return false;
    sessionStorage.removeItem('ICS_RETURN_DETAIL');
    if (detail === 'life') {
      if (typeof window.openView === 'function') window.openView('meinics');
      openDetail('life');
      return true;
    }
    return false;
  }

  document.addEventListener('click', event => {
    const detailButton = event.target.closest('[data-ics-detail]');
    if (detailButton) { openDetail(detailButton.dataset.icsDetail); return; }
    if (event.target.closest('#icsCockpitBack')) { backHome(); return; }
    if (event.target.closest('#icsOpenLifeChronicle')) {
      sessionStorage.setItem('ICS_RETURN_DETAIL', 'life');
      window.location.href = './ics-lebenschronik.html';
      return;
    }
    if (event.target.closest('[data-view="meinics"]')) window.setTimeout(renderHome,180);
  });

  const timer = window.setInterval(() => {
    if (renderHome()) {
      window.clearInterval(timer);
      window.setTimeout(openRequestedReturnDetail, 80);
    }
  },300);
  window.setTimeout(() => window.clearInterval(timer),15000);
  window.icsOrganizeMeinIcsCockpit = renderHome;
})();