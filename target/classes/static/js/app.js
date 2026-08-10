/**
 * E-Waste Connect - Main Application UI & Page Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarActiveLink();
  routePageHandler();
});

/**
 * Automatically highlight the active link in the navigation header
 */
function initNavbarActiveLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Get URL Query Parameter by Name
 */
function getUrlParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

/**
 * Format Indian Rupee currency
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Display Floating Toast Notification
 */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✓' : '⚠️';
  toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Route page specific scripts based on body data-page or filename
 */
function routePageHandler() {
  const page = document.body.dataset.page || window.location.pathname.split('/').pop();

  switch (page) {
    case 'find-provider.html':
      initFindProviderPage();
      break;
    case 'provider-details.html':
      initProviderDetailsPage();
      break;
    case 'request.html':
      initRequestFormPage();
      break;
    case 'request-status.html':
      initRequestStatusPage();
      break;
    case 'provider.html':
      initProviderRegisterPage();
      break;
    default:
      break;
  }
}

/* ==========================================================================
   PAGE 2: Find Provider Page Logic
   ========================================================================== */
let mapInstance = null;

function initFindProviderPage() {
  const form = document.getElementById('search-filter-form');
  const resultsContainer = document.getElementById('provider-results-list');
  const resultCount = document.getElementById('results-count');

  // Pre-fill parameters if navigated from home page
  const wasteParam = getUrlParam('waste');
  const qtyParam = getUrlParam('qty');
  if (wasteParam) {
    const wasteSelect = document.getElementById('filter-waste');
    if (wasteSelect) wasteSelect.value = wasteParam;
  }
  if (qtyParam) {
    const qtyInput = document.getElementById('filter-qty');
    if (qtyInput) qtyInput.value = qtyParam;
  }

  function renderResults() {
    const wasteType = document.getElementById('filter-waste')?.value || 'All';
    const location = document.getElementById('filter-location')?.value || '';
    const pickupAvailable = document.getElementById('filter-pickup')?.checked || false;
    const maxPrice = document.getElementById('filter-price')?.value || '';
    const sortBy = document.getElementById('filter-sort')?.value || 'recommended';

    const providers = filterProviders({
      wasteType,
      location,
      pickupAvailable,
      maxPrice,
      sortBy
    });

    if (resultCount) {
      resultCount.textContent = `${providers.length} provider${providers.length === 1 ? '' : 's'} found`;
    }

    if (providers.length === 0) {
      resultsContainer.innerHTML = `
        <div class="card" style="text-align: center; padding: 3rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3>No Recycling Providers Found</h3>
          <p style="color: var(--text-muted); margin-top: 0.5rem;">Try adjusting your search location, waste category, or filter criteria.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = providers.map(p => `
      <div class="provider-card">
        <div class="provider-main">
          <div class="provider-header">
            <div>
              <h3 class="provider-name">${p.name}</h3>
              <div style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;">
                📍 ${p.city} • <span style="color: var(--primary); font-weight: 600;">${p.distanceKm} km away</span>
              </div>
            </div>
            <div class="rating-pill">⭐ ${p.rating} (${p.reviewCount})</div>
          </div>

          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin: 0.25rem 0;">
            ${p.wasteTypes.slice(0, 5).map(wt => `<span class="badge badge-primary">${wt}</span>`).join('')}
            ${p.wasteTypes.length > 5 ? `<span class="badge badge-neutral">+${p.wasteTypes.length - 5} more</span>` : ''}
          </div>

          <div class="provider-details-grid">
            <div class="detail-item">
              <label>${wasteType !== 'All' ? wasteType : 'Accepted'} Rate</label>
              <span>${formatCurrency(p.price)} / ${p.unit}</span>
            </div>
            <div class="detail-item">
              <label>Minimum Qty</label>
              <span>${p.minimumQuantity} ${p.unit}</span>
            </div>
            <div class="detail-item">
              <label>Doorstep Pickup</label>
              <span>${p.pickupAvailable ? '✓ Available' : '✕ Self Drop'}</span>
            </div>
            <div class="detail-item">
              <label>Transport Fee</label>
              <span>${p.transportationAvailable ? (p.transportationCharge === 0 ? 'Free' : formatCurrency(p.transportationCharge)) : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-end; gap: 0.75rem;">
          <a href="provider-details.html?id=${p.id}${wasteType !== 'All' ? `&waste=${encodeURIComponent(wasteType)}` : ''}" class="btn btn-primary btn-sm">
            View Details & Prices
          </a>
          <a href="request.html?providerId=${p.id}&waste=${encodeURIComponent(wasteType !== 'All' ? wasteType : 'PCB')}&qty=${document.getElementById('filter-qty')?.value || 20}" class="btn btn-secondary btn-sm">
            Request Collection
          </a>
        </div>
      </div>
    `).join('');

    renderMapMarkers(providers);
  }

  // Bind filter inputs
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    renderResults();
  });

  document.getElementById('filter-waste')?.addEventListener('change', renderResults);
  document.getElementById('filter-sort')?.addEventListener('change', renderResults);
  document.getElementById('filter-pickup')?.addEventListener('change', renderResults);

  // "Use My Location" simulation
  document.getElementById('btn-use-location')?.addEventListener('click', () => {
    const locInput = document.getElementById('filter-location');
    if (locInput) {
      locInput.value = "Ahmedabad, Gujarat";
      showToast("Location updated to current position: Ahmedabad");
      renderResults();
    }
  });

  renderResults();
}

/**
 * Leaflet Map Render Helper
 */
function renderMapMarkers(providers) {
  const mapElem = document.getElementById('leaflet-map');
  if (!mapElem || typeof L === 'undefined') return;

  if (!mapInstance) {
    mapInstance = L.map('leaflet-map').setView([23.0225, 72.5714], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);
  }

  // Clear existing markers
  mapInstance.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      mapInstance.removeLayer(layer);
    }
  });

  providers.forEach(p => {
    if (p.latitude && p.longitude) {
      const marker = L.marker([p.latitude, p.longitude]).addTo(mapInstance);
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <strong style="color:#059669">${p.name}</strong><br/>
          ${p.city} (${p.distanceKm} km)<br/>
          Rate: <b>${formatCurrency(p.price)} / ${p.unit}</b><br/>
          <a href="provider-details.html?id=${p.id}" style="color:#059669; font-size:12px;">View Profile &rarr;</a>
        </div>
      `);
    }
  });
}

