/**
 * Gold Coast Solar & Energy Solutions
 * Interactive Engine & Hosting Diagnostics
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeroWidget();
  initBrandTabs();
  initSavingsCalculator();
  initQuoteWizard();
  initQuickContactForm();
  initHostingDiagnostics();
  initSmoothScroll();
});

/* -------------------------------------------------------------------------- */
/* 1. Mobile Navigation Toggle                                                 */
/* -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      toggleBtn.classList.toggle('open');
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 2. Quick Hero Solar Estimator Widget                                      */
/* -------------------------------------------------------------------------- */
function initHeroWidget() {
  const billBtns = document.querySelectorAll('#quick-bill-selector .bill-btn');
  const recSystem = document.getElementById('hero-rec-system');
  const recSavings = document.getElementById('hero-rec-savings');
  const recPayback = document.getElementById('hero-rec-payback');

  const estimates = {
    '400': { system: '6.6 kW Solar (16 x 415W Panels)', savings: '$1,450 / year', payback: '3.1 Years' },
    '700': { system: '10.0 kW Solar (24 x 415W Panels)', savings: '$2,380 / year', payback: '3.3 Years' },
    '1200': { system: '13.2 kW Solar + 10kWh Sungrow Battery', savings: '$3,850 / year', payback: '4.2 Years' },
    '1800': { system: '20.0 kW Commercial + Tesla Powerwall 3', savings: '$5,900 / year', payback: '4.5 Years' }
  };

  billBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      billBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const billVal = btn.dataset.bill;
      if (estimates[billVal]) {
        recSystem.textContent = estimates[billVal].system;
        recSavings.textContent = estimates[billVal].savings;
        recPayback.textContent = estimates[billVal].payback;
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 3. Solar Brands Filtering Tabs                                            */
/* -------------------------------------------------------------------------- */
function initBrandTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const brandCards = document.querySelectorAll('.brand-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category;

      brandCards.forEach(card => {
        if (category === 'all' || card.dataset.cat === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 4. Interactive Gold Coast Solar Savings Calculator                         */
/* -------------------------------------------------------------------------- */
function initSavingsCalculator() {
  const billSlider = document.getElementById('calc-bill');
  const billValDisplay = document.getElementById('calc-bill-val');
  
  const daytimeSlider = document.getElementById('calc-daytime');
  const daytimeValDisplay = document.getElementById('calc-daytime-val');
  
  const batteryCheckbox = document.getElementById('calc-has-battery');

  // Result displays
  const annualSavingsEl = document.getElementById('calc-annual-savings');
  const systemSizeEl = document.getElementById('calc-system-size');
  const paybackEl = document.getElementById('calc-payback');
  const co2El = document.getElementById('calc-co2');
  const total25YrEl = document.getElementById('calc-25yr');

  function calculateSavings() {
    const qBill = parseFloat(billSlider.value);
    const daytimePct = parseFloat(daytimeSlider.value) / 100;
    const hasBattery = batteryCheckbox.checked;

    // Display slider values
    billValDisplay.textContent = `$${qBill} / quarter`;
    daytimeValDisplay.textContent = `${Math.round(daytimePct * 100)}%`;

    // Calculation logic tailored for Gold Coast solar irradiance (~4.8 kWh/kWp/day)
    const annualBill = qBill * 4;
    
    // Efficiency multiplier: battery captures unused solar for nighttime peak
    let selfConsumptionFactor = daytimePct + (hasBattery ? 0.38 : 0.05);
    if (selfConsumptionFactor > 0.92) selfConsumptionFactor = 0.92;

    const estAnnualSavings = Math.round(annualBill * selfConsumptionFactor * 0.85);

    // Recommended system sizing
    let sysSize = '6.6 kW';
    let baseCost = 4800; // estimated after STC rebate
    
    if (qBill > 1400) {
      sysSize = '13.2 kW';
      baseCost = 8900;
    } else if (qBill > 800) {
      sysSize = '10.0 kW';
      baseCost = 6800;
    }

    if (hasBattery) {
      sysSize += ' + 10kWh Battery';
      baseCost += 8500;
    }

    const paybackYears = (baseCost / Math.max(estAnnualSavings, 800)).toFixed(1);
    const co2Offset = (estAnnualSavings * 0.0029).toFixed(1); // tonnes/yr
    const 25YrSavings = (estAnnualSavings * 25).toLocaleString();

    // Render results
    annualSavingsEl.textContent = `$${estAnnualSavings.toLocaleString()}`;
    systemSizeEl.textContent = sysSize;
    paybackEl.textContent = `${paybackYears} Yrs`;
    co2El.textContent = `${co2Offset} Tonnes`;
    total25YrEl.textContent = `$${25YrSavings}`;
  }

  if (billSlider && daytimeSlider) {
    billSlider.addEventListener('input', calculateSavings);
    daytimeSlider.addEventListener('input', calculateSavings);
    batteryCheckbox.addEventListener('change', calculateSavings);

    // Initial trigger
    calculateSavings();
  }
}

/* -------------------------------------------------------------------------- */
/* 5. Multi-step Quote Wizard Form                                           */
/* -------------------------------------------------------------------------- */
function initQuoteWizard() {
  const wizardForm = document.getElementById('quote-form');
  const steps = document.querySelectorAll('.wizard-step');
  const indicators = document.querySelectorAll('.step-indicator');
  const nextBtns = document.querySelectorAll('.btn-next');
  const prevBtns = document.querySelectorAll('.btn-prev');
  
  const modal = document.getElementById('quote-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalOk = document.getElementById('modal-ok-btn');
  const modalSummary = document.getElementById('modal-summary');

  // Option card radio toggle styling
  document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const input = card.querySelector('input');
      if (input && input.type === 'radio') {
        // Uncheck sibling option cards
        card.parentElement.querySelectorAll('.option-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        input.checked = true;
      } else if (input && input.type === 'checkbox') {
        card.classList.toggle('active');
        input.checked = !input.checked;
      }
    });
  });

  // Step navigation
  function goToStep(stepNum) {
    steps.forEach(s => s.classList.remove('active'));
    indicators.forEach(ind => ind.classList.remove('active'));

    const targetStep = document.getElementById(`step-${stepNum}`);
    if (targetStep) {
      targetStep.classList.add('active');
    }

    indicators.forEach(ind => {
      if (parseInt(ind.dataset.step) <= stepNum) {
        ind.classList.add('active');
      }
    });
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.dataset.goto);
      goToStep(target);
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.dataset.goto);
      goToStep(target);
    });
  });

  // Form submission
  if (wizardForm) {
    wizardForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(wizardForm);
      const data = {
        property: formData.get('property_type') || 'Single Story House',
        suburb: formData.get('suburb') || 'Gold Coast',
        name: formData.get('full_name') || 'Customer',
        phone: formData.get('phone') || 'N/A',
        email: formData.get('email') || 'N/A',
        brands: formData.getAll('preferred_brand').join(', ') || 'Installer Recommendation'
      };

      // Populate Modal Summary
      modalSummary.innerHTML = `
        <p><strong>Property:</strong> ${data.property} (${data.suburb})</p>
        <p><strong>Requested Brands:</strong> ${data.brands}</p>
        <p><strong>Contact Info:</strong> ${data.name} | ${data.phone} | ${data.email}</p>
        <p><strong>Status:</strong> <span style="color:#10b981; font-weight:700;">✓ Hosting Test Simulation Complete</span></p>
      `;

      // Show Modal
      modal.classList.add('active');
    });
  }

  // Modal Close
  function closeModal() {
    modal.classList.remove('active');
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOk) modalOk.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 6. Quick Contact Form                                                     */
/* -------------------------------------------------------------------------- */
function initQuickContactForm() {
  const contactForm = document.getElementById('quick-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your message has been sent. (Hosting test simulation)');
      contactForm.reset();
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 7. Hosting Environment Diagnostics Engine                                  */
/* -------------------------------------------------------------------------- */
function initHostingDiagnostics() {
  const diagDomain = document.getElementById('diag-domain');
  const diagLoadTime = document.getElementById('diag-loadtime');
  const diagViewport = document.getElementById('diag-viewport');

  if (diagDomain) {
    const protocol = window.location.protocol;
    const host = window.location.host || 'Local File / Preview';
    diagDomain.textContent = `${protocol}//${host}`;
  }

  if (diagLoadTime) {
    window.addEventListener('load', () => {
      const perf = window.performance.timing;
      if (perf && perf.loadEventEnd > 0) {
        const loadTimeMs = perf.loadEventEnd - perf.navigationStart;
        diagLoadTime.textContent = `✓ Loaded in ${loadTimeMs}ms`;
      } else {
        diagLoadTime.textContent = `✓ Ready (Standard Load)`;
      }
    });
  }

  if (diagViewport) {
    function updateViewport() {
      diagViewport.textContent = `${window.innerWidth}px x ${window.innerHeight}px`;
    }
    updateViewport();
    window.addEventListener('resize', updateViewport);
  }
}

/* -------------------------------------------------------------------------- */
/* 8. Smooth Scrolling Links                                                 */
/* -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
