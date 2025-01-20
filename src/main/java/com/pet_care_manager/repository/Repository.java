package com.pet_care_manager.repository;

import com.pet_care_manager.model.Pet;
import com.pet_care_manager.model.PetOwner;
import com.pet_care_manager.model.Veterinarian;
import com.pet_care_manager.model.Visit;
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
import java.util.List;
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

    public void updatePetOwner(Long id, PetOwner petOwner) {
        String sql = "UPDATE pet_owner SET last_name = ?, first_name = ?, middle_name = ?, inn = ? WHERE id = ?";
        jdbcTemplate.update(sql, petOwner.getLastName(), petOwner.getFirstName(), petOwner.getMiddleName(), petOwner.getInn(), id);
    }

    public void deletePetOwnerByInn(Long inn) {
        // Обновление внешних ключей на null, если есть
        String updateSql = "UPDATE pet SET owner_id = NULL WHERE owner_id = (SELECT id FROM pet_owner WHERE inn = ?)";
        jdbcTemplate.update(updateSql, inn);

        // Удаление записи
        String deleteSql = "DELETE FROM pet_owner WHERE inn = ?";
        jdbcTemplate.update(deleteSql, inn);
    }


    public List<PetOwner> getAllPetOwners() {
        String sql = "SELECT * FROM pet_owner";
        return jdbcTemplate.query(sql, new PetOwnerRowMapper());
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



    public List<Pet> getAllPets() {
        String sql = "SELECT p.*, po.inn AS ownerInn FROM pet p JOIN pet_owner po ON p.owner_id = po.id";
        return jdbcTemplate.query(sql, new PetRowMapper());
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
            pet.setOwnerInn(rs.getLong("ownerInn")); // Добавляем ИНН владельца
            return pet;
        }
    }


    public Pet createPet(Pet pet) {
        // Поиск ownerId по ownerInn
        Long ownerId = findOwnerIdByInn(pet.getOwnerInn());
        if (ownerId == null) {
            throw new IllegalArgumentException("Owner with INN " + pet.getOwnerInn() + " not found");
        }
        pet.setOwnerId(ownerId);

        String sql = "INSERT INTO pet (nickname, breed, pet_species, owner_id, passport_number) VALUES (?, ?, ?, ?, ?)";

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, pet.getNickname());
            ps.setString(2, pet.getBreed());
            ps.setString(3, pet.getPetSpecies());
            ps.setLong(4, pet.getOwnerId());
            ps.setString(5, pet.getPassportNumber());
            return ps;
        });


        return pet;
    }

    private Long findOwnerIdByInn(Long inn) {
        String sql = "SELECT id FROM pet_owner WHERE inn = ?";
        List<Long> ownerIds = jdbcTemplate.query(sql, new RowMapper<Long>() {
            @Override
            public Long mapRow(ResultSet rs, int rowNum) throws SQLException {
                return rs.getLong("id");
            }
        }, inn);
        return ownerIds.isEmpty() ? null : ownerIds.get(0);
    }


    public void updatePet(Pet pet) {
        String sql = "UPDATE pet SET nickname = ?, breed = ?, pet_species = ? WHERE passport_number = ?";
        jdbcTemplate.update(sql,
                pet.getNickname(),
                pet.getBreed(),
                pet.getPetSpecies(),
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



    public Visit getVisitById(Long id) {
        String sql = "SELECT * FROM visit WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new VisitRowMapper(), id);
    }

    public Visit createVisit(Visit visit) {
        String petIdSql = "SELECT id FROM pet WHERE passport_number = ?";
        Long petId = jdbcTemplate.queryForObject(petIdSql, Long.class, visit.getPetPassport());

        if (petId == null) {
            throw new RuntimeException("Pet not found with passport number: " + visit.getPetPassport());
        }

        visit.setPetId(petId);

        String sql = "INSERT INTO visit (pet_id, veterinarian_id, visit_date, diagnosis, treatment, doctor_comments) VALUES (?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, visit.getPetId());
            ps.setLong(2, visit.getVeterinarianId());
            ps.setDate(3, new java.sql.Date(visit.getVisitDate().getTime()));
            ps.setString(4, visit.getDiagnosis());
            ps.setString(5, visit.getTreatment());
            ps.setString(6, visit.getDoctorComments());
            return ps;
        }, keyHolder);

        visit.setId(((Number) keyHolder.getKeys().get("id")).longValue());
        return visit;
    }


    public void updateVisit(Visit visit) {
        String sql = "UPDATE visit SET veterinarian_id = ?, visit_date = ?, diagnosis = ?, treatment = ?, doctor_comments = ? WHERE id = ?";
        jdbcTemplate.update(sql, visit.getVeterinarianId(), new java.sql.Date(visit.getVisitDate().getTime()), visit.getDiagnosis(), visit.getTreatment(), visit.getDoctorComments(), visit.getId());
    }


    public void deleteVisit(Long id) {
        // Обновление внешних ключей на null, если есть
        String updateSql = "UPDATE visit SET pet_id = NULL, veterinarian_id = NULL WHERE id = ?";
        jdbcTemplate.update(updateSql, id);

        // Удаление записи
        String deleteSql = "DELETE FROM visit WHERE id = ?";
        jdbcTemplate.update(deleteSql, id);
    }

    public List<Visit> getAllVisits() {
        String sql = "SELECT v.*, p.passport_number\n" +
                "FROM visit v\n" +
                "JOIN pet p ON v.pet_id = p.id\n" +
                "ORDER BY v.visit_date DESC;\n";
        return jdbcTemplate.query(sql, new VisitRowMapper());
    }

    private static class VisitRowMapper implements RowMapper<Visit> {
        @Override
        public Visit mapRow(ResultSet rs, int rowNum) throws SQLException {
            Visit visit = new Visit();
            visit.setId(rs.getLong("id"));
            visit.setPetId(rs.getLong("pet_id"));
            visit.setPetPassport(rs.getString("passport_number")); // Установка паспорта животного
            visit.setVeterinarianId(rs.getLong("veterinarian_id"));
            visit.setVisitDate(rs.getDate("visit_date"));
            visit.setDiagnosis(rs.getString("diagnosis"));
            visit.setTreatment(rs.getString("treatment"));
            visit.setDoctorComments(rs.getString("doctor_comments"));
            return visit;
        }
    }


    public List<Veterinarian> getAllVeterinarians() {
        String sql = "SELECT * FROM veterinarian";
        return jdbcTemplate.query(sql, new VeterinarianRowMapper());
    }

    public Veterinarian getVeterinarianById(Long id) {
        String sql = "SELECT * FROM veterinarian WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new VeterinarianRowMapper(), id);
    }

    public Veterinarian createVeterinarian(Veterinarian veterinarian) {
        String sql = "INSERT INTO veterinarian (last_name, first_name, middle_name, specialization) VALUES (?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, veterinarian.getLastName());
            ps.setString(2, veterinarian.getFirstName());
            ps.setString(3, veterinarian.getMiddleName());
            ps.setString(4, veterinarian.getSpecialization());
            return ps;
        }, keyHolder);

        veterinarian.setId(((Number) keyHolder.getKeys().get("id")).longValue());
        return veterinarian;
    }

    public void updateVeterinarian(Veterinarian veterinarian) {
        String sql = "UPDATE veterinarian SET last_name = ?, first_name = ?, middle_name = ?, specialization = ? WHERE id = ?";
        jdbcTemplate.update(sql, veterinarian.getLastName(), veterinarian.getFirstName(), veterinarian.getMiddleName(), veterinarian.getSpecialization(), veterinarian.getId());
    }
    public void deleteVeterinarian(Long id) {
        // Обновление внешних ключей на null, если есть
        String updateSql = "UPDATE visit SET veterinarian_id = NULL WHERE veterinarian_id = ?";
        jdbcTemplate.update(updateSql, id);

        // Удаление записи
        String deleteSql = "DELETE FROM veterinarian WHERE id = ?";
        jdbcTemplate.update(deleteSql, id);
    }

    private static class VeterinarianRowMapper implements RowMapper<Veterinarian> {
        @Override
        public Veterinarian mapRow(ResultSet rs, int rowNum) throws SQLException {
            Veterinarian veterinarian = new Veterinarian();
            veterinarian.setId(rs.getLong("id"));
            veterinarian.setLastName(rs.getString("last_name"));
            veterinarian.setFirstName(rs.getString("first_name"));
            veterinarian.setMiddleName(rs.getString("middle_name"));
            veterinarian.setSpecialization(rs.getString("specialization"));
            return veterinarian;
        }
    }
}
