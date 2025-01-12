-- Таблица владельцев животных
CREATE TABLE IF NOT EXISTS pet_owner (
id SERIAL UNIQUE, -- Уникальный идентификатор владельца
last_name VARCHAR(300) NOT NULL, -- Фамилия владельца
first_name VARCHAR(100) NOT NULL, -- Имя владельца
middle_name VARCHAR(100) NOT NULL, -- Отчество владельца
inn BIGINT NOT NULL, -- ИНН владельца
PRIMARY KEY (inn) -- Первичный ключ
);

-- Таблица животных
CREATE TABLE IF NOT EXISTS pet (
id SERIAL UNIQUE, -- Уникальный идентификатор животного
nickname VARCHAR(300) NOT NULL, -- Кличка животного
breed VARCHAR(200) NOT NULL, -- Порода животного
pet_species VARCHAR(100) NOT NULL, -- Вид животного
owner_id INTEGER REFERENCES pet_owner(id), -- Идентификатор владельца (внешний ключ)
passport_number VARCHAR(10) NOT NULL, -- Номер паспорта животного
PRIMARY KEY (passport_number) -- Первичный ключ
);

-- Таблица ветеринаров
CREATE TABLE IF NOT EXISTS veterinarian (
id SERIAL UNIQUE, -- Уникальный идентификатор ветеринара
last_name VARCHAR(300) NOT NULL, -- Фамилия ветеринара
first_name VARCHAR(100) NOT NULL, -- Имя ветеринара
middle_name VARCHAR(100) NOT NULL, -- Отчество ветеринара
specialization VARCHAR(200) NOT NULL, -- Специализация ветеринара
PRIMARY KEY (id) -- Первичный ключ
);

-- Таблица визитов
CREATE TABLE IF NOT EXISTS visit (
id SERIAL UNIQUE, -- Уникальный идентификатор визита
pet_id INTEGER REFERENCES pet(id), -- Идентификатор животного (внешний ключ)
veterinarian_id INTEGER REFERENCES veterinarian(id), -- Идентификатор ветеринара (внешний ключ)
visit_date DATE NOT NULL, -- Дата визита
diagnosis TEXT, -- Диагноз
treatment TEXT, -- Лечение
doctor_comments TEXT, -- Комментарии доктора
PRIMARY KEY (id) -- Первичный ключ
);

-- Вставка данных в таблицу pet_owner
INSERT INTO pet_owner (last_name, first_name, middle_name, inn) VALUES
('Иванов', 'Иван', 'Иванович', 123456789012),
('Петров', 'Петр', 'Петрович', 234567890123),
('Сидоров', 'Сидор', 'Сидорович', 345678901234);

-- Вставка данных в таблицу pet
INSERT INTO pet (nickname, breed, pet_species, owner_id, passport_number) VALUES
('Барсик', 'Сиамская', 'Кошка', 1, 'A123456789'),
('Барбарис', 'Сиамская', 'Кошка', 1, 'A12345679'),
('Рекс', 'Немецкая овчарка', 'Собака', 2, 'B234567890'),
('Кеша', 'Попугай', 'Птица', 3, 'C345678901');

-- Вставка данных в таблицу veterinarian
INSERT INTO veterinarian (last_name, first_name, middle_name, specialization) VALUES
('Смирнов', 'Алексей', 'Алексеевич', 'Терапевт'),
('Кузнецов', 'Дмитрий', 'Дмитриевич', 'Хирург'),
('Попов', 'Андрей', 'Андреевич', 'Дерматолог');

-- Вставка данных в таблицу visit
INSERT INTO visit (pet_id, veterinarian_id, visit_date, diagnosis, treatment, doctor_comments) VALUES
(1, 1, '2023-10-01', 'Здоров', 'Не требуется', 'Животное в отличном состоянии'),
(2, 2, '2023-10-02', 'Легкая простуда', 'Антибиотики', 'Следите за состоянием животного'),
(3, 3, '2023-10-03', 'Кожное заболевание', 'Мазь', 'Применять мазь два раза в день');
