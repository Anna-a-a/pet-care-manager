package com.pet_care_manager.controller;


import com.pet_care_manager.model.PetOwner;
import com.pet_care_manager.service.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
