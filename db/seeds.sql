INSERT INTO department (name)
VALUES ("Sales"),
       ("Risk Management"),
       ("Computers and Math"),
       ("Finance"),
       ("Crib"),
       ("Legal"),
       ("The Top");

INSERT INTO role (title, salary, department_id)
VALUES  ("Sales Lead", 100000, 7),
        ("Salesperson", 50000, 1),
        ("Lead Engineer", 20000, 2),
        ("Software Engineer", 10101, 3),
        ("Account Manager", 180000, 4),
        ("Chief Executive Officer", 9000000, 6),
        ("Lawyer", 50000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Eric", "Stateman", 2, NULL),
        ("Jennifer", "Coolidge", 7, NULL),
        ("Nancy", "Dreifus", 1, 1),
        ("Peter", "Porkins", 4, 2),
        ("Bart", "Harley Jarvis", 5, NULL),
        ("Julie", "Woodin", 2, 2),
        ("Alice", "Nelson", 3, 5),
        ("Alice", "Anderson", 4, 1),
        ("Edward", "From Twilight", 5, 2),
        ("Mister", "Rich", 6, NULL);