package com.ewaste.connect.repository;

import com.ewaste.connect.model.RecyclingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<RecyclingRequest, String> {
    List<RecyclingRequest> findByProviderId(Long providerId);
}
