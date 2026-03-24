export type TemplateType = 'service_booking' | 'restaurant_menu' | 'event_registration' | 'waitlist'

export function generateAppHTML(templateType: TemplateType, config: Record<string, string>): string {
  switch (templateType) {
    case 'service_booking':
      return generateServiceBooking(config)
    case 'restaurant_menu':
      return generateRestaurantMenu(config)
    case 'event_registration':
      return generateEventRegistration(config)
    case 'waitlist':
      return generateWaitlist(config)
    default:
      return generateServiceBooking(config)
  }
}

function head(title: string, primaryColor = '#2563eb'): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escHtml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',-apple-system,sans-serif;background:#fff;color:#111827;-webkit-font-smoothing:antialiased}
  :root{--primary:${primaryColor};--primary-dark:color-mix(in srgb,${primaryColor} 85%,#000)}
  a{color:var(--primary);text-decoration:none}
  .btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:10px;font-weight:600;font-size:16px;border:none;cursor:pointer;transition:all .15s;white-space:nowrap}
  .btn-primary{background:var(--primary);color:#fff}.btn-primary:hover{background:var(--primary-dark)}
  .btn-outline{background:#fff;color:var(--primary);border:2px solid var(--primary)}.btn-outline:hover{background:var(--primary);color:#fff}
  .container{max-width:960px;margin:0 auto;padding:0 20px}
  .section{padding:64px 0}
  input,textarea,select{width:100%;padding:12px 16px;border:1.5px solid #e5e7eb;border-radius:10px;font-size:15px;font-family:inherit;outline:none;transition:.15s}
  input:focus,textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--primary) 15%,transparent)}
  label{display:block;font-size:14px;font-weight:500;color:#374151;margin-bottom:6px}
  .form-group{margin-bottom:20px}
  .card{background:#fff;border:1.5px solid #e5e7eb;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,.06)}
  nav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.95);backdrop-filter:blur(8px);border-bottom:1px solid #f3f4f6;padding:14px 0}
  .nav-inner{display:flex;align-items:center;justify-content:space-between}
  .logo{font-size:20px;font-weight:700;color:#111827}
  .tag{display:inline-block;padding:4px 12px;border-radius:99px;font-size:13px;font-weight:500}
  @media(max-width:640px){.section{padding:48px 0}.btn{padding:12px 20px;font-size:15px}}
</style>
</head>
<body>`
}

function foot(): string {
  return `</body></html>`
}

function escHtml(s: string): string {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function generateServiceBooking(c: Record<string, string>): string {
  const name = c.businessName || 'Our Services'
  const services = (c.services || 'Service').split(/[,\n]+/).map((s) => s.trim()).filter(Boolean)
  const hours = c.hours || 'Mon–Fri 8am–5pm'
  const location = c.location || ''
  const email = c.contactEmail || ''

  return `${head(name)}
<nav>
  <div class="container nav-inner">
    <div class="logo">${escHtml(name)}</div>
    <a href="#book" class="btn btn-primary" style="padding:10px 20px;font-size:14px">Book Now</a>
  </div>
</nav>

<section style="background:linear-gradient(135deg,#eff6ff 0%,#fff 60%);padding:80px 0 64px">
  <div class="container" style="text-align:center">
    <span class="tag" style="background:#dbeafe;color:#1d4ed8;margin-bottom:16px">✅ Available for bookings</span>
    <h1 style="font-size:clamp(32px,5vw,52px);font-weight:800;color:#111827;line-height:1.1;margin-bottom:16px">${escHtml(name)}</h1>
    <p style="font-size:18px;color:#6b7280;max-width:520px;margin:0 auto 32px">Professional service you can count on. Book online in seconds.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <a href="#book" class="btn btn-primary">📅 Book an Appointment</a>
      ${email ? `<a href="mailto:${escHtml(email)}" class="btn btn-outline">✉️ Email Us</a>` : ''}
    </div>
    ${location ? `<p style="margin-top:24px;font-size:14px;color:#9ca3af">📍 Serving ${escHtml(location)}</p>` : ''}
  </div>
</section>

<section class="section" id="services">
  <div class="container">
    <h2 style="text-align:center;font-size:28px;font-weight:700;margin-bottom:8px">What We Do</h2>
    <p style="text-align:center;color:#6b7280;margin-bottom:40px">Professional services tailored to your needs</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px">
      ${services.map((s) => `
      <div class="card" style="text-align:center">
        <div style="font-size:32px;margin-bottom:12px">🔧</div>
        <div style="font-weight:600;color:#111827">${escHtml(s)}</div>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="section" style="background:#f9fafb" id="book">
  <div class="container" style="max-width:560px">
    <h2 style="text-align:center;font-size:28px;font-weight:700;margin-bottom:8px">Book an Appointment</h2>
    <p style="text-align:center;color:#6b7280;margin-bottom:32px">Fill out the form below and we'll confirm within 24 hours.</p>
    <form id="bookingForm" class="card" style="padding:32px">
      <div class="form-group"><label>Your Name</label><input type="text" name="name" placeholder="Jane Smith" required></div>
      <div class="form-group"><label>Phone Number</label><input type="tel" name="phone" placeholder="(555) 123-4567" required></div>
      <div class="form-group"><label>Service Needed</label>
        <select name="service" required>
          <option value="">Select a service...</option>
          ${services.map((s) => `<option value="${escHtml(s)}">${escHtml(s)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Preferred Date</label><input type="date" name="date" required></div>
      <div class="form-group"><label>Preferred Time</label>
        <select name="time">
          <option>Morning (8am–12pm)</option>
          <option>Afternoon (12pm–5pm)</option>
          <option>Flexible</option>
        </select>
      </div>
      <div class="form-group"><label>Additional Notes (optional)</label><textarea name="notes" rows="3" placeholder="Any specific details..."></textarea></div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center">Request Booking ✓</button>
    </form>
    <div id="success" style="display:none;text-align:center;padding:40px">
      <div style="font-size:48px;margin-bottom:12px">🎉</div>
      <h3 style="font-size:22px;font-weight:700;margin-bottom:8px">Booking Request Sent!</h3>
      <p style="color:#6b7280">We'll confirm your appointment within 24 hours. Thank you!</p>
    </div>
  </div>
</section>

<footer style="background:#111827;color:#9ca3af;padding:40px 0">
  <div class="container" style="text-align:center">
    <p style="font-size:18px;font-weight:700;color:#fff;margin-bottom:8px">${escHtml(name)}</p>
    <p style="font-size:14px">🕐 ${escHtml(hours)}${location ? ` &nbsp;·&nbsp; 📍 ${escHtml(location)}` : ''}${email ? ` &nbsp;·&nbsp; ✉️ <a href="mailto:${escHtml(email)}" style="color:#60a5fa">${escHtml(email)}</a>` : ''}</p>
    <p style="margin-top:16px;font-size:12px;color:#4b5563">Powered by <a href="https://vibedeploy.app" style="color:#60a5fa">VibeDeploy</a></p>
  </div>
</footer>

<script>
document.getElementById('bookingForm').addEventListener('submit',function(e){
  e.preventDefault();
  var data=Object.fromEntries(new FormData(this).entries());
  console.log('Booking:', data);
  this.style.display='none';
  document.getElementById('success').style.display='block';
});
</script>
${foot()}`
}

function generateRestaurantMenu(c: Record<string, string>): string {
  const name = c.businessName || 'Our Restaurant'
  const cuisine = c.cuisine || 'Restaurant'
  const addressHours = c.addressAndHours || ''
  const phone = c.contactPhone || ''

  // Parse menu items: "Name — description — $price" per line
  const rawItems = (c.menuItems || '').split('\n').map((l) => l.trim()).filter(Boolean)
  const menuItems = rawItems.map((line) => {
    const parts = line.split(/[—–-]+/)
    return {
      name: (parts[0] || line).trim(),
      desc: (parts[1] || '').trim(),
      price: (parts[2] || '').trim(),
    }
  })

  return `${head(name, '#ea580c')}
<nav>
  <div class="container nav-inner">
    <div class="logo">${escHtml(name)}</div>
    ${phone ? `<a href="tel:${escHtml(phone)}" class="btn btn-primary" style="padding:10px 20px;font-size:14px">📞 Call Us</a>` : ''}
  </div>
</nav>

<section style="background:linear-gradient(135deg,#431407,#9a3412);padding:80px 0;text-align:center;color:#fff">
  <p style="font-size:14px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:#fed7aa;margin-bottom:12px">${escHtml(cuisine)}</p>
  <h1 style="font-size:clamp(36px,6vw,60px);font-weight:800;line-height:1.1;margin-bottom:16px">${escHtml(name)}</h1>
  <p style="font-size:18px;color:#fed7aa;max-width:480px;margin:0 auto">Authentic flavors, lovingly prepared.</p>
  ${addressHours ? `<p style="margin-top:24px;font-size:14px;color:#fdba74;opacity:.9">📍 ${escHtml(addressHours)}</p>` : ''}
</section>

<section class="section">
  <div class="container">
    <h2 style="text-align:center;font-size:28px;font-weight:700;margin-bottom:40px">Our Menu</h2>
    ${menuItems.length > 0 ? `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
      ${menuItems.map((item) => `
      <div class="card" style="display:flex;justify-content:space-between;align-items:start;gap:12px">
        <div>
          <div style="font-weight:600;color:#111827;margin-bottom:4px">${escHtml(item.name)}</div>
          ${item.desc ? `<div style="font-size:13px;color:#6b7280;line-height:1.5">${escHtml(item.desc)}</div>` : ''}
        </div>
        ${item.price ? `<div style="font-weight:700;color:#ea580c;font-size:16px;white-space:nowrap">${escHtml(item.price)}</div>` : ''}
      </div>`).join('')}
    </div>` : `<p style="text-align:center;color:#9ca3af">Menu coming soon!</p>`}
  </div>
</section>

${addressHours ? `
<section class="section" style="background:#fff7ed">
  <div class="container" style="max-width:480px;text-align:center">
    <h2 style="font-size:24px;font-weight:700;margin-bottom:24px">Find Us</h2>
    <div class="card">
      <p style="font-size:15px;color:#374151;line-height:1.8">${escHtml(addressHours).replace(/\n/g, '<br>')}</p>
      ${phone ? `<a href="tel:${escHtml(phone)}" class="btn btn-primary" style="margin-top:20px;width:100%;justify-content:center">📞 ${escHtml(phone)}</a>` : ''}
    </div>
  </div>
</section>` : ''}

<footer style="background:#1c1917;color:#9ca3af;padding:32px 0;text-align:center">
  <p style="font-weight:700;color:#fff;margin-bottom:4px">${escHtml(name)}</p>
  <p style="font-size:13px">Powered by <a href="https://vibedeploy.app" style="color:#fb923c">VibeDeploy</a></p>
</footer>
${foot()}`
}

function generateEventRegistration(c: Record<string, string>): string {
  const name = c.eventName || 'Our Event'
  const desc = c.description || ''
  const dateTime = c.dateTime || ''
  const location = c.location || ''
  const capacity = parseInt(c.capacity || '100')
  const pricing = c.pricing || 'Free'
  const isFree = /free/i.test(pricing)

  return `${head(name, '#059669')}
<nav>
  <div class="container nav-inner">
    <div class="logo" style="font-size:16px">🎉 ${escHtml(name)}</div>
    <a href="#register" class="btn btn-primary" style="padding:10px 20px;font-size:14px">Register Now</a>
  </div>
</nav>

<section style="background:linear-gradient(135deg,#064e3b,#059669);padding:80px 0;text-align:center;color:#fff">
  <span class="tag" style="background:rgba(255,255,255,.15);color:#fff;margin-bottom:16px">${isFree ? '🎟️ Free Event' : `🎟️ ${escHtml(pricing)}`}</span>
  <h1 style="font-size:clamp(30px,5vw,52px);font-weight:800;line-height:1.15;margin-bottom:16px;max-width:700px;margin-left:auto;margin-right:auto">${escHtml(name)}</h1>
  ${desc ? `<p style="font-size:18px;color:#a7f3d0;max-width:600px;margin:0 auto 24px">${escHtml(desc)}</p>` : ''}
  <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:16px;margin-top:8px">
    ${dateTime ? `<span style="background:rgba(255,255,255,.15);padding:8px 16px;border-radius:99px;font-size:14px">📅 ${escHtml(dateTime)}</span>` : ''}
    ${location ? `<span style="background:rgba(255,255,255,.15);padding:8px 16px;border-radius:99px;font-size:14px">📍 ${escHtml(location)}</span>` : ''}
    <span style="background:rgba(255,255,255,.15);padding:8px 16px;border-radius:99px;font-size:14px" id="spotsLeft">👥 <span id="spotsNum">${capacity}</span> spots available</span>
  </div>
</section>

<section class="section" id="register">
  <div class="container" style="max-width:520px">
    <h2 style="text-align:center;font-size:28px;font-weight:700;margin-bottom:8px">Reserve Your Spot</h2>
    <p style="text-align:center;color:#6b7280;margin-bottom:32px">${isFree ? 'It\'s free — just let us know you\'re coming!' : `${escHtml(pricing)} per person`}</p>
    <form id="regForm" class="card" style="padding:32px">
      <div class="form-group"><label>Full Name</label><input type="text" name="name" placeholder="Jane Smith" required></div>
      <div class="form-group"><label>Email Address</label><input type="email" name="email" placeholder="jane@example.com" required></div>
      <div class="form-group"><label>Phone (optional)</label><input type="tel" name="phone" placeholder="(555) 123-4567"></div>
      <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;background:#059669">
        ${isFree ? 'Reserve My Free Spot →' : `Register — ${escHtml(pricing)} →`}
      </button>
      <p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:12px">You'll receive a confirmation email with all the details.</p>
    </form>
    <div id="regSuccess" style="display:none;text-align:center;padding:40px">
      <div style="font-size:48px;margin-bottom:12px">🎉</div>
      <h3 style="font-size:22px;font-weight:700;margin-bottom:8px">You're registered!</h3>
      <p style="color:#6b7280">Check your email for confirmation details. See you there!</p>
    </div>
  </div>
</section>

<footer style="background:#111827;color:#9ca3af;padding:32px 0;text-align:center">
  <p style="font-weight:700;color:#fff;margin-bottom:4px">${escHtml(name)}</p>
  <p style="font-size:13px">Powered by <a href="https://vibedeploy.app" style="color:#34d399">VibeDeploy</a></p>
</footer>

<script>
var spots=${capacity};
document.getElementById('regForm').addEventListener('submit',function(e){
  e.preventDefault();
  spots=Math.max(0,spots-1);
  document.getElementById('spotsNum').textContent=spots;
  this.style.display='none';
  document.getElementById('regSuccess').style.display='block';
});
</script>
${foot()}`
}

function generateWaitlist(c: Record<string, string>): string {
  const waitlistFor = c.waitlistFor || 'Our Program'
  const name = c.businessName || ''
  const totalSpots = parseInt(c.totalSpots || '100')
  const mockSigned = Math.floor(totalSpots * 0.6)

  return `${head(`Waitlist — ${waitlistFor}`, '#7c3aed')}
<section style="min-height:100vh;background:linear-gradient(135deg,#f5f3ff 0%,#fff 60%);display:flex;align-items:center">
  <div class="container" style="max-width:520px;padding:60px 20px">
    <div style="text-align:center;margin-bottom:40px">
      <span class="tag" style="background:#ede9fe;color:#7c3aed;margin-bottom:16px">📋 Now Accepting Waitlist Signups</span>
      <h1 style="font-size:clamp(28px,5vw,42px);font-weight:800;color:#111827;line-height:1.2;margin-bottom:12px">
        Join the waitlist for<br><span style="color:#7c3aed">${escHtml(waitlistFor)}</span>
      </h1>
      ${name ? `<p style="color:#6b7280;font-size:16px">by ${escHtml(name)}</p>` : ''}
    </div>

    <!-- Progress -->
    <div class="card" style="margin-bottom:24px">
      <div style="display:flex;justify-content:space-between;margin-bottom:10px">
        <span style="font-size:14px;color:#6b7280">${mockSigned} people already signed up</span>
        <span style="font-size:14px;font-weight:600;color:#7c3aed">${totalSpots} total spots</span>
      </div>
      <div style="background:#ede9fe;border-radius:99px;height:8px;overflow:hidden">
        <div style="background:#7c3aed;height:100%;border-radius:99px;width:${Math.round((mockSigned/totalSpots)*100)}%;transition:width 1s"></div>
      </div>
    </div>

    <form id="waitlistForm" class="card" style="padding:32px">
      <div class="form-group"><label>Full Name</label><input type="text" name="name" placeholder="Jane Smith" required></div>
      <div class="form-group"><label>Email Address</label><input type="email" name="email" placeholder="jane@example.com" required></div>
      <button type="submit" class="btn" style="width:100%;justify-content:center;background:#7c3aed;color:#fff">
        Join Waitlist →
      </button>
      <p style="text-align:center;font-size:12px;color:#9ca3af;margin-top:12px">We'll email you when your spot is ready.</p>
    </form>

    <div id="waitlistSuccess" style="display:none;text-align:center" class="card">
      <div style="font-size:48px;margin:24px 0 12px">🎉</div>
      <h3 style="font-size:22px;font-weight:700;margin-bottom:8px">You're on the list!</h3>
      <p style="color:#6b7280;margin-bottom:8px">You're #<strong id="position">${mockSigned + 1}</strong> in line.</p>
      <p style="color:#6b7280;font-size:14px">We'll email you as soon as a spot opens up.</p>
    </div>

    <p style="text-align:center;margin-top:24px;font-size:12px;color:#9ca3af">
      Powered by <a href="https://vibedeploy.app" style="color:#7c3aed">VibeDeploy</a>
    </p>
  </div>
</section>

<script>
document.getElementById('waitlistForm').addEventListener('submit',function(e){
  e.preventDefault();
  this.style.display='none';
  document.getElementById('waitlistSuccess').style.display='block';
});
</script>
${foot()}`
}
