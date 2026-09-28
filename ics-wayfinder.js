// ICS Wegweiser · persönliche Klickführung in Mein ICS
(() => {
  const KEY='ics_wayfinder_v1';
  const GOLD='#b8924f', CREAM='#f6f1e7';
  const steps=[
    {id:'muster',title:'Gedankenmuster & Glaubenssatz',text:'Schau, welcher innere Satz oder welches Muster hinter deinem Thema liegen könnte.',target:'#openAuswertung'},
    {id:'trigger',title:'Trigger & Auslöser',text:'Erkenne, welche Situation dein Muster immer wieder aktiviert.',href:'./trigger-kompass-app.html'},
    {id:'gegenpol',title:'Gegenpol',text:'Finde eine neue innere Richtung und einen konkreten nächsten Schritt.',target:'#openGegenpolGenerator'},
    {id:'reset',title:'RESET',text:'Komm aus dem Reagieren zurück in einen bewussten Zustand.',target:'#openResetCheck'},
    {id:'gestaltung',title:'In den Schöpfermodus',text:'Übersetze deine Erkenntnis in einen bewussten Gestaltungs-Schritt.',target:'#openGestaltungsCodefinder'}
  ];
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{index:0,status:{},source:''}}catch{return {index:0,status:{},source:''}}};
  const save=s=>localStorage.setItem(KEY,JSON.stringify(s));
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  function current(s){let i=Math.max(0,Math.min(s.index||0,steps.length-1)); return {i,step:steps[i]};}
  function progress(s){return steps.map(x=>({title:x.title,status:s.status?.[x.id]||'neu'}));}
  function mount(){
    const cards=document.getElementById('icsCockpitCards');
    if(!cards) return false;
    let box=document.getElementById('icsWayfinder');
    if(!box){box=document.createElement('section');box.id='icsWayfinder';}
    // Cockpit rebuilds its inner HTML repeatedly, so keep the wayfinder outside that replaceable area.
    const home=document.getElementById('icsCockpitHome');
    if(home && box.parentElement!==home) home.insertBefore(box,cards);
    if(!box.isConnected) return false;
    const s=read(), {i,step}=current(s), done=Object.values(s.status||{}).filter(x=>x==='done').length, open=Object.values(s.status||{}).filter(x=>x==='open').length;
    const finished=steps.every(x=>['done','open'].includes(s.status?.[x.id]));
    box.style.cssText='margin:0 0 24px;padding:20px;border:1px solid rgba(184,146,79,.5);border-radius:18px;background:linear-gradient(180deg,rgba(184,146,79,.10),rgba(184,146,79,.025));';
    if(finished){
      box.innerHTML=`<small style="color:${GOLD};letter-spacing:.11em;">DEIN ICS WEG</small><h3 style="margin:7px 0;color:${CREAM};font-size:1.35rem;">Dein Weg ist für jetzt durchlaufen.</h3><p style="opacity:.72;line-height:1.5;">${done} angeschaut · ${open} für später offen. Du kannst offene Themen jederzeit wieder aufnehmen.</p><button class="gold-button" data-wf-open-first>Offenen Weg fortsetzen →</button>`;
      return true;
    }
    box.innerHTML=`<small style="color:${GOLD};letter-spacing:.11em;">DEIN NÄCHSTER SCHRITT</small>
      <h3 style="margin:7px 0 5px;color:${CREAM};font-size:1.45rem;">${esc(step.title)}</h3>
      <p style="margin:0;opacity:.72;line-height:1.5;">${esc(step.text)}</p>
      <div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:16px;">
        <button class="gold-button" data-wf-look>Jetzt anschauen →</button>
        <button type="button" data-wf-next style="border:1px solid rgba(184,146,79,.55);border-radius:999px;background:transparent;color:${CREAM};padding:11px 17px;font:inherit;font-weight:700;cursor:pointer;">Weiter zum nächsten →</button>
      </div>
      <p style="margin:12px 0 0;opacity:.52;font-size:.82rem;">„Weiter“ merkt dieses Thema als offen. Nichts geht verloren.</p>
      ${open?'<button type="button" data-wf-list style="margin-top:12px;border:0;background:none;color:'+GOLD+';padding:0;font:inherit;cursor:pointer;">○ '+open+' offene'+(open===1?'s Thema':' Themen')+' ansehen</button>':''}`;
    return true;
  }
  function advance(s){let n=(s.index||0)+1; while(n<steps.length && ['done','open'].includes(s.status?.[steps[n].id])) n++; s.index=n<steps.length?n:steps.length-1; save(s); mount();}
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
    if(e.target.closest('[data-wf-next]')){const s=read(),{step}=current(s);s.status[step.id]='open';advance(s);return;}
    if(e.target.closest('[data-wf-look]')){const s=read(),{step}=current(s);s.status[step.id]='done';save(s);openStep(step);return;}
    if(e.target.closest('[data-wf-list]')){showOpen();return;}
    if(e.target.closest('[data-wf-close]')){document.getElementById('icsWfModal')?.remove();return;}
    if(e.target.closest('[data-wf-open-first]')){const s=read(),idx=steps.findIndex(x=>s.status?.[x.id]==='open');if(idx>=0){s.index=idx;delete s.status[steps[idx].id];save(s);mount();}return;}
    if(e.target.closest('[data-view="meinics"]'))setTimeout(mount,250);
  });
  const timer=setInterval(()=>{if(mount())clearInterval(timer)},350); setTimeout(()=>clearInterval(timer),15000);
  window.icsWayfinderRender=mount;
})();