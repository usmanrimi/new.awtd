/* ==========================================================================
   AWTD — Africa Workforce Training & Development
   Shared Application Foundation & Interactive Controller (js/main.js)
   ========================================================================== */

(function () {
  'use strict';

  /* ---- 1. Single-Source Configuration ---- */
  var AWTD_CONFIG = {
    pilotCities: 'Abuja',
    maxPilotTracks: 2,
    defaultPilotTracks: ['electrical-solar', 'welding-fabrication'],
    contactEmail: 'info@awtd.org',
    googleSheetsId: '1dqh6_nAvz0KphMWpfqKSeEB5MegwJ74fBHv-7KchAPk',
    googleSheetsEndpoint: 'https://script.google.com/macros/s/AKfycbzsra4jMtAHpDtKp25FqE1GeqXjuNl5_18VBO-sypF0XUzEDPM-Y2tfCnpR4yGY17xTbg/exec',
    formEndpoint: '', /* Optional secondary webhook endpoint */
    legalName: 'Africa Workforce Training & Development, Inc.',
    documents: {
      'blueprint': {
        title: 'The AWTD Blueprint',
        year: '2026',
        status: 'Working Document · Board Review',
        summary: 'The complete operational model: employer-led competency standards, the learner journey, and quality safeguards engineered to prevent theoretical drift.'
      },
      'market-survey': {
        title: 'Market Needs Survey',
        year: '2026',
        status: 'Working Document · Board Review',
        summary: 'Employer demand mapping across candidate technical sectors, quantifying where critical technician gaps slow industrial and infrastructure growth.'
      },
      'concept-note': {
        title: 'Concept Note: Nigeria Pilot',
        year: '2026',
        status: 'Working Document · Board Review',
        summary: 'Abuja pilot scope, one cohort of 20 trainees (Electrical and Welding), eight-week certificate (72 contact hours, 3 evenings/week 18:00 to 21:00), and the Month 6 Decision Gate.'
      },
      'capability-statement': {
        title: 'Capability Statement (The Brief)',
        year: '2026',
        status: 'Pre-Release Verification',
        summary: 'Executive overview of AWTD, priority technical sectors, measurable KPIs, and multi-jurisdiction governance across the United States, Nigeria, and South Africa.'
      }
    }
  };

  /* Clear stale October prototype localStorage overrides so November 15 facts are authoritative */
  try {
    if (localStorage.getItem('awtd-pilot-cities') === 'Abuja + Kaduna') {
      localStorage.removeItem('awtd-pilot-cities');
    }
    var oldTracks = localStorage.getItem('awtd-pilot-tracks');
    if (oldTracks && oldTracks.indexOf('industrial-maintenance') !== -1) {
      localStorage.removeItem('awtd-pilot-tracks');
    }
  } catch (e) {}

  window.AWTD_CONFIG = AWTD_CONFIG;

  /* ---- 2. Populate & Live-Edit Single-Source Config Fields ---- */
  function renderConfigBindings() {
    var cityNodes = document.querySelectorAll('[data-config="pilot-cities"]');
    cityNodes.forEach(function (node) {
      node.textContent = AWTD_CONFIG.pilotCities;
    });

    var emailNodes = document.querySelectorAll('[data-config="contact-email"]');
    emailNodes.forEach(function (node) {
      node.textContent = AWTD_CONFIG.contactEmail;
    });

    var legalNodes = document.querySelectorAll('[data-config="legal-name"]');
    legalNodes.forEach(function (node) {
      node.textContent = AWTD_CONFIG.legalName;
    });

    /* Live visitor local date & time integrated into scrolling announcement */
    var dateTimeNodes = document.querySelectorAll('[data-live-datetime]');
    if (dateTimeNodes.length > 0) {
      function updateLocalDateTime() {
        var now = new Date();
        var formatted = '';
        try {
          formatted = now.toLocaleString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
          });
        } catch (e) {
          formatted = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
        }
        dateTimeNodes.forEach(function (el) {
          el.textContent = formatted;
        });
      }
      updateLocalDateTime();
      setInterval(updateLocalDateTime, 1000);
    }

    var cityInput = document.getElementById('reviewCityInput');
    if (cityInput && document.activeElement !== cityInput) {
      cityInput.value = AWTD_CONFIG.pilotCities;
    }
  }

  function initConfigBindings() {
    renderConfigBindings();

    var cityInput = document.getElementById('reviewCityInput');
    var citySaveBtn = document.getElementById('reviewCitySaveBtn');

    function applyCityUpdate() {
      if (!cityInput) return;
      var nextVal = cityInput.value.trim();
      if (!nextVal) {
        cityInput.value = AWTD_CONFIG.pilotCities;
        return;
      }
      AWTD_CONFIG.pilotCities = nextVal;
      try {
        localStorage.setItem('awtd-pilot-cities', nextVal);
      } catch (e) {}
      renderConfigBindings();
      if (citySaveBtn) {
        var origText = citySaveBtn.textContent;
        citySaveBtn.textContent = 'Synced ✓';
        setTimeout(function () {
          citySaveBtn.textContent = origText;
        }, 1400);
      }
    }

    if (citySaveBtn) {
      citySaveBtn.addEventListener('click', applyCityUpdate);
    }
    if (cityInput) {
      cityInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyCityUpdate();
        }
      });
    }
  }

  /* ---- 3. Legacy Review Cleanup ---- */
  function initReviewToggle() {
    // Production release: Development review mode permanently retired
    try {
      localStorage.removeItem('awtd-review');
    } catch (e) {}
    document.body.classList.remove('review');
  }

  /* ---- 4. Sticky Header, Mobile Menu & Active Section Spy ---- */
  function initNavigation() {
    var nav = document.querySelector('.nav');
    var navToggle = document.getElementById('navToggle');
    var navLinksContainer = document.getElementById('navLinks');
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    function onScroll() {
      if (!nav) return;
      nav.classList.toggle('is-scrolled', window.scrollY > 16);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (navToggle && navLinksContainer) {
      navToggle.addEventListener('click', function () {
        var expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        navLinksContainer.classList.toggle('is-open', !expanded);
      });

      navLinksContainer.addEventListener('click', function (e) {
        var trigger = e.target.closest ? e.target.closest('.nav-dropdown-trigger') : null;
        if (trigger) {
          var parentItem = trigger.closest('.nav-item');
          var isOpen = parentItem.classList.contains('is-open');
          document.querySelectorAll('.nav-item.is-open').forEach(function (item) {
            item.classList.remove('is-open');
            var btn = item.querySelector('.nav-dropdown-trigger');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          });
          if (!isOpen) {
            parentItem.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
          }
          return;
        }
        if (e.target.closest('a') && navLinksContainer.classList.contains('is-open')) {
          navToggle.setAttribute('aria-expanded', 'false');
          navLinksContainer.classList.remove('is-open');
        }
      });

      document.addEventListener('click', function (e) {
        if (!e.target.closest('.nav-item')) {
          document.querySelectorAll('.nav-item.is-open').forEach(function (item) {
            item.classList.remove('is-open');
            var btn = item.querySelector('.nav-dropdown-trigger');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          });
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          document.querySelectorAll('.nav-item.is-open').forEach(function (item) {
            item.classList.remove('is-open');
            var btn = item.querySelector('.nav-dropdown-trigger');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          });
          if (navLinksContainer.classList.contains('is-open')) {
            navToggle.setAttribute('aria-expanded', 'false');
            navLinksContainer.classList.remove('is-open');
            navToggle.focus();
          }
        }
      });
    }

    if ('IntersectionObserver' in window && navLinks.length > 0) {
      var sectionMap = {};
      navLinks.forEach(function (link) {
        var id = link.getAttribute('href').slice(1);
        if (id) sectionMap[id] = link;
      });

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && entry.target.id && sectionMap[entry.target.id]) {
              navLinks.forEach(function (l) {
                l.classList.remove('is-active');
              });
              sectionMap[entry.target.id].classList.add('is-active');
            }
          });
        },
        { rootMargin: '-28% 0px -60% 0px', threshold: 0 }
      );

      Object.keys(sectionMap).forEach(function (id) {
        var sec = document.getElementById(id);
        if (sec) observer.observe(sec);
      });
    }
  }

  /* ---- 5. Training Tracks Filter, Movable "Pilot phase" Chip & 3D Flip Dossiers ---- */
  function initTracksController() {
    var trackCards = Array.prototype.slice.call(document.querySelectorAll('.track-card'));
    var filterBtns = Array.prototype.slice.call(document.querySelectorAll('[data-track-filter]'));
    var statusMsg = document.getElementById('trackPilotStatus');
    if (trackCards.length === 0) return;

    var activePilotIds = AWTD_CONFIG.defaultPilotTracks.slice();
    try {
      var saved = localStorage.getItem('awtd-pilot-tracks');
      if (saved) {
        var parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length <= AWTD_CONFIG.maxPilotTracks) {
          activePilotIds = parsed;
        }
      }
    } catch (e) {}

    var currentFilter = 'all';

    function renderTrackChips() {
      trackCards.forEach(function (card) {
        var id = card.getAttribute('data-track-id');
        var isPilot = activePilotIds.indexOf(id) !== -1;
        card.setAttribute('data-pilot', isPilot ? 'true' : 'false');

        var chips = card.querySelectorAll('.chip');
        chips.forEach(function (chip) {
          if (isPilot) {
            chip.textContent = 'Pilot phase';
            chip.classList.remove('chip--future');
          } else {
            chip.textContent = 'Future rollout';
            chip.classList.add('chip--future');
          }
        });

        var toggleBtns = card.querySelectorAll('.track-pilot-toggle');
        toggleBtns.forEach(function (toggleBtn) {
          toggleBtn.textContent = isPilot ? 'Remove Pilot chip' : 'Set as Pilot track';
        });
      });

      var pilotCountEl = document.querySelector('[data-filter-count="pilot"]');
      var futureCountEl = document.querySelector('[data-filter-count="future"]');
      if (pilotCountEl) pilotCountEl.textContent = String(activePilotIds.length);
      if (futureCountEl) futureCountEl.textContent = String(trackCards.length - activePilotIds.length);

      applyFilter(currentFilter);
    }

    function applyFilter(filter) {
      currentFilter = filter;
      filterBtns.forEach(function (btn) {
        var isMatch = btn.getAttribute('data-track-filter') === filter;
        btn.classList.toggle('is-active', isMatch);
        btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });

      trackCards.forEach(function (card) {
        var isPilot = card.getAttribute('data-pilot') === 'true';
        var show = true;
        if (filter === 'pilot') show = isPilot;
        else if (filter === 'future') show = !isPilot;
        card.classList.toggle('is-hidden', !show);
      });
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyFilter(btn.getAttribute('data-track-filter'));
      });
    });

    trackCards.forEach(function (card) {
      /* Movable Pilot Chip Toggle */
      var toggleBtns = card.querySelectorAll('.track-pilot-toggle');
      toggleBtns.forEach(function (toggleBtn) {
        toggleBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          var id = card.getAttribute('data-track-id');
          var idx = activePilotIds.indexOf(id);
          if (idx !== -1) {
            activePilotIds.splice(idx, 1);
            if (statusMsg) statusMsg.textContent = '';
          } else {
            if (activePilotIds.length >= AWTD_CONFIG.maxPilotTracks) {
              var removed = activePilotIds.shift();
              activePilotIds.push(id);
              if (statusMsg) {
                statusMsg.textContent = 'Pilot cap is 2 tracks. Shifted chip from ' + removed.replace(/-/g, ' ') + ' to ' + id.replace(/-/g, ' ') + '.';
              }
            } else {
              activePilotIds.push(id);
              if (statusMsg) statusMsg.textContent = '';
            }
          }
          try {
            localStorage.setItem('awtd-pilot-tracks', JSON.stringify(activePilotIds));
          } catch (err) {}
          renderTrackChips();
        });
      });

      /* 3D Flip Card Dossier Toggle (Tap anywhere on card + Flip buttons) */
      function toggleCardFlip() {
        var willFlip = !card.classList.contains('is-flipped');
        card.classList.toggle('is-flipped', willFlip);
        var allFlipBtns = card.querySelectorAll('.track-flip-btn');
        allFlipBtns.forEach(function (b) {
          b.setAttribute('aria-expanded', willFlip ? 'true' : 'false');
        });
      }

      card.addEventListener('click', function () {
        toggleCardFlip();
      });

      var flipBtns = card.querySelectorAll('.track-flip-btn');
      flipBtns.forEach(function (flipBtn) {
        flipBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          toggleCardFlip();
        });
      });
    });

    renderTrackChips();
  }

  /* ---- 5b. Status Quo vs AWTD Blueprint Interactive Contrast ---- */
  function initContrastController() {
    var contrastBtns = Array.prototype.slice.call(document.querySelectorAll('[data-contrast-dim]'));
    var contrastItems = Array.prototype.slice.call(document.querySelectorAll('[data-dim]'));
    if (contrastItems.length === 0) return;

    function setDimension(dim) {
      contrastBtns.forEach(function (btn) {
        var match = btn.getAttribute('data-contrast-dim') === dim;
        btn.classList.toggle('is-active', match);
        btn.setAttribute('aria-pressed', match ? 'true' : 'false');
      });

      contrastItems.forEach(function (item) {
        if (!dim || dim === 'all') {
          item.classList.remove('is-dimmed', 'is-highlighted');
        } else {
          var isMatch = item.getAttribute('data-dim') === dim;
          item.classList.toggle('is-highlighted', isMatch);
          item.classList.toggle('is-dimmed', !isMatch);
        }
      });
    }

    contrastBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setDimension(btn.getAttribute('data-contrast-dim'));
      });
    });

    contrastItems.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        var activeBtn = document.querySelector('[data-contrast-dim].is-active');
        if (activeBtn && activeBtn.getAttribute('data-contrast-dim') !== 'all') return;
        var dim = item.getAttribute('data-dim');
        contrastItems.forEach(function (el) {
          el.classList.toggle('is-highlighted', el.getAttribute('data-dim') === dim);
        });
      });
      item.addEventListener('mouseleave', function () {
        var activeBtn = document.querySelector('[data-contrast-dim].is-active');
        if (activeBtn && activeBtn.getAttribute('data-contrast-dim') !== 'all') return;
        contrastItems.forEach(function (el) {
          el.classList.remove('is-highlighted');
        });
      });
    });
  }

  /* ---- 6. Position Papers & Capability Statement Modal ---- */
  function initDocumentModal() {
    var backdrop = document.getElementById('docModalBackdrop');
    var titleEl = document.getElementById('docModalTitle');
    var statusEl = document.getElementById('docModalStatus');
    var descEl = document.getElementById('docModalDesc');
    var closeBtn = document.getElementById('docModalClose');
    var requestBtn = document.getElementById('docModalRequest');
    var triggers = document.querySelectorAll('[data-doc-id]');
    var activeDocTitle = '';
    var lastFocused = null;

    if (!backdrop) return;

    function openModal(docId) {
      var doc = AWTD_CONFIG.documents[docId];
      if (!doc) return;
      activeDocTitle = doc.title;
      if (titleEl) titleEl.textContent = doc.title;
      if (statusEl) statusEl.textContent = doc.year + ' · ' + doc.status;
      if (descEl) descEl.textContent = doc.summary;
      lastFocused = document.activeElement;
      backdrop.classList.add('is-open');
      backdrop.setAttribute('aria-hidden', 'false');
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      backdrop.classList.remove('is-open');
      backdrop.setAttribute('aria-hidden', 'true');
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(trigger.getAttribute('data-doc-id'));
      });
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(trigger.getAttribute('data-doc-id'));
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
        closeModal();
      }
    });

    if (requestBtn) {
      requestBtn.addEventListener('click', function () {
        closeModal();
        selectInquiryTopic('Document Request: ' + activeDocTitle);
      });
    }
  }

  /* ---- 7. Working with AWTD Pathways & Validated Inquiry Form with Local Ledger ---- */
  function selectInquiryTopic(topicValue) {
    var panel = document.getElementById('inquiryPanel');
    var select = document.getElementById('inquiryRole');
    var message = document.getElementById('inquiryMessage');
    var nameInput = document.getElementById('inquiryName');

    if (!panel) {
      window.location.href = 'get-involved.html?doc=' + encodeURIComponent(topicValue.replace('Document Request: ', '')) + '#inquiryPanel';
      return;
    }

    var pathwayBtns = document.querySelectorAll('[data-inquiry-topic]');
    pathwayBtns.forEach(function (btn) {
      btn.classList.toggle('is-selected', btn.getAttribute('data-inquiry-topic') === topicValue);
    });

    if (select) {
      var matched = false;
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value === topicValue) {
          select.selectedIndex = i;
          matched = true;
          break;
        }
      }
      if (!matched) {
        select.value = 'Brief / Position Paper Request';
        if (message && !message.value) {
          message.value = 'Please notify me when "' + topicValue.replace('Document Request: ', '') + '" is cleared for release.';
        }
      }
    }

    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(function () {
        if (nameInput) nameInput.focus();
      }, 450);
    }
  }

  function getSavedInquiries() {
    try {
      var raw = localStorage.getItem('awtd-inquiries');
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function updateInquiryLedgerUI() {
    var countEl = document.getElementById('inquiryLedgerCount');
    var list = getSavedInquiries();
    if (countEl) {
      countEl.textContent = String(list.length);
    }
  }

  function initInquiryForm() {
    var ctaTriggers = document.querySelectorAll('[data-inquiry-topic]');
    var form = document.getElementById('awtdInquiryForm');
    var statusEl = document.getElementById('inquiryStatus');
    var exportBtn = document.getElementById('exportInquiriesBtn');

    ctaTriggers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        selectInquiryTopic(btn.getAttribute('data-inquiry-topic'));
      });
    });

    updateInquiryLedgerUI();

    if (exportBtn) {
      exportBtn.addEventListener('click', function () {
        var records = getSavedInquiries();
        if (records.length === 0) {
          if (statusEl) {
            statusEl.classList.remove('is-error');
            statusEl.textContent = 'Local inquiry ledger is currently empty (0 saved inquiries).';
          }
          return;
        }
        var blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'awtd-inquiries-ledger.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    if (!form) return;

    try {
      var params = new URLSearchParams(window.location.search);
      var docParam = params.get('doc');
      var roleParam = params.get('role') || params.get('topic');
      if (docParam) {
        selectInquiryTopic('Document Request: ' + docParam);
      } else if (roleParam) {
        selectInquiryTopic(roleParam);
      }
    } catch (e) {}

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('inquiryName') || {}).value || '';
      var org = (document.getElementById('inquiryOrg') || {}).value || '';
      var email = (document.getElementById('inquiryEmail') || {}).value || '';
      var role = (document.getElementById('inquiryRole') || {}).value || '';
      var msg = (document.getElementById('inquiryMessage') || {}).value || '';

      name = name.trim();
      org = org.trim();
      email = email.trim();
      msg = msg.trim();

      if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (statusEl) {
          statusEl.textContent = 'Validation required: Please provide your full name and a valid work email address.';
          statusEl.classList.add('is-error');
        }
        return;
      }

      /* Persist locally to localStorage ledger (since external SMTP/API backend is unconfigured) */
      var entry = {
        timestamp: new Date().toISOString(),
        name: name,
        organisation: org || 'N/A',
        email: email,
        pathway: role,
        message: msg || 'Requesting a conversation regarding ' + role + '.'
      };

      try {
        var existing = getSavedInquiries();
        existing.push(entry);
        localStorage.setItem('awtd-inquiries', JSON.stringify(existing));
      } catch (err) {}

      updateInquiryLedgerUI();

      var endpoint = AWTD_CONFIG.googleSheetsEndpoint || AWTD_CONFIG.formEndpoint;
      if (endpoint) {
        if (statusEl) {
          statusEl.classList.remove('is-error');
          statusEl.textContent = 'Submitting your enquiry...';
        }
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            timestamp: entry.timestamp,
            formType: 'Enquiry',
            name: name,
            organisation: org,
            email: email,
            role: role,
            message: msg,
            pageUrl: window.location.href
          })
        }).then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json().catch(function () { return { status: 'ok' }; });
        }).then(function (result) {
          if (result && result.status === 'error') throw new Error(result.message || 'Sheet error');
          form.reset();
          if (statusEl) {
            statusEl.classList.remove('is-error');
            statusEl.textContent = 'Thank you for contacting AWTD. Your enquiry has been received.';
          }
        }).catch(function () {
          if (statusEl) {
            statusEl.classList.add('is-error');
            statusEl.textContent = 'Could not reach the Google Sheet endpoint. Please check your connection or email ' + AWTD_CONFIG.contactEmail + '.';
          }
        });
      } else {
        if (statusEl) {
          statusEl.classList.add('is-error');
          statusEl.textContent = 'Google Sheets Web App endpoint is not yet connected. Please configure AWTD_CONFIG.googleSheetsEndpoint.';
        }
      }
    });
  }

  /* ---- 7b. Portal Forms (Employers, Entrepreneurship, Academic Articles) ---- */
  function initPortalForms() {
    var configs = [
      {
        formId: 'employerNeedsForm',
        statusId: 'employerNeedsStatus',
        storageKey: 'awtd-employer-needs',
        subjectPrefix: '[AWTD Employer Training Need]',
        buildEntry: function (form) {
          return {
            timestamp: new Date().toISOString(),
            type: 'Employer Training Need',
            company: (form.querySelector('[name="company"]') || {}).value || '',
            contactName: (form.querySelector('[name="contactName"]') || {}).value || '',
            email: (form.querySelector('[name="email"]') || {}).value || '',
            sector: (form.querySelector('[name="sector"]') || {}).value || '',
            location: (form.querySelector('[name="location"]') || {}).value || '',
            needs: (form.querySelector('[name="needs"]') || {}).value || ''
          };
        },
        successMsg: 'Training need logged. Preparing direct dispatch to '
      },
      {
        formId: 'entrepreneurshipForm',
        statusId: 'entrepreneurshipStatus',
        storageKey: 'awtd-entrepreneurship-apps',
        subjectPrefix: '[AWTD Entrepreneurship Application]',
        buildEntry: function (form) {
          return {
            timestamp: new Date().toISOString(),
            type: 'Entrepreneurship Application',
            fullName: (form.querySelector('[name="fullName"]') || {}).value || '',
            email: (form.querySelector('[name="email"]') || {}).value || '',
            phone: (form.querySelector('[name="phone"]') || {}).value || '',
            tradeTrack: (form.querySelector('[name="tradeTrack"]') || {}).value || '',
            ventureConcept: (form.querySelector('[name="ventureConcept"]') || {}).value || ''
          };
        },
        successMsg: 'Entrepreneurship application logged. Preparing dispatch to '
      },
      {
        formId: 'articleSubmissionForm',
        statusId: 'articleSubmissionStatus',
        storageKey: 'awtd-article-submissions',
        subjectPrefix: '[AWTD Academic Paper Submission — Pending Board Review]',
        buildEntry: function (form) {
          return {
            timestamp: new Date().toISOString(),
            type: 'Academic Paper Submission',
            publicationState: 'Unpublished — Pending Board Review',
            authorName: (form.querySelector('[name="authorName"]') || {}).value || '',
            institution: (form.querySelector('[name="institution"]') || {}).value || '',
            email: (form.querySelector('[name="email"]') || {}).value || '',
            field: (form.querySelector('[name="field"]') || {}).value || '',
            title: (form.querySelector('[name="title"]') || {}).value || '',
            abstract: (form.querySelector('[name="abstract"]') || {}).value || ''
          };
        },
        successMsg: 'Submission recorded as Unpublished (Pending Board Review). Preparing dispatch to '
      }
    ];

    configs.forEach(function (cfg) {
      var form = document.getElementById(cfg.formId);
      var statusEl = document.getElementById(cfg.statusId);
      if (!form) return;

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var entry = cfg.buildEntry(form);
        var emailVal = (entry.email || '').trim();
        if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          if (statusEl) {
            statusEl.textContent = 'Please provide a valid email address before submitting.';
            statusEl.classList.add('is-error');
          }
          return;
        }

        try {
          var existing = JSON.parse(localStorage.getItem(cfg.storageKey) || '[]');
          if (Array.isArray(existing)) {
            existing.push(entry);
            localStorage.setItem(cfg.storageKey, JSON.stringify(existing));
          }
        } catch (err) {}

        var endpoint = AWTD_CONFIG.googleSheetsEndpoint || AWTD_CONFIG.formEndpoint;
        if (endpoint) {
          if (statusEl) {
            statusEl.classList.remove('is-error');
            statusEl.textContent = 'Submitting your application...';
          }
          var sheetPayload = Object.assign({ pageUrl: window.location.href }, entry);
          fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(sheetPayload)
          }).then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json().catch(function () { return { status: 'ok' }; });
          }).then(function (result) {
            if (result && result.status === 'error') throw new Error(result.message || 'Sheet error');
            form.reset();
            if (statusEl) {
              statusEl.classList.remove('is-error');
              statusEl.textContent = 'Thank you. Your application has been submitted successfully.';
            }
          }).catch(function () {
            if (statusEl) {
              statusEl.classList.add('is-error');
              statusEl.textContent = 'Could not reach the Google Sheet endpoint. Please check your connection or email ' + AWTD_CONFIG.contactEmail + '.';
            }
          });
        } else {
          if (statusEl) {
            statusEl.classList.add('is-error');
            statusEl.textContent = 'Google Sheets Web App endpoint is not yet connected. Please configure AWTD_CONFIG.googleSheetsEndpoint.';
          }
        }
      });
    });
  }

  /* ---- 8. Complete Motion Design, Page Transitions, Parallax & Stat Counters ---- */
  function initAnimations() {
    var prefersReduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced) {
      document.body.classList.add('awtd-motion-ready');

      /* 8a. Branded Loading & Smooth Cross-Page Transitions */
      var curtain = document.querySelector('.awtd-page-curtain');
      if (!curtain) {
        curtain = document.createElement('div');
        curtain.className = 'awtd-page-curtain is-active';
        curtain.setAttribute('aria-hidden', 'true');
        curtain.innerHTML =
          '<div class="awtd-loader-core">' +
            '<span class="awtd-loader-ring"></span>' +
            '<img class="awtd-loader-logo" src="04%20Logos/awtd-logo-transparent.png" alt="">' +
          '</div>';
        document.body.appendChild(curtain);

        window.requestAnimationFrame(function () {
          window.setTimeout(function () {
            curtain.classList.remove('is-active');
          }, 220);
        });
      }

      window.addEventListener('pageshow', function () {
        curtain.classList.remove('is-active');
      });

      document.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
          return;
        }
        var link = e.target.closest ? e.target.closest('a[href]') : null;
        if (!link) return;
        var rawHref = link.getAttribute('href') || '';
        if (
          !rawHref ||
          rawHref.charAt(0) === '#' ||
          rawHref.indexOf('mailto:') === 0 ||
          rawHref.indexOf('tel:') === 0 ||
          link.hasAttribute('download') ||
          (link.getAttribute('target') && link.getAttribute('target') !== '_self')
        ) {
          return;
        }
        var targetUrl;
        try {
          targetUrl = new URL(link.href, window.location.href);
        } catch (err) {
          return;
        }
        if (targetUrl.origin !== window.location.origin) return;
        if (targetUrl.pathname === window.location.pathname && targetUrl.hash) return;

        e.preventDefault();
        curtain.classList.add('is-active');
        window.setTimeout(function () {
          window.location.href = targetUrl.href;
        }, 230);
      });

      /* 8b. Scroll Progress Bar & Subtle Hero Parallax */
      if (!document.querySelector('.scroll-progress-bar')) {
        var progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        progressBar.setAttribute('aria-hidden', 'true');
        document.body.appendChild(progressBar);

        var heroPhoto = document.querySelector('.hero .hero-photo');
        var rafPending = false;
        var updateScrollMotion = function () {
          rafPending = false;
          var docEl = document.documentElement;
          var scrollTop = window.pageYOffset || docEl.scrollTop || 0;
          var maxScroll = Math.max(docEl.scrollHeight - docEl.clientHeight, 1);
          var ratio = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
          progressBar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
          if (heroPhoto) {
            var parallaxOffset = Math.min(scrollTop * 0.08, 26);
            heroPhoto.style.setProperty('--hero-parallax', parallaxOffset.toFixed(1) + 'px');
          }
        };

        var onScrollMotion = function () {
          if (!rafPending) {
            rafPending = true;
            window.requestAnimationFrame(updateScrollMotion);
          }
        };

        window.addEventListener('scroll', onScrollMotion, { passive: true });
        window.addEventListener('resize', onScrollMotion, { passive: true });
        updateScrollMotion();
      }

      /* 8c. Subtle Cursor Spotlight on Interactive Cards (Pointer Devices) */
      if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.addEventListener(
          'mousemove',
          function (e) {
            var card = e.target.closest
              ? e.target.closest('.why-landscape-card, .model-card, .card, .outcome-card, .paper')
              : null;
            if (!card) return;
            var rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', String(Math.round(e.clientX - rect.left)) + 'px');
            card.style.setProperty('--my', String(Math.round(e.clientY - rect.top)) + 'px');
          },
          { passive: true }
        );
      }
    }

    /* 8d. Independent Section Choreography (Headings, Media, Content, Staggered Grids) */
    document.querySelectorAll('.sec-head').forEach(function (head) {
      if (head.closest('.hero, .page-hero')) return;
      var eyebrow = head.querySelector('.eyebrow');
      var heading = head.querySelector('h2, h3');
      var lead = head.querySelector('.lead, p');
      if (eyebrow) {
        eyebrow.classList.add('reveal', 'reveal-left');
      }
      if (heading) {
        heading.classList.add('reveal');
        heading.style.transitionDelay = '90ms';
      }
      if (lead) {
        lead.classList.add('reveal');
        lead.style.transitionDelay = '180ms';
      }
    });

    document
      .querySelectorAll('.media-showcase-grid, .media-showcase-card, .workshop-feature-strip, .workshop-feature-card, .about-media, .figure-frame')
      .forEach(function (mediaEl) {
        if (mediaEl.closest('.hero, .page-hero')) return;
        mediaEl.classList.add('reveal', 'reveal-scale');
      });

    var autoRevealSelectors = [
      '.why-landscape-top',
      '.cta-band',
      '.strap',
      '.editorial-split > *',
      '.engage-layout > *'
    ];
    document.querySelectorAll(autoRevealSelectors.join(', ')).forEach(function (el) {
      if (el.closest('.hero, .page-hero, .nav, .foot')) return;
      if (!el.classList.contains('reveal') && !el.classList.contains('stagger-item')) {
        el.classList.add('reveal');
      }
    });

    var rowContainers =
      '.pilot-specs, .coalition-list, .publication-list, .pathway-list';
    var staggerGroups = document.querySelectorAll(
      '.grid, .why-landscape-table, .model-grid, .model-bento-grid, .model-steps, .tracks-grid, .stats, .telemetry-grid, ' +
      '.leadership-editorial-grid, .roadmap-timeline, .phases, .pipeline-track, .journey, .eag-strip, .logos, ' +
      '.papers-grid, ' + rowContainers
    );

    staggerGroups.forEach(function (group) {
      var isRowGroup = group.matches ? group.matches(rowContainers) : false;
      var children = Array.prototype.slice.call(group.children);
      children.forEach(function (child, idx) {
        if (child.classList.contains('pend-note')) return;
        child.classList.add('stagger-item');
        if (isRowGroup) child.classList.add('stagger-row');
        child.style.transitionDelay = String(Math.min(idx * 75, 450)) + 'ms';
      });
    });

    var revealEls = document.querySelectorAll('.reveal:not(.band)');
    var staggerItems = document.querySelectorAll('.stagger-item');

    if (prefersReduced || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) {
        el.classList.add('is-visible');
      });
      staggerItems.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -36px 0px' }
    );

    function revealVisibleOrPassed() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      revealEls.forEach(function (el) {
        if (!el.classList.contains('is-visible') && el.getBoundingClientRect().top < vh * 0.94) {
          el.classList.add('is-visible');
          revealObserver.unobserve(el);
        }
      });
      staggerItems.forEach(function (el) {
        if (!el.classList.contains('is-visible') && el.getBoundingClientRect().top < vh * 0.94) {
          el.classList.add('is-visible');
          revealObserver.unobserve(el);
        }
      });
    }

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });

    staggerItems.forEach(function (el) {
      revealObserver.observe(el);
    });

    window.addEventListener('scroll', revealVisibleOrPassed, { passive: true });
    revealVisibleOrPassed();

    var statEls = document.querySelectorAll('[data-stat-target]');
    var statsObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          obs.unobserve(el);
          var target = parseInt(el.getAttribute('data-stat-target'), 10);
          var suffix = el.getAttribute('data-stat-suffix') || '';
          if (isNaN(target) || target === 0) {
            el.textContent = '0' + suffix;
            el.classList.add('is-counted');
            return;
          }
          var start = 0;
          var duration = 850;
          var startTime = null;
          function tick(ts) {
            if (!startTime) startTime = ts;
            var progress = Math.min((ts - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.round(start + (target - start) * eased);
            el.textContent = String(current) + suffix;
            if (progress < 1) {
              window.requestAnimationFrame(tick);
            } else {
              el.textContent = String(target) + suffix;
              el.classList.add('is-counted');
            }
          }
          window.requestAnimationFrame(tick);
        });
      },
      { threshold: 0.45 }
    );

    statEls.forEach(function (el) {
      statsObserver.observe(el);
    });
  }

  /* ---- Initialize on DOMContentLoaded ---- */
  function init() {
    initConfigBindings();
    initReviewToggle();
    initNavigation();
    initTracksController();
    initContrastController();
    initDocumentModal();
    initInquiryForm();
    initPortalForms();
    initAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
