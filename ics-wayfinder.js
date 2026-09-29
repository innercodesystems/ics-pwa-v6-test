// ICS Wegweiser · persönliche Klickführung in Mein ICS
(() => {
  const KEY='ics_wayfinder_v2';
  const GOLD='#b8924f', CREAM='#f6f1e7';
  const steps=[
    {id:'muster',title:'Gedankenmuster & Glaubenssatz',text:'Schau, welcher innere Satz oder welches Muster hinter deinem Thema liegen könnte.',why:'Wiederkehrende Gedanken können auf ein inneres Muster hinweisen. Deshalb bietet ICS dir diesen Weg als Möglichkeit an.',target:'#openAuswertung'},
    {id:'trigger',title:'Trigger & Auslöser',text:'Erkenne, welche Situation dein Muster immer wieder aktiviert.',why:'Manchmal beginnt ein Gedankenkreislauf mit einer bestimmten Situation oder Reaktion. Hier kannst du prüfen, ob es einen Auslöser gibt.',href:'./trigger-kompass-app.html'},
    {id:'gegenpol',title:'Gegenpol',text:'Finde eine neue innere Richtung und einen konkreten nächsten Schritt.',why:'Wenn du ein Muster erkannt hast, kann ein bewusster Gegenpol helfen, eine neue Richtung zu wählen.',target:'#openGegenpolGenerator'},
    {id:'reset',title:'RESET',text:'Komm aus dem Reagieren zurück in einen bewussten Zustand.',why:'Wenn gerade Entlastung wichtiger ist als Analyse, kann RESET dir helfen, erst einmal wieder Raum zu schaffen.',target:'#openResetCheck'},
    {id:'gestaltung',title:'In den Schöpfermodus',text:'Übersetze deine Erkenntnis in einen bewussten Gestaltungs-Schritt.',why:'Wenn genug Klarheit da ist, kann aus der Erkenntnis ein konkreter nächster Schritt entstehen.',target:'#openGestaltungsCodefinder'}
  ];
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{index:0,status:{},source:''}}catch{return {index:0,status:{},source:''}}};
  const save=s=>localStorage.setItem(KEY,JSON.stringify(s));
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  function current(s){let i=Math.max(0,Math.min(s.index||0,steps.length-1)); return {i,step:steps[i]};}
  function progress(s){return steps.map(x=>({title:x.title,status:s.status?.[x.id]||'neu'}));}
  function mount(){
    const host=document.getElementById('icsWayfinderHost');
    if(!host) return false;
    let box=document.getElementById('icsWayfinder');
    if(!box){box=document.createElement('section');box.id='icsWayfinder';}
    if(box.parentElement!==host) host.replaceChildren(box);
    const s=read(), {i,step}=current(s), done=Object.values(s.status||{}).filter(x=>x==='done').length, open=Object.values(s.status||{}).filter(x=>x==='open').length;
    const finished=(s.index||0)>=steps.length;
    box.style.cssText='margin:0 0 24px;padding:20px;border:1px solid rgba(184,146,79,.5);border-radius:18px;background:linear-gradient(180deg,rgba(184,146,79,.10),rgba(184,146,79,.025));';
    if(finished){
      box.innerHTML=`<small style="color:${GOLD};letter-spacing:.11em;">DEIN ICS WEG</small><h3 style="margin:7px 0;color:${CREAM};font-size:1.35rem;">Dein Weg ist für jetzt durchlaufen.</h3><p style="opacity:.72;line-height:1.5;">${done} angeschaut · ${open} für später offen. Du kannst offene Themen jederzeit wieder aufnehmen.</p><button class="gold-button" data-wf-open-first>Offenen Weg fortsetzen →</button>`;
      return true;
    }
    box.innerHTML=`<small style="color:${GOLD};letter-spacing:.11em;">DEIN NÄCHSTER SCHRITT</small>
      <h3 style="margin:7px 0 5px;color:${CREAM};font-size:1.45rem;">${esc(step.title)}</h3>
      <p style="margin:0;opacity:.72;line-height:1.5;">${esc(step.text)}</p>
      <details style="margin-top:12px;"><summary style="color:${GOLD};cursor:pointer;font-weight:700;">Warum schlägt ICS das vor?</summary><p style="margin:8px 0 0;opacity:.68;line-height:1.5;">${esc(step.why||'Dieser Schritt ist eine mögliche Richtung – du entscheidest, ob sie gerade zu dir passt.')}</p></details>
      <div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:16px;">
        <button class="gold-button" data-wf-look>Jetzt anschauen →</button>
        <button type="button" data-wf-next style="border:1px solid rgba(184,146,79,.55);border-radius:999px;background:transparent;color:${CREAM};padding:11px 17px;font:inherit;font-weight:700;cursor:pointer;">Weiter →</button>
        <button type="button" data-wf-remember style="border:0;background:none;color:${GOLD};padding:11px 6px;font:inherit;font-weight:700;cursor:pointer;">Für später merken</button>
      </div>
      <p style="margin:12px 0 0;opacity:.52;font-size:.82rem;">„Weiter“ überspringt nur. Nur „Für später merken“ legt ein offenes Thema an.</p>
      ${open?'<button type="button" data-wf-list style="margin-top:12px;border:0;background:none;color:'+GOLD+';padding:0;font:inherit;cursor:pointer;">○ '+open+' offene'+(open===1?'s Thema':' Themen')+' ansehen</button>':''}`;
    return true;
  }
  function advance(s){let n=(s.index||0)+1; while(n<steps.length && ['done','open'].includes(s.status?.[steps[n].id])) n++; s.index=n; save(s); mount();}
  function openStep(step){
    sessionStorage.setItem('ICS_WAYFINDER_RETURN','1');
    if(step.href){location.href=step.href;return;}
    const el=document.querySelector(step.target);
    if(el){el.click();} else {alert('Dieser ICS-Bereich wird gerade verbunden. Das Thema bleibt gespeichert.');}
  }
  function showOpen(){
    const s=read(), items=progress(s).filter(x=>x.status==='open');
    let modal=document.getElementById('icsWfModal');
    if(!modal){modal=document.createElement('div');modal.id='icsWfModal';document.body.appendChild(modal);}
    modal.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.82);display:grid;place-items:center;padding:24px;';
    modal.innerHTML=`<div style="width:min(100%,520px);max-height:80vh;overflow:auto;background:#11100e;border:1px solid rgba(184,146,79,.55);border-radius:20px;padding:22px;color:${CREAM};"><small style="color:${GOLD};letter-spacing:.1em;">FÜR SPÄTER GEMERKT</small><h2 style="margin:8px 0 14px;">Deine offenen Themen</h2>${items.length?items.map(x=>'<div style="padding:12px 0;border-top:1px solid rgba(184,146,79,.2);">○ '+esc(x.title)+'</div>').join(''):'<p>Im Moment ist nichts offen.</p>'}<button class="gold-button" data-wf-close style="margin-top:16px;">Schließen</button></div>`;
  }
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-wf-next]')){const s=read();advance(s);return;}
    if(e.target.closest('[data-wf-remember]')){const s=read(),{step}=current(s);s.status[step.id]='open';advance(s);return;}
    if(e.target.closest('[data-wf-look]')){const s=read(),{step}=current(s);s.status[step.id]='done';save(s);openStep(step);return;}
    if(e.target.closest('[data-wf-list]')){showOpen();return;}
    if(e.target.closest('[data-wf-close]')){document.getElementById('icsWfModal')?.remove();return;}
    if(e.target.closest('[data-wf-open-first]')){const s=read();let idx=steps.findIndex(x=>s.status?.[x.id]==='open');if(idx<0){idx=steps.findIndex(x=>s.status?.[x.id]!=='done');}if(idx<0){s.index=0;s.status={};}else{s.index=idx;if(s.status?.[steps[idx].id]==='open')delete s.status[steps[idx].id];}save(s);mount();return;}
    if(e.target.closest('[data-view="meinics"]'))setTimeout(mount,250);
  });
  // Mount only when needed. Avoid observing our own DOM updates, which can create a render loop.
  let attempts=0;
  const timer=setInterval(()=>{
    attempts++;
    if(mount() || attempts>=30) clearInterval(timer);
  },500);
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) setTimeout(mount,150); });
  window.icsWayfinderRender=mount;
})();