package com.pet_care_manager.repository;

import com.pet_care_manager.model.PetOwner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

@org.springframework.stereotype.Repository
public class Repository {

    @Autowired
    private final JdbcTemplate jdbcTemplate;

    public Repository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<PetOwner> getPetOwner(Long id) {
        String sql = "SELECT * FROM pet_owner WHERE id = ?";
        return jdbcTemplate.query(sql, new PetOwnerRowMapper(), id).stream().findFirst();
    }

    public class PetOwnerRowMapper implements RowMapper<PetOwner> {
        @Override
        public PetOwner mapRow(ResultSet rs, int rowNum) throws SQLException {
            PetOwner petOwner = new PetOwner();
            petOwner.setId(rs.getLong("id"));
            petOwner.setLastName(rs.getString("last_name"));
            petOwner.setFirstName(rs.getString("first_name"));
            petOwner.setMiddleName(rs.getString("middle_name"));
            petOwner.setInn(rs.getLong("inn"));
            return petOwner;
        }
    }
}
