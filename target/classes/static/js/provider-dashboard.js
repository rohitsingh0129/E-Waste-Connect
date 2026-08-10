/**
 * E-Waste Connect - Provider Dashboard Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page === 'provider-dashboard.html' || window.location.pathname.includes('provider-dashboard.html')) {
    initDashboardPage();
  }
});

function initDashboardPage() {
  const currentProviderId = parseInt(getUrlParam('providerId')) || 1;
  const provider = getProviderById(currentProviderId) || getProviderById(1);

  if (!provider) return;

  // Set header info
  const bizTitleElem = document.getElementById('dash-biz-name');
  if (bizTitleElem) bizTitleElem.textContent = provider.name;

  renderDashboardMetrics(provider.id);
  renderListingsTable(provider);
  renderIncomingRequests(provider.id);
  initModalHandlers(provider);
}

/**
 * Render Top Summary Stats
 */
function renderDashboardMetrics(providerId) {
  const provider = getProviderById(providerId);
  const requests = getRequestsByProvider(providerId);

  const activeListingsCount = provider.pricingMatrix ? provider.pricingMatrix.length : (provider.wasteTypes ? provider.wasteTypes.length : 0);
  const pendingRequestsCount = requests.filter(r => r.status === 'Submitted' || r.status === 'Accepted' || r.status === 'Pickup Scheduled').length;
  const completedRequestsCount = requests.filter(r => r.status === 'Completed').length;
  
  const totalCollectedKg = requests
    .filter(r => r.status === 'Collected' || r.status === 'Completed')
    .reduce((sum, r) => sum + (r.unit === 'kg' ? r.quantity : r.quantity * 2), 0);

  const activeListingsElem = document.getElementById('metric-active-listings');
  const pendingReqElem = document.getElementById('metric-pending-requests');
  const completedReqElem = document.getElementById('metric-completed-requests');
  const totalCollectedElem = document.getElementById('metric-total-collected');

  if (activeListingsElem) activeListingsElem.textContent = activeListingsCount;
  if (pendingReqElem) pendingReqElem.textContent = pendingRequestsCount;
  if (completedReqElem) completedReqElem.textContent = completedRequestsCount;
  if (totalCollectedElem) totalCollectedElem.textContent = `${totalCollectedKg} kg`;
}

/**
 * Render Provider Listings Table
 */
function renderListingsTable(provider) {
  const tbody = document.getElementById('listings-table-body');
  if (!tbody) return;

  const listings = provider.pricingMatrix || [
    { wasteType: "PCB", price: provider.price, unit: provider.unit, minQty: provider.minimumQuantity }
  ];

  if (listings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-muted);">No active listings. Click "Add Listing" to create one.</td></tr>`;
    return;
  }

  tbody.innerHTML = listings.map(item => `
    <tr>
      <td><strong>${item.wasteType}</strong></td>
      <td style="color: var(--primary); font-weight: 700;">${formatCurrency(item.price)} / ${item.unit}</td>
      <td>${item.minQty} ${item.unit}</td>
      <td><span class="badge badge-success">Active</span></td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="handleDeleteListing(${provider.id}, '${item.wasteType}')">
          🗑️ Delete
        </button>
      </td>
    </tr>
  `).join('');
}

/**
 * Handle Delete Listing
 */
function handleDeleteListing(providerId, wasteType) {
  if (confirm(`Are you sure you want to remove the listing for ${wasteType}?`)) {
    deleteProviderListing(providerId, wasteType);
    const updatedProvider = getProviderById(providerId);
    renderListingsTable(updatedProvider);
    renderDashboardMetrics(providerId);
    showToast(`Listing for ${wasteType} removed.`);
  }
}

/**
 * Render Incoming Pickup Requests
 */
