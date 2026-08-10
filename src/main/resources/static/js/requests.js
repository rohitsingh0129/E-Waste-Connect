/**
 * E-Waste Connect - Pickup Requests Data & API Layer
 * Connects to Java Spring Boot REST API (/api/requests) with localStorage fallback
 */

const STORAGE_KEY_REQUESTS = 'ewaste_requests';

const initialRequests = [
  {
    id: "REQ-1024",
    providerId: 1,
    providerName: "ABC E-Waste Recycling",
    customerName: "ABC Mobile Repair Shop",
    customerPhone: "+91 98760 11223",
    customerEmail: "abcmobile@gmail.com",
    wasteType: "PCB",
    quantity: 20,
    unit: "kg",
    pickupRequired: true,
    address: "Shop 14, Galaxy Market, Relief Road, Ahmedabad 380001",
    pickupDate: "2026-08-12",
    pickupTime: "10:30 AM",
    notes: "Includes 15 kg smartphone motherboards and 5 kg computer PCBs. Boxed and ready.",
    estimatedValue: 5000,
    status: "Submitted",
    createdAt: "2026-08-10 09:15:00",
    statusHistory: [
      { status: "Submitted", timestamp: "2026-08-10 09:15:00", note: "Request submitted by customer" }
    ]
  }
];

function initRequestsStorage() {
  if (!localStorage.getItem(STORAGE_KEY_REQUESTS)) {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(initialRequests));
  }
}
initRequestsStorage();

// Try async sync with Spring Boot REST API
if (window.location.protocol.startsWith('http')) {
  fetch('/api/requests')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(data));
      }
    })
    .catch(err => console.log('Spring Boot requests API offline, using localStorage.'));
}

function getRequests() {
  const data = localStorage.getItem(STORAGE_KEY_REQUESTS);
  return data ? JSON.parse(data) : initialRequests;
}

function getRequestById(id) {
  const requests = getRequests();
  return requests.find(r => r.id === id) || null;
}

function getRequestsByProvider(providerId) {
  const requests = getRequests();
  return requests.filter(r => r.providerId === parseInt(providerId));
}

function createRequest(requestData) {
  const requests = getRequests();
  const nextNum = Math.floor(1000 + Math.random() * 9000);
  const reqId = `REQ-${nextNum}`;
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const newRequest = {
    id: reqId,
    providerId: parseInt(requestData.providerId) || 1,
    providerName: requestData.providerName || "ABC E-Waste Recycling",
    customerName: requestData.customerName || "E-Waste Generator",
    customerPhone: requestData.customerPhone || "+91 99999 88888",
    customerEmail: requestData.customerEmail || "user@example.com",
    wasteType: requestData.wasteType || "PCB",
    quantity: parseFloat(requestData.quantity) || 10,
    unit: requestData.unit || "kg",
    pickupRequired: requestData.pickupRequired !== false,
    address: requestData.address || "Main Street, Ahmedabad",
    pickupDate: requestData.pickupDate || now.substring(0, 10),
    pickupTime: requestData.pickupTime || "11:00 AM",
    notes: requestData.notes || "",
    estimatedValue: (parseFloat(requestData.quantity) || 10) * (parseFloat(requestData.pricePerUnit) || 250),
    status: "Submitted",
    createdAt: now,
    statusHistory: [
      { status: "Submitted", timestamp: now, note: "Request submitted by customer" }
    ]
  };

  requests.unshift(newRequest);
  localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));

  // Sync to Spring Boot REST API
  if (window.location.protocol.startsWith('http')) {
    fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRequest)
    }).catch(e => console.log('REST API offline, request stored locally.'));
  }

  return newRequest;
}

function updateRequestStatus(reqId, newStatus, note = "") {
  const requests = getRequests();
  const idx = requests.findIndex(r => r.id === reqId);
  
  if (idx !== -1) {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    requests[idx].status = newStatus;
    
    if (!requests[idx].statusHistory) {
      requests[idx].statusHistory = [];
    }
    
    requests[idx].statusHistory.push({
      status: newStatus,
      timestamp: now,
      note: note || `Status updated to ${newStatus}`
    });

    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));

    // Sync to Spring Boot REST API
    if (window.location.protocol.startsWith('http')) {
      fetch(`/api/requests/${reqId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      }).catch(e => console.log('REST API status update offline.'));
    }

    return requests[idx];
  }
  return null;
}
