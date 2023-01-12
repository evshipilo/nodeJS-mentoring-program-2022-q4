create extension if not exists "uuid-ossp";

create table if not exists users (
id uuid primary key default uuid_generate_v4(),
login text,
password text,
age integer,
is_deleted boolean)

insert into users (login, password, age, is_deleted) values 
('login1','password1', 30, false),
('login2','password2', 32, false),
('login11','password11', 40, false),
('login5','password5', 35, false),
('login3','password3', 33, false)
