package com.ewaste.connect.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pricing_items")
public class PricingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String wasteType;
    private Double price;
    private String unit;
    private Integer minQty;

    public PricingItem() {}

    public PricingItem(String wasteType, Double price, String unit, Integer minQty) {
        this.wasteType = wasteType;
        this.price = price;
        this.unit = unit;
        this.minQty = minQty;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getWasteType() { return wasteType; }
    public void setWasteType(String wasteType) { this.wasteType = wasteType; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Integer getMinQty() { return minQty; }
    public void setMinQty(Integer minQty) { this.minQty = minQty; }
}