/* ==========================================================================
   PAGE 3: Provider Details Page Logic
   ========================================================================== */
function initProviderDetailsPage() {
  const providerId = getUrlParam('id') || '1';
  const provider = getProviderById(providerId);

  if (!provider) {
    document.getElementById('provider-details-container').innerHTML = `
      <div class="card" style="text-align:center; padding:3rem;">
        <h2>Provider Not Found</h2>
        <a href="find-provider.html" class="btn btn-primary" style="margin-top:1rem;">Back to Provider Search</a>
      </div>
    `;
    return;
  }

  // Update DOM fields
  document.getElementById('pd-name').textContent = provider.name;
  document.getElementById('pd-location').textContent = `${provider.city} (${provider.distanceKm} km away)`;
  document.getElementById('pd-rating').textContent = `⭐ ${provider.rating} (${provider.reviewCount} customer reviews)`;
  document.getElementById('pd-address').textContent = provider.address;
  document.getElementById('pd-phone').textContent = provider.phone;
  document.getElementById('pd-email').textContent = provider.email;
  document.getElementById('pd-hours').textContent = provider.workingHours;
  document.getElementById('pd-description').textContent = provider.description;

  document.getElementById('pd-pickup-badge').textContent = provider.pickupAvailable ? '✓ Available' : '✕ Self Drop';
  document.getElementById('pd-transport-fee').textContent = provider.transportationAvailable ? 
    (provider.transportationCharge === 0 ? `Free pickup above ${provider.freePickupThreshold} kg` : formatCurrency(provider.transportationCharge)) : 'Not Available';

  // Request Collection CTA button update
  const requestBtn = document.getElementById('pd-request-btn');
  if (requestBtn) {
    const passedWaste = getUrlParam('waste') || 'PCB';
    requestBtn.href = `request.html?providerId=${provider.id}&waste=${encodeURIComponent(passedWaste)}`;
  }

  // Render Pricing Matrix
  const matrixTbody = document.getElementById('pd-pricing-tbody');
  if (matrixTbody) {
    const matrix = provider.pricingMatrix || [
      { wasteType: "PCB", price: provider.price, unit: provider.unit, minQty: provider.minimumQuantity }
    ];
    matrixTbody.innerHTML = matrix.map(m => `
      <tr>
        <td><strong>${m.wasteType}</strong></td>
        <td style="color: var(--primary); font-weight: 700;">${formatCurrency(m.price)} / ${m.unit}</td>
        <td>${m.minQty} ${m.unit}</td>
        <td><span class="badge badge-success">Accepting</span></td>
      </tr>
    `).join('');
  }

  // Single Provider Map Render
  const mapElem = document.getElementById('provider-detail-map');
  if (mapElem && typeof L !== 'undefined' && provider.latitude && provider.longitude) {
    const pMap = L.map('provider-detail-map').setView([provider.latitude, provider.longitude], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(pMap);
    L.marker([provider.latitude, provider.longitude]).addTo(pMap)
      .bindPopup(`<b>${provider.name}</b><br>${provider.address}`).openPopup();
  }
}

/* ==========================================================================
   PAGE 4: Collection Request Form Page Logic
   ========================================================================== */
function initRequestFormPage() {
  const providerId = getUrlParam('providerId') || '1';
  const wasteParam = getUrlParam('waste') || 'PCB';
  const qtyParam = getUrlParam('qty') || '20';

  const provider = getProviderById(providerId) || getProviderById(1);

  // Set provider summary card
  document.getElementById('req-provider-name').textContent = provider.name;
  document.getElementById('req-provider-location').textContent = provider.city;
  document.getElementById('req-provider-phone').textContent = provider.phone;

  // Pre-fill form inputs
  const wasteSelect = document.getElementById('req-waste-type');
  const qtyInput = document.getElementById('req-qty');

  if (wasteSelect) wasteSelect.value = wasteParam;
  if (qtyInput) qtyInput.value = qtyParam;

  // Submit Handler
  const requestForm = document.getElementById('collection-request-form');
  requestForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const requestData = {
      providerId: provider.id,
      providerName: provider.name,
      customerName: document.getElementById('req-name')?.value || "ABC Repair Shop",
      customerPhone: document.getElementById('req-phone')?.value || "+91 98765 43210",
      customerEmail: document.getElementById('req-email')?.value || "customer@example.com",
      wasteType: document.getElementById('req-waste-type')?.value || "PCB",
      quantity: document.getElementById('req-qty')?.value || 10,
      unit: document.getElementById('req-unit')?.value || "kg",
      pickupRequired: document.getElementById('req-pickup-toggle')?.checked !== false,
      address: document.getElementById('req-address')?.value || "Relief Road, Ahmedabad",
      pickupDate: document.getElementById('req-date')?.value || new Date().toISOString().split('T')[0],
      pickupTime: document.getElementById('req-time')?.value || "10:00 AM",
      notes: document.getElementById('req-notes')?.value || "",
      pricePerUnit: provider.price
    };

    const createdReq = createRequest(requestData);
    showToast(`Request ${createdReq.id} submitted successfully!`);
    
    setTimeout(() => {
      window.location.href = `request-status.html?id=${createdReq.id}`;
    }, 800);
  });
}

