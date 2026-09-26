// ICS Studio · TESTMODUL
(() => {
  const KEY = 'ICS_STUDIO_V1';
  const state = JSON.parse(localStorage.getItem(KEY) || 'null') || {
    customers: [
      {name:'Anna M.', contact:'', note:''},
      {name:'Michael K.', contact:'', note:''}
    ],
    services: [
      {name:'Transformationsmassage', duration:60, price:90},
      {name:'RESET Coaching', duration:60, price:150},
      {name:'Erstgespräch', duration:60, price:150}
    ],
    appointments: []
  };
  const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function install(){
    const shell=document.querySelector('.app-shell');
    if(!shell || document.getElementById('view-studio')) return;

    const view=document.createElement('section');
    view.className='app-view';
    view.id='view-studio';
    view.innerHTML=`
      <div class="view-header">
        <p class="section-kicker">ICS VERWALTUNG</p>
        <h1>ICS Studio</h1>
        <p>Termine, Kunden und Leistungen an einem Ort.</p>
      </div>
      <section class="premium-card">
        <div class="ics-studio-tabs">
          <button data-tab="dashboard" class="gold-button">Heute</button>
          <button data-tab="customers">Kunden</button>
          <button data-tab="services">Leistungen</button>
        </div>
        <div id="icsStudioBody"></div>
      </section>
      <div style="text-align:center;margin-top:18px"><button id="icsStudioBack" class="secondary-button">← Zurück zu Mehr</button></div>`;
    shell.appendChild(view);

    const more=document.getElementById('view-mehr');
    if(more){
      const card=document.createElement('section');
      card.className='premium-card';
      card.innerHTML=`<p class="section-kicker">VERWALTUNG · TEST</p><h2>ICS Studio</h2><p>Termine, Kunden und Leistungen verwalten.</p><button id="openIcsStudio" class="gold-button">ICS Studio öffnen</button>`;
      more.appendChild(card);
    }
    document.getElementById('openIcsStudio')?.addEventListener('click',()=>window.openView?.('studio'));
    document.getElementById('icsStudioBack')?.addEventListener('click',()=>window.openView?.('mehr'));
    view.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.tab)));
    render('dashboard');
  }

  function render(tab){
    const body=document.getElementById('icsStudioBody'); if(!body)return;
    if(tab==='dashboard'){
      body.innerHTML=`<div class="ics-studio-grid">
        <div class="ics-studio-stat"><strong>${state.appointments.length}</strong><span>Termine</span></div>
        <div class="ics-studio-stat"><strong>${state.customers.length}</strong><span>Kunden</span></div>
        <div class="ics-studio-stat"><strong>${state.services.length}</strong><span>Leistungen</span></div>
      </div><button id="studioNewAppointment" class="gold-button" style="width:100%;margin-top:18px">＋ Termin anlegen</button>
      <div class="ics-studio-list">${state.appointments.length?state.appointments.map((a,i)=>`<div class="ics-studio-row"><div><strong>${esc(a.date)} · ${esc(a.time)}</strong><p>${esc(a.customer)} · ${esc(a.service)}</p></div><button data-del="${i}">×</button></div>`).join(''):'<p>Noch keine Termine angelegt.</p>'}</div>`;
      body.querySelector('#studioNewAppointment')?.addEventListener('click',newAppointment);
      body.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{state.appointments.splice(+b.dataset.del,1);save();render('dashboard')});
    } else if(tab==='customers'){
      body.innerHTML=`<button id="studioNewCustomer" class="gold-button">＋ Kunde</button><div class="ics-studio-list">${state.customers.map(c=>`<div class="ics-studio-row"><div><strong>${esc(c.name)}</strong><p>${esc(c.contact||'Keine Kontaktdaten')}</p></div></div>`).join('')}</div>`;
      body.querySelector('#studioNewCustomer').onclick=()=>{const name=prompt('Name des Kunden:');if(!name)return;const contact=prompt('Telefon oder E-Mail:')||'';state.customers.push({name,contact,note:''});save();render('customers')};
    } else {
      body.innerHTML=`<button id="studioNewService" class="gold-button">＋ Leistung</button><div class="ics-studio-list">${state.services.map(s=>`<div class="ics-studio-row"><div><strong>${esc(s.name)}</strong><p>${s.duration} Min. · € ${s.price}</p></div></div>`).join('')}</div>`;
      body.querySelector('#studioNewService').onclick=()=>{const name=prompt('Name der Leistung:');if(!name)return;const duration=+(prompt('Dauer in Minuten:','60')||60);const price=+(prompt('Preis in Euro:','90')||0);state.services.push({name,duration,price});save();render('services')};
    }
  }
  function newAppointment(){
    if(!state.customers.length||!state.services.length)return alert('Bitte zuerst Kunde und Leistung anlegen.');
    const customer=prompt('Kunde:',state.customers[0].name);if(!customer)return;
    const service=prompt('Leistung:',state.services[0].name);if(!service)return;
    const date=prompt('Datum (JJJJ-MM-TT):',new Date().toISOString().slice(0,10));if(!date)return;
    const time=prompt('Uhrzeit:','10:00');if(!time)return;
    state.appointments.push({customer,service,date,time,status:'Bestätigt'});save();render('dashboard');
  }
  window.addEventListener('load',()=>setTimeout(install,800));
})();