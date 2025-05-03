-- UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM for user role
CREATE TYPE user_role AS ENUM ('student', 'admin', 'superadmin');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name varchar(255) NOT NULL,
    email varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    phone varchar(255) NOT NULL,
    student_id_number varchar(255) NOT NULL,
    passport_pin varchar(255) NOT NULL,
    passport_number varchar(255) NOT NULL,
    gender varchar(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    img_url varchar(50),
    created_at timestamp DEFAULT now()
);

alter table users
add column groupname varchar(50);

-- Build table
CREATE TABLE IF NOT EXISTS build (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(255) NOT NULL,
    description text NOT NULL,
    created_at timestamp DEFAULT now(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE
);

-- ENUM for build status
CREATE TYPE build_status AS ENUM
 ('in', 'out', 'panding', 'rejected');

-- History table
CREATE TABLE IF NOT EXISTS history (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    build_id uuid REFERENCES build(id) ON DELETE CASCADE, 
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    status build_status NOT NULL DEFAULT 'in',
    enter_time timestamp DEFAULT now(),
    exit_time timestamp,
    message text NOT NULL,
    created_at timestamp DEFAULT now()
);


ALTER TABLE users
ALTER COLUMN img_url TYPE VARCHAR(250);

INSERT INTO users (
    full_name,
    email,
    password,
    phone,
    student_id_number,
    passport_pin,
    passport_number,
    gender,
    role,
    img_url
) VALUES (
    'ERGASHEV JAMSHID JO‘RAQUL O‘G‘LI',
    'jamshid14092002@gmail.com',
    '$2b$10$iQ1gxyVv/FZyuqimBq4QX.wI/t.IZrMrGlKSAP9mIoO1wODmBa9cS',
    '+998941791409',
    '388211100546',
    'AC0183148',
    '51409026080052',
    'Erkak',
    'superadmin',
    'https://hemis.samtuit.uz/static/crop/3/2/320_320_90_3272605016.jpg'
);
-- MyPassword : mysecretpassword


-- loginHistory
 CREATE table loginHistory(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    login_time timestamp DEFAULT now(),
    ip_address varchar(50) NOT NULL,
    user_agent text NOT NULL
 );