/* ==========================================================================
   PAGE 5: Request Status Timeline Page Logic
   ========================================================================== */
function initRequestStatusPage() {
  const reqId = getUrlParam('id') || 'REQ-1024';
  const req = getRequestById(reqId);

  if (!req) {
    document.getElementById('status-content').innerHTML = `
      <div class="card" style="text-align:center; padding:3rem;">
        <h2>Request ${reqId} Not Found</h2>
        <a href="find-provider.html" class="btn btn-primary" style="margin-top:1rem;">Back to Find Provider</a>
      </div>
    `;
    return;
  }

  document.getElementById('st-id').textContent = req.id;
  document.getElementById('st-provider').textContent = req.providerName;
  document.getElementById('st-waste').textContent = `${req.quantity} ${req.unit} of ${req.wasteType}`;
  document.getElementById('st-address').textContent = req.address;
  document.getElementById('st-date').textContent = `${req.pickupDate} at ${req.pickupTime}`;
  document.getElementById('st-value').textContent = formatCurrency(req.estimatedValue);

  // Update Visual Timeline Steps
  // Statuses: Submitted -> Accepted -> Pickup Scheduled -> Collected -> Completed
  const steps = ["Submitted", "Accepted", "Pickup Scheduled", "Collected", "Completed"];
  const currentStepIndex = steps.indexOf(req.status);

  steps.forEach((stepName, idx) => {
    const stepElem = document.getElementById(`step-${idx + 1}`);
    if (stepElem) {
      stepElem.classList.remove('active', 'completed');
      if (idx < currentStepIndex) {
        stepElem.classList.add('completed');
      } else if (idx === currentStepIndex) {
        stepElem.classList.add('active');
      }
    }
  });

  // Render Status History Timeline Log
  const historyContainer = document.getElementById('st-history-log');
  if (historyContainer && req.statusHistory) {
    historyContainer.innerHTML = req.statusHistory.map(h => `
      <div style="display:flex; gap:1rem; margin-bottom:1rem; font-size:0.9rem;">
        <div style="color:var(--primary); font-weight:700; min-width:140px;">${h.timestamp}</div>
        <div>
          <strong>${h.status}</strong> — ${h.note}
        </div>
      </div>
    `).join('');
  }
}

