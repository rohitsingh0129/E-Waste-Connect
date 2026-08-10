package com.ewaste.connect.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "providers")
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String city;
    private String address;
    private String phone;
    private String email;
    private Double rating;
    private Integer reviewCount;

    @ElementCollection
    private List<String> wasteTypes = new ArrayList<>();

    private Double price;
    private String unit;
    private Integer minimumQuantity;
    private Boolean pickupAvailable;
    private Boolean transportationAvailable;
    private Double transportationCharge;
    private Integer freePickupThreshold;

    private Double latitude;
    private Double longitude;
    private Double distanceKm;
    private String workingHours;

    @Column(length = 1000)
    private String description;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "provider_id")
    private List<PricingItem> pricingMatrix = new ArrayList<>();

    public Provider() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public List<String> getWasteTypes() { return wasteTypes; }
    public void setWasteTypes(List<String> wasteTypes) { this.wasteTypes = wasteTypes; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Integer getMinimumQuantity() { return minimumQuantity; }
    public void setMinimumQuantity(Integer minimumQuantity) { this.minimumQuantity = minimumQuantity; }

    public Boolean getPickupAvailable() { return pickupAvailable; }
    public void setPickupAvailable(Boolean pickupAvailable) { this.pickupAvailable = pickupAvailable; }

    public Boolean getTransportationAvailable() { return transportationAvailable; }
    public void setTransportationAvailable(Boolean transportationAvailable) { this.transportationAvailable = transportationAvailable; }

    public Double getTransportationCharge() { return transportationCharge; }
    public void setTransportationCharge(Double transportationCharge) { this.transportationCharge = transportationCharge; }

    public Integer getFreePickupThreshold() { return freePickupThreshold; }
    public void setFreePickupThreshold(Integer freePickupThreshold) { this.freePickupThreshold = freePickupThreshold; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public String getWorkingHours() { return workingHours; }
    public void setWorkingHours(String workingHours) { this.workingHours = workingHours; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<PricingItem> getPricingMatrix() { return pricingMatrix; }
    public void setPricingMatrix(List<PricingItem> pricingMatrix) { this.pricingMatrix = pricingMatrix; }
}
