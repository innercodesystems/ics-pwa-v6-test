const { test, expect } = require('@playwright/test');

test('detect duplicate app-core bootstrap after successful sign-in', async ({ page }) => {
  const errors = [];
  const coreRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (new URL(request.url()).pathname.endsWith('/app-core.js')) coreRequests.push(request.url());
  });
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/**', route => route.fulfill({
    status: 200, contentType: 'application/javascript',
    body: `window.supabase={createClient:()=>({
      auth:{getSession:async()=>({data:{session:null},error:null}),
      signInWithPassword:async({email})=>({data:{user:{id:'mock-user',email}},error:null})},
      from:()=>({upsert:async()=>({error:null})})
    })};`
  }));
  await page.goto('http://127.0.0.1:4173/index.html');
  await expect(page.locator('#ics-auth-gate')).toBeVisible();
  await page.locator('#ics-login-email').fill('tester@example.invalid');
  await page.locator('#ics-login-password').fill('test-password');
  await page.locator('#ics-login-button').click();
  await expect(page.locator('#ics-auth-gate')).toHaveCount(0);
  await page.waitForTimeout(500);
  console.log('app-core requests:', JSON.stringify(coreRequests));
  console.log('page errors:', JSON.stringify(errors));
  expect(coreRequests, 'app-core should be requested only once during sign-in').toHaveLength(1);
  expect(errors.filter(message => /already been declared|redeclaration/i.test(message)), 'No redeclaration errors').toEqual([]);
});
