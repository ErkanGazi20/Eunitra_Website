const DEFAULT_STATS={projects:24,success:91,markets:6};
function getStats(){try{return {...DEFAULT_STATS,...JSON.parse(localStorage.getItem('eunitraStats')||'{}')}}catch(e){return DEFAULT_STATS}}
function renderStats(){const s=getStats();const p=document.getElementById('projectsCompleted');const r=document.getElementById('successRate');const m=document.getElementById('marketsSupported');if(p)p.textContent=`${s.projects}+`;if(r)r.textContent=`${s.success}%`;if(m)m.textContent=s.markets}
function setLanguage(lang){document.documentElement.lang=lang;document.querySelectorAll('[data-en][data-tr]').forEach(el=>{el.textContent=el.dataset[lang]});document.querySelectorAll('.lang-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.lang===lang));localStorage.setItem('eunitraLang',lang)}
document.querySelectorAll('.lang-btn').forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.lang)));
const menu=document.querySelector('.menu-toggle');const nav=document.querySelector('.main-nav');if(menu&&nav)menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
const form=document.getElementById('contactForm');if(form)form.addEventListener('submit',e=>{e.preventDefault();const lang=localStorage.getItem('eunitraLang')||'en';document.getElementById('formMessage').textContent=lang==='tr'?'Teşekkürler. Bu prototip form henüz bir sunucuya bağlı değildir.':'Thank you. This prototype form is not yet connected to a server.';form.reset()});
renderStats();setLanguage(localStorage.getItem('eunitraLang')||'en');
