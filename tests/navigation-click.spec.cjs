const { test, expect } = require('@playwright/test');
test('ICS bottom navigation and Nachschlagewerk respond to clicks', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ICS_USER_NAME', 'ICS Test'));
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/**', route => route.fulfill({ status: 200, contentType: 'application/javascript', body: 'window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})}})};' }));
  page.on('pageerror', error => console.log('ICS PAGE ERROR', error.message));
  page.on('console', msg => { if(msg.type()==='error') console.log('ICS CONSOLE ERROR',msg.text()); });
  await page.goto('http://127.0.0.1:4173/index.html');
  await page.evaluate(() => {
    document.querySelector('.bottom-nav').addEventListener('click', e => console.log('ICS CAPTURE NAV', e.target.closest('.nav-item')?.dataset.view), true);
  });
  await expect(page.locator('#view-heute')).toHaveClass(/active/, {timeout:15000});
  await page.locator('#todayToNachschlagewerk').click();
  await expect(page.locator('#view-nachschlagewerk')).toHaveClass(/active/);
  for (const name of ['heute','meinics','journal','welten','mehr']) {
    console.log('ICS BEFORE', name, await page.locator('.bottom-nav .nav-item[data-view="'+name+'"]').evaluate(el => ({outer:el.outerHTML.slice(0,200),connected:el.isConnected})));
    await page.locator('.bottom-nav .nav-item[data-view="'+name+'"]').click();
    console.log('ICS AFTER', name, await page.evaluate(() => ({activeViews:[...document.querySelectorAll('.app-view.active')].map(x=>x.id),activeTabs:[...document.querySelectorAll('.nav-item.active')].map(x=>x.dataset.view), openViewType:typeof openView, appViewsCount:typeof appViews!=='undefined'?appViews.length:-1, domViewsCount:document.querySelectorAll('.app-view').length, heuteInSnapshot:typeof appViews!=='undefined'&&appViews.includes(document.getElementById('view-heute')), nachschlagewerkInSnapshot:typeof appViews!=='undefined'&&appViews.includes(document.getElementById('view-nachschlagewerk'))})));
    if(name === 'heute') {
      console.log('ICS DIRECT CALL', await page.evaluate(() => { openView('heute'); return {activeViews:[...document.querySelectorAll('.app-view.active')].map(x=>x.id),activeTabs:[...document.querySelectorAll('.nav-item.active')].map(x=>x.dataset.view)}; }));
    }
    console.log('ICS NAV:', name, 'active=', await page.locator('.app-view.active').evaluateAll(nodes => nodes.map(n => n.id)));
    await expect(page.locator('#view-'+name)).toHaveClass(/active/);
  }
});
