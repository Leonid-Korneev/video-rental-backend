create table studios
(
    id      serial primary key,
    name    varchar(20) NOT NULL,
    country varchar(20) NOT NULL
);

create TABLE films
(
    id         serial primary key,
    title      varchar(50) NOT NULL,
    genre      varchar(20) NOT NULL,
    studio_id  integer     NOT NULL,
    director   varchar(50) NOT NULL,
    actors     text        NOT NULL,
    year       varchar(5)  NOT NULL,
    annotation text        NOT NULL,
    price      varchar(10) NOT NULL,
    foreign key (studio_id) references studios (id)
);

create TABLE authorities
(
    id        serial primary key,
    authority varchar(20) NOT NULL
);

create TABLE users
(
    id           serial primary key,
    username     varchar(20) NOT NULL,
    password     varchar(200) NOT NULL,
    authority_id integer     NOT NULL,
    foreign key (authority_id) references authorities (id)
);

create TABLE passports
(
    id          serial primary key,
    first_name  varchar(30) NOT NULL,
    last_name   varchar(30) NOT NULL,
    middle_name varchar(30) NOT NULL,
    series      integer     NOT NULL,
    number      integer     NOT NULL,
    city        varchar(20) NOT NULL,
    street      varchar(20) NOT NULL,
    house       varchar(20) NOT NULL,
    phone       varchar(15) NOT NULL,
    user_id     integer     NOT NULL,
    foreign key (user_id) references users (id)
);

create TABLE logbook
(
    id          serial primary key,
    film_id     integer     NOT NULL,
    user_id     integer     NOT NULL,
    issue_date  date        NOT NULL,
    return_date date DEFAULT null,
    foreign key (film_id) references films (id),
    foreign key (user_id) references users (id)

);

insert into authorities (authority)
values ('client');
insert into authorities (authority)
values ('admin');
insert into authorities (authority)
values ('director');
insert into authorities (authority)
values ('accountant');