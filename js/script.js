document.addEventListener('DOMContentLoaded', () => {

  /* =============================================
     STATE — loaded from / persisted to localStorage
     ============================================= */
  const STORAGE_KEY = 'cx-portfolio-data';

  const defaultData = {
    name: '',
    roles: [],
    bio: '',
    location: '',
    status: '',
    email: '',
    github: '',
    photo: '',        // base64 data-URL
    skills: [],       // [{ name, percent }]
    projects: [],     // [{ title, desc, tech, tags, link }]
  };

  const loadData = () => {
    try {
      return Object.assign({}, defaultData, JSON.parse(localStorage.getItem(STORAGE_KEY)) || {});
    } catch {
      return { ...defaultData };
    }
  };

  const saveData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  let portfolioData = loadData();

  /* =============================================
     RENDER — apply stored data to the DOM
     ============================================= */
  const renderPortfolio = () => {
    const d = portfolioData;

    // --- Logo / nav name ---
    const navName = document.getElementById('navLogoName');
    navName.textContent = d.name ? d.name.split(' ')[0] + '.Dev' : 'Portfolio';

    // --- Page title ---
    document.getElementById('pageTitle').textContent =
      d.name ? `${d.name} | Portfolio` : 'My Portfolio | CloudExify';

    // --- Hero name ---
    document.getElementById('heroName').textContent = d.name || 'Your Name';

    // --- Bio ---
    const bioPara = document.getElementById('heroBio');
    bioPara.textContent = d.bio ||
      'Click "Edit Portfolio" in the top-right to add your name, bio, skills, and projects.';
    bioPara.classList.toggle('about-empty-hint', !d.bio);

    // --- Hero Photo ---
    const heroPhoto = document.getElementById('heroPhoto');
    const heroPhotoPlaceholder = document.getElementById('heroPhotoPlaceholder');
    if (d.photo) {
      heroPhoto.src = d.photo;
      heroPhoto.classList.remove('hidden');
      heroPhotoPlaceholder.classList.add('hidden');
    } else {
      heroPhoto.classList.add('hidden');
      heroPhotoPlaceholder.classList.remove('hidden');
    }

    // --- Typewriter roles ---
    typewriterPhrases = d.roles.length > 0 ? d.roles : ['a Developer'];
    // reset typewriter
    wordIndex = 0; charIndex = 0; isDeleting = false;

    // --- About section ---
    const aboutPara = document.getElementById('aboutPara1');
    aboutPara.textContent = d.bio || 'Your story will appear here once you edit your portfolio.';
    aboutPara.classList.toggle('about-empty-hint', !d.bio);

    const aboutDetails = document.getElementById('aboutDetails');
    aboutDetails.innerHTML = '';
    if (d.location) {
      aboutDetails.innerHTML += `
        <div class="detail-item">
          <span class="detail-label">Location</span>
          <span class="detail-value">${escHtml(d.location)}</span>
        </div>`;
    }
    if (d.status) {
      aboutDetails.innerHTML += `
        <div class="detail-item">
          <span class="detail-label">Status</span>
          <span class="detail-value text-glow">${escHtml(d.status)}</span>
        </div>`;
    }

    // --- Contact methods ---
    const methodsEl = document.getElementById('contactMethods');
    methodsEl.innerHTML = '';
    if (d.email) {
      methodsEl.innerHTML += `
        <div class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span>${escHtml(d.email)}</span>
        </div>`;
    }
    if (d.github) {
      methodsEl.innerHTML += `
        <div class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          <span>${escHtml(d.github)}</span>
        </div>`;
    }

    // --- Footer ---
    document.getElementById('footerText').textContent =
      d.name
        ? `© ${new Date().getFullYear()} ${d.name}. CloudExify Summer Internship.`
        : `© ${new Date().getFullYear()} CloudExify Summer Internship.`;

    // --- Skills ---
    renderSkillsSection();

    // --- Projects ---
    renderProjectsSection();
  };

  /* Render skills grid */
  const renderSkillsSection = () => {
    const grid = document.getElementById('skillsGrid');
    grid.innerHTML = '';
    if (!portfolioData.skills.length) {
      grid.innerHTML = `
        <div class="skills-empty glass">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.2">
            <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>No skills added yet. Click <strong>"Edit Portfolio"</strong> to add your skills.</p>
        </div>`;
      return;
    }
    portfolioData.skills.forEach(skill => {
      const card = document.createElement('div');
      card.className = 'skill-card glass skill';
      card.dataset.percent = skill.percent;
      card.innerHTML = `
        <div class="skill-meta">
          <span class="skill-name">${escHtml(skill.name)}</span>
          <span class="skill-percentage">0%</span>
        </div>
        <div class="skill-bar"><div class="skill-fill"></div></div>`;
      grid.appendChild(card);
    });
    // Re-observe new skill cards
    reObserveSkills();
  };

  /* Render projects grid */
  const renderProjectsSection = () => {
    const grid = document.getElementById('projectsGrid');
    const filterContainer = document.getElementById('filterContainer');

    grid.innerHTML = '';
    filterContainer.style.display = 'none';

    if (!portfolioData.projects.length) {
      grid.innerHTML = `
        <div class="skills-empty glass">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          <p>No projects added yet. Click <strong>"Edit Portfolio"</strong> to showcase your work.</p>
        </div>`;
      return;
    }

    // Build unique tag list for filters
    const allTags = new Set();
    portfolioData.projects.forEach(p => {
      (p.tags || '').split(',').map(t => t.trim()).filter(Boolean).forEach(t => allTags.add(t));
    });

    // Rebuild filter buttons
    filterContainer.innerHTML = '<button class="filter-btn active" data-filter="all">All Projects</button>';
    allTags.forEach(tag => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.filter = tag.toLowerCase().replace(/\s+/g, '-');
      btn.textContent = tag;
      filterContainer.appendChild(btn);
    });
    filterContainer.style.display = 'flex';
    attachFilterListeners();

    // Render project cards
    portfolioData.projects.forEach(project => {
      const tagsArr = (project.tags || '').split(',').map(t => t.trim()).filter(Boolean);
      const techArr = (project.tech || '').split(',').map(t => t.trim()).filter(Boolean);
      const tagDataAttr = tagsArr.map(t => t.toLowerCase().replace(/\s+/g, '-')).join(',');
      const primaryTag = tagsArr[0] || 'Project';

      const card = document.createElement('article');
      card.className = 'project-card glass';
      card.dataset.tags = tagDataAttr;
      card.innerHTML = `
        <div class="project-banner">
          <div class="project-tag">${escHtml(primaryTag)}</div>
        </div>
        <div class="project-content">
          <h3 class="project-title">${escHtml(project.title)}</h3>
          <p class="project-desc">${escHtml(project.desc)}</p>
          <div class="project-tech">
            ${techArr.map(t => `<span>${escHtml(t)}</span>`).join('')}
          </div>
          ${project.link
            ? `<a href="${escAttr(project.link)}" target="_blank" rel="noopener" class="project-link">View Project &rarr;</a>`
            : ''}
        </div>`;
      grid.appendChild(card);
    });
  };

  /* =============================================
     SKILL ANIMATIONS (IntersectionObserver)
     ============================================= */
  let skillObserver = null;

  const reObserveSkills = () => {
    if (skillObserver) skillObserver.disconnect();

    skillObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const targetPercent = parseInt(card.dataset.percent, 10) || 0;
        const fill = card.querySelector('.skill-fill');
        const percentText = card.querySelector('.skill-percentage');

        fill.style.width = `${targetPercent}%`;

        let count = 0;
        const stepTime = Math.max(1, Math.floor(1200 / targetPercent));
        const counter = setInterval(() => {
          count++;
          percentText.textContent = `${count}%`;
          if (count >= targetPercent) clearInterval(counter);
        }, stepTime);

        obs.unobserve(card);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.skill').forEach(el => skillObserver.observe(el));
  };

  /* =============================================
     TYPEWRITER
     ============================================= */
  let typewriterPhrases = portfolioData.roles.length ? portfolioData.roles : ['a Developer'];
  let wordIndex = 0, charIndex = 0, isDeleting = false;
  const typedEl = document.getElementById('typedText');

  const typewriter = () => {
    const current = typewriterPhrases[wordIndex % typewriterPhrases.length];
    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }
    let speed = isDeleting ? 35 : 75;
    if (!isDeleting && charIndex === current.length) { speed = 1600; isDeleting = true; }
    else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex++; speed = 500; }
    setTimeout(typewriter, speed);
  };
  typewriter();

  /* =============================================
     PROJECT FILTER
     ============================================= */
  const attachFilterListeners = () => {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.project-card').forEach(card => {
          const tags = (card.dataset.tags || '').split(',');
          card.classList.toggle('filtered-out', filter !== 'all' && !tags.includes(filter));
        });
      });
    });
  };

  /* =============================================
     ACTIVE NAV ON SCROLL
     ============================================= */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.45, rootMargin: '-76px 0px 0px 0px' }).observe;

  // Simpler scroll-based approach that works reliably
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });

  /* =============================================
     MOBILE NAV HAMBURGER
     ============================================= */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  const closeMenu = () => {
    hamburger.setAttribute('aria-expanded', 'false');
    navLinksContainer.classList.remove('active');
  };
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !expanded);
    navLinksContainer.classList.toggle('active');
  });
  navLinks.forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth >= 768) closeMenu(); });

  /* =============================================
     THEME & ACCENT SWITCHER
     ============================================= */
  const themeToggle = document.getElementById('themeToggle');
  const toggleText = themeToggle.querySelector('.toggle-text');
  const accentBtns = document.querySelectorAll('.accent-btn');

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cx-theme', theme);
    toggleText.textContent = theme === 'light' ? 'Light Mode' : 'Dark Mode';
  };
  const applyAccent = (accent) => {
    document.documentElement.setAttribute('data-accent', accent);
    localStorage.setItem('cx-accent', accent);
    accentBtns.forEach(b => b.classList.toggle('active', b.dataset.accent === accent));
  };

  // Load saved theme/accent
  applyTheme(localStorage.getItem('cx-theme') || 'dark');
  applyAccent(localStorage.getItem('cx-accent') || 'cyan');

  themeToggle.addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
  accentBtns.forEach(btn => btn.addEventListener('click', () => applyAccent(btn.dataset.accent)));

  /* =============================================
     CONTACT FORM VALIDATION
     ============================================= */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (input, errorEl, ok) => {
    input.classList.toggle('invalid', !ok);
    errorEl.style.display = ok ? 'none' : 'block';
    return ok;
  };

  ['formName', 'formEmail', 'formMessage'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
      const errId = id === 'formName' ? 'nameError' : id === 'formEmail' ? 'emailError' : 'messageError';
      const ok = id === 'formEmail' ? EMAIL_RE.test(el.value.trim()) : el.value.trim() !== '';
      validateField(el, document.getElementById(errId), ok);
    });
  });

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    formStatus.className = 'form-status';

    const nameEl    = document.getElementById('formName');
    const emailEl   = document.getElementById('formEmail');
    const msgEl     = document.getElementById('formMessage');

    const ok1 = validateField(nameEl,  document.getElementById('nameError'),    nameEl.value.trim()  !== '');
    const ok2 = validateField(emailEl, document.getElementById('emailError'),   EMAIL_RE.test(emailEl.value.trim()));
    const ok3 = validateField(msgEl,   document.getElementById('messageError'), msgEl.value.trim()   !== '');

    if (ok1 && ok2 && ok3) {
      formStatus.textContent = '✓ Message sent! We\'ll get back to you soon.';
      formStatus.classList.add('success');
      contactForm.reset();
      [nameEl, emailEl, msgEl].forEach(el => el.classList.remove('invalid'));
    } else {
      formStatus.textContent = 'Please fix the errors above before sending.';
      formStatus.classList.add('error');
    }
  });

  /* =============================================
     EDIT PANEL
     ============================================= */
  const editPanel    = document.getElementById('editPanel');
  const editOverlay  = document.getElementById('editOverlay');
  const editToggle   = document.getElementById('editModeToggle');
  const closePanel   = document.getElementById('closeEditPanel');
  const cancelBtn    = document.getElementById('cancelEditBtn');
  const saveBtn      = document.getElementById('savePortfolioBtn');

  const openEditPanel = () => {
    populateEditPanel();
    editPanel.classList.add('open');
    editPanel.setAttribute('aria-hidden', 'false');
    editOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeEditPanel = () => {
    editPanel.classList.remove('open');
    editPanel.setAttribute('aria-hidden', 'true');
    editOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  editToggle.addEventListener('click', openEditPanel);
  closePanel.addEventListener('click', closeEditPanel);
  cancelBtn.addEventListener('click', closeEditPanel);
  editOverlay.addEventListener('click', closeEditPanel);

  /* ---- Populate form fields from current data ---- */
  const populateEditPanel = () => {
    const d = portfolioData;
    document.getElementById('editName').value     = d.name     || '';
    document.getElementById('editRoles').value    = d.roles.join(', ') || '';
    document.getElementById('editBio').value      = d.bio      || '';
    document.getElementById('editLocation').value = d.location || '';
    document.getElementById('editStatus').value   = d.status   || '';
    document.getElementById('editEmail').value    = d.email    || '';
    document.getElementById('editGithub').value   = d.github   || '';

    // Photo preview
    const preview      = document.getElementById('photoPreview');
    const placeholder  = document.getElementById('photoUploadPlaceholder');
    const removeBtn    = document.getElementById('removePhotoBtn');
    if (d.photo) {
      preview.src = d.photo;
      preview.classList.remove('hidden');
      placeholder.classList.add('hidden');
      removeBtn.classList.remove('hidden');
    } else {
      preview.classList.add('hidden');
      placeholder.classList.remove('hidden');
      removeBtn.classList.add('hidden');
    }
    // Pending state for unsaved photo changes this session
    pendingPhoto = d.photo;

    renderSkillsEditor(d.skills);
    renderProjectsEditor(d.projects);
  };

  /* ---- PHOTO UPLOAD ---- */
  let pendingPhoto = portfolioData.photo;

  const photoUploadArea    = document.getElementById('photoUploadArea');
  const photoInput         = document.getElementById('photoInput');
  const photoPreview       = document.getElementById('photoPreview');
  const photoPlaceholder   = document.getElementById('photoUploadPlaceholder');
  const removePhotoBtn     = document.getElementById('removePhotoBtn');

  photoUploadArea.addEventListener('click', () => photoInput.click());
  photoUploadArea.addEventListener('dragover', e => { e.preventDefault(); photoUploadArea.style.borderColor = 'var(--accent)'; });
  photoUploadArea.addEventListener('dragleave', () => { photoUploadArea.style.borderColor = ''; });
  photoUploadArea.addEventListener('drop', e => {
    e.preventDefault();
    photoUploadArea.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file) handlePhotoFile(file);
  });

  photoInput.addEventListener('change', () => {
    if (photoInput.files[0]) handlePhotoFile(photoInput.files[0]);
    photoInput.value = '';
  });

  removePhotoBtn.addEventListener('click', () => {
    pendingPhoto = '';
    photoPreview.src = '';
    photoPreview.classList.add('hidden');
    photoPlaceholder.classList.remove('hidden');
    removePhotoBtn.classList.add('hidden');
  });

  const handlePhotoFile = (file) => {
    if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024)    { alert('File is too large (max 5 MB). Please compress the image first.'); return; }

    const reader = new FileReader();
    reader.onload = (e) => {
      pendingPhoto = e.target.result;
      photoPreview.src = pendingPhoto;
      photoPreview.classList.remove('hidden');
      photoPlaceholder.classList.add('hidden');
      removePhotoBtn.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  };

  /* ---- SKILLS EDITOR ---- */
  let editSkills = [];

  const renderSkillsEditor = (skills) => {
    editSkills = skills.map(s => ({ ...s }));
    rebuildSkillsEditor();
  };

  const rebuildSkillsEditor = () => {
    const list = document.getElementById('skillsEditList');
    list.innerHTML = '';
    editSkills.forEach((skill, i) => {
      const row = document.createElement('div');
      row.className = 'skill-edit-row';
      row.innerHTML = `
        <input type="text" class="edit-input skill-name-input" placeholder="Skill name" value="${escAttr(skill.name)}" data-index="${i}">
        <input type="number" class="edit-input percent-input skill-pct-input" placeholder="%" min="1" max="100" value="${skill.percent}" data-index="${i}">
        <button class="btn-remove-row skill-remove-btn" data-index="${i}" title="Remove skill">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14H6L5 6"></path>
            <path d="M10 11v6M14 11v6"></path>
          </svg>
        </button>`;
      list.appendChild(row);
    });

    list.querySelectorAll('.skill-name-input').forEach(el => {
      el.addEventListener('input', () => { editSkills[+el.dataset.index].name = el.value; });
    });
    list.querySelectorAll('.skill-pct-input').forEach(el => {
      el.addEventListener('input', () => { editSkills[+el.dataset.index].percent = Math.min(100, Math.max(0, +el.value || 0)); });
    });
    list.querySelectorAll('.skill-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        editSkills.splice(+btn.dataset.index, 1);
        rebuildSkillsEditor();
      });
    });
  };

  document.getElementById('addSkillBtn').addEventListener('click', () => {
    editSkills.push({ name: '', percent: 80 });
    rebuildSkillsEditor();
    // Scroll to new item
    const list = document.getElementById('skillsEditList');
    list.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  /* ---- PROJECTS EDITOR ---- */
  let editProjects = [];

  const renderProjectsEditor = (projects) => {
    editProjects = projects.map(p => ({ ...p }));
    rebuildProjectsEditor();
  };

  const rebuildProjectsEditor = () => {
    const list = document.getElementById('projectsEditList');
    list.innerHTML = '';
    editProjects.forEach((proj, i) => {
      const block = document.createElement('div');
      block.className = 'project-edit-block';
      block.innerHTML = `
        <div class="project-edit-block-header">
          <span>Project ${i + 1}</span>
          <button class="btn-remove-row proj-remove-btn" data-index="${i}" title="Remove project">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6l-1 14H6L5 6"></path>
              <path d="M10 11v6M14 11v6"></path>
            </svg>
          </button>
        </div>
        <input type="text" class="edit-input proj-title" placeholder="Project title" value="${escAttr(proj.title || '')}" data-index="${i}">
        <textarea class="edit-input proj-desc" rows="2" placeholder="Short description..." data-index="${i}">${escHtml(proj.desc || '')}</textarea>
        <input type="text" class="edit-input proj-tech" placeholder="Tech stack (comma-separated): e.g. React, Node.js" value="${escAttr(proj.tech || '')}" data-index="${i}">
        <input type="text" class="edit-input proj-tags" placeholder="Filter tags (comma-separated): e.g. Frontend, JavaScript" value="${escAttr(proj.tags || '')}" data-index="${i}">
        <input type="url"  class="edit-input proj-link" placeholder="Project URL (optional)" value="${escAttr(proj.link || '')}" data-index="${i}">`;
      list.appendChild(block);
    });

    const bind = (sel, field) => {
      list.querySelectorAll(sel).forEach(el => {
        el.addEventListener('input', () => { editProjects[+el.dataset.index][field] = el.value; });
      });
    };
    bind('.proj-title', 'title');
    bind('.proj-desc',  'desc');
    bind('.proj-tech',  'tech');
    bind('.proj-tags',  'tags');
    bind('.proj-link',  'link');

    list.querySelectorAll('.proj-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        editProjects.splice(+btn.dataset.index, 1);
        rebuildProjectsEditor();
      });
    });
  };

  document.getElementById('addProjectBtn').addEventListener('click', () => {
    editProjects.push({ title: '', desc: '', tech: '', tags: '', link: '' });
    rebuildProjectsEditor();
    const list = document.getElementById('projectsEditList');
    list.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  /* ---- SAVE ---- */
  saveBtn.addEventListener('click', () => {
    portfolioData = {
      name:      document.getElementById('editName').value.trim(),
      roles:     document.getElementById('editRoles').value.split(',').map(r => r.trim()).filter(Boolean),
      bio:       document.getElementById('editBio').value.trim(),
      location:  document.getElementById('editLocation').value.trim(),
      status:    document.getElementById('editStatus').value.trim(),
      email:     document.getElementById('editEmail').value.trim(),
      github:    document.getElementById('editGithub').value.trim(),
      photo:     pendingPhoto,
      skills:    editSkills.filter(s => s.name.trim()),
      projects:  editProjects.filter(p => p.title.trim()),
    };

    saveData(portfolioData);
    renderPortfolio();
    closeEditPanel();

    // Flash save confirmation
    saveBtn.textContent = '✓ Saved!';
    setTimeout(() => {
      saveBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Save All Changes`;
    }, 2200);
  });

  /* =============================================
     EASTER EGG
     ============================================= */
  const dialog       = document.getElementById('easterEggDialog');
  const closeDialogBtn = document.getElementById('closeDialog');
  const logoEl       = document.querySelector('.logo');

  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiIdx = 0;
  let inputBuf  = '';

  const showEgg = () => {
    if (dialog && dialog.showModal) dialog.showModal();
  };

  document.addEventListener('keydown', e => {
    // Konami
    if (e.key === KONAMI[konamiIdx]) { konamiIdx++; if (konamiIdx === KONAMI.length) { showEgg(); konamiIdx = 0; } }
    else konamiIdx = e.key === KONAMI[0] ? 1 : 0;

    // Keyword buffer
    inputBuf += e.key.toLowerCase();
    if (inputBuf.length > 6) inputBuf = inputBuf.slice(-6);
    if (inputBuf === 'secret') { showEgg(); inputBuf = ''; }
  });

  logoEl?.addEventListener('dblclick', e => { e.preventDefault(); showEgg(); });

  closeDialogBtn?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', e => {
    const r = dialog.getBoundingClientRect();
    if (e.clientY < r.top || e.clientY > r.bottom || e.clientX < r.left || e.clientX > r.right) {
      dialog.close();
    }
  });

  /* =============================================
     INITIAL RENDER
     ============================================= */
  renderPortfolio();

  /* =============================================
     UTILITIES
     ============================================= */
  function escHtml(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function escAttr(str) {
    return String(str || '').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

}); // end DOMContentLoaded
