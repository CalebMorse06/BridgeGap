export type TemplateType = 'service_booking' | 'restaurant_menu' | 'event_registration' | 'waitlist' | 'portfolio' | 'donation'

export interface GenerateConfig {
  projectId?: string
  notificationEmail?: string
  brandColor?: string
  [key: string]: string | undefined
}

export function generateAppHTML(templateType: TemplateType, config: GenerateConfig): string {
  switch (templateType) {
    case 'service_booking': return generateServiceBooking(config)
    case 'restaurant_menu': return generateRestaurantMenu(config)
    case 'event_registration': return generateEventRegistration(config)
    case 'waitlist': return generateWaitlist(config)
    case 'portfolio': return generatePortfolio(config)
    case 'donation': return generateDonation(config)
    default: return generateServiceBooking(config)
  }
}

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://vibedeploy.app'

function e(s: string | undefined): string {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ---------------------------------------------------------------------------
// SHARED STYLES — crisp, modern, mobile-first
// ---------------------------------------------------------------------------
const BASE_CSS = (primary: string, primaryLight: string) => `
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fff;color:#111827;-webkit-font-smoothing:antialiased;line-height:1.6}
  :root{--p:${primary};--ph:color-mix(in srgb,${primary} 82%,#000);--pl:${primaryLight};--pr:color-mix(in srgb,${primary} 12%,transparent)}
  a{color:inherit;text-decoration:none}
  .c{max-width:1080px;margin:0 auto;padding:0 24px}
  .sec{padding:80px 0}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 32px;border-radius:12px;font-weight:600;font-size:15px;border:none;cursor:pointer;transition:all .2s;white-space:nowrap;font-family:inherit}
  .btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,.12)}
  .btn:active{transform:translateY(0);box-shadow:none}
  .btn-p{background:var(--p);color:#fff}.btn-p:hover{background:var(--ph)}
  .btn-o{background:#fff;color:var(--p);border:2px solid var(--p)}.btn-o:hover{background:var(--p);color:#fff}
  .btn-w{background:#fff;color:#111827;box-shadow:0 1px 4px rgba(0,0,0,.12)}
  input,textarea,select{width:100%;padding:13px 16px;border:1.5px solid #e5e7eb;border-radius:12px;font-size:15px;font-family:inherit;outline:none;transition:.2s;background:#fff;color:#111827}
  input:focus,textarea:focus,select:focus{border-color:var(--p);box-shadow:0 0 0 3px var(--pr)}
  input::placeholder,textarea::placeholder{color:#9ca3af}
  label{display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px}
  .fg{margin-bottom:20px}
  .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden}
  .card-p{padding:28px}
  .grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
  .grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px}
  .tag{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:99px;font-size:13px;font-weight:500}
  .fade{animation:fadeIn .6s ease-out}
  @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
  @keyframes checkmark{from{stroke-dashoffset:80}to{stroke-dashoffset:0}}
  @media(max-width:768px){.sec{padding:56px 0}.c{padding:0 16px}.g3{grid-template-columns:1fr}.hm{display:none!important}.btn{padding:12px 24px;font-size:14px}}
`

const SUCCESS_OVERLAY = `
<div id="overlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(4px);z-index:200;align-items:center;justify-content:center">
  <div style="background:#fff;border-radius:20px;padding:44px 36px;max-width:380px;width:90%;text-align:center;animation:fadeIn .35s ease-out">
    <div style="width:64px;height:64px;background:#ecfdf5;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round"><polyline points="20,6 9,17 4,12" style="stroke-dasharray:80;stroke-dashoffset:80;animation:checkmark .5s ease-out .15s forwards"/></svg>
    </div>
    <h3 id="ol-title" style="font-size:20px;font-weight:800;color:#111827;margin-bottom:8px">Done!</h3>
    <p id="ol-msg" style="font-size:15px;color:#6b7280;line-height:1.6;margin-bottom:24px"></p>
    <button onclick="document.getElementById('overlay').style.display='none'" class="btn btn-p" style="width:100%">Close</button>
  </div>
</div>
`

const SUBMIT_SCRIPT = (projectId: string, projectName: string, templateType: string, notificationEmail: string, formId: string, successTitle: string, successMsg: string) => `
<script>
(function(){
  var form=document.getElementById('${formId}');
  if(!form)return;
  form.addEventListener('submit',function(ev){
    ev.preventDefault();
    var btn=form.querySelector('button[type=submit]');
    var orig=btn.innerHTML;
    btn.disabled=true;
    btn.innerHTML='<span class="spinner"></span> Submitting...';
    var fd=new FormData(form);
    var data={};
    fd.forEach(function(v,k){data[k]=v});
    fetch('${API_BASE}/api/submissions',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        projectId:'${projectId}',
        projectName:'${e(projectName)}',
        templateType:'${templateType}',
        notificationEmail:'${e(notificationEmail)}',
        data:data
      })
    }).then(function(){
      document.getElementById('ol-title').textContent='${successTitle}';
      document.getElementById('ol-msg').textContent='${successMsg}';
      document.getElementById('overlay').style.display='flex';
      form.reset();
    }).catch(function(){
      document.getElementById('ol-title').textContent='${successTitle}';
      document.getElementById('ol-msg').textContent='${successMsg}';
      document.getElementById('overlay').style.display='flex';
      form.reset();
    }).finally(function(){
      btn.disabled=false;
      btn.innerHTML=orig;
    });
  });
})();
</script>
`

const ANALYTICS_SCRIPT = (projectId: string) => `
<script>
(function(){
  if(!navigator.sendBeacon)return;
  var d=JSON.stringify({projectId:'${projectId}',stat:'views'});
  // fire-and-forget view event
  setTimeout(function(){
    fetch('${API_BASE}/api/analytics',{method:'POST',headers:{'Content-Type':'application/json'},body:d,keepalive:true}).catch(function(){});
  },1000);
})();
</script>
`

function head(title: string, primary: string, primaryLight: string, desc?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="description" content="${e(desc || title)}">
<meta property="og:title" content="${e(title)}">
<meta property="og:description" content="${e(desc || title)}">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✨</text></svg>">
<title>${e(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>${BASE_CSS(primary, primaryLight)}</style>
</head>
<body>
${SUCCESS_OVERLAY}`
}

function foot(projectId: string, primaryColor = '#2563eb', businessCtx: string = '{}'): string {
  const widget = `
<!-- AI Chat Widget -->
<div id="chatBtn" style="position:fixed;bottom:20px;right:20px;z-index:1000;background:var(--p,${primaryColor});color:#fff;border-radius:50px;padding:12px 20px;font-size:14px;font-weight:600;font-family:Inter,-apple-system,sans-serif;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.2);display:flex;align-items:center;gap:8px;transition:all .2s;border:none" onclick="toggleChat()" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
  <span style="font-size:18px">💬</span>
  <span id="chatBtnText">Ask a question</span>
</div>

<div id="chatBox" style="display:none;position:fixed;bottom:80px;right:20px;z-index:1000;width:min(340px,calc(100vw-40px));background:#fff;border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,.15);overflow:hidden;animation:fadeIn .2s ease-out;font-family:Inter,-apple-system,sans-serif">
  <div style="background:var(--p,${primaryColor});padding:16px 20px;display:flex;align-items:center;justify-content:space-between">
    <div style="color:#fff">
      <div style="font-weight:700;font-size:15px">Ask Us Anything</div>
      <div style="font-size:12px;opacity:.8">Powered by AI · Usually instant</div>
    </div>
    <button onclick="toggleChat()" style="background:rgba(255,255,255,.2);border:none;color:#fff;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center">×</button>
  </div>
  <div id="chatMsgs" style="height:200px;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px">
    <div style="background:#f3f4f6;padding:10px 14px;border-radius:12px;font-size:13px;color:#374151;max-width:80%">Hi! What would you like to know? 👋</div>
  </div>
  <div style="padding:12px 16px;border-top:1px solid #f3f4f6;display:flex;gap:8px">
    <input id="chatInput" type="text" placeholder="Type your question..." onkeydown="if(event.key==='Enter')sendChat()" style="flex:1;padding:8px 12px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:13px;outline:none;font-family:inherit" onfocus="this.style.borderColor='var(--p,${primaryColor})'" onblur="this.style.borderColor='#e5e7eb'">
    <button onclick="sendChat()" style="background:var(--p,${primaryColor});color:#fff;border:none;border-radius:10px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer">Send</button>
  </div>
</div>

<div id="vd-brand" style="position:fixed;bottom:20px;left:20px;z-index:999;display:flex;align-items:center;gap:6px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:6px 12px;box-shadow:0 2px 8px rgba(0,0,0,.06);font-family:Inter,-apple-system,sans-serif;cursor:pointer;font-size:11px;color:#9ca3af;font-weight:500" onclick="window.open('https://vibedeploy.app','_blank')">
  <span>✨</span>VibeDeploy
</div>

<script>
var chatOpen=false;
var businessCtx=${businessCtx};
function toggleChat(){
  chatOpen=!chatOpen;
  document.getElementById('chatBox').style.display=chatOpen?'flex':'none';
  if(chatOpen){document.getElementById('chatInput').focus();}
  document.getElementById('chatBtnText').textContent=chatOpen?'Close':'Ask a question';
}
function sendChat(){
  var input=document.getElementById('chatInput');
  var q=input.value.trim();
  if(!q)return;
  input.value='';
  addMsg(q,true);
  addMsg('...',false,'thinking');
  fetch('${API_BASE}/api/widget-chat',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({question:q,businessContext:businessCtx})
  }).then(function(r){return r.json()}).then(function(d){
    var el=document.getElementById('thinking');
    if(el){el.textContent=d.answer||'Please contact us for more info!';el.id='';}
  }).catch(function(){
    var el=document.getElementById('thinking');
    if(el){el.textContent='Please use the contact form or call us!';el.id='';}
  });
}
function addMsg(text,isUser,id){
  var msgs=document.getElementById('chatMsgs');
  var div=document.createElement('div');
  div.textContent=text;
  if(id)div.id=id;
  div.style.cssText='padding:10px 14px;border-radius:12px;font-size:13px;max-width:80%;'+(isUser?'background:var(--p,#2563eb);color:#fff;align-self:flex-end;margin-left:auto':'background:#f3f4f6;color:#374151');
  msgs.appendChild(div);
  msgs.scrollTop=msgs.scrollHeight;
}
</script>
`
  return `${widget}${ANALYTICS_SCRIPT(projectId)}</body></html>`
}

// ---------------------------------------------------------------------------
// SERVICE BOOKING
// ---------------------------------------------------------------------------
function generateServiceBooking(c: GenerateConfig): string {
  const name = c.businessName || 'Our Services'
  const rawServices = (c.services || 'Service').split(/[,\n]+/).map(s => s.trim()).filter(Boolean)
  const hours = c.hours || 'Mon–Fri 8am–5pm'
  const location = c.location || ''
  const email = c.contactEmail || ''
  const pid = c.projectId || ''
  const primary = c.brandColor || '#2563eb'
  const svcIcons = ['🔧','⚡','🏠','🛠️','💧','🔨','🪛','🧹','🏗️','🔩','🌿','🎨']

  return `${head(name, primary, '#eff6ff', `${name} — Book online today`)}
<nav style="position:sticky;top:0;z-index:50;background:rgba(255,255,255,.96);backdrop-filter:blur(12px);border-bottom:1px solid #f3f4f6">
  <div class="c" style="display:flex;align-items:center;justify-content:space-between;height:64px">
    <span style="font-size:18px;font-weight:800;color:#111827">${e(name)}</span>
    <div style="display:flex;align-items:center;gap:20px">
      <a href="#services" class="hm" style="font-size:14px;color:#6b7280;font-weight:500">Services</a>
      <a href="#book" class="hm" style="font-size:14px;color:#6b7280;font-weight:500">Book</a>
      <a href="#book" class="btn btn-p" style="padding:10px 22px;font-size:14px;border-radius:10px">Book Now</a>
    </div>
  </div>
</nav>

<section style="background:linear-gradient(140deg,#eff6ff 0%,#fff 55%,#f0fdf4 100%);padding:96px 0 80px;position:relative;overflow:hidden">
  <div style="position:absolute;top:-30%;right:-5%;width:480px;height:480px;background:radial-gradient(circle,rgba(37,99,235,.05) 0%,transparent 70%);border-radius:50%;pointer-events:none"></div>
  <div class="c fade" style="position:relative;z-index:1">
    <div class="tag" style="background:#dbeafe;color:#1d4ed8;margin-bottom:20px">
      <span style="width:7px;height:7px;background:#22c55e;border-radius:50%;display:inline-block"></span>
      Available for bookings
    </div>
    <h1 style="font-size:clamp(34px,5.5vw,58px);font-weight:900;color:#111827;line-height:1.08;letter-spacing:-.025em;margin-bottom:18px;max-width:620px">${e(name)}</h1>
    <p style="font-size:18px;color:#6b7280;max-width:480px;margin-bottom:36px;line-height:1.7">Professional, reliable service — book online in seconds. No phone tag, no waiting.</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <a href="#book" class="btn btn-p" style="font-size:16px;padding:16px 36px">📅 Book an Appointment</a>
      ${email ? `<a href="mailto:${e(email)}" class="btn btn-o">✉️ Email Us</a>` : ''}
    </div>
    <div style="display:flex;gap:28px;flex-wrap:wrap;margin-top:40px">
      ${[`⭐ 5-Star Service`, `🕐 ${hours}`, location ? `📍 ${location}` : '', `✅ Licensed & Insured`].filter(Boolean).map(t => `<span style="font-size:13px;color:#6b7280;font-weight:500">${e(t!)}</span>`).join('')}
    </div>
  </div>
</section>

<section class="sec" id="services">
  <div class="c">
    <div style="text-align:center;margin-bottom:48px">
      <h2 style="font-size:34px;font-weight:800;color:#111827;margin-bottom:10px">Our Services</h2>
      <p style="font-size:16px;color:#6b7280;max-width:440px;margin:0 auto">Everything handled professionally, every time.</p>
    </div>
    <div class="grid3">
      ${rawServices.map((s, i) => `
      <div class="card card-p" style="text-align:center;transition:transform .2s,box-shadow .2s" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 28px rgba(0,0,0,.08)'" onmouseout="this.style.transform='';this.style.boxShadow=''">
        <div style="width:56px;height:56px;border-radius:14px;background:var(--pl);display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 16px">${svcIcons[i % svcIcons.length]}</div>
        <h3 style="font-weight:700;font-size:16px;color:#111827;margin-bottom:6px">${e(s)}</h3>
        <p style="font-size:13px;color:#9ca3af;line-height:1.5">Handled by experienced professionals.</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="sec" style="background:#f9fafb">
  <div class="c">
    <div style="text-align:center;margin-bottom:48px">
      <h2 style="font-size:34px;font-weight:800;color:#111827;margin-bottom:10px">How It Works</h2>
    </div>
    <div class="grid3" style="max-width:780px;margin:0 auto">
      ${[
        {n:'1',i:'📝',t:'Book Online',d:'Pick your service, date, and time. Takes 60 seconds.'},
        {n:'2',i:'📱',t:'Get Confirmed',d:"We'll confirm within a few hours — often same day."},
        {n:'3',i:'✅',t:'Job Done',d:'We show up on time and get it done right, guaranteed.'},
      ].map(s => `
      <div style="text-align:center;padding:8px">
        <div style="width:52px;height:52px;border-radius:50%;background:var(--pl);color:var(--p);font-weight:900;font-size:20px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;border:2px solid var(--p)">${s.n}</div>
        <h3 style="font-weight:700;font-size:17px;color:#111827;margin-bottom:6px">${s.t}</h3>
        <p style="font-size:14px;color:#6b7280;line-height:1.6">${s.d}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="sec" style="background:#f9fafb">
  <div class="c">
    <div style="text-align:center;margin-bottom:40px">
      <h2 style="font-size:34px;font-weight:800;color:#111827;margin-bottom:10px">What Customers Say</h2>
      <p style="font-size:16px;color:#6b7280">Trusted by homeowners across ${e(location || 'the area')}</p>
    </div>
    <div class="grid3" style="max-width:900px;margin:0 auto">
      ${[
        {stars:5,text:'Showed up on time, fixed the problem fast, and was transparent about pricing. Will call again.',name:'Michael R.',icon:'👨'},
        {stars:5,text:'Very professional and friendly. They explained everything before starting. Highly recommend!',name:'Sarah K.',icon:'👩'},
        {stars:5,text:'Emergency call on a Sunday — they were there within 2 hours. Absolute lifesavers.',name:'James T.',icon:'👨‍💼'},
      ].map(t => `
      <div class="card card-p">
        <div style="display:flex;gap:2px;margin-bottom:12px;color:#f59e0b;font-size:18px">${'★'.repeat(t.stars)}</div>
        <p style="font-size:14px;color:#374151;line-height:1.6;margin-bottom:16px">"${t.text}"</p>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:36px;height:36px;background:#f3f4f6;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px">${t.icon}</div>
          <div style="font-size:13px;font-weight:600;color:#111827">${t.name}</div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="sec" id="book">
  <div class="c" style="max-width:560px">
    <div style="text-align:center;margin-bottom:36px">
      <h2 style="font-size:34px;font-weight:800;color:#111827;margin-bottom:10px">Book an Appointment</h2>
      <p style="font-size:16px;color:#6b7280">Fill this out and we'll confirm within 24 hours.</p>
    </div>
    <form id="bookForm" class="card" style="padding:36px;box-shadow:0 4px 24px rgba(0,0,0,.07)">
      <div class="fg"><label>Your Name</label><input type="text" name="name" placeholder="Jane Smith" required></div>
      <div class="fg"><label>Phone Number</label><input type="tel" name="phone" placeholder="(555) 123-4567" required></div>
      <div class="fg"><label>Email Address</label><input type="email" name="email" placeholder="jane@example.com"></div>
      <div class="fg"><label>Service Needed</label>
        <select name="service" required>
          <option value="">Select a service...</option>
          ${rawServices.map(s => `<option value="${e(s)}">${e(s)}</option>`).join('')}
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="fg"><label>Preferred Date</label><input type="date" name="date" required></div>
        <div class="fg"><label>Preferred Time</label>
          <select name="time"><option>Morning (8–12)</option><option>Afternoon (12–5)</option><option>Flexible</option></select>
        </div>
      </div>
      <div class="fg"><label>Additional Notes <span style="color:#9ca3af;font-weight:400">(optional)</span></label><textarea name="notes" rows="3" placeholder="Anything helpful for us to know..."></textarea></div>
      <button type="submit" class="btn btn-p" style="width:100%;font-size:16px;padding:16px;border-radius:12px">Request Appointment →</button>
      <p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:12px">No payment required to book. We'll confirm availability first.</p>
    </form>
  </div>
</section>

<footer style="background:#111827;padding:48px 0 32px">
  <div class="c" style="text-align:center">
    <p style="font-size:20px;font-weight:800;color:#fff;margin-bottom:10px">${e(name)}</p>
    <p style="font-size:14px;color:#9ca3af;line-height:2">${[hours && `🕐 ${e(hours)}`, location && `📍 ${e(location)}`, email && `✉️ <a href="mailto:${e(email)}" style="color:#60a5fa">${e(email)}</a>`].filter(Boolean).join(' &nbsp;·&nbsp; ')}</p>
    <div style="margin-top:24px;padding-top:20px;border-top:1px solid #1f2937">
      <p style="font-size:12px;color:#4b5563">Built with <a href="https://vibedeploy.app" style="color:#60a5fa;font-weight:500">VibeDeploy</a> — no coding required</p>
    </div>
  </div>
</footer>

${SUBMIT_SCRIPT(pid, name, 'service_booking', email, 'bookForm', 'Request Sent! 📅', "We'll confirm your appointment within 24 hours and send you a reminder the day before.")}
${foot(pid, primary, JSON.stringify({name:c.businessName||c.eventName||c.yourName||c.organizationName||"",services:c.services||"",hours:c.hours||"",location:c.location||"",email:c.contactEmail||""}))}`
}

// ---------------------------------------------------------------------------
// RESTAURANT MENU
// ---------------------------------------------------------------------------
function generateRestaurantMenu(c: GenerateConfig): string {
  const name = c.businessName || 'Our Restaurant'
  const cuisine = c.cuisine || 'Restaurant'
  const addressHours = c.addressAndHours || ''
  const phone = c.contactPhone || ''
  const location = addressHours.split('\n')[0] || ''
  const pid = c.projectId || ''
  const primary = c.brandColor || '#ea580c'

  const rawItems = (c.menuItems || '').split('\n').map(l => l.trim()).filter(Boolean)
  const items = rawItems.map(line => {
    const parts = line.split(/[—–-]{1,2}/)
    const price = (parts[2] || '').trim()
    return {
      name: (parts[0] || line).trim(),
      desc: (parts[1] || '').trim(),
      price: price ? (price.startsWith('$') ? price : `$${price}`) : '',
    }
  })

  // Group into sections if we can detect them (all caps = section header)
  const hasOrdering = /yes|yeah|online|order/i.test(c.onlineOrdering || '')

  return `${head(name, primary, '#fff7ed', `${name} — ${cuisine} · Full Menu`)}
<nav style="position:sticky;top:0;z-index:50;background:rgba(255,255,255,.96);backdrop-filter:blur(12px);border-bottom:1px solid #f3f4f6">
  <div class="c" style="display:flex;align-items:center;justify-content:space-between;height:64px">
    <span style="font-size:18px;font-weight:800;color:#111827">${e(name)}</span>
    <div style="display:flex;align-items:center;gap:16px">
      <a href="#menu" class="hm" style="font-size:14px;color:#6b7280;font-weight:500">Menu</a>
      <a href="#visit" class="hm" style="font-size:14px;color:#6b7280;font-weight:500">Visit</a>
      ${phone ? `<a href="tel:${e(phone)}" class="btn btn-p" style="padding:10px 20px;font-size:14px;border-radius:10px">📞 Order Now</a>` : ''}
    </div>
  </div>
</nav>

<section style="background:linear-gradient(155deg,#431407 0%,#9a3412 45%,#c2410c 100%);padding:96px 0 80px;text-align:center;color:#fff;position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.03) 1px,transparent 1px);background-size:32px 32px;pointer-events:none"></div>
  <div class="c fade" style="position:relative;z-index:1">
    <p style="font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#fed7aa;margin-bottom:16px">${e(cuisine)}</p>
    <h1 style="font-size:clamp(38px,7vw,68px);font-weight:900;line-height:1.05;margin-bottom:20px;letter-spacing:-.02em">${e(name)}</h1>
    <p style="font-size:17px;color:#fed7aa;max-width:420px;margin:0 auto 32px;line-height:1.7">Made with love, served with pride. Come taste the difference.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <a href="#menu" class="btn btn-w" style="font-weight:700">🍽️ See Our Menu</a>
      ${phone ? `<a href="tel:${e(phone)}" class="btn" style="background:rgba(255,255,255,.12);color:#fff;border:1.5px solid rgba(255,255,255,.25)">📞 ${e(phone)}</a>` : ''}
    </div>
    ${addressHours ? `<p style="margin-top:32px;font-size:14px;color:#fdba74;opacity:.9">📍 ${e(addressHours.split('\n')[0])}</p>` : ''}
  </div>
</section>

<!-- Social proof strip -->
<section style="background:#fff;border-bottom:1px solid #f3f4f6;padding:16px 0">
  <div class="c" style="display:flex;justify-content:center;gap:32px;flex-wrap:wrap">
    ${[`⭐ 4.9 on Google`, `🏆 ${cuisine} Favorite`, `📍 ${location||'Local Favorite'}`, `🕐 ${(addressHours||'').split('\n')[0]||'See Hours'}`].map(t=>`<span style="font-size:13px;color:#6b7280;font-weight:500">${e(t)}</span>`).join('')}
  </div>
</section>

<section class="sec" id="menu">
  <div class="c">
    <div style="text-align:center;margin-bottom:48px">
      <h2 style="font-size:34px;font-weight:800;color:#111827;margin-bottom:10px">Our Menu</h2>
      <p style="font-size:16px;color:#6b7280">Everything made fresh to order</p>
    </div>
    ${items.length > 0 ? `
    <div style="max-width:760px;margin:0 auto">
      ${items.map((item,i) => `
      <div style="display:flex;justify-content:space-between;align-items:start;gap:20px;padding:18px 0;border-bottom:1px solid #f3f4f6;${i===0?'border-top:1px solid #f3f4f6':''}">
        <div style="display:flex;gap:14px;flex:1">
          <div style="width:48px;height:48px;border-radius:10px;background:var(--pl);display:flex;align-items:center;justify-content:center;font-size:22px;shrink:0">🍽️</div>
          <div style="flex:1">
            <div style="font-weight:700;font-size:15px;color:#111827;margin-bottom:3px">${e(item.name)}</div>
            ${item.desc ? `<div style="font-size:13px;color:#6b7280;line-height:1.5">${e(item.desc)}</div>` : ''}
          </div>
        </div>
        <div style="text-align:right;shrink:0">
          ${item.price ? `<div style="font-weight:800;color:var(--p);font-size:16px">${e(item.price)}</div>` : ''}
          ${hasOrdering ? `<button onclick="addToCart('${e(item.name)}','${e(item.price)}')" style="margin-top:6px;padding:5px 12px;background:var(--p);color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer">Add</button>` : ''}
        </div>
      </div>`).join('')}
    </div>
    ${hasOrdering ? `
    <div id="cartBar" style="display:none;position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#111827;color:#fff;padding:14px 28px;border-radius:99px;font-size:14px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,.3);z-index:50;cursor:pointer;white-space:nowrap" onclick="submitOrder()">
      🛒 View Order (<span id="cartCount">0</span> items) →
    </div>
    <div style="text-align:center;margin-top:48px">
      <a href="${phone ? `tel:${e(phone)}` : '#'}" class="btn btn-p" style="font-size:16px;padding:16px 44px">📞 ${phone ? `Call to Order: ${e(phone)}` : 'Contact Us'}</a>
    </div>` : ''}
    ` : `
    <div style="text-align:center;padding:60px 20px">
      <div style="font-size:48px;margin-bottom:12px">🍽️</div>
      <p style="font-size:17px;color:#6b7280;margin-bottom:20px">Our full menu is coming soon!</p>
      ${phone ? `<a href="tel:${e(phone)}" class="btn btn-p">Call to Ask — ${e(phone)}</a>` : ''}
    </div>`}
  </div>
</section>

${hasOrdering ? `
<script>
var cart=[];
function addToCart(name,price){
  cart.push({name,price});
  document.getElementById('cartCount').textContent=cart.length;
  document.getElementById('cartBar').style.display='block';
}
function submitOrder(){
  var items=cart.map(function(i){return i.name}).join(', ');
  document.getElementById('ol-title').textContent='Order Placed! 🎉';
  document.getElementById('ol-msg').textContent='Your order for: '+items+'. We\\'ll prepare it right away!';
  document.getElementById('overlay').style.display='flex';
  cart=[];
  document.getElementById('cartBar').style.display='none';
}
</script>` : ''}

${addressHours ? `
<section class="sec" style="background:#fff7ed" id="visit">
  <div class="c" style="max-width:580px">
    <div style="text-align:center;margin-bottom:36px">
      <h2 style="font-size:34px;font-weight:800;color:#111827;margin-bottom:10px">Find Us</h2>
    </div>
    <div class="card" style="padding:36px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.06)">
      <div style="font-size:40px;margin-bottom:16px">📍</div>
      <p style="font-size:16px;color:#374151;line-height:2;white-space:pre-line">${e(addressHours)}</p>
      ${phone ? `<a href="tel:${e(phone)}" class="btn btn-p" style="margin-top:24px;width:100%;font-size:16px">📞 Call ${e(phone)}</a>` : ''}
    </div>
  </div>
</section>` : ''}

<footer style="background:#111827;padding:48px 0 32px">
  <div class="c" style="text-align:center">
    <p style="font-size:20px;font-weight:800;color:#fff;margin-bottom:10px">${e(name)}</p>
    <p style="font-size:14px;color:#9ca3af">${e(cuisine)}${addressHours ? ` · ${e(addressHours.split('\n')[0])}` : ''}${phone ? ` · ${e(phone)}` : ''}</p>
    <div style="margin-top:24px;padding-top:20px;border-top:1px solid #1f2937">
      <p style="font-size:12px;color:#4b5563">Built with <a href="https://vibedeploy.app" style="color:#fb923c;font-weight:500">VibeDeploy</a></p>
    </div>
  </div>
</footer>
${foot(pid, primary, JSON.stringify({name:c.businessName||c.eventName||c.yourName||c.organizationName||"",services:c.services||"",hours:c.hours||"",location:c.location||"",email:c.contactEmail||""}))}`
}

// ---------------------------------------------------------------------------
// EVENT REGISTRATION
// ---------------------------------------------------------------------------
function generateEventRegistration(c: GenerateConfig): string {
  const name = c.eventName || 'Our Event'
  const desc = c.description || ''
  const dateTime = c.dateTime || ''
  const location = c.location || ''
  const capacity = parseInt(c.capacity || '100')
  const pricing = c.pricing || 'Free'
  const isFree = /free/i.test(pricing)
  const pid = c.projectId || ''
  const primary = c.brandColor || '#059669'
  const notifEmail = c.notificationEmail || c.contactEmail || ''

  return `${head(name, primary, '#ecfdf5', desc || `Join us for ${name}`)}
<nav style="position:sticky;top:0;z-index:50;background:rgba(255,255,255,.96);backdrop-filter:blur(12px);border-bottom:1px solid #f3f4f6">
  <div class="c" style="display:flex;align-items:center;justify-content:space-between;height:64px">
    <span style="font-size:16px;font-weight:800;color:#111827">🎉 ${e(name)}</span>
    <a href="#register" class="btn btn-p" style="padding:10px 22px;font-size:14px;border-radius:10px">Register Now</a>
  </div>
</nav>

<section style="background:linear-gradient(155deg,#064e3b 0%,#059669 55%,#34d399 100%);padding:96px 0 80px;text-align:center;color:#fff;position:relative;overflow:hidden">
  <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px);background-size:40px 40px;pointer-events:none"></div>
  <div class="c fade" style="position:relative;z-index:1;max-width:700px">
    <span class="tag" style="background:rgba(255,255,255,.15);color:#fff;margin-bottom:20px">${isFree ? '🎟️ Free Event' : `🎟️ ${e(pricing)}`}</span>
    <h1 style="font-size:clamp(30px,5.5vw,52px);font-weight:900;line-height:1.1;margin-bottom:20px;letter-spacing:-.015em">${e(name)}</h1>
    ${desc ? `<p style="font-size:17px;color:#a7f3d0;max-width:560px;margin:0 auto 28px;line-height:1.7">${e(desc)}</p>` : ''}
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-bottom:36px">
      ${dateTime ? `<span class="tag" style="background:rgba(255,255,255,.15);color:#fff">📅 ${e(dateTime)}</span>` : ''}
      ${location ? `<span class="tag" style="background:rgba(255,255,255,.15);color:#fff">📍 ${e(location)}</span>` : ''}
      <span class="tag" style="background:rgba(255,255,255,.15);color:#fff">👥 <span id="spotCount">${capacity}</span> spots available</span>
    </div>
    <a href="#register" class="btn btn-w" style="font-weight:700;font-size:16px;padding:16px 40px">Reserve My Spot →</a>
  </div>
</section>

${dateTime || location ? `
<section class="sec" style="background:#f9fafb">
  <div class="c">
    <div class="grid3" style="max-width:720px;margin:0 auto">
      ${dateTime ? `<div class="card card-p" style="text-align:center"><div style="font-size:36px;margin-bottom:12px">📅</div><div style="font-weight:700;color:#111827;margin-bottom:4px">When</div><div style="font-size:14px;color:#6b7280">${e(dateTime)}</div></div>` : ''}
      ${location ? `<div class="card card-p" style="text-align:center"><div style="font-size:36px;margin-bottom:12px">📍</div><div style="font-weight:700;color:#111827;margin-bottom:4px">Where</div><div style="font-size:14px;color:#6b7280">${e(location)}</div></div>` : ''}
      <div class="card card-p" style="text-align:center"><div style="font-size:36px;margin-bottom:12px">${isFree ? '🆓' : '💳'}</div><div style="font-weight:700;color:#111827;margin-bottom:4px">Price</div><div style="font-size:14px;color:#6b7280">${isFree ? 'Free admission' : e(pricing)}</div></div>
    </div>
  </div>
</section>` : ''}

<section class="sec" id="register">
  <div class="c" style="max-width:520px">
    <div style="text-align:center;margin-bottom:36px">
      <h2 style="font-size:34px;font-weight:800;color:#111827;margin-bottom:10px">Register Now</h2>
      <p style="font-size:16px;color:#6b7280">${isFree ? "It's free — just let us know you're coming!" : `${e(pricing)} per person`}</p>
    </div>
    <form id="regForm" class="card" style="padding:36px;box-shadow:0 4px 24px rgba(0,0,0,.07)">
      <div class="fg"><label>Full Name</label><input type="text" name="name" placeholder="Jane Smith" required></div>
      <div class="fg"><label>Email Address</label><input type="email" name="email" placeholder="jane@example.com" required></div>
      <div class="fg"><label>Phone <span style="color:#9ca3af;font-weight:400">(optional)</span></label><input type="tel" name="phone" placeholder="(555) 123-4567"></div>
      <button type="submit" class="btn btn-p" style="width:100%;font-size:16px;padding:16px;border-radius:12px">
        ${isFree ? "Reserve My Spot →" : `Register — ${e(pricing)} →`}
      </button>
      <p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:12px">You'll receive a confirmation email with all the details.</p>
    </form>
  </div>
</section>

<footer style="background:#111827;padding:48px 0 32px">
  <div class="c" style="text-align:center">
    <p style="font-size:20px;font-weight:800;color:#fff;margin-bottom:10px">${e(name)}</p>
    <p style="font-size:14px;color:#9ca3af">${[dateTime && `📅 ${e(dateTime)}`, location && `📍 ${e(location)}`].filter(Boolean).join(' · ')}</p>
    <div style="margin-top:24px;padding-top:20px;border-top:1px solid #1f2937">
      <p style="font-size:12px;color:#4b5563">Built with <a href="https://vibedeploy.app" style="color:#34d399;font-weight:500">VibeDeploy</a></p>
    </div>
  </div>
</footer>

${SUBMIT_SCRIPT(pid, name, 'event_registration', notifEmail, 'regForm', "You're Registered! 🎉", "Check your email for confirmation details. We can't wait to see you there!")}
<script>
var spots=${capacity};
document.getElementById('regForm').addEventListener('submit',function(){
  spots=Math.max(0,spots-1);
  var el=document.getElementById('spotCount');
  if(el)el.textContent=spots;
},true);
</script>
${foot(pid, primary, JSON.stringify({name:c.businessName||c.eventName||c.yourName||c.organizationName||"",services:c.services||"",hours:c.hours||"",location:c.location||"",email:c.contactEmail||""}))}`
}

// ---------------------------------------------------------------------------
// WAITLIST
// ---------------------------------------------------------------------------
function generateWaitlist(c: GenerateConfig): string {
  const waitlistFor = c.waitlistFor || 'Our Program'
  const name = c.businessName || ''
  const totalSpots = parseInt(c.totalSpots || '100')
  const signed = Math.floor(totalSpots * 0.65)
  const pct = Math.round((signed / totalSpots) * 100)
  const pid = c.projectId || ''
  const primary = c.brandColor || '#7c3aed'
  const notifEmail = c.notificationEmail || ''

  return `${head(`Waitlist — ${waitlistFor}`, primary, '#f5f3ff', `Join the waitlist for ${waitlistFor}`)}

<section style="min-height:100vh;background:linear-gradient(155deg,#f5f3ff 0%,#fff 45%,#faf5ff 100%);display:flex;align-items:center;position:relative;overflow:hidden;padding:40px 0">
  <div style="position:absolute;top:-25%;left:-10%;width:700px;height:700px;background:radial-gradient(circle,rgba(124,58,237,.05) 0%,transparent 70%);border-radius:50%;pointer-events:none"></div>
  <div class="c fade" style="max-width:460px;padding:60px 24px;position:relative;z-index:1">
    ${name ? `<p style="text-align:center;font-size:14px;font-weight:600;color:#6b7280;margin-bottom:12px;letter-spacing:.02em">${e(name)}</p>` : ''}
    <h1 style="text-align:center;font-size:clamp(26px,5vw,38px);font-weight:900;color:#111827;line-height:1.2;margin-bottom:12px;letter-spacing:-.015em">
      Join the waitlist for<br><span style="color:var(--p)">${e(waitlistFor)}</span>
    </h1>
    <p style="text-align:center;font-size:16px;color:#6b7280;margin-bottom:32px;line-height:1.6">Limited spots. Sign up now and we'll let you know the moment you're in.</p>

    <div class="card" style="padding:22px;margin-bottom:20px;box-shadow:0 2px 12px rgba(124,58,237,.08)">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px">
        <span style="font-size:14px;color:#6b7280"><strong style="color:#111827;font-size:18px;font-weight:800">${signed}</strong> people signed up</span>
        <span style="font-size:13px;font-weight:700;color:var(--p)">${totalSpots} total spots</span>
      </div>
      <div style="background:#ede9fe;border-radius:99px;height:10px;overflow:hidden">
        <div id="progBar" style="background:linear-gradient(90deg,var(--p),color-mix(in srgb,var(--p) 70%,#a855f7));height:100%;border-radius:99px;width:${pct}%;transition:width 1.2s ease-out"></div>
      </div>
      <p style="font-size:13px;color:#9ca3af;margin-top:8px;text-align:center">${100 - pct}% of spots still available</p>
    </div>

    <form id="wlForm" class="card" style="padding:32px;box-shadow:0 4px 24px rgba(124,58,237,.1)">
      <div class="fg"><label>Full Name</label><input type="text" name="name" placeholder="Jane Smith" required></div>
      <div class="fg"><label>Email Address</label><input type="email" name="email" placeholder="jane@example.com" required></div>
      <button type="submit" class="btn" style="width:100%;background:var(--p);color:#fff;font-size:16px;padding:16px;border-radius:12px">
        Join the Waitlist →
      </button>
      <p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:12px">No spam. We'll only email you when your spot is ready.</p>
    </form>

    <p style="text-align:center;margin-top:32px;font-size:12px;color:#9ca3af">
      Built with <a href="https://vibedeploy.app" style="color:var(--p);font-weight:500">VibeDeploy</a>
    </p>
  </div>
</section>

${SUBMIT_SCRIPT(pid, waitlistFor, 'waitlist', notifEmail, 'wlForm', "You're on the List! 🎉", `You're #${signed + 1} in line. We'll email you as soon as a spot opens up.`)}
<script>
var total=${totalSpots},cur=${signed};
document.getElementById('wlForm').addEventListener('submit',function(){
  cur++;
  var p=Math.round((cur/total)*100);
  var bar=document.getElementById('progBar');
  if(bar)bar.style.width=p+'%';
},true);
</script>
${foot(pid, primary, JSON.stringify({name:c.businessName||c.eventName||c.yourName||c.organizationName||"",services:c.services||"",hours:c.hours||"",location:c.location||"",email:c.contactEmail||""}))}`
}

// ---------------------------------------------------------------------------
// PORTFOLIO (new template)
// ---------------------------------------------------------------------------
function generatePortfolio(c: GenerateConfig): string {
  const name = c.yourName || 'Your Name'
  const role = c.role || 'Freelancer'
  const bio = c.bio || `I help clients achieve their goals through high-quality ${role.toLowerCase()} work.`
  const skills = (c.skills || 'Design, Development, Strategy').split(/[,\n]+/).map(s => s.trim()).filter(Boolean)
  const email = c.contactEmail || ''
  const pid = c.projectId || ''
  const primary = c.brandColor || '#6366f1'

  return `${head(`${name} — ${role}`, primary, '#eef2ff', `${name} · ${role} · Available for hire`)}
<nav style="position:sticky;top:0;z-index:50;background:rgba(255,255,255,.96);backdrop-filter:blur(12px);border-bottom:1px solid #f3f4f6">
  <div class="c" style="display:flex;align-items:center;justify-content:space-between;height:64px">
    <span style="font-size:18px;font-weight:800;color:#111827">${e(name)}</span>
    <div style="display:flex;gap:20px;align-items:center">
      ${['About','Skills','Contact'].map(l => `<a href="#${l.toLowerCase()}" class="hm" style="font-size:14px;color:#6b7280;font-weight:500">${l}</a>`).join('')}
      ${email ? `<a href="mailto:${e(email)}" class="btn btn-p" style="padding:10px 22px;font-size:14px;border-radius:10px">Hire Me</a>` : ''}
    </div>
  </div>
</nav>

<section style="padding:100px 0 80px;background:linear-gradient(140deg,#eef2ff 0%,#fff 60%)" id="about">
  <div class="c fade" style="max-width:640px">
    <div class="tag" style="background:#e0e7ff;color:#4338ca;margin-bottom:20px">
      <span style="width:7px;height:7px;background:#22c55e;border-radius:50%;display:inline-block"></span>
      Available for new projects
    </div>
    <h1 style="font-size:clamp(36px,6vw,60px);font-weight:900;color:#111827;line-height:1.08;letter-spacing:-.025em;margin-bottom:12px">Hey, I'm<br>${e(name)} 👋</h1>
    <p style="font-size:18px;color:#6b7280;margin-bottom:12px;font-weight:600">${e(role)}</p>
    <p style="font-size:17px;color:#6b7280;line-height:1.7;margin-bottom:36px;max-width:520px">${e(bio)}</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      ${email ? `<a href="mailto:${e(email)}" class="btn btn-p" style="font-size:16px;padding:16px 36px">Let's Work Together →</a>` : ''}
      <a href="#skills" class="btn btn-o">See My Work</a>
    </div>
  </div>
</section>

<section class="sec" style="background:#f9fafb" id="skills">
  <div class="c">
    <div style="text-align:center;margin-bottom:48px">
      <h2 style="font-size:34px;font-weight:800;color:#111827;margin-bottom:10px">What I Do</h2>
      <p style="font-size:16px;color:#6b7280">Skills and expertise I bring to every project</p>
    </div>
    <div class="grid3">
      ${skills.map((s, i) => {
        const icons = ['✨','🎯','⚡','🛠️','🚀','🎨','📊','🔍','💡']
        return `<div class="card card-p" style="text-align:center">
          <div style="font-size:32px;margin-bottom:12px">${icons[i % icons.length]}</div>
          <h3 style="font-weight:700;font-size:16px;color:#111827">${e(s)}</h3>
        </div>`
      }).join('')}
    </div>
  </div>
</section>

${email ? `
<section class="sec" id="contact">
  <div class="c" style="max-width:520px;text-align:center">
    <h2 style="font-size:34px;font-weight:800;color:#111827;margin-bottom:12px">Let's Work Together</h2>
    <p style="font-size:17px;color:#6b7280;margin-bottom:36px;line-height:1.7">Have a project in mind? I'd love to hear about it. Reach out and let's chat.</p>
    <a href="mailto:${e(email)}" class="btn btn-p" style="font-size:17px;padding:18px 44px">📧 ${e(email)}</a>
  </div>
</section>` : ''}

<footer style="background:#111827;padding:40px 0 28px">
  <div class="c" style="text-align:center">
    <p style="font-weight:800;color:#fff;margin-bottom:6px">${e(name)}</p>
    <p style="font-size:14px;color:#9ca3af">${e(role)}</p>
    <div style="margin-top:20px;padding-top:16px;border-top:1px solid #1f2937">
      <p style="font-size:12px;color:#4b5563">Built with <a href="https://vibedeploy.app" style="color:#818cf8;font-weight:500">VibeDeploy</a></p>
    </div>
  </div>
</footer>
${foot(pid, primary, JSON.stringify({name:c.businessName||c.eventName||c.yourName||c.organizationName||"",services:c.services||"",hours:c.hours||"",location:c.location||"",email:c.contactEmail||""}))}`
}

// ---------------------------------------------------------------------------
// DONATION PAGE (new template)
// ---------------------------------------------------------------------------
function generateDonation(c: GenerateConfig): string {
  const orgName = c.organizationName || 'Our Cause'
  const mission = c.mission || 'We are working to make a positive impact in our community.'
  const goal = parseInt(c.fundraisingGoal || '5000')
  const raised = Math.floor(goal * 0.42)
  const pct = Math.round((raised / goal) * 100)
  const pid = c.projectId || ''
  const primary = c.brandColor || '#dc2626'
  const notifEmail = c.notificationEmail || ''

  return `${head(`Donate — ${orgName}`, primary, '#fef2f2', `Support ${orgName}`)}
<nav style="position:sticky;top:0;z-index:50;background:rgba(255,255,255,.96);backdrop-filter:blur(12px);border-bottom:1px solid #f3f4f6">
  <div class="c" style="display:flex;align-items:center;justify-content:space-between;height:64px">
    <span style="font-size:18px;font-weight:800;color:#111827">❤️ ${e(orgName)}</span>
    <a href="#donate" class="btn btn-p" style="padding:10px 22px;font-size:14px;border-radius:10px">Donate Now</a>
  </div>
</nav>

<section style="padding:96px 0 80px;background:linear-gradient(140deg,#fef2f2 0%,#fff 60%)">
  <div class="c fade" style="max-width:600px;text-align:center">
    <div style="font-size:64px;margin-bottom:20px">❤️</div>
    <h1 style="font-size:clamp(32px,5.5vw,52px);font-weight:900;color:#111827;line-height:1.1;margin-bottom:16px">Support ${e(orgName)}</h1>
    <p style="font-size:18px;color:#6b7280;max-width:500px;margin:0 auto 36px;line-height:1.7">${e(mission)}</p>
    <a href="#donate" class="btn btn-p" style="font-size:16px;padding:16px 40px">Make a Donation →</a>
  </div>
</section>

<section class="sec" style="background:#f9fafb">
  <div class="c" style="max-width:560px">
    <div class="card" style="padding:28px;margin-bottom:32px">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <span style="font-size:15px;color:#6b7280">Raised so far</span>
        <span style="font-size:15px;font-weight:700;color:var(--p)">Goal: $${goal.toLocaleString()}</span>
      </div>
      <div style="background:#fee2e2;border-radius:99px;height:12px;overflow:hidden;margin-bottom:8px">
        <div style="background:var(--p);height:100%;border-radius:99px;width:${pct}%;transition:width 1.5s ease-out"></div>
      </div>
      <div style="display:flex;justify-content:space-between">
        <span style="font-size:22px;font-weight:900;color:#111827">$${raised.toLocaleString()}</span>
        <span style="font-size:14px;color:#9ca3af;margin-top:4px">${pct}% of goal</span>
      </div>
    </div>
  </div>
</section>

<section class="sec" id="donate">
  <div class="c" style="max-width:480px">
    <div style="text-align:center;margin-bottom:36px">
      <h2 style="font-size:34px;font-weight:800;color:#111827;margin-bottom:10px">Make a Donation</h2>
      <p style="font-size:16px;color:#6b7280">Every dollar makes a difference.</p>
    </div>

    <form id="donateForm" class="card" style="padding:36px;box-shadow:0 4px 24px rgba(220,38,38,.08)">
      <div class="fg"><label>Your Name</label><input type="text" name="name" placeholder="Jane Smith" required></div>
      <div class="fg"><label>Email Address</label><input type="email" name="email" placeholder="jane@example.com" required></div>
      <div class="fg">
        <label>Donation Amount</label>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px">
          ${['$10','$25','$50','$100'].map((amt, i) => `
          <button type="button" onclick="selectAmt(this,'${amt}')" class="btn" style="background:${i===1?'var(--p)':'#f9fafb'};color:${i===1?'#fff':'#111827'};border:1.5px solid ${i===1?'var(--p)':'#e5e7eb'};padding:10px 8px;font-size:14px;border-radius:10px;font-weight:600">${amt}</button>`).join('')}
        </div>
        <input type="number" name="amount" id="amtInput" placeholder="Or enter custom amount" min="1" style="text-align:center">
      </div>
      <button type="submit" class="btn btn-p" style="width:100%;font-size:16px;padding:16px;border-radius:12px">❤️ Donate Now</button>
      <p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:12px">Secure donation. You'll receive a receipt by email.</p>
    </form>
  </div>
</section>

<footer style="background:#111827;padding:40px 0 28px">
  <div class="c" style="text-align:center">
    <p style="font-weight:800;color:#fff;margin-bottom:6px">❤️ ${e(orgName)}</p>
    <p style="font-size:12px;color:#4b5563;margin-top:16px">Built with <a href="https://vibedeploy.app" style="color:#f87171;font-weight:500">VibeDeploy</a></p>
  </div>
</footer>

${SUBMIT_SCRIPT(pid, orgName, 'donation', notifEmail, 'donateForm', "Thank You! ❤️", "Your donation has been received. You'll get a receipt in your email shortly.")}
<script>
function selectAmt(btn,amt){
  document.querySelectorAll('.amt-btn').forEach(function(b){b.style.background='#f9fafb';b.style.color='#111827';b.style.borderColor='#e5e7eb'});
  btn.style.background='var(--p)';btn.style.color='#fff';btn.style.borderColor='var(--p)';
  document.getElementById('amtInput').value=amt.replace('$','');
}
document.querySelectorAll('button[onclick]').forEach(function(b){b.classList.add('amt-btn')});
</script>
${foot(pid, primary, JSON.stringify({name:c.businessName||c.eventName||c.yourName||c.organizationName||"",services:c.services||"",hours:c.hours||"",location:c.location||"",email:c.contactEmail||""}))}`
}
