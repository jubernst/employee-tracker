const inquirer = require("inquirer");
const mysql = require("mysql2");
require("dotenv").config();
const ctable = require("console.table");

const options = [
  {
    type: "list",
    name: "next",
    message: "What would you like to do now?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
      "Quit",
    ],
  },
];

const db = mysql.createConnection(
  // Use dotenv to protect privacy
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database`)
);

// Query functions should be in a separate file

// Return all rows of a given table
// Should only get the name or title
const getDepartmentNames = () => {
  db.query("SELECT name FROM department", function (err, result) {
    return result;
  });
};

const getRoleTitles = () => {
  db.query("SELECT title FROM role", function (err, result) {
    return result;
  });
};

const getEmployeeNames = () => {
  db.query(
    "SELECT first_name, last_name FROM employee",
    function (err, results) {
      for (var i=0; i<results.length; i++){
        results[i].concat();
      }
    }
  );
};

// Print tables
function viewDepartments() {
  db.query(`SELECT * FROM department`, function (err, results) {
    console.table(results);
  });
  prompt();
}

function viewRoles() {
  // Join role with the department names
  db.query(
    `SELECT role.id, role.title, role.salary AS id, title, salary, department.name AS department FROM role JOIN department ON role.department_id = department.id`,
    function (err, results) {
      console.table(results);
    }
  );
  prompt();
}

function viewEmployees() {
  db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id AS id, first_name, last_name, manager_id, role.title AS title FROM employee JOIN role ON employee.role_id = role.id`,
    function (err, results) {
      console.table(results);
    }
  );
  prompt();
}

function addDepartment() {
  // Get input
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the department:",
      },
    ])
    .then((answers) => {
      db.query(
        `INSERT INTO department (name) VALUES (${answers.name})`,
        function (err, results) {
          //if (err) throw err;
          console.log(`Added ${answers.name} to the database`);
        }
      );
    });
  prompt();
}

function addRole() {
  // Get input
  const questions = [
    {
      type: "input",
      name: "title",
      message: "Enter the title for the role:",
    },
    {
      type: "input",
      name: "salary",
      message: "Enter the salary for the role:",
    },
    {
      type: "list",
      name: "department",
      message: "Enter the department for the role:",
      choices: [getDepartmentNames()],
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    const department_id = db.query(
      `SELECT id FROM department WHERE name=?`,
      answers.department
    );
    db.query(
      `INSERT INTO role (title, salary, department_id) VALUES (${answers.title}, ${answers.salary}, ${department_id})`
    ).then(console.log(`Added ${answers.title} to the database`));
  });
  prompt();
}

async function addEmployee() {
  // Get
  const managers = db.query(
    "SELECT first_name, last_name FROM employee WHERE NOT manager_id = null"
  );

  // Get role titles
  const titles = [db.query("SELECT title FROM role")];

  const questions = [
    {
      type: "input",
      name: "first_name",
      message: "What is the first name of the employee? ",
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the last name of the employee? ",
    },
    {
      type: "list",
      name: "role",
      message: "What is the role of the employee? ",
      choices: titles,
    },
    {
      type: "confirm",
      name: "hasManager",
      message: "Does this employee have a manager? ",
    },
    {
      type: "list",
      message: "What is the name of the manager? ",
      name: managers,
      choices: managers,
      when: (answers) => answers.hasManager,
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    const role_id = db.query(
      `SELECT id FROM role WHERE title='${answers.role}'`
    );
    if (answers.hasManager) {
      const manager_id = db.query(
        `SELECT id FROM employee WHERE first_name=${answers.employee}`
      );
      db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (${answers.first_name}, ${answers.last_name}, ${role_id}, ${manager_id})`
      );
    } else {
      db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (${answers.first_name}, ${answers.last_name}, ${role_id}, NULL)`
      );
    }

    console.log(
      `Added ${answers.first_name} ${answers.last_name} to the database`
    );
  });
  prompt();
}

function updateEmployee() {
  let employees = db.query(
    "SELECT first_name, last_name AS firstName, lastName FROM employee"
  );

  inquirer
    .prompt(
      {
        type: "search-list",
        message: "Enter the name of the employee you'd like to update",
        name: "employee",
        choices: getEmployeeNames(),
      },
      {
        type: "search-list",
        message: "What would you like their new role to be?",
        name: "role",
        choices: getRoleTitles(),
      }
    )
    .then((answers) => {
      const role_id = db.query(`SELECT id FROM role WHERE title=?`, [
        answers.role,
      ]);

      db.query(
        `UPDATE employee SET role_id = ${role_id} WHERE first_name = ${answers.employee}` //Parse answers.employee to get the first and last name
      );

      console.log(
        `Updated the file of ${answers.first_name} ${answers.last_name}`
      );
    });
  prompt();
}

function prompt() {
  inquirer.prompt(options).then((answer) => {
    switch (answer.next) {
      case "View all departments":
        viewDepartments();
        break;
      case "View all roles":
        viewRoles();
        break;
      case "View all employees":
        viewEmployees();
        break;
      case "Add a department":
        addDepartment();
        break;
      case "Add a role":
        addRole();
        break;
      case "Add an employee":
        addEmployee();
        break;
      case "Update an employee role":
        updateEmployee();
        break;
      case "Quit":
        console.log("Goodbye!");
        return;
    }
  });
}

// Function call to begin the prompt
prompt();
