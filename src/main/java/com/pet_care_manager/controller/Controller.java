package com.pet_care_manager.controller;

import com.pet_care_manager.model.Pet;
import com.pet_care_manager.model.PetOwner;
import com.pet_care_manager.service.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

}
