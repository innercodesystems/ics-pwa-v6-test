// =========================================================
// ICS · ACTION COCKPIT BRIDGE
// Offene ACTION -> Rückblick -> Integration -> nächste ACTION / letzte Integration.
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

  function recoverPendingReflection() {
    const existing=document.getElementById('icsActionIntegrationCard');
    if (existing && !existing.hidden) return true;
    const pending=readSteps().filter(item=>item?.done===true && !item?.integration).sort((a,b)=>new Date(b.completedAt||b.createdAt||0)-new Date(a.completedAt||a.createdAt||0))[0];
    if (!pending || typeof window.icsShowActionReflection!=='function') return false;
    window.icsShowActionReflection(pending);
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
    if ((!reflection || reflection.hidden) && !card.hidden) { /* offene ACTION hat Vorrang */ }
    else if (!reflection || reflection.hidden) { recoverPendingReflection(); reflection=document.getElementById('icsActionIntegrationCard'); }
    const hasCurrentAction=!card.hidden,hasReflection=Boolean(reflection&&!reflection.hidden);
    if(hasCurrentAction){content.insertBefore(card,content.firstChild);card.style.marginTop='0';}
    if(hasReflection){if(reflection.parentElement!==content)content.appendChild(reflection);reflection.style.marginTop=hasCurrentAction?'24px':'0';}
    await renderLatestIntegration(content,hasCurrentAction||hasReflection); return true;
  }

  function restoreMovedCards(){const card=document.getElementById('actionCurrentStepCard');if(card&&placeholder?.isConnected){placeholder.parentNode.insertBefore(card,placeholder.nextSibling);card.style.marginTop='24px';}const reflection=document.getElementById('icsActionIntegrationCard');if(reflection&&card?.parentNode&&reflection.parentElement!==card.parentElement)card.insertAdjacentElement('afterend',reflection);}
  document.addEventListener('click',event=>{if(event.target.closest('#icsCockpitBack'))restoreMovedCards();},true);
  document.addEventListener('click',event=>{if(event.target.closest('[data-ics-detail="action"]'))window.setTimeout(syncActionDetail,60);});
  document.addEventListener('click',event=>{if(!event.target.closest('#completeActionCurrentStep'))return;window.setTimeout(()=>{recoverPendingReflection();syncActionDetail();},120);},true);
  window.addEventListener('ics:action-integrated',()=>window.setTimeout(syncActionDetail,80));
  window.icsShowCurrentActionInCockpit=syncActionDetail;
})();