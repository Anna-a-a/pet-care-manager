package com.pet_care_manager.service;

import com.pet_care_manager.model.PetOwner;
import com.pet_care_manager.repository.Repository;
import org.springframework.beans.factory.annotation.Autowired;

@org.springframework.stereotype.Service
public class Service {

    @Autowired
    private Repository repository;

    public PetOwner getPetOwner(Long id) {
        return repository.getPetOwner(id).orElseThrow(() -> new RuntimeException("PetOwner not found"));
    }
}
