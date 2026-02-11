
    create table admin (
        id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table bachelor_student (
        id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table defensemeeting_professor_association (
        score float(53),
        defense_meeting_id bigint not null,
        id bigint not null auto_increment,
        professor_id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table department (
        id bigint not null auto_increment,
        name varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table field (
        active bit not null,
        department_id bigint,
        id bigint not null auto_increment,
        name varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    create table master_student (
        id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table phd_student (
        id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table professor (
        is_manager bit,
        id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table student (
        graduation_date datetime(6),
        id bigint not null,
        instructor_id bigint,
        student_number bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table thesis_defense_meeting (
        score float(53),
        id bigint not null auto_increment,
        selected_time_slot_id bigint,
        submission_date datetime(6),
        thesis_form_id bigint not null,
        update_date datetime(6),
        location varchar(255),
        state enum ('CANCELED','COMPLETED','JURIES_SELECTED','JURIES_SPECIFIED_TIME','SCHEDULED','STUDENT_SPECIFIED_TIME') not null,
        primary key (id)
    ) engine=InnoDB;

    create table thesis_form (
        admin_reviewed_at datetime(6),
        field_id bigint,
        id bigint not null auto_increment,
        instructor_id bigint not null,
        instructor_reviewed_at datetime(6),
        manager_reviewed_at datetime(6),
        revision_requested_at datetime(6),
        student_id bigint not null,
        submission_date datetime(6),
        update_date datetime(6),
        revision_message varchar(1000),
        abstract_text varchar(255),
        rejection_reason varchar(255),
        title varchar(255),
        state enum ('ADMIN_APPROVED','ADMIN_REJECTED','ADMIN_REVISION_REQUESTED_FOR_INSTRUCTOR','ADMIN_REVISION_REQUESTED_FOR_STUDENT','INSTRUCTOR_APPROVED','INSTRUCTOR_REJECTED','INSTRUCTOR_REVISION_REQUESTED','MANAGER_APPROVED','MANAGER_REJECTED','MANAGER_REVISION_REQUESTED_FOR_ADMIN','MANAGER_REVISION_REQUESTED_FOR_INSTRUCTOR','MANAGER_REVISION_REQUESTED_FOR_STUDENT','SUBMITTED') not null,
        student_type enum ('BACHELOR','MASTER','PHD'),
        primary key (id)
    ) engine=InnoDB;

    create table time_slot (
        date date not null,
        defense_meeting_id bigint,
        id bigint not null auto_increment,
        time_period enum ('PERIOD_10_30_12_00','PERIOD_13_30_15_00','PERIOD_15_30_17_00','PERIOD_7_30_9_00','PERIOD_9_00_10_30') not null,
        primary key (id)
    ) engine=InnoDB;

    create table timeslot_professor_association (
        id bigint not null auto_increment,
        professor_id bigint not null,
        timeslot_id bigint not null,
        primary key (id)
    ) engine=InnoDB;

    create table users (
        enabled bit,
        creation_date datetime(6) not null,
        department_id bigint,
        field_id bigint,
        id bigint not null auto_increment,
        email varchar(255) not null,
        first_name varchar(255) not null,
        last_name varchar(255) not null,
        password varchar(255) not null,
        phone_number varchar(255) not null,
        primary key (id)
    ) engine=InnoDB;

    alter table defensemeeting_professor_association 
       add constraint uk_defense_meeting_id_professor_id unique (defense_meeting_id, professor_id);

    alter table department 
       add constraint UK1t68827l97cwyxo9r1u6t4p7d unique (name);

    alter table student 
       add constraint UK17gskajnuiawdedks0b3lp8rx unique (student_number);

    alter table thesis_defense_meeting 
       add constraint UKt4fp5d6xwuqx1ltpalpt19b3a unique (selected_time_slot_id);

    alter table thesis_defense_meeting 
       add constraint UKmp87e9oyprhq3ltmf1v6ipiom unique (thesis_form_id);

    create index idx_timeslot_date_period_meeting 
       on time_slot (defense_meeting_id, date, time_period);

    alter table time_slot 
       add constraint uk_timeslot_date_period_meeting unique (date, time_period, defense_meeting_id);

    alter table users 
       add constraint UK6dotkott2kjsp8vw4d0m25fb7 unique (email);

    alter table users 
       add constraint UK9q63snka3mdh91as4io72espi unique (phone_number);

    alter table admin 
       add constraint FKqer4e53tfnl17s22ior7fcsv8 
       foreign key (id) 
       references users (id);

    alter table bachelor_student 
       add constraint FK1i6ctx3du7dncayp7isl4vdbi 
       foreign key (id) 
       references student (id);

    alter table defensemeeting_professor_association 
       add constraint FKeelrca6xpvedveu08crl0ilu4 
       foreign key (defense_meeting_id) 
       references thesis_defense_meeting (id);

    alter table defensemeeting_professor_association 
       add constraint FK7xqodopyhrndt0xk41d3pxosl 
       foreign key (professor_id) 
       references professor (id);

    alter table field 
       add constraint FK7sek1bdc701h6powdjqnnvbvd 
       foreign key (department_id) 
       references department (id);

    alter table master_student 
       add constraint FK2u7h2o44f3nvxkh77admi3h22 
       foreign key (id) 
       references student (id);

    alter table phd_student 
       add constraint FK63yiky0ud8vaco0e20ohn7idb 
       foreign key (id) 
       references student (id);

    alter table professor 
       add constraint FK3d3bqgq0xxp7nbeclk2a6vthc 
       foreign key (id) 
       references users (id);

    alter table student 
       add constraint FK3nuk9gvmkgj7t8ciwy6s0k2ej 
       foreign key (instructor_id) 
       references professor (id);

    alter table student 
       add constraint FK3w7xmt19i6a0cr7kp8c80ek40 
       foreign key (id) 
       references users (id);

    alter table thesis_defense_meeting 
       add constraint FKim4ug0mjvvpsl5wb5va4btmh5 
       foreign key (selected_time_slot_id) 
       references time_slot (id);

    alter table thesis_defense_meeting 
       add constraint FK28qy5y9y0auk0cr28lu59mdxu 
       foreign key (thesis_form_id) 
       references thesis_form (id);

    alter table thesis_form 
       add constraint FK3yh8fnw21wa1oa8bc51w92u6p 
       foreign key (field_id) 
       references field (id);

    alter table thesis_form 
       add constraint FKnsc9jk815emabltlu7orshjon 
       foreign key (instructor_id) 
       references professor (id);

    alter table thesis_form 
       add constraint FKkhi6b10pjdntom85jx1rrj5dh 
       foreign key (student_id) 
       references student (id);

    alter table time_slot 
       add constraint FKb8l4g6svsnj8dlb0kmsinu82y 
       foreign key (defense_meeting_id) 
       references thesis_defense_meeting (id);

    alter table timeslot_professor_association 
       add constraint FKg8cr9fw2a8u49uu8c62rv2dx2 
       foreign key (professor_id) 
       references professor (id);

    alter table timeslot_professor_association 
       add constraint FKs55v7etyegl5w8q9egqr97ju9 
       foreign key (timeslot_id) 
       references time_slot (id);

    alter table users 
       add constraint FKfi832e3qv89fq376fuh8920y4 
       foreign key (department_id) 
       references department (id);

    alter table users 
       add constraint FK2b4ciyset4wra151rt98fte2b 
       foreign key (field_id) 
       references field (id);
