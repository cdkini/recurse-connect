CREATE TABLE IF NOT EXISTS locations (
    id INT PRIMARY KEY,
    name VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS companies (
    id INT PRIMARY KEY,
    name VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
    id INT PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    profile_path VARCHAR(256) NOT NULL,
    image_path VARCHAR(512) NOT NULL,
    location_id INT REFERENCES locations (id),
    company_id INT REFERENCES companies (id),
    bio VARCHAR(1024),
    interests VARCHAR(512),
    before_rc VARCHAR(512),
    during_rc VARCHAR(512),
    email VARCHAR(128),
    github VARCHAR(128),
    twitter VARCHAR(128)
);

CREATE TABLE IF NOT EXISTS batches (
    id INT PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    short_name VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS stints (
    id INT PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    batch_id INT REFERENCES batches (id),
    profile_id INT REFERENCES profiles (id)
);

CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    author_id INT REFERENCES profiles (id),
    title VARCHAR(128) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    content JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    author_id INT REFERENCES profiles (id),
    name VARCHAR(128) NOT NULL,
    profile_id INT REFERENCES profiles (id),
    note_id INT REFERENCES notes (id)
);

