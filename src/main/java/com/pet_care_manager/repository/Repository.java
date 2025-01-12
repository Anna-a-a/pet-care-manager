package com.pet_care_manager.repository;

import com.pet_care_manager.model.Pet;
import com.pet_care_manager.model.PetOwner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
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
    public Optional<Pet> getPet(Long id) {
        String sql = "SELECT * FROM pet WHERE id = ?";
        return jdbcTemplate.query(sql, new PetRowMapper(), id).stream().findFirst();
    }
    public PetOwner createPetOwner(PetOwner petOwner) {
        String sql = "INSERT INTO pet_owner (last_name, first_name, middle_name, inn) VALUES (?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, petOwner.getLastName());
            ps.setString(2, petOwner.getFirstName());
            ps.setString(3, petOwner.getMiddleName());
            ps.setLong(4, petOwner.getInn());
            return ps;
        }, keyHolder);

        petOwner.setId(
                (
                        (Integer)keyHolder.getKeys().get("id")
                ).longValue()
        );
        return petOwner;
    }

    public void updatePetOwnerByInn(PetOwner petOwner) {
        String sql = "UPDATE pet_owner SET first_name = ?, last_name = ?, middle_name = ? WHERE inn = ?";

        jdbcTemplate.update(sql,
                petOwner.getFirstName(),
                petOwner.getLastName(),
                petOwner.getMiddleName(),
                petOwner.getInn());
    }

    public Pet createPet(Pet pet) {
        String sql = "INSERT INTO pet (nickname, breed, pet_species, owner_id, passport_number) VALUES (?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, pet.getNickname());
            ps.setString(2, pet.getBreed());
            ps.setString(3, pet.getPetSpecies());
            ps.setLong(4, pet.getOwnerId());
            ps.setString(5, pet.getPassportNumber());
            return ps;
        }, keyHolder);

        pet.setId(
                (
                        (Integer)keyHolder.getKeys().get("id")
                ).longValue()
        );
        return pet;
    }

    public void updatePet(Pet pet) {
        String sql = "UPDATE pet SET nickname = ?, breed = ?, pet_species = ?, owner_id = ? WHERE passport_number = ?";

        jdbcTemplate.update(sql,
                pet.getNickname(),
                pet.getBreed(),
                pet.getPetSpecies(),
                pet.getOwnerId(),
                pet.getPassportNumber());
    }

    public void deletePetById(Long id) {
        // Обновление записей в таблице visit, чтобы удалить ссылку на удаляемую запись в таблице pets
        String updateVisitsSql = "UPDATE visit SET pet_id = NULL WHERE pet_id = ?";
        jdbcTemplate.update(updateVisitsSql, id);

        // Удаление записи в таблице pets
        String deletePetSql = "DELETE FROM pet WHERE id = ?";
        jdbcTemplate.update(deletePetSql, id);
    }

    private static class PetRowMapper implements RowMapper<Pet> {
        @Override
        public Pet mapRow(ResultSet rs, int rowNum) throws SQLException {
            Pet pet = new Pet();
            pet.setId(rs.getLong("id"));
            pet.setNickname(rs.getString("nickname"));
            pet.setBreed(rs.getString("breed"));
            pet.setPetSpecies(rs.getString("pet_species"));
            pet.setOwnerId(rs.getLong("owner_id"));
            pet.setPassportNumber(rs.getString("passport_number"));
            return pet;
        }
    }
}
