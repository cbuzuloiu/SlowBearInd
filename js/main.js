/* ============================================================
   NAVBAR — scroll effect + active link + mobile menu
============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navItems  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveLink();
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-link')) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  }
});

function updateActiveLink() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

/* ============================================================
   COUNTER ANIMATION — trust bar numbers
============================================================ */
function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800;
  const step     = 16;
  const steps    = duration / step;
  const increment = target / steps;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.trust-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ============================================================
   REVEAL ANIMATION — scroll-in sections
============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   PORTFOLIO CAROUSEL
============================================================ */
const track    = document.getElementById('carouselTrack');
const prevBtn  = document.getElementById('carouselPrev');
const nextBtn  = document.getElementById('carouselNext');
const dotsEl   = document.getElementById('carouselDots');
const carousel = document.getElementById('carousel');

const cards         = track.querySelectorAll('.portfolio-card');
const totalCards    = cards.length;
let currentIndex    = 0;
let visibleCards    = getVisibleCount();
let maxIndex        = Math.max(0, totalCards - visibleCards);

function getVisibleCount() {
  if (window.innerWidth < 480) return 1;
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function getCardWidth() {
  const card = cards[0];
  const gap  = 24;
  return card.offsetWidth + gap;
}

function goTo(index) {
  visibleCards = getVisibleCount();
  maxIndex     = Math.max(0, totalCards - visibleCards);
  currentIndex = Math.max(0, Math.min(index, maxIndex));
  track.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
  updateDots();
}

function buildDots() {
  dotsEl.innerHTML = '';
  visibleCards = getVisibleCount();
  maxIndex     = Math.max(0, totalCards - visibleCards);
  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === currentIndex ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  }
}

function updateDots() {
  dotsEl.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

// Touch / drag support
let dragStart = 0;
let isDragging = false;

carousel.addEventListener('mousedown', e => {
  dragStart  = e.clientX;
  isDragging = true;
  carousel.classList.add('dragging');
});

window.addEventListener('mousemove', e => {
  if (!isDragging) return;
});

window.addEventListener('mouseup', e => {
  if (!isDragging) return;
  isDragging = false;
  carousel.classList.remove('dragging');
  const diff = dragStart - e.clientX;
  if (Math.abs(diff) > 50) {
    goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
  }
});

carousel.addEventListener('touchstart', e => {
  dragStart = e.touches[0].clientX;
}, { passive: true });

carousel.addEventListener('touchend', e => {
  const diff = dragStart - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
  }
}, { passive: true });

// Rebuild on resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    buildDots();
    goTo(currentIndex);
  }, 150);
});

buildDots();
goTo(0);

