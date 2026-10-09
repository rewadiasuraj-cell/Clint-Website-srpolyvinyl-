// Run with jsdom available: NODE_PATH=/path/to/node_modules node scripts/check-refresh.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.join(__dirname, '../public');
const script = fs.readFileSync(path.join(root, 'js/main.js'), 'utf8');
function load(file, query = '') {
  const dom = new JSDOM(fs.readFileSync(path.join(root, file), 'utf8'), {url: 'https://example.com/' + file + query, runScripts: 'outside-only'});
  const w = dom.window, frames = [];
  w.HTMLMediaElement.prototype.pause = function () {};
  w.HTMLMediaElement.prototype.play = function () { return Promise.resolve(); };
  w.matchMedia = q => ({matches: q.includes('prefers-reduced-motion')});
  w.requestAnimationFrame = fn => frames.push(fn);
  w.eval(script);
  for(let i=0; i<3; i++){const batch=frames.splice(0);batch.forEach(fn=>fn(i*16));}
  return dom;
}
for (const file of ['products.html', 'products-alternative.html']) {
  const dom = load(file), w = dom.window, d = w.document;
  const visible = () => [...d.querySelectorAll('.catalog-card')].filter(c => !c.hidden);
  assert.equal(visible().length, 18);
  const search = d.getElementById('product-search'), filter = d.getElementById('product-filter');
  search.value = 'DINP'; search.dispatchEvent(new w.Event('input')); assert.equal(visible().length, 1);
  filter.value = 'resins'; filter.dispatchEvent(new w.Event('change')); assert.equal(visible().length, 0);
  assert.equal(d.getElementById('catalog-empty').hidden, false);
  search.value = ''; search.dispatchEvent(new w.Event('input')); assert.equal(visible().length, 3);
  filter.value = 'all'; filter.dispatchEvent(new w.Event('change')); assert.equal(visible().length, 18);
  dom.window.close();
}
{
  const dom = load('index.html'), d = dom.window.document;
  assert.equal(d.querySelectorAll('.slide').length, 6);
  assert.equal(d.querySelectorAll('.slider-dots button').length, 6);
  d.querySelector('.slider-arrow.next').click();
  assert.equal(d.querySelector('.slide.active').getAttribute('aria-label'), '2 of 6: Payal');
  assert.equal([...d.querySelectorAll('.slide')].filter(s => s.inert).length, 5);
  d.querySelector('.slider-pause').click(); assert.equal(d.querySelector('.slider-pause').getAttribute('aria-pressed'), 'true');
  d.querySelector('.hamburger').click(); assert.equal(d.querySelector('.hamburger').getAttribute('aria-expanded'), 'true');
  dom.window.close();
}
{
  const dom = load('contact.html', '?product=Titanium%20Dioxide&brand=Tricon'), w = dom.window, d = w.document;
  assert.equal(d.getElementById('f-product').value, 'Titanium Dioxide');
  assert.equal(d.getElementById('f-brand').value, 'Tricon');
  for (const [id,value] of [['f-name','Test Buyer'],['f-phone','9876543210'],['f-grade','Grade X'],['f-quantity','5 MT'],['f-location','Delhi'],['f-message','Please quote']]) d.getElementById(id).value = value;
  let sent;w.open=url=>{sent=url;};d.getElementById('sendWhatsApp').click();
  assert.ok(sent.startsWith('https://wa.me/918586980901'));
  const message = new URL(sent).searchParams.get('text');
  for(const text of ['Grade: Grade X','Quantity: 5 MT','Delivery location: Delhi','Manufacturer: Tricon','Enquiry type: Request a quote']) assert.ok(message.includes(text));
  dom.window.close();
}
for(const file of ['about.html','about-alternative.html']) {
  const dom = load(file);assert.ok(!/Integrity|certs\/|Infrastructure/i.test(dom.window.document.querySelector('main').innerHTML));dom.window.close();
}
console.log('PASS: both catalogs, grade search, combined filters, empty state, six-slide controls, focus isolation, pause, mobile menu, enquiry prefill and WhatsApp payload, About Us removals.');
