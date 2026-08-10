package com.ewaste.connect.model;

import jakarta.persistence.*;

@Entity
@Table(name = "recycling_requests")
public class RecyclingRequest {

    @Id
    private String id; // e.g. REQ-1024

    private Long providerId;
    private String providerName;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String wasteType;
    private Double quantity;
    private String unit;
    private Boolean pickupRequired;

    @Column(length = 500)
    private String address;

    private String pickupDate;
    private String pickupTime;

    @Column(length = 1000)
    private String notes;

    private Double estimatedValue;
    private String status; // Submitted -> Accepted -> Pickup Scheduled -> Collected -> Completed
    private String createdAt;

    public RecyclingRequest() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getWasteType() { return wasteType; }
    public void setWasteType(String wasteType) { this.wasteType = wasteType; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Boolean getPickupRequired() { return pickupRequired; }
    public void setPickupRequired(Boolean pickupRequired) { this.pickupRequired = pickupRequired; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPickupDate() { return pickupDate; }
    public void setPickupDate(String pickupDate) { this.pickupDate = pickupDate; }

    public String getPickupTime() { return pickupTime; }
    public void setPickupTime(String pickupTime) { this.pickupTime = pickupTime; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Double getEstimatedValue() { return estimatedValue; }
    public void setEstimatedValue(Double estimatedValue) { this.estimatedValue = estimatedValue; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