/* ============================================================
   PORTFOLIO MODAL
============================================================ */
const projects = {
  'office-rewiring': {
    category: 'Commercial',
    imgClass: 'portfolio-img--1',
    title: 'Office Building Rewiring',
    desc: [
      'A comprehensive electrical overhaul of a 3-floor, 2,400 sqm commercial office building in the city center. The building\'s original wiring dated back to the 1980s and was no longer compliant with current safety regulations — presenting real fire and fault risks for the tenants.',
      'Our team stripped and replaced the entire wiring infrastructure across all floors, installed two new 400A main distribution panels, and added dedicated circuits for server rooms, kitchen areas, and conference facilities. All cable runs were neatly concealed within new conduit channels to preserve the building\'s renovated interior.',
      'Emergency exit lighting, fire alarm integration, and surge protection were completed as part of the same contract. The building passed its post-inspection with zero deficiencies and received its updated electrical compliance certificate on schedule.'
    ],
    meta: [
      { icon: 'fa-calendar', label: 'Duration', value: '6 weeks' },
      { icon: 'fa-building', label: 'Client', value: 'Corporate Office' },
      { icon: 'fa-ruler-combined', label: 'Area', value: '2,400 sqm' },
      { icon: 'fa-bolt', label: 'Panel', value: '2 × 400A' }
    ]
  },
  'panel-upgrade': {
    category: 'Residential',
    imgClass: 'portfolio-img--2',
    title: 'Residential Panel Upgrade',
    desc: [
      'A complete electrical panel replacement for a 1960s family home that had retained its original fuse box — a common safety concern in older residential properties. The homeowner had started experiencing frequent trips and flickering lights, signalling the system was dangerously overloaded.',
      'We replaced the outdated 100A fuse board with a modern 200A circuit breaker panel featuring separate circuits for high-draw appliances, a dedicated EV charger circuit, and full GFCI protection in wet areas. All existing wiring was inspected and deteriorated runs were replaced before the new panel was energised.',
      'The work was completed over two days with only planned outages during the switchover, and the home passed its local authority electrical inspection with a clean certificate. The client now has capacity to safely expand their home\'s electrical load for years to come.'
    ],
    meta: [
      { icon: 'fa-calendar', label: 'Duration', value: '2 days' },
      { icon: 'fa-house-chimney-user', label: 'Client', value: 'Private Homeowner' },
      { icon: 'fa-bolt', label: 'New Panel', value: '200A' },
      { icon: 'fa-shield-halved', label: 'Result', value: 'Full compliance' }
    ]
  },
  'retail-installation': {
    category: 'Commercial',
    imgClass: 'portfolio-img--3',
    title: 'Retail Store Installation',
    desc: [
      'End-to-end electrical installation for a new 480 sqm retail store opening in a busy shopping centre. The project was handled from bare shell — no existing electrical infrastructure was in place, requiring full design and installation from scratch to meet both the landlord\'s requirements and the tenant\'s operational needs.',
      'We installed a 3-phase main supply, distributed consumer units for different zones of the store, dedicated circuits for HVAC, LED display lighting, fitting room circuits, and a cluster of 12 POS (point-of-sale) power and data stations across the sales floor. Decorative pendant lighting and concealed track lighting were wired to dimmer systems.',
      'The installation was coordinated closely with the fit-out contractor to meet a hard opening deadline. We completed all electrical work two days ahead of schedule, allowing extra time for final snagging and the store to open without delays.'
    ],
    meta: [
      { icon: 'fa-calendar', label: 'Duration', value: '3 weeks' },
      { icon: 'fa-store', label: 'Client', value: 'Retail Tenant' },
      { icon: 'fa-ruler-combined', label: 'Area', value: '480 sqm' },
      { icon: 'fa-plug', label: 'Supply', value: '3-phase' }
    ]
  },
  'warehouse-led': {
    category: 'Industrial',
    imgClass: 'portfolio-img--4',
    title: 'Warehouse LED Retrofit',
    desc: [
      'A large-scale industrial lighting upgrade across a 5,000 sqm distribution warehouse. The existing metal halide fixtures were over 20 years old, consuming excessive power, generating significant heat, and producing inconsistent light levels — all of which were impacting both worker safety and operating costs.',
      'We replaced 420 high-bay metal halide fixtures with modern LED equivalents, reconfigured the lighting circuits into controlled zones, and integrated occupancy sensors in low-traffic areas such as maintenance corridors and storage bays. The entire retrofit was phased across weekend shifts to avoid disruption to the warehouse\'s daily operations.',
      'Post-installation energy monitoring confirmed a 62% reduction in lighting-related electricity consumption. Workers reported significantly improved visibility at ground level, and the client expects full ROI on the retrofit within 28 months based on current energy pricing.'
    ],
    meta: [
      { icon: 'fa-calendar', label: 'Duration', value: '4 weekends' },
      { icon: 'fa-industry', label: 'Client', value: 'Distribution Company' },
      { icon: 'fa-ruler-combined', label: 'Area', value: '5,000 sqm' },
      { icon: 'fa-leaf', label: 'Energy saved', value: '62%' }
    ]
  },
  'smart-home': {
    category: 'Residential',
    imgClass: 'portfolio-img--5',
    title: 'Smart Home Integration',
    desc: [
      'A full smart electrical system design and installation for a newly built 320 sqm residential property. The client wanted complete control over all lighting, power circuits, and climate support from a single app — with scenes, schedules, and remote access built in from day one.',
      'We installed a Lutron Caseta lighting control system across 18 zones, wired motorised blind actuators in the living areas and master bedroom, and ran dedicated circuits for a 22kW EV charger, home theatre room, and a rooftop terrace entertainment setup. Whole-home surge protection and a smart consumer unit with remote monitoring were included to protect the investment.',
      'All systems were commissioned, tested, and programmed in collaboration with the client before handover. A full user guide and remote support package were provided, and the setup has been running without fault since installation. This project is a strong example of how modern electrical infrastructure can be invisible yet powerful.'
    ],
    meta: [
      { icon: 'fa-calendar', label: 'Duration', value: '5 weeks' },
      { icon: 'fa-house-chimney-user', label: 'Client', value: 'Private Homeowner' },
      { icon: 'fa-ruler-combined', label: 'Area', value: '320 sqm' },
      { icon: 'fa-lightbulb', label: 'Zones', value: '18 lighting zones' }
    ]
  },
  'generator-setup': {
    category: 'Commercial',
    imgClass: 'portfolio-img--6',
    title: 'Emergency Generator Setup',
    desc: [
      'Design and installation of a mission-critical backup power system for a private medical facility. Power interruptions at this site were unacceptable — the facility operates diagnostic equipment and refrigerated medical storage that cannot tolerate even a brief outage without risk to patient safety.',
      'We installed a 150kW diesel standby generator with an automatic transfer switch (ATS) configured for sub-10-second failover. Critical circuits — including the operating room, imaging suite, server room, and drug refrigeration units — were isolated onto a dedicated sub-panel backed by an additional online UPS for zero-transition protection.',
      'The entire system was load-tested under full simulated demand before sign-off, and monthly automated test cycles were configured. Full documentation, maintenance schedules, and staff training were delivered as part of the handover package. The facility has since experienced two mains outages with zero disruption to operations.'
    ],
    meta: [
      { icon: 'fa-calendar', label: 'Duration', value: '3 weeks' },
      { icon: 'fa-hospital', label: 'Client', value: 'Medical Facility' },
      { icon: 'fa-bolt', label: 'Generator', value: '150kW diesel' },
      { icon: 'fa-clock-rotate-left', label: 'Failover', value: '< 10 seconds' }
    ]
  }
};

const modalOverlay = document.getElementById('modalOverlay');
const modalBox     = document.getElementById('modalBox');
const modalClose   = document.getElementById('modalClose');
const modalImg     = document.getElementById('modalImg');
const modalCat     = document.getElementById('modalCategory');
const modalTitle   = document.getElementById('modalTitle');
const modalDesc    = document.getElementById('modalDesc');
const modalMeta    = document.getElementById('modalMeta');

function openModal(key) {
  const p = projects[key];
  if (!p) return;

  modalImg.className   = 'modal-img ' + p.imgClass;
  modalCat.textContent = p.category;
  modalTitle.textContent = p.title;

  modalDesc.innerHTML = p.desc.map(t => `<p>${t}</p>`).join('');

  modalMeta.innerHTML = p.meta.map(m => `
    <div class="modal-chip">
      <i class="fa-solid ${m.icon}"></i>
      <strong>${m.label}:</strong>
      <span>${m.value}</span>
    </div>
  `).join('');

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.portfolio-card[data-project]').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.project));
});

modalClose.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', e => {
  if (!modalBox.contains(e.target)) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ============================================================
   SMOOTH SCROLL — offset for fixed navbar
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 8;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
