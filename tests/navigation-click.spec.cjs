const { test, expect } = require('@playwright/test');
test('ICS bottom navigation and Nachschlagewerk respond to clicks', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ICS_USER_NAME', 'ICS Test'));
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/**', route => route.fulfill({ status: 200, contentType: 'application/javascript', body: 'window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})}})};' }));
  await page.goto('http://127.0.0.1:4173/index.html');
  await expect(page.locator('#view-heute')).toHaveClass(/active/, {timeout:15000});
  await page.locator('#todayToNachschlagewerk').click();
  await expect(page.locator('#view-nachschlagewerk')).toHaveClass(/active/);
  for (const name of ['heute','meinics','journal','welten','mehr']) {
    await page.locator('.bottom-nav .nav-item[data-view="'+name+'"]').click();
    console.log('ICS NAV:', name, 'active=', await page.locator('.app-view.active').evaluateAll(nodes => nodes.map(n => n.id)));
    await expect(page.locator('#view-'+name)).toHaveClass(/active/);
  }
});
