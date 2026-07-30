const revealItems = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

const yearTarget = document.getElementById('year');
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

function closeNav() {
  if (!navToggle || !navLinks) return;
  navToggle.setAttribute('aria-expanded', 'false');
  navLinks.classList.remove('open');
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navLinks.classList.toggle('open', !isOpen);
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
}

// Resume modal behavior
const resumeBtn = document.getElementById('resume-btn');
const resumeBtnMobile = document.getElementById('resume-btn-mobile');
const resumeBtnHero = document.getElementById('resume-btn-hero');
const resumeModal = document.getElementById('resume-modal');
const resumeBackdrop = document.getElementById('resume-backdrop');
const resumeClose = document.getElementById('resume-close');

function openResume(e) {
  if (e) e.preventDefault();
  if (!resumeModal) return;
  resumeModal.setAttribute('aria-hidden', 'false');
}

function closeResume() {
  if (!resumeModal) return;
  resumeModal.setAttribute('aria-hidden', 'true');
}

if (resumeBtn) resumeBtn.addEventListener('click', openResume);
if (resumeBtnMobile) resumeBtnMobile.addEventListener('click', openResume);
if (resumeBtnHero) resumeBtnHero.addEventListener('click', openResume);
if (resumeBackdrop) resumeBackdrop.addEventListener('click', closeResume);
if (resumeClose) resumeClose.addEventListener('click', closeResume);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && resumeModal && resumeModal.getAttribute('aria-hidden') === 'false') closeResume();
});

// Load local-only workspace projects from projects.json (if present)
async function loadProjects() {
  try {
    const res = await fetch('projects.json');
    if (!res.ok) return;
    const projects = await res.json();
    const section = document.getElementById('local-work');
    const grid = document.getElementById('local-project-grid');
    if (!grid || !projects.length) return;

    projects.forEach(p => {
      const isLocal = p.path.startsWith('file:///') || !/^https?:\/\//i.test(p.path);
      const art = document.createElement('article');
      art.className = 'project-card reveal';
      const displayPath = p.path.replace('file:///', '');
      art.innerHTML = `
        <div style="height:140px;background:linear-gradient(135deg,rgba(79,209,255,0.08),rgba(124,124,255,0.06));display:flex;align-items:center;justify-content:center;color:var(--muted);font-weight:600;">${p.name}</div>
        <div class="project-card__body">
          <h3>${p.name}</h3>
          <p class="project-desc">${isLocal ? 'Local file — not deployed yet.' : 'Hosted project reference.'}</p>
          <div class="card-links">
            ${isLocal
              ? `<button type="button" class="local-copy-btn" data-path="${displayPath}">Copy path</button>`
              : `<a href="${p.path}" target="_blank" rel="noreferrer">Open</a>`}
          </div>
        </div>
      `;
      grid.appendChild(art);
      observer.observe(art);
    });

    if (section) section.hidden = false;

    grid.querySelectorAll('.local-copy-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const path = btn.getAttribute('data-path');
        try {
          await navigator.clipboard.writeText(path);
          const original = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = original; }, 1500);
        } catch (e) {
          // clipboard unavailable; ignore silently
        }
      });
    });
  } catch (e) {
    // ignore if file missing
  }
}

loadProjects();

// Live GitHub stats — falls back to the static numbers already in the HTML if the API is unavailable
const GITHUB_USERNAME = 'dghimirey';

async function loadGithubStats() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    if (!res.ok) return;
    const user = await res.json();
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el && value !== undefined && value !== null) el.textContent = value;
    };
    setText('gh-repos-hero', user.public_repos);
    setText('gh-followers-hero', user.followers);
    setText('gh-repos-pulse', user.public_repos);
    setText('gh-gists-pulse', user.public_gists);
    setText('gh-followers-pulse', user.followers);
  } catch (e) {
    // API unreachable or rate-limited; static fallback numbers stay in place
  }
}

