// ICS navigation structural regression test. No external packages required.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const html = fs.readFileSync('index.html', 'utf8');
const core = fs.readFileSync('app-core.js', 'utf8');
const bootstrap = fs.readFileSync('app.js', 'utf8');
const nav = ['heute', 'meinics', 'journal', 'welten', 'mehr'];
for (const view of nav) {
  assert.match(html, new RegExp(`id=["']view-${view}["']`), 'Missing view: ' + view);
  assert.match(html, new RegExp(`data-view=["']${view}["']`), 'Missing nav button: ' + view);
}
assert.match(html, /id=["']view-nachschlagewerk["']/);
assert.match(html, /id=["']todayToNachschlagewerk["']/);
assert.match(core, /todayToNachschlagewerk\?\.addEventListener\(['"]click['"]/);
assert.match(core, /openView\(['"]nachschlagewerk['"]\)/);
assert.match(core, /navItems\.forEach\(\(item\) => \{/);
assert.match(core, /item\.addEventListener\(['"]click['"]/);
assert.match(core, /function openView\(/);
assert.match(bootstrap, /app-core\.js/);
console.log('ICS navigation structure: OK (' + nav.length + ' tabs + Nachschlagewerk)');
