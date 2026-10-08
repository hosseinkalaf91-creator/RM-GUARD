'use strict';

const officers = [
  ['KHALEGH_RM','خالق','حسین آر ام','@Khalegh___RM','نظارت کلی بر گارد، تصمیم‌گیری‌های نهایی و مدیریت ساختار اصلی RM.',''],
  ['KHALEGH²_RM','خالق دوم','کارن آر ام','@want_zone','نظارت کلی بر گارد، تصمیم‌گیری‌های نهایی و مدیریت ساختار اصلی RM.',''],
  ['ARSHAD','مقام ارشد','مانی','@mavan__meme','نظارت بر عملکرد مقام‌ها، رسیدگی به مسائل مهم و کمک به مدیریت گارد.',''],
  ['LEADER','لیدر','پارسا','@User_HESOYAM','مدیریت اعضا، اجرای قوانین و هماهنگی فعالیت‌های گارد.',''],
  ['LEADER²','لیدر ۲','امیر','@HAMILTON_O','همکاری با LEADER و برعهده گرفتن مدیریت در زمان نبودن او.',''],
  ['CO-LEADER','کولیدر','حسین','@HosseinMoca','کمک به LEADER، پیگیری امور اعضا و اجرای تصمیمات مدیریت.','سازنده سایت: طراحی، ساخت و توسعه وب‌سایت رسمی RM GUARD.'],
  ['CREATOR','کریتور','دکستر','@its_the_dexter','همکاری با CREATOR و کمک در اجرای ایده‌ها و پروژه‌های گارد.',''],
  ['QUEEN','ملکه','نازی','@Leonaz_5','همکاری در مدیریت اجتماعی گارد، ایجاد هماهنگی بین اعضا و کمک به حفظ نظم.',''],
  ['GUARD','عضو گارد','ممبرها','—','رعایت قوانین RM، احترام به مقام‌ها و همکاری در فعالیت‌های گارد.','']
];

const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeLdLQp7mK3b6IeEbkw91jz2vB3U_JDUi2cyHtcxkQC0f07Lw/formResponse';
const seen = new Set();
let currentOfficer = 0;

const $ = id => document.getElementById(id);
const modal = $('modal');
const officerList = $('officerList');

function renderOfficers() {
  officerList.innerHTML = '';
  officers.forEach((o, i) => {
    const el = document.createElement('article');
    el.className = 'officer';
    el.dataset.i = i;
    el.innerHTML = `<div class="rank"></div><h3></h3><div class="role"></div><span class="status">مشاهده توضیحات</span>`;
    el.querySelector('.rank').textContent = o[0];
    el.querySelector('h3').textContent = o[2];
    el.querySelector('.role').textContent = `${o[1]} · ${o[3]}`;
    el.addEventListener('click', () => openOfficer(i));
    officerList.appendChild(el);
  });
}

function openOfficer(i) {
  currentOfficer = i;
  const o = officers[i];
  $('mRank').textContent = o[0];
  $('mName').textContent = `${o[2]} | ${o[1]}`;
  $('mText').textContent = `آیدی روبیکا: ${o[3]}`;
  $('mDuty').textContent = `وظیفه: ${o[4]}`;
  $('mExtra').textContent = o[5] || '';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOfficer() {
  seen.add(currentOfficer);
  const card = officerList.querySelector(`[data-i="${currentOfficer}"]`);
  if (card) {
    card.querySelector('.status').textContent = '✓ مشاهده شد';
    card.style.borderColor = '#777';
  }
  modal.classList.remove('open');
  document.body.style.overflow = '';
  updateLock();
}

function updateLock() {
  $('progress').textContent = `${seen.size} از ${officers.length} مشاهده شد`;
  if (seen.size === officers.length) {
    $('joinLock').textContent = '✓ توضیحات تمام مقام‌دارها مشاهده شد. ثبت‌نام فعال است.';
    $('joinLock').classList.add('ready');
    $('lockMsg').textContent = '✓ همه مقام‌دارها را مشاهده کردید. اکنون می‌توانید ثبت‌نام کنید.';
    $('lockMsg').classList.add('ready');
    $('joinForm').style.opacity = '1';
    $('joinForm').style.pointerEvents = 'auto';
  }
}

function closeMenu() { $('nav').classList.remove('open'); }

$('close').addEventListener('click', closeOfficer);
$('done').addEventListener('click', closeOfficer);
modal.addEventListener('click', e => { if (e.target === modal) e.stopPropagation(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeOfficer(); });

$('menuBtn').addEventListener('click', () => $('nav').classList.toggle('open'));
document.querySelectorAll('#nav a').forEach(a => a.addEventListener('click', closeMenu));

$('joinForm').addEventListener('submit', async e => {
  e.preventDefault();
  if (seen.size !== officers.length) return;

  const attack = document.querySelector('input[name="attack"]:checked')?.value;
  const attackText = attack === 'yes'
    ? 'بله،امکان و آمادگی شرکت در اتک ها را دارم'
    : 'خیر، امکان شرکت در اتک ها را ندارم';
  const rulesText = 'قوانین گارد RM را مطالعه کردم و با آن موافقم.';

  const data = new FormData();
  data.append('entry.314238582', $('name').value.trim());
  data.append('entry.285030876', $('nick').value.trim());
  data.append('entry.479487623', $('rubika').value.trim());
  data.append('entry.1561042894', $('age').value.trim());
  data.append('entry.124169759', attackText);
  data.append('entry.1566681406', rulesText);

  const button = $('joinForm').querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'در حال ثبت...';

  try {
    await fetch(formUrl, { method: 'POST', mode: 'no-cors', body: data });
  } catch (err) {
    // Google Forms may block browser access to the response because of CORS.
    // The no-cors request is still sent; the site intentionally does not expose response data.
  }

  $('joinForm').classList.add('hidden');
  $('lockMsg').classList.add('hidden');
  $('success').classList.remove('hidden');
  if (attack === 'yes') $('slaughter').classList.remove('hidden');
});

$('copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('RM');
    $('copy').textContent = '✓ کپی شد';
    setTimeout(() => $('copy').textContent = 'کپی RM', 1500);
  } catch {
    const area = document.createElement('textarea');
    area.value = 'RM';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
    $('copy').textContent = '✓ کپی شد';
    setTimeout(() => $('copy').textContent = 'کپی RM', 1500);
  }
});

const searchable = [...document.querySelectorAll('main section')].map(s => ({ id: s.id, text: s.innerText }));
function doSearch() {
  const q = $('searchInput').value.trim().toLowerCase();
  $('results').innerHTML = '';
  if (!q) return;
  const hits = searchable.filter(x => x.text.toLowerCase().includes(q));
  if (!hits.length) {
    $('results').innerHTML = '<div class="no-result">موردی پیدا نشد.</div>';
    return;
  }
  hits.slice(0, 8).forEach(x => {
    const d = document.createElement('div');
    d.className = 'search-result';
    d.textContent = x.text.replace(/\s+/g, ' ').slice(0, 170) + '...';
    d.addEventListener('click', () => document.getElementById(x.id)?.scrollIntoView({ behavior: 'smooth' }));
    $('results').appendChild(d);
  });
}
$('searchBtn').addEventListener('click', doSearch);
$('searchInput').addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

renderOfficers();
updateLock();
