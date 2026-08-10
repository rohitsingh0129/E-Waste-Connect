/**
 * E-Waste Connect - Providers Data & API Layer
 * Connects to Java Spring Boot REST API (/api/providers) with localStorage fallback
 */

const STORAGE_KEY_PROVIDERS = 'ewaste_providers';

// Initial realistic seed data
const initialProviders = [
  {
    id: 1,
    name: "ABC E-Waste Recycling",
    city: "Ahmedabad",
    address: "Plot 42, GIDC Industrial Estate, Naroda, Ahmedabad, Gujarat 382330",
    phone: "+91 98765 43210",
    email: "contact@abcewaste.com",
    rating: 4.7,
    reviewCount: 38,
    wasteTypes: ["PCB", "Mobile Phone", "Laptop", "Battery", "Charger", "Copper Wire"],
    price: 250,
    unit: "kg",
    minimumQuantity: 10,
    pickupAvailable: true,
    transportationAvailable: true,
    transportationCharge: 0,
    freePickupThreshold: 50,
    latitude: 23.0725,
    longitude: 72.6114,
    distanceKm: 2.4,
    workingHours: "Mon - Sat: 9:00 AM - 7:00 PM",
    description: "Authorized e-waste recycler certified by GPCB. We process all types of electronic scrap with maximum material recovery and zero landfill impact.",
    pricingMatrix: [
      { wasteType: "PCB", price: 250, unit: "kg", minQty: 10 },
      { wasteType: "Mobile Phone", price: 300, unit: "kg", minQty: 5 },
      { wasteType: "Laptop", price: 220, unit: "kg", minQty: 5 },
      { wasteType: "Battery", price: 110, unit: "kg", minQty: 15 },
      { wasteType: "Copper Wire", price: 540, unit: "kg", minQty: 10 }
    ]
  },
  {
    id: 2,
    name: "Green Earth Recycling Co.",
    city: "Ahmedabad",
    address: "102, Green Complex, SG Highway, Prahlad Nagar, Ahmedabad 380015",
    phone: "+91 98980 12345",
    email: "info@greenearthrecycling.in",
    rating: 4.4,
    reviewCount: 24,
    wasteTypes: ["PCB", "Computer", "Monitor", "Printer", "Charger"],
    price: 230,
    unit: "kg",
    minimumQuantity: 20,
    pickupAvailable: true,
    transportationAvailable: false,
    transportationCharge: 200,
    freePickupThreshold: 100,
    latitude: 23.0125,
    longitude: 72.5114,
    distanceKm: 4.1,
    workingHours: "Mon - Fri: 10:00 AM - 6:00 PM",
    description: "Specialized in bulk IT asset disposition and corporate e-waste collection. High precision sorting and secure data destruction available.",
    pricingMatrix: [
      { wasteType: "PCB", price: 230, unit: "kg", minQty: 20 },
      { wasteType: "Computer", price: 150, unit: "kg", minQty: 10 },
      { wasteType: "Monitor", price: 90, unit: "unit", minQty: 5 },
      { wasteType: "Printer", price: 110, unit: "unit", minQty: 5 }
    ]
  },
  {
    id: 3,
    name: "EcoCircuit Scrap & Tech Recovery",
    city: "Ahmedabad",
    address: "Sector 8, Odhav Industrial Area, Ahmedabad 382415",
    phone: "+91 97123 98765",
    email: "support@ecocircuit.org",
    rating: 4.9,
    reviewCount: 52,
    wasteTypes: ["PCB", "Mobile Phone", "Laptop", "Copper Wire", "Battery"],
    price: 280,
    unit: "kg",
    minimumQuantity: 5,
    pickupAvailable: true,
    transportationAvailable: true,
    transportationCharge: 0,
    freePickupThreshold: 20,
    latitude: 23.0325,
    longitude: 72.6314,
    distanceKm: 1.8,
    workingHours: "Mon - Sat: 8:30 AM - 8:00 PM",
    description: "Top-rated precious metal recovery unit buying high-grade circuit boards, telecom scrap, and laptop motherboards at premium market rates.",
    pricingMatrix: [
      { wasteType: "PCB", price: 280, unit: "kg", minQty: 5 },
      { wasteType: "Copper Wire", price: 580, unit: "kg", minQty: 10 },
      { wasteType: "Mobile Phone", price: 340, unit: "kg", minQty: 5 },
      { wasteType: "Battery", price: 130, unit: "kg", minQty: 10 }
    ]
  }
];

function initProvidersStorage() {
  if (!localStorage.getItem(STORAGE_KEY_PROVIDERS)) {
    localStorage.setItem(STORAGE_KEY_PROVIDERS, JSON.stringify(initialProviders));
  }
}
initProvidersStorage();

// Try async sync with Spring Boot backend
if (window.location.protocol.startsWith('http')) {
  fetch('/api/providers')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(STORAGE_KEY_PROVIDERS, JSON.stringify(data));
      }
    })
    .catch(err => console.log('Spring Boot backend offline, using localStorage cache.'));
}

