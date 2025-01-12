package com.pet_care_manager.service;

import com.pet_care_manager.model.User;
import com.pet_care_manager.repository.Repository;
import org.springframework.beans.factory.annotation.Autowired;

@org.springframework.stereotype.Service
public class Service {

    @Autowired
    private Repository repository;

    public User getUser(Long userId) {
        var user = repository.getUser(userId).get();
        return user;
    }
}
