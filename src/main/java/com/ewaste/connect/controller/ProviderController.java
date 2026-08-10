package com.ewaste.connect.controller;

import com.ewaste.connect.model.PricingItem;
import com.ewaste.connect.model.Provider;
import com.ewaste.connect.repository.ProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "*")
public class ProviderController {

    @Autowired
    private ProviderRepository providerRepository;

    @GetMapping
    public List<Provider> getAllProviders(
            @RequestParam(required = false) String wasteType,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean pickupAvailable,
            @RequestParam(required = false) Double maxPrice) {

        List<Provider> providers = providerRepository.findAll();

        if (wasteType != null && !wasteType.equalsIgnoreCase("All")) {
            providers = providers.stream()
                    .filter(p -> p.getWasteTypes().contains(wasteType))
                    .collect(Collectors.toList());
        }

        if (location != null && !location.trim().isEmpty()) {
            String locLower = location.toLowerCase();
            providers = providers.stream()
                    .filter(p -> p.getCity().toLowerCase().contains(locLower) || p.getAddress().toLowerCase().contains(locLower))
                    .collect(Collectors.toList());
        }

        if (pickupAvailable != null && pickupAvailable) {
            providers = providers.stream()
                    .filter(Provider::getPickupAvailable)
                    .collect(Collectors.toList());
        }

        if (maxPrice != null) {
            providers = providers.stream()
                    .filter(p -> p.getPrice() <= maxPrice)
                    .collect(Collectors.toList());
        }

        return providers;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Provider> getProviderById(@PathVariable Long id) {
        return providerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Provider createProvider(@RequestBody Provider provider) {
        if (provider.getRating() == null) provider.setRating(5.0);
        if (provider.getReviewCount() == null) provider.setReviewCount(1);
        if (provider.getDistanceKm() == null) provider.setDistanceKm(2.5);
        if (provider.getLatitude() == null) provider.setLatitude(23.0225);
        if (provider.getLongitude() == null) provider.setLongitude(72.5714);

        return providerRepository.save(provider);
    }

    @PostMapping("/{id}/listings")
    public ResponseEntity<Provider> addListing(@PathVariable Long id, @RequestBody PricingItem item) {
        return providerRepository.findById(id).map(provider -> {
            provider.getPricingMatrix().add(item);
            if (!provider.getWasteTypes().contains(item.getWasteType())) {
                provider.getWasteTypes().add(item.getWasteType());
            }
            Provider updated = providerRepository.save(provider);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/listings/{wasteType}")
    public ResponseEntity<Provider> deleteListing(@PathVariable Long id, @PathVariable String wasteType) {
        return providerRepository.findById(id).map(provider -> {
            provider.getPricingMatrix().removeIf(item -> item.getWasteType().equalsIgnoreCase(wasteType));
            provider.getWasteTypes().removeIf(wt -> wt.equalsIgnoreCase(wasteType));
            Provider updated = providerRepository.save(provider);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }
}
