CREATE TABLE IF NOT EXISTS location (
    id INT PRIMARY KEY,
    name VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS company (
    id INT PRIMARY KEY,
    name VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS profile (
    id INT PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    profile_path VARCHAR(256) NOT NULL,
    image_path VARCHAR(512) NOT NULL,
    location_id INT REFERENCES location (id),
    company_id INT REFERENCES company (id),
    bio VARCHAR(1024),
    interests VARCHAR(512),
    before_rc VARCHAR(512),
    during_rc VARCHAR(512),
    email VARCHAR(128),
    github VARCHAR(128),
    twitter VARCHAR(128)
);

CREATE TABLE IF NOT EXISTS batch (
    id INT PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    short_name VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS stint (
    id INT PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    batch_id INT REFERENCES batch (id),
    profile_id INT REFERENCES profile (id)
);

CREATE TABLE IF NOT EXISTS note (
    id SERIAL PRIMARY KEY,
    author_id INT REFERENCES profile (id),
    title VARCHAR(128) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    content JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS tag (
    id SERIAL PRIMARY KEY,
    author_id INT REFERENCES profile (id),
    name VARCHAR(128) NOT NULL,
    profile_id INT REFERENCES profile (id),
    note_id INT REFERENCES note (id)
);

