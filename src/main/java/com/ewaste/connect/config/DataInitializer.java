package com.ewaste.connect.config;

import com.ewaste.connect.model.PricingItem;
import com.ewaste.connect.model.Provider;
import com.ewaste.connect.model.RecyclingRequest;
import com.ewaste.connect.repository.ProviderRepository;
import com.ewaste.connect.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Override
    public void run(String... args) throws Exception {
        if (providerRepository.count() == 0) {

            // Provider 1
            Provider p1 = new Provider();
            p1.setName("ABC E-Waste Recycling");
            p1.setCity("Ahmedabad");
            p1.setAddress("Plot 42, GIDC Industrial Estate, Naroda, Ahmedabad, Gujarat 382330");
            p1.setPhone("+91 98765 43210");
            p1.setEmail("contact@abcewaste.com");
            p1.setRating(4.7);
            p1.setReviewCount(38);
            p1.setWasteTypes(Arrays.asList("PCB", "Mobile Phone", "Laptop", "Battery", "Charger", "Copper Wire"));
            p1.setPrice(250.0);
            p1.setUnit("kg");
            p1.setMinimumQuantity(10);
            p1.setPickupAvailable(true);
            p1.setTransportationAvailable(true);
            p1.setTransportationCharge(0.0);
            p1.setFreePickupThreshold(50);
            p1.setLatitude(23.0725);
            p1.setLongitude(72.6114);
            p1.setDistanceKm(2.4);
            p1.setWorkingHours("Mon - Sat: 9:00 AM - 7:00 PM");
            p1.setDescription("Authorized e-waste recycler certified by GPCB. We process all types of electronic scrap with maximum material recovery and zero landfill impact.");
            p1.setPricingMatrix(Arrays.asList(
                    new PricingItem("PCB", 250.0, "kg", 10),
                    new PricingItem("Mobile Phone", 300.0, "kg", 5),
                    new PricingItem("Laptop", 220.0, "kg", 5),
                    new PricingItem("Battery", 110.0, "kg", 15),
                    new PricingItem("Copper Wire", 540.0, "kg", 10)
            ));
            p1 = providerRepository.save(p1);

            // Provider 2
            Provider p2 = new Provider();
            p2.setName("Green Earth Recycling Co.");
            p2.setCity("Ahmedabad");
            p2.setAddress("102, Green Complex, SG Highway, Prahlad Nagar, Ahmedabad 380015");
            p2.setPhone("+91 98980 12345");
            p2.setEmail("info@greenearthrecycling.in");
            p2.setRating(4.4);
            p2.setReviewCount(24);
            p2.setWasteTypes(Arrays.asList("PCB", "Computer", "Monitor", "Printer", "Charger"));
            p2.setPrice(230.0);
            p2.setUnit("kg");
            p2.setMinimumQuantity(20);
            p2.setPickupAvailable(true);
            p2.setTransportationAvailable(false);
            p2.setTransportationCharge(200.0);
            p2.setFreePickupThreshold(100);
            p2.setLatitude(23.0125);
            p2.setLongitude(72.5114);
            p2.setDistanceKm(4.1);
            p2.setWorkingHours("Mon - Fri: 10:00 AM - 6:00 PM");
            p2.setDescription("Specialized in bulk IT asset disposition and corporate e-waste collection. High precision sorting and secure data destruction available.");
            p2.setPricingMatrix(Arrays.asList(
                    new PricingItem("PCB", 230.0, "kg", 20),
                    new PricingItem("Computer", 150.0, "kg", 10),
                    new PricingItem("Monitor", 90.0, "unit", 5),
                    new PricingItem("Printer", 110.0, "unit", 5)
            ));
            providerRepository.save(p2);

            // Provider 3
            Provider p3 = new Provider();
            p3.setName("EcoCircuit Scrap & Tech Recovery");
            p3.setCity("Ahmedabad");
            p3.setAddress("Sector 8, Odhav Industrial Area, Ahmedabad 382415");
            p3.setPhone("+91 97123 98765");
            p3.setEmail("support@ecocircuit.org");
            p3.setRating(4.9);
            p3.setReviewCount(52);
            p3.setWasteTypes(Arrays.asList("PCB", "Mobile Phone", "Laptop", "Copper Wire", "Battery"));
            p3.setPrice(280.0);
            p3.setUnit("kg");
            p3.setMinimumQuantity(5);
            p3.setPickupAvailable(true);
            p3.setTransportationAvailable(true);
            p3.setTransportationCharge(0.0);
            p3.setFreePickupThreshold(20);
            p3.setLatitude(23.0325);
            p3.setLongitude(72.6314);
            p3.setDistanceKm(1.8);
            p3.setWorkingHours("Mon - Sat: 8:30 AM - 8:00 PM");
            p3.setDescription("Top-rated precious metal recovery unit buying high-grade circuit boards, telecom scrap, and laptop motherboards at premium market rates.");
            p3.setPricingMatrix(Arrays.asList(
                    new PricingItem("PCB", 280.0, "kg", 5),
                    new PricingItem("Copper Wire", 580.0, "kg", 10),
                    new PricingItem("Mobile Phone", 340.0, "kg", 5),
                    new PricingItem("Battery", 130.0, "kg", 10)
            ));
            providerRepository.save(p3);

            // Seed Initial Request
            RecyclingRequest r1 = new RecyclingRequest();
            r1.setId("REQ-1024");
            r1.setProviderId(p1.getId());
            r1.setProviderName(p1.getName());
            r1.setCustomerName("ABC Mobile Repair Shop");
            r1.setCustomerPhone("+91 98760 11223");
            r1.setCustomerEmail("abcmobile@gmail.com");
            r1.setWasteType("PCB");
            r1.setQuantity(20.0);
            r1.setUnit("kg");
            r1.setPickupRequired(true);
            r1.setAddress("Shop 14, Galaxy Market, Relief Road, Ahmedabad 380001");
            r1.setPickupDate("2026-08-12");
            r1.setPickupTime("10:30 AM");
            r1.setNotes("Includes 15 kg smartphone motherboards and 5 kg computer PCBs.");
            r1.setEstimatedValue(5000.0);
            r1.setStatus("Submitted");
            r1.setCreatedAt("2026-08-10 09:15:00");
            requestRepository.save(r1);

            System.out.println("✅ DataInitializer: Seeded 3 Providers and 1 Request into H2 Database.");
        }
    }
}
