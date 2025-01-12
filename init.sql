-- init.sql
-- Таблица владельцев собак
CREATE TABLE IF NOT EXISTS dog_owner (
    id SERIAL UNIQUE, -- Уникальный идентификатор владельца
    last_name VARCHAR(300) NOT NULL, -- Фамилия владельца
    first_name VARCHAR(100) NOT NULL, -- Имя владельца
    middle_name VARCHAR(100) NOT NULL, -- Отчество владельца
    inn BIGINT NOT NULL, -- ИНН владельца
    PRIMARY KEY (inn) -- Первичный ключ
);

-- Таблица пород собак
CREATE TABLE IF NOT EXISTS dog_breed (
    id SERIAL UNIQUE, -- Уникальный идентификатор породы
    breed VARCHAR(200) NOT NULL, -- Название породы
    PRIMARY KEY (breed) -- Первичный ключ
);

-- Таблица собак
CREATE TABLE IF NOT EXISTS dog (
    id SERIAL UNIQUE, -- Уникальный идентификатор собаки
    nickname VARCHAR(300) NOT NULL, -- Кличка собаки
    breed_id INTEGER REFERENCES dog_breed(id), -- Порода собаки (внешний ключ)
    owner_id INTEGER UNIQUE REFERENCES dog_owner(id), -- Идентификатор владельца (внешний ключ)
    passport_number VARCHAR(10) NOT NULL, -- Номер паспорта собаки
    PRIMARY KEY (passport_number) -- Первичный ключ
);

-- Таблица вакцин
CREATE TABLE IF NOT EXISTS vaccine (
    id SERIAL UNIQUE, -- Уникальный идентификатор вакцины
    name VARCHAR(100) NOT NULL, -- Название вакцины
    production_date DATE NOT NULL, -- Дата производства вакцины
    expiration_date DATE NOT NULL, -- Дата истечения срока вакцины
    PRIMARY KEY (name, production_date) -- Первичный ключ
);

-- Таблица вакцинации
CREATE TABLE IF NOT EXISTS vaccination (
    id SERIAL UNIQUE, -- Уникальный идентификатор вакцинации
    dog_id INTEGER REFERENCES dog(id), -- Идентификатор собаки (внешний ключ)
    vaccine_id INTEGER REFERENCES vaccine(id), -- Идентификатор вакцины (внешний ключ)
    serial_number BIGINT NOT NULL, -- Серийный номер вакцины
    application_date DATE, -- Дата применения вакцины
    PRIMARY KEY (serial_number) -- Первичный ключ
);
