package com.pet_care_manager.service;

import com.pet_care_manager.model.Pet;
import com.pet_care_manager.model.PetOwner;
import com.pet_care_manager.model.Veterinarian;
import com.pet_care_manager.model.Visit;
import com.pet_care_manager.repository.Repository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@org.springframework.stereotype.Service
public class Service {

    @Autowired
    private Repository repository;

    public PetOwner getPetOwner(Long id) {
        return repository.getPetOwner(id).orElseThrow(() -> new RuntimeException("PetOwner not found"));
    }

    public List<PetOwner> getAllPetOwners() {
        return repository.getAllPetOwners();
    }

    public PetOwner createPetOwner(PetOwner petOwner) {
        return repository.createPetOwner(petOwner);
    }

    public void updatePetOwner(Long id, PetOwner petOwner) {
        repository.updatePetOwner(id, petOwner);
    }

    public void deletePetOwnerByInn(Long inn) {
        repository.deletePetOwnerByInn(inn);
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

    public List<Visit> getAllVisits() {
        return repository.getAllVisits();
    }


    public Visit getVisitById(Long id) {
        return repository.getVisitById(id);
    }

    public Visit createVisit(Visit visit) {
        return repository.createVisit(visit);
    }

    public void updateVisit(Visit visit) {
        repository.updateVisit(visit);
    }


    public void deleteVisit(Long id) {
        repository.deleteVisit(id);
    }

    public List<Veterinarian> getAllVeterinarians() {
        return repository.getAllVeterinarians();
    }

    public Veterinarian getVeterinarianById(Long id) {
        return repository.getVeterinarianById(id);
    }

    public Veterinarian createVeterinarian(Veterinarian veterinarian) {
        return repository.createVeterinarian(veterinarian);
    }

    public void updateVeterinarian(Veterinarian veterinarian) {
        repository.updateVeterinarian(veterinarian);
    }

    public void deleteVeterinarian(Long id) {
        repository.deleteVeterinarian(id);
    }
}
