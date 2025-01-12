package com.pet_care_manager.model;

public class Pet {

    private Long id;
    private String nickname;
    private String breed;
    private String petSpecies;
    private Long ownerId;
    private String passportNumber;

    public Pet() {
    }

    public Pet(Long id, String nickname, String breed, String petSpecies, Long ownerId, String passportNumber) {
        this.id = id;
        this.nickname = nickname;
        this.breed = breed;
        this.petSpecies = petSpecies;
        this.ownerId = ownerId;
        this.passportNumber = passportNumber;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public String getPetSpecies() {
        return petSpecies;
    }

    public void setPetSpecies(String petSpecies) {
        this.petSpecies = petSpecies;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getPassportNumber() {
        return passportNumber;
    }

    public void setPassportNumber(String passportNumber) {
        this.passportNumber = passportNumber;
    }
}

