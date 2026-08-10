package com.ewaste.connect.controller;

import com.ewaste.connect.model.RecyclingRequest;
import com.ewaste.connect.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class RequestController {

    @Autowired
    private RequestRepository requestRepository;

    @GetMapping
    public List<RecyclingRequest> getAllRequests(@RequestParam(required = false) Long providerId) {
        if (providerId != null) {
            return requestRepository.findByProviderId(providerId);
        }
        return requestRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecyclingRequest> getRequestById(@PathVariable String id) {
        return requestRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public RecyclingRequest createRequest(@RequestBody RecyclingRequest request) {
        if (request.getId() == null || request.getId().trim().isEmpty()) {
            int randomNum = 1000 + new Random().nextInt(9000);
            request.setId("REQ-" + randomNum);
        }
        if (request.getStatus() == null) {
            request.setStatus("Submitted");
        }
        if (request.getCreatedAt() == null) {
            request.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        }
        return requestRepository.save(request);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<RecyclingRequest> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        return requestRepository.findById(id).map(req -> {
            req.setStatus(newStatus);
            RecyclingRequest updated = requestRepository.save(req);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }
}
