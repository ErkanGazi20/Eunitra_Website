const DEFAULT_STATS={projects:24,success:91,markets:6};

async function getStats(){
  const cfg=window.EUNITRA_CONFIG||{};
  const url=cfg.supabaseUrl||'';
  const key=cfg.supabasePublishableKey||'';
  const configured=url.startsWith('https://')&&!url.includes('YOUR_SUPABASE')&&key.length>20&&!key.includes('YOUR_SUPABASE');
  if(!configured)return DEFAULT_STATS;
  try{
    const response=await fetch(`${url}/rest/v1/site_stats?id=eq.1&select=projects,success,markets`,{
      headers:{apikey:key,Accept:'application/json'}
    });
    if(!response.ok)throw new Error(`Stats request failed: ${response.status}`);
    const rows=await response.json();
    return rows[0]?{...DEFAULT_STATS,...rows[0]}:DEFAULT_STATS;
  }catch(error){
    console.error('Could not load EUNITRA statistics:',error);
    return DEFAULT_STATS;
  }
}

async function renderStats(){
  const s=await getStats();
  const p=document.getElementById('projectsCompleted');
  const r=document.getElementById('successRate');
  const m=document.getElementById('marketsSupported');
  if(p)p.textContent=`${s.projects}+`;
  if(r)r.textContent=`${s.success}%`;
  if(m)m.textContent=s.markets;
}

function setLanguage(lang){document.documentElement.lang=lang;document.querySelectorAll('[data-en][data-tr]').forEach(el=>{el.textContent=el.dataset[lang]});document.querySelectorAll('.lang-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.lang===lang));localStorage.setItem('eunitraLang',lang)}
document.querySelectorAll('.lang-btn').forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.lang)));
const menu=document.querySelector('.menu-toggle');const nav=document.querySelector('.main-nav');if(menu&&nav)menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
const form=document.getElementById('contactForm');
if(form)form.addEventListener('submit',async e=>{
  e.preventDefault();
  const lang=localStorage.getItem('eunitraLang')||'en';
  const message=document.getElementById('formMessage');
  const button=form.querySelector('button[type="submit"]');
  const data=new FormData(form);
  if(data.get('_honey')) return;

  const payload={
    name:data.get('name'),
    organisation:data.get('organisation')||'—',
    email:data.get('email'),
    topic:data.get('topic'),
    message:data.get('message'),
    _subject:'New EUNITRA website enquiry',
    _template:'table'
  };

  button.disabled=true;
  button.textContent=lang==='tr'?'Gönderiliyor…':'Sending…';
  message.textContent='';

  try{
    const response=await fetch('https://formsubmit.co/ajax/ulku@eunitra.com',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify(payload)
    });
    const result=await response.json();
    if(!response.ok||result.success===false) throw new Error(result.message||'Submission failed');
    message.textContent=lang==='tr'?'Teşekkürler. Mesajınız EUNITRA’ya gönderildi. En kısa sürede sizinle iletişime geçeceğiz.':'Thank you. Your message has been sent to EUNITRA. We will be in touch shortly.';
    form.reset();
  }catch(error){
    console.error(error);
    message.textContent=lang==='tr'?'Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin veya doğrudan ulku@eunitra.com adresine e-posta gönderin.':'We could not send your message. Please try again later or email ulku@eunitra.com directly.';
  }finally{
    button.disabled=false;
    button.textContent=lang==='tr'?'Mesaj gönder':'Send enquiry';
  }
});

renderStats();
setLanguage(localStorage.getItem('eunitraLang')||'en');