function renderIncomingRequests(providerId) {
  const container = document.getElementById('dashboard-requests-container');
  if (!container) return;

  const requests = getRequestsByProvider(providerId);

  if (requests.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align:center; padding:2.5rem;">
        <p style="color:var(--text-muted);">No incoming requests at the moment.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = requests.map(req => `
    <div class="card" style="margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <h4 style="font-size: 1.1rem;">#${req.id}</h4>
            <span class="badge ${getBadgeClassForStatus(req.status)}">${req.status}</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
            Customer: <strong>${req.customerName}</strong> (${req.customerPhone})
          </p>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 800; font-size: 1.2rem; color: var(--primary);">${formatCurrency(req.estimatedValue)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${req.createdAt}</div>
        </div>
      </div>

      <div class="provider-details-grid" style="margin-bottom: 1rem;">
        <div class="detail-item">
          <label>Waste Category</label>
          <span>${req.wasteType}</span>
        </div>
        <div class="detail-item">
          <label>Quantity</label>
          <span>${req.quantity} ${req.unit}</span>
        </div>
        <div class="detail-item">
          <label>Pickup Location</label>
          <span>${req.address}</span>
        </div>
        <div class="detail-item">
          <label>Scheduled Date</label>
          <span>${req.pickupDate} (${req.pickupTime})</span>
        </div>
      </div>

      ${req.notes ? `<div style="font-size:0.85rem; background:#f8fafc; padding:0.6rem; border-radius:6px; margin-bottom:1rem; color:#475569;">💬 Note: ${req.notes}</div>` : ''}

      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: flex-end;">
        <a href="request-status.html?id=${req.id}" class="btn btn-outline btn-sm">Track Flow</a>
        ${renderStatusActionButtons(req)}
      </div>
    </div>
  `).join('');
}

/**
 * Returns dynamic action buttons based on status progression workflow:
 * Submitted -> Accepted -> Pickup Scheduled -> Collected -> Completed
 */
function renderStatusActionButtons(req) {
  switch (req.status) {
    case 'Submitted':
      return `
        <button class="btn btn-primary btn-sm" onclick="handleUpdateReqStatus('${req.id}', 'Accepted')">✓ Accept Request</button>
        <button class="btn btn-outline btn-sm" style="color:var(--danger);" onclick="handleUpdateReqStatus('${req.id}', 'Rejected')">✕ Reject</button>
      `;
    case 'Accepted':
      return `
        <button class="btn btn-primary btn-sm" onclick="handleUpdateReqStatus('${req.id}', 'Pickup Scheduled')">📅 Schedule Pickup</button>
      `;
    case 'Pickup Scheduled':
      return `
        <button class="btn btn-primary btn-sm" onclick="handleUpdateReqStatus('${req.id}', 'Collected')">🚚 Mark Collected</button>
      `;
    case 'Collected':
      return `
        <button class="btn btn-secondary btn-sm" onclick="handleUpdateReqStatus('${req.id}', 'Completed')">♻️ Complete Recycling</button>
      `;
    case 'Completed':
      return `<span style="color:var(--success); font-weight:700; font-size:0.85rem;">✓ Order Fully Processed</span>`;
    default:
      return '';
  }
}

function handleUpdateReqStatus(reqId, newStatus) {
  updateRequestStatus(reqId, newStatus);
  const currentProviderId = parseInt(getUrlParam('providerId')) || 1;
  renderIncomingRequests(currentProviderId);
  renderDashboardMetrics(currentProviderId);
  showToast(`Request ${reqId} updated to '${newStatus}'`);
}

function getBadgeClassForStatus(status) {
  switch (status) {
    case 'Submitted': return 'badge-warning';
    case 'Accepted': return 'badge-info';
    case 'Pickup Scheduled': return 'badge-primary';
    case 'Collected': return 'badge-neutral';
    case 'Completed': return 'badge-success';
    default: return 'badge-neutral';
  }
}

/**
 * Add Listing Modal Interactivity
 */
function initModalHandlers(provider) {
  const modalOverlay = document.getElementById('add-listing-modal');
  const openBtn = document.getElementById('btn-open-add-modal');
  const closeBtn = document.getElementById('btn-close-add-modal');
  const form = document.getElementById('add-listing-form');

  openBtn?.addEventListener('click', () => {
    modalOverlay?.classList.add('active');
  });

  closeBtn?.addEventListener('click', () => {
    modalOverlay?.classList.remove('active');
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const listing = {
      wasteType: document.getElementById('modal-waste-type').value,
      price: parseFloat(document.getElementById('modal-price').value),
      unit: document.getElementById('modal-unit').value,
      minQty: parseInt(document.getElementById('modal-min-qty').value)
    };

    addProviderListing(provider.id, listing);
    modalOverlay?.classList.remove('active');
    
    const updatedProvider = getProviderById(provider.id);
    renderListingsTable(updatedProvider);
    renderDashboardMetrics(provider.id);
    showToast(`New listing for ${listing.wasteType} added!`);
  });
}