function getProviders() {
  const data = localStorage.getItem(STORAGE_KEY_PROVIDERS);
  return data ? JSON.parse(data) : initialProviders;
}

function getProviderById(id) {
  const providers = getProviders();
  return providers.find(p => p.id === parseInt(id)) || null;
}

function filterProviders({ wasteType, location, pickupAvailable, maxPrice, sortBy }) {
  let list = getProviders();

  if (wasteType && wasteType !== "All") {
    list = list.filter(p => p.wasteTypes.includes(wasteType));
  }

  if (location && location.trim() !== "") {
    const locLower = location.toLowerCase();
    list = list.filter(p => p.city.toLowerCase().includes(locLower) || p.address.toLowerCase().includes(locLower));
  }

  if (pickupAvailable) {
    list = list.filter(p => p.pickupAvailable);
  }

  if (maxPrice) {
    list = list.filter(p => p.price <= parseFloat(maxPrice));
  }

  if (sortBy === "price_asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (sortBy === "distance_asc") {
    list.sort((a, b) => (a.distanceKm || 5) - (b.distanceKm || 5));
  } else if (sortBy === "rating_desc") {
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
}

function registerProvider(providerData) {
  const providers = getProviders();
  const newId = providers.length > 0 ? Math.max(...providers.map(p => p.id)) + 1 : 1;

  const newProvider = {
    id: newId,
    name: providerData.name,
    city: providerData.city || "Ahmedabad",
    address: providerData.address || "Main City Road",
    phone: providerData.phone || "+91 98000 00000",
    email: providerData.email || "info@provider.com",
    rating: 5.0,
    reviewCount: 1,
    wasteTypes: providerData.wasteTypes || ["PCB", "Mobile Phone"],
    price: parseFloat(providerData.price) || 200,
    unit: providerData.unit || "kg",
    minimumQuantity: parseInt(providerData.minimumQuantity) || 10,
    pickupAvailable: providerData.pickupAvailable || false,
    transportationAvailable: providerData.transportationAvailable || false,
    transportationCharge: parseFloat(providerData.transportationCharge) || 0,
    freePickupThreshold: 50,
    latitude: 23.0225 + (Math.random() * 0.05 - 0.025),
    longitude: 72.5714 + (Math.random() * 0.05 - 0.025),
    distanceKm: parseFloat((Math.random() * 4 + 1).toFixed(1)),
    workingHours: "Mon - Sat: 9:00 AM - 6:00 PM",
    description: providerData.description || "Newly registered certified e-waste recovery business.",
    pricingMatrix: (providerData.wasteTypes || ["PCB"]).map(wt => ({
      wasteType: wt,
      price: parseFloat(providerData.price) || 200,
      unit: providerData.unit || "kg",
      minQty: parseInt(providerData.minimumQuantity) || 10
    }))
  };

  providers.push(newProvider);
  localStorage.setItem(STORAGE_KEY_PROVIDERS, JSON.stringify(providers));

  // Sync to Spring Boot REST API
  if (window.location.protocol.startsWith('http')) {
    fetch('/api/providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProvider)
    }).catch(e => console.log('REST API offline, stored locally.'));
  }

  return newProvider;
}

function addProviderListing(providerId, listing) {
  const providers = getProviders();
  const idx = providers.findIndex(p => p.id === parseInt(providerId));
  if (idx !== -1) {
    if (!providers[idx].pricingMatrix) providers[idx].pricingMatrix = [];
    
    const existingIndex = providers[idx].pricingMatrix.findIndex(item => item.wasteType === listing.wasteType);
    if (existingIndex !== -1) {
      providers[idx].pricingMatrix[existingIndex] = listing;
    } else {
      providers[idx].pricingMatrix.push(listing);
    }

    if (!providers[idx].wasteTypes.includes(listing.wasteType)) {
      providers[idx].wasteTypes.push(listing.wasteType);
    }

    localStorage.setItem(STORAGE_KEY_PROVIDERS, JSON.stringify(providers));

    // Sync to Spring Boot REST API
    if (window.location.protocol.startsWith('http')) {
      fetch(`/api/providers/${providerId}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listing)
      }).catch(e => console.log('REST API offline, stored locally.'));
    }

    return true;
  }
  return false;
}

function deleteProviderListing(providerId, wasteType) {
  const providers = getProviders();
  const idx = providers.findIndex(p => p.id === parseInt(providerId));
  if (idx !== -1 && providers[idx].pricingMatrix) {
    providers[idx].pricingMatrix = providers[idx].pricingMatrix.filter(item => item.wasteType !== wasteType);
    providers[idx].wasteTypes = providers[idx].wasteTypes.filter(wt => wt !== wasteType);
    localStorage.setItem(STORAGE_KEY_PROVIDERS, JSON.stringify(providers));

    if (window.location.protocol.startsWith('http')) {
      fetch(`/api/providers/${providerId}/listings/${encodeURIComponent(wasteType)}`, {
        method: 'DELETE'
      }).catch(e => console.log('REST API delete offline.'));
    }

    return true;
  }
  return false;
}
