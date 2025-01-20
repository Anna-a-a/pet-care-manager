package com.pet_care_manager.controller;

import com.pet_care_manager.model.Pet;
import com.pet_care_manager.model.PetOwner;
import com.pet_care_manager.model.Veterinarian;
import com.pet_care_manager.model.Visit;
import com.pet_care_manager.service.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class Controller {

    @Autowired
    private final Service service;

    public Controller(Service service) {
        this.service = service;
    }

    @GetMapping("/petOwner/{id}")
    public ResponseEntity<PetOwner> getPetOwnerById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPetOwner(id));
    }

    @GetMapping("/petOwners")
    public ResponseEntity<List<PetOwner>> getAllPetOwners() {
        List<PetOwner> petOwners = service.getAllPetOwners();
        return ResponseEntity.ok(petOwners);
    }



    @PostMapping("/petOwner")
    public ResponseEntity<PetOwner> createPetOwner(@RequestBody PetOwner petOwner) {
        PetOwner createdPetOwner = service.createPetOwner(petOwner);
        return ResponseEntity.ok(createdPetOwner);
    }

    @PutMapping("/updatePetOwner")
    public ResponseEntity<String> updatePetOwnerByInn(@RequestBody PetOwner petOwner) {
        service.updatePetOwnerByInn(petOwner);
        return ResponseEntity.ok("PetOwner updated successfully");
    }

    @GetMapping("/pet/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPet(id));
    }

    @PostMapping("/pet")
    public ResponseEntity<Pet> createPet(@RequestBody Pet pet) {
        Pet createdPet = service.createPet(pet);
        return ResponseEntity.ok(createdPet);
    }

    @PutMapping("/updatePet")
    public ResponseEntity<String> updatePet(@RequestBody Pet pet) {
        service.updatePet(pet);
        return ResponseEntity.ok("Pet updated successfully");
    }

    @DeleteMapping("/pet/{id}")
    public ResponseEntity<String> deletePetById(@PathVariable Long id) {
        service.deletePetById(id);
        return ResponseEntity.ok("Pet deleted successfully");
    }

    @GetMapping("/visits")
    public List<Visit> getAllVisits() {
        return service.getAllVisits();
    }


    @GetMapping("/visit/{id}")
    public ResponseEntity<Visit> getVisitById(@PathVariable Long id) {
        Visit visit = service.getVisitById(id);
        return visit != null ? ResponseEntity.ok(visit) : ResponseEntity.notFound().build();
    }

    @PostMapping("visit")
    public ResponseEntity<Visit> createVisit(@RequestBody Visit visit) {
        Visit createdVisit = service.createVisit(visit);
        return ResponseEntity.status(201).body(createdVisit);
    }

    @PutMapping("updateVisit/{id}")
    public ResponseEntity<Void> updateVisit(@PathVariable Long id, @RequestBody Visit visit) {
        visit.setId(id);
        service.updateVisit(visit);
        return ResponseEntity.ok().build();
    }



    @DeleteMapping("deleteVisit/{id}")
    public ResponseEntity<Void> deleteVisit(@PathVariable Long id) {
        service.deleteVisit(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("veterinarians")
    public List<Veterinarian> getAllVeterinarians() {
        return service.getAllVeterinarians();
    }

    @GetMapping("veterinarians/{id}")
    public ResponseEntity<Veterinarian> getVeterinarianById(@PathVariable Long id) {
        Veterinarian veterinarian = service.getVeterinarianById(id);
        return veterinarian != null ? ResponseEntity.ok(veterinarian) : ResponseEntity.notFound().build();
    }

    @PostMapping("veterinarian")
    public ResponseEntity<Veterinarian> createVeterinarian(@RequestBody Veterinarian veterinarian) {
        Veterinarian createdVeterinarian = service.createVeterinarian(veterinarian);
        return ResponseEntity.status(201).body(createdVeterinarian);
    }

    @PutMapping("updateVeterinarian/{id}")
    public ResponseEntity<Void> updateVeterinarian(@PathVariable Long id, @RequestBody Veterinarian veterinarian) {
        veterinarian.setId(id);
        service.updateVeterinarian(veterinarian);
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("deleteVeterinarian/{id}")
    public ResponseEntity<Void> deleteVeterinarian(@PathVariable Long id) {
        service.deleteVeterinarian(id);
        return ResponseEntity.noContent().build();
    }
}