/* ==========================================================================
   PAGE 6: Provider Registration Page Logic
   ========================================================================== */
function initProviderRegisterPage() {
  const form = document.getElementById('provider-register-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Gather selected checkboxes for waste types
    const wasteCheckboxes = document.querySelectorAll('input[name="acceptedWaste"]:checked');
    const selectedWaste = Array.from(wasteCheckboxes).map(cb => cb.value);

    const providerData = {
      name: document.getElementById('reg-biz-name')?.value || "Eco Recycling Solutions",
      city: document.getElementById('reg-city')?.value || "Ahmedabad",
      address: document.getElementById('reg-address')?.value || "Industrial Area",
      phone: document.getElementById('reg-phone')?.value || "+91 98000 11122",
      email: document.getElementById('reg-email')?.value || "contact@ecobiz.com",
      wasteTypes: selectedWaste.length > 0 ? selectedWaste : ["PCB", "Laptop", "Mobile Phone"],
      price: document.getElementById('reg-price')?.value || 250,
      unit: document.getElementById('reg-unit')?.value || "kg",
      minimumQuantity: document.getElementById('reg-min-qty')?.value || 10,
      pickupAvailable: document.getElementById('reg-pickup')?.checked || false,
      transportationAvailable: document.getElementById('reg-transport')?.checked || false,
      transportationCharge: document.getElementById('reg-transport-fee')?.value || 0,
      description: document.getElementById('reg-description')?.value || "Certified recycler specializing in sustainable tech recovery."
    };

    const newProvider = registerProvider(providerData);
    showToast("Provider Registration Successful! Redirecting to Dashboard...");

    setTimeout(() => {
      window.location.href = `provider-dashboard.html?providerId=${newProvider.id}`;
    }, 1000);
  });
}
