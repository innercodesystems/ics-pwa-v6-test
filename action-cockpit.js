// =========================================================
// ICS · ACTION COCKPIT BRIDGE
// Offene ACTION -> Rückblick -> Integration -> nächste ACTION / letzte Integration.
// Rückblick kann aus lokalem Stand ODER Cloud-ACTION wiederhergestellt werden.
// =========================================================
(() => {
  const ACTION_KEY = 'ICS_ACTION_NEXT_STEPS';
  let placeholder = null;
  const GOLD = '#b8924f';
  const CREAM = '#f6f1e7';

  function esc(value) { return String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }
  function first(result, keys) { for (const key of keys) { const value=result?.[key]; if (typeof value==='string'&&value.trim()) return value.trim(); } return ''; }
  function readSteps() { try { const data=JSON.parse(localStorage.getItem(ACTION_KEY)||'[]'); return Array.isArray(data)?data:[]; } catch { return []; } }
  function getContent() { const detail=document.getElementById('icsCockpitDetail'); if(!detail||detail.hidden)return null; return detail.querySelector('#icsCockpitDetailContent'); }
  function ensurePlaceholder(card) { if(placeholder?.isConnected)return; placeholder=document.createElement('span'); placeholder.id='icsActionCurrentStepPlaceholder'; placeholder.hidden=true; card.parentNode?.insertBefore(placeholder,card); }
  function norm(value){return String(value||'').trim().toLowerCase().replace(/\s+/g,' ');}

  async function recoverPendingReflection() {
    const existing=document.getElementById('icsActionIntegrationCard');
    if (existing && !existing.hidden) return true;
    if (typeof window.icsShowActionReflection!=='function') return false;

    // 1. Zuerst der eindeutige lokale Stand.
    const localPending=readSteps().filter(item=>item?.done===true && !item?.integration)
      .sort((a,b)=>new Date(b.completedAt||b.createdAt||0)-new Date(a.completedAt||a.createdAt||0))[0];
    if (localPending) {
      window.icsShowActionReflection(localPending);
      return true;
    }

    // 2. Fallback für ältere/testweise ACTIONS: Cloud-ACTION gegen bereits
    //    vorhandene Integrationen abgleichen. Cloud speichert die ACTION beim
    //    Erstellen; ältere Datensätze wurden beim Erledigen noch nicht aktualisiert.
    if (typeof window.icsGetToolResults!=='function') return false;
    const [actionsRes, integrationsRes]=await Promise.all([
      window.icsGetToolResults({toolId:'action_next_step',limit:30}),
      window.icsGetToolResults({toolId:'action_integration',limit:30})
    ]);
    if (!actionsRes?.ok) return false;
    const integrations=integrationsRes?.ok ? integrationsRes.data||[] : [];
    const integratedIds=new Set(integrations.map(x=>x?.result?.local_action_id).filter(Boolean));
    const integratedTexts=new Set(integrations.map(x=>norm(x?.result?.step)).filter(Boolean));
    const localOpenIds=new Set(readSteps().filter(x=>x?.done!==true).map(x=>x.id).filter(Boolean));

    const candidate=(actionsRes.data||[]).find(item=>{
      const r=item?.result||{};
      const id=r.local_id;
      const text=norm(r.step);
      if (!id && !text) return false;
      if (integratedIds.has(id) || (text && integratedTexts.has(text))) return false;
      // Eine lokal weiterhin offene ACTION darf nicht als erledigt behandelt werden.
      if (id && localOpenIds.has(id)) return false;
      return true;
    });
    if (!candidate) return false;
    const r=candidate.result||{};
    window.icsShowActionReflection({
      id:r.local_id || `cloud_${candidate.id}`,
      createdAt:r.created_at || candidate.created_at,
      completedAt:r.completed_at || new Date().toISOString(),
      topic:r.topic || '',
      size:r.size || 'small',
      step:r.step || '',
      done:true
    });
    return true;
  }

  async function renderLatestIntegration(content, separated) {
    let block=document.getElementById('icsActionCloudIntegration'); if(!block){block=document.createElement('section');block.id='icsActionCloudIntegration';}
    block.style.cssText=`margin-top:${separated?'28px':'0'};padding-top:${separated?'24px':'0'};border-top:${separated?'1px solid rgba(184,146,79,.28)':'0'};`;
    block.innerHTML='<small style="opacity:.6;">Letzte Integration wird geladen…</small>'; content.appendChild(block);
    if(typeof window.icsGetToolResults!=='function'){block.remove();return;}
    const response=await window.icsGetToolResults({toolId:'action_integration',limit:1}); const item=response?.ok?response.data?.[0]:null; if(!item){block.remove();return;}
    const r=item.result||{},topic=first(r,['topic','theme'])||'ACTION',step=first(r,['step','action','text']),changed=first(r,['changed','change','reflection']),learning=first(r,['learning','takeaway','integration']);
    block.innerHTML=`<small style="display:block;color:${GOLD};letter-spacing:.08em;text-transform:uppercase;">ZULETZT UMGESETZT &amp; INTEGRIERT · ACTION</small><h3 style="margin:8px 0 0;color:${CREAM};">${esc(topic)}</h3>${step?`<p style="margin:7px 0 0;opacity:.72;line-height:1.5;">Schritt: ${esc(step)}</p>`:''}${changed?`<div style="margin-top:15px;padding-left:12px;border-left:1px solid ${GOLD};"><small style="color:${GOLD};">WAS SICH VERÄNDERT HAT</small><strong style="display:block;margin-top:5px;color:${CREAM};font-size:1.05rem;line-height:1.4;">${esc(changed)}</strong></div>`:''}${learning?`<small style="display:block;margin-top:14px;color:${GOLD};">DEINE ERKENNTNIS</small><p style="margin:7px 0 0;opacity:.75;line-height:1.5;">${esc(learning)}</p>`:''}`;
  }

  async function syncActionDetail() {
    const content=getContent(),card=document.getElementById('actionCurrentStepCard'); if(!content||!card)return false; ensurePlaceholder(card);
    let reflection=document.getElementById('icsActionIntegrationCard');
    if ((!reflection || reflection.hidden) && card.hidden) {
      await recoverPendingReflection();
      reflection=document.getElementById('icsActionIntegrationCard');
    }
    const hasCurrentAction=!card.hidden,hasReflection=Boolean(reflection&&!reflection.hidden);
    if(hasCurrentAction){content.insertBefore(card,content.firstChild);card.style.marginTop='0';}
    if(hasReflection){if(reflection.parentElement!==content)content.appendChild(reflection);reflection.style.marginTop=hasCurrentAction?'24px':'0';}
    await renderLatestIntegration(content,hasCurrentAction||hasReflection); return true;
  }

  function restoreMovedCards(){const card=document.getElementById('actionCurrentStepCard');if(card&&placeholder?.isConnected){placeholder.parentNode.insertBefore(card,placeholder.nextSibling);card.style.marginTop='24px';}const reflection=document.getElementById('icsActionIntegrationCard');if(reflection&&card?.parentNode&&reflection.parentElement!==card.parentElement)card.insertAdjacentElement('afterend',reflection);}
  document.addEventListener('click',event=>{if(event.target.closest('#icsCockpitBack'))restoreMovedCards();},true);
  document.addEventListener('click',event=>{if(event.target.closest('[data-ics-detail="action"]'))window.setTimeout(syncActionDetail,60);});
  document.addEventListener('click',event=>{if(!event.target.closest('#completeActionCurrentStep'))return;window.setTimeout(syncActionDetail,120);},true);
  window.addEventListener('ics:action-integrated',()=>window.setTimeout(syncActionDetail,80));
  window.icsShowCurrentActionInCockpit=syncActionDetail;
})();