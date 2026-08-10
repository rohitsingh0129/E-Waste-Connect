package com.ewaste.connect.repository;

import com.ewaste.connect.model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {
    List<Provider> findByCityContainingIgnoreCase(String city);
}