async function loadGithubActivity() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`);
    if (!res.ok) return;
    const events = await res.json();
    const list = document.getElementById('gh-activity-list');
    if (!list || !Array.isArray(events) || !events.length) return;

    const describe = (event) => {
      const repoName = event.repo && event.repo.name ? event.repo.name.split('/').pop() : 'a repository';
      const repoUrl = event.repo ? `https://github.com/${event.repo.name}` : '#';
      switch (event.type) {
        case 'PushEvent': {
          const count = event.payload && event.payload.commits ? event.payload.commits.length : 1;
          return `Pushed ${count} commit${count === 1 ? '' : 's'} to <a href="${repoUrl}" target="_blank" rel="noreferrer">${repoName}</a>`;
        }
        case 'CreateEvent':
          return `Created ${event.payload && event.payload.ref_type ? event.payload.ref_type : 'a ref'} in <a href="${repoUrl}" target="_blank" rel="noreferrer">${repoName}</a>`;
        case 'PullRequestEvent':
          return `${event.payload && event.payload.action === 'opened' ? 'Opened' : 'Updated'} a pull request on <a href="${repoUrl}" target="_blank" rel="noreferrer">${repoName}</a>`;
        case 'IssuesEvent':
          return `${event.payload && event.payload.action === 'opened' ? 'Opened' : 'Updated'} an issue on <a href="${repoUrl}" target="_blank" rel="noreferrer">${repoName}</a>`;
        case 'WatchEvent':
          return `Starred <a href="${repoUrl}" target="_blank" rel="noreferrer">${repoName}</a>`;
        case 'ForkEvent':
          return `Forked <a href="${repoUrl}" target="_blank" rel="noreferrer">${repoName}</a>`;
        default:
          return `Active on <a href="${repoUrl}" target="_blank" rel="noreferrer">${repoName}</a>`;
      }
    };

    const items = events.slice(0, 4).map(describe);
    if (!items.length) return;
    list.innerHTML = items.map(text => `<li>${text}</li>`).join('');
  } catch (e) {
    // API unreachable or rate-limited; static fallback list stays in place
  }
}

loadGithubStats();
loadGithubActivity();

// Contact form: send via mailto or WhatsApp
const contactForm = document.getElementById('contact-form');
const contactWaBtn = document.getElementById('contact-wa');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value || 'Someone';
    const email = document.getElementById('contact-email').value || '';
    const msg = document.getElementById('contact-message').value || '';
    const subject = encodeURIComponent('Portfolio contact from ' + name);
    const body = encodeURIComponent(msg + '\n\n' + name + (email ? (' — ' + email) : ''));
    window.location.href = `mailto:sachinbista2102@gmail.com?subject=${subject}&body=${body}`;
  });
}
if (contactWaBtn) {
  contactWaBtn.addEventListener('click', () => {
    const name = document.getElementById('contact-name').value || 'Someone';
    const email = document.getElementById('contact-email').value || '';
    const msg = document.getElementById('contact-message').value || '';
    const text = encodeURIComponent(`${msg}\n\nFrom: ${name}${email ? ' — ' + email : ''}`);
    // Nepal country code format without + for wa.me
    window.open(`https://wa.me/9779867418402?text=${text}`, '_blank');
  });
}

// WhatsApp widget logic
const waOpen = document.getElementById('wa-open');
const waPanel = document.getElementById('wa-panel');
const waClose = document.getElementById('wa-close');
const waMessages = document.getElementById('wa-messages');
const waInput = document.getElementById('wa-input');
const waSend = document.getElementById('wa-send');
const waOpenLink = document.getElementById('wa-open-link');

function appendMessage(text, who='bot'){
  if(!waMessages) return;
  const el = document.createElement('div');
  el.className = 'wa-msg ' + (who==='user' ? 'user' : 'bot');
  el.textContent = text;
  waMessages.appendChild(el);
  waMessages.scrollTop = waMessages.scrollHeight;
}

if (waOpen) waOpen.addEventListener('click', ()=>{
  if (waPanel) waPanel.setAttribute('aria-hidden','false');
  appendMessage('Hi! I\'m Sachin\'s assistant. How can I help today?');
});
if (waClose) waClose.addEventListener('click', ()=>{ if (waPanel) waPanel.setAttribute('aria-hidden','true'); });

if (waSend) waSend.addEventListener('click', ()=>{
  const text = waInput.value.trim();
  if (!text) return;
  appendMessage(text,'user');
  waInput.value='';
  // basic canned responses
  setTimeout(()=>{
    if (/price|cost|fee/i.test(text)) appendMessage('Thanks — for pricing details, share your requirements and I\'ll respond with a tailored quote.');
    else if (/hire|project|work|collab/i.test(text)) appendMessage('Great — please share a short brief and preferred timeline, and I\'ll get back with next steps.');
    else appendMessage('Thanks for the message — I\'ll get back to you soon. You can also continue this chat in WhatsApp.');
  },600);
});

if (waInput) {
  waInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (waSend) waSend.click();
    }
  });
}

if (waOpenLink) {
  waOpenLink.addEventListener('click', (e)=>{
    e.preventDefault();
    // gather messages to send
    let texts = [];
    document.querySelectorAll('.wa-msg').forEach(m=>texts.push(m.textContent));
    const payload = encodeURIComponent(texts.join('\n'));
    window.open(`https://wa.me/9779867418402?text=${payload}`,'_blank');
  });
}
