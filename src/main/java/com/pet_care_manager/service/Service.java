package com.pet_care_manager.service;

import com.pet_care_manager.model.Pet;
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

    public PetOwner createPetOwner(PetOwner petOwner) {
        return repository.createPetOwner(petOwner);
    }

    public void updatePetOwnerByInn(PetOwner petOwner) {
        repository.updatePetOwnerByInn(petOwner);
    }

    public Pet getPet(Long id) {
        return repository.getPet(id).orElse(null);
    }

    public Pet createPet(Pet pet) {
        return repository.createPet(pet);
    }

    public void updatePet(Pet pet) {
        repository.updatePet(pet);
    }

    public void deletePetById(Long id) {
        repository.deletePetById(id);
    }
}
