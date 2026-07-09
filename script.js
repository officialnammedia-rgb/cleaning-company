document.addEventListener('DOMContentLoaded', () => {

  // --- SELECTORS ---
  const header = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');
  const quoteForm = document.getElementById('quoteForm');
  const formSuccess = document.getElementById('form-success');
  const successCloseBtn = document.getElementById('success-close-btn');

  // Customizer Selectors
  const customizerToggle = document.getElementById('customizer-toggle');
  const customizerCard = document.getElementById('customizer-card');
  const inputName = document.getElementById('input-business-name');
  const inputLocation = document.getElementById('input-location');
  const inputPhone = document.getElementById('input-phone');
  const inputAbn = document.getElementById('input-abn');
  const colorSwatches = document.querySelectorAll('.color-swatch');
  const customizerReset = document.getElementById('customizer-reset');

  // Footer Year
  document.getElementById('footer-year').textContent = new Date().getFullYear();

  // --- MOBILE NAV TOGGLE ---
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // --- STICKY NAV ON SCROLL ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- ACTIVE LINK SPY & FADE-IN ON SCROLL ---
  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '-50px 0px -50px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Active navbar state
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        
        // Trigger entrance animations
        if (entry.target.classList.contains('fade-in-section')) {
          entry.target.classList.add('visible');
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  // Observe items with fade-in class
  document.querySelectorAll('.fade-in-section').forEach(el => {
    sectionObserver.observe(el);
  });


  // --- DYNAMIC SUBURBS MAP ---
  const suburbMap = {
    sydney: ["Bondi", "Paddington", "Surry Hills", "Coogee", "Manly", "Mosman", "Newtown", "Randwick", "Double Bay", "Balmain"],
    melbourne: ["Fitzroy", "St Kilda", "South Yarra", "Richmond", "Carlton", "Brunswick", "Prahran", "Collingwood", "Hawthorn", "Footscray"],
    brisbane: ["New Farm", "West End", "Paddington", "Coorparoo", "Fortitude Valley", "Teneriffe", "Kangaroo Point", "South Brisbane", "Indooroopilly", "Hamilton"],
    perth: ["Subiaco", "Fremantle", "Cottesloe", "Claremont", "Scarborough", "Northbridge", "Leederville", "South Perth", "Victoria Park", "Nedlands"],
    adelaide: ["Glenelg", "Norwood", "Prospect", "Unley", "North Adelaide", "Mitcham", "St Peters", "Burnside", "Kensington", "Mile End"]
  };


  // --- BRAND CUSTOMIZATION REBRANDER FUNCTION ---
  function updateBranding(data) {
    // 1. Update Business Name
    const nameTexts = document.querySelectorAll('.brand-name-text');
    nameTexts.forEach(el => {
      el.textContent = data.name;
    });
    
    // Update Document Title
    document.title = `${data.name} - Premium Residential & Commercial Cleaning Services`;

    // 2. Update Location
    const locTexts = document.querySelectorAll('.brand-location-text');
    locTexts.forEach(el => {
      el.textContent = data.location;
    });

    // 3. Update Phone
    const phoneTexts = document.querySelectorAll('.brand-phone-text');
    phoneTexts.forEach(el => {
      el.textContent = data.phone;
    });
    const phoneLinks = document.querySelectorAll('.brand-phone-link');
    phoneLinks.forEach(el => {
      // Clean phone number format for tel link
      const telFormat = data.phone.replace(/[^0-9+]/g, '');
      el.setAttribute('href', `tel:${telFormat}`);
    });

    // 4. Update Email
    const emailPrefix = data.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanEmail = `hello@${emailPrefix || 'clean'}.com.au`;
    const emailTexts = document.querySelectorAll('.brand-email-text');
    emailTexts.forEach(el => {
      el.textContent = cleanEmail;
    });
    const emailLinks = document.querySelectorAll('.brand-email-link');
    emailLinks.forEach(el => {
      el.setAttribute('href', `mailto:${cleanEmail}`);
    });

    // 5. Update ABN
    const abnTexts = document.querySelectorAll('.brand-abn-text');
    abnTexts.forEach(el => {
      el.textContent = data.abn;
    });

    // 6. Update Suburbs list based on Location
    const locationKey = data.location.trim().toLowerCase();
    const targetSuburbs = suburbMap[locationKey] || suburbMap['sydney'];
    const suburbsContainer = document.getElementById('footer-suburbs');
    
    if (suburbsContainer && targetSuburbs) {
      suburbsContainer.innerHTML = '';
      targetSuburbs.forEach(suburb => {
        const div = document.createElement('div');
        div.textContent = suburb;
        suburbsContainer.appendChild(div);
      });
    }
  }

  // --- LOCALSTORAGE PERSISTENCE FOR DEMO ---
  const defaultBranding = {
    name: "AuraClean Australia",
    location: "Sydney",
    phone: "0488 843 322",
    abn: "ABN 43 982 104 382",
    theme: "teal"
  };

  let brandingState = JSON.parse(localStorage.getItem('cleaning_pitch_branding')) || { ...defaultBranding };

  // Initial render
  updateBranding(brandingState);
  applyTheme(brandingState.theme);

  // Set initial inputs values
  inputName.value = brandingState.name;
  inputLocation.value = brandingState.location;
  inputPhone.value = brandingState.phone;
  inputAbn.value = brandingState.abn;


  // --- PITCH CUSTOMIZER CONTROL PANEL INTERACTION ---
  customizerToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    customizerCard.classList.toggle('active');
  });

  // Close customizer if clicking outside
  document.addEventListener('click', (e) => {
    if (!customizerCard.contains(e.target) && e.target !== customizerToggle) {
      customizerCard.classList.remove('active');
    }
  });

  // Input Event Listeners
  inputName.addEventListener('input', () => {
    brandingState.name = inputName.value || defaultBranding.name;
    updateBranding(brandingState);
    saveState();
  });

  inputLocation.addEventListener('input', () => {
    brandingState.location = inputLocation.value || defaultBranding.location;
    updateBranding(brandingState);
    saveState();
  });

  inputPhone.addEventListener('input', () => {
    brandingState.phone = inputPhone.value || defaultBranding.phone;
    updateBranding(brandingState);
    saveState();
  });

  inputAbn.addEventListener('input', () => {
    brandingState.abn = inputAbn.value || defaultBranding.abn;
    updateBranding(brandingState);
    saveState();
  });

  // Color Swapper
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      // Deactivate all swatches
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const theme = swatch.getAttribute('data-theme');
      brandingState.theme = theme;
      applyTheme(theme);
      saveState();
    });
  });

  function applyTheme(theme) {
    // Remove old classes
    document.body.className = '';
    
    // Add current theme class
    if (theme === 'theme-blue') {
      document.body.classList.add('theme-blue');
    } else if (theme === 'theme-green') {
      document.body.classList.add('theme-green');
    } else if (theme === 'theme-navy') {
      document.body.classList.add('theme-navy');
    } else {
      document.body.classList.add('theme-teal'); // default
    }

    // Set swatch active UI state matching the current theme
    colorSwatches.forEach(s => {
      if (s.getAttribute('data-theme') === theme || (theme === 'teal' && s.getAttribute('data-theme') === 'teal')) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });
  }

  function saveState() {
    localStorage.setItem('cleaning_pitch_branding', JSON.stringify(brandingState));
  }

  // Customizer Reset Button
  customizerReset.addEventListener('click', () => {
    brandingState = { ...defaultBranding };
    
    inputName.value = brandingState.name;
    inputLocation.value = brandingState.location;
    inputPhone.value = brandingState.phone;
    inputAbn.value = brandingState.abn;
    
    updateBranding(brandingState);
    applyTheme(brandingState.theme);
    saveState();
  });

  // --- BEFORE/AFTER IMAGE SLIDER SHOWCASE ---
  const sliders = document.querySelectorAll('.ba-slider');
  sliders.forEach(slider => {
    const range = slider.querySelector('.ba-range');
    const afterImage = slider.querySelector('.after-image');
    const handle = slider.querySelector('.ba-handle');

    range.addEventListener('input', (e) => {
      const value = e.target.value;
      afterImage.style.width = `${value}%`;
      handle.style.left = `${value}%`;
    });
  });

  // --- FORM SUBMISSION INTERACTIVE UI ---
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Perform validation checks
    const name = document.getElementById('form-name').value;
    const suburb = document.getElementById('form-suburb').value;
    const phone = document.getElementById('form-phone').value;
    
    if (name.trim() === "" || suburb.trim() === "" || phone.trim() === "") {
      alert("Please fill in all required fields.");
      return;
    }

    // Slide up the success overlay card
    formSuccess.classList.add('active');
  });

  successCloseBtn.addEventListener('click', () => {
    // Slide down overlay and reset form
    formSuccess.classList.remove('active');
    quoteForm.reset();
  });
});
