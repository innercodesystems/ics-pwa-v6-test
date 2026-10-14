const { test, expect } = require('@playwright/test');

test('ICS login: error, successful sign-in and navigation', async ({ page }) => {
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/**', route => route.fulfill({
    status: 200, contentType: 'application/javascript',
    body: `window.supabase={createClient:()=>({
      auth:{
        getSession:async()=>({data:{session:null},error:null}),
        signInWithPassword:async({email,password})=>password==='correct-test-password'?
          {data:{user:{id:'mock-user',email}},error:null}:
          {data:{user:null},error:{message:'Invalid credentials'}}
      },
      from:()=>({upsert:async()=>({error:null})})
    })};`
  }));
  await page.goto('http://127.0.0.1:4173/index.html');
  await expect(page.locator('#ics-auth-gate')).toBeVisible();
  await expect(page.locator('#view-heute')).not.toHaveClass(/active/).catch(()=>{});
  await page.locator('#ics-login-email').fill('tester@example.invalid');
  await page.locator('#ics-login-password').fill('wrong-password');
  await page.locator('#ics-login-button').click();
  await expect(page.locator('#ics-login-message')).toContainText('Anmeldung nicht möglich');
  await expect(page.locator('#ics-auth-gate')).toBeVisible();
  await page.locator('#ics-login-password').fill('correct-test-password');
  await page.locator('#ics-login-button').click();
  await expect(page.locator('#ics-auth-gate')).toHaveCount(0);
  await expect(page.locator('#view-welcome')).toHaveClass(/active/, {timeout:15000});
  await page.locator('.bottom-nav .nav-item[data-view="heute"]').click();
  await expect(page.locator('#view-heute')).toHaveClass(/active/);
  await page.locator('#todayToNachschlagewerk').click();
  await expect(page.locator('#view-nachschlagewerk')).toHaveClass(/active/);
  await page.locator('.bottom-nav .nav-item[data-view="meinics"]').click();
  await expect(page.locator('#view-meinics')).toHaveClass(/active/);
});
