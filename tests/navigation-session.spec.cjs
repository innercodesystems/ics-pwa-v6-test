const { test, expect } = require('@playwright/test');

test('navigation after simulated signed-in session', async ({ page }) => {
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/**', route => route.fulfill({
    status: 200, contentType: 'application/javascript',
    body: "window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:{user:{id:'test-id',email:'test@example.invalid'}}},error:null})},from:()=>({upsert:async()=>({error:null})})})};"
  }));
  await page.goto('http://127.0.0.1:4173/index.html');
  await expect(page.locator('#ics-auth-gate')).toHaveCount(0);
  await expect(page.locator('#view-welcome')).toHaveClass(/active/);
  await page.locator('.bottom-nav .nav-item[data-view="heute"]').click();
  await expect(page.locator('#view-heute')).toHaveClass(/active/);
  await page.locator('#todayToNachschlagewerk').click();
  await expect(page.locator('#view-nachschlagewerk')).toHaveClass(/active/);
  for (const name of ['heute','meinics','journal','welten','mehr']) {
    await page.locator('.bottom-nav .nav-item[data-view="'+name+'"]').click();
    await expect(page.locator('#view-'+name)).toHaveClass(/active/);
  }
});
