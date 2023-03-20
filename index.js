const inquirer = require("inquirer");
const mysql = require("mysql2");
require("dotenv").config();
require("console.table");

// Ask if we can use sequelize

// connect to sql with promise in order to use async / await
// consider using a pool for better practice
const db = mysql
  .createConnection(
    // Use dotenv to protect privacy
    {
      host: "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "employees_db",
    },
    console.log(`Connected to the employees_db database.`)
  )
  .promise();

// Query functions should be in a separate file

// Return all instances in a given table
const getList = async (table) => {
  const list = await db.query(`SELECT * FROM ${table}`);
  return list;
};

// Prints a given table
function viewTable(table) {
  db.query(`SELECT * FROM ${table}`, function (err, results) {
    console.table(results);
  });
}

function addDepartment() {
  // Get input
  const questions = [
    {
      type: "input",
      name: "name",
      message: "Enter the name of the department:",
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    db.query(`INSERT INTO departments (name) VALUES (${answers.name})`).then(
      viewTable("departments")
    );
  });
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
      type: "search-list",
      name: "department",
      message: "Enter the department for the role:",
      choices: getList("departments"),
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    db.query(
      `INSERT INTO roles (title, salary, department) VALUES (${answers.title}, ${answers.salary}, ${answers.department})`
    ).then(viewTable("roles"));
  });
}

function addEmployee() {
  // Get input
  const questions = [
    {
      type: "input",
      name: "first_name",
      message: "Enter the first name of the employee:",
    },
    {
      type: "input",
      name: "last_name",
      message: "Enter the last name of the employee:",
    },
    {
      type: "search-list",
      name: "role",
      message: "Enter the role of the employee:",
      choices: getList("roles"),
    },
    {
      type: "confirm",
      name: "hasManager",
      message: "Does this employee have a manager?",
    },
    {
      type: "search-list",
      message: "Enter the name of the manager:",
      name: "manager",
      choices: getList("employees"),
      when: (answers) => answers.hasManager,
    },
  ];

  inquirer
    .prompt(questions)
    .then((answers) => {
      if (answers.hasManager) {
        db.query(
          `INSERT INTO employees (first_name, last_name, role_id, manager) VALUES (${answers.first_name}, ${answers.last_name}, ${answers.role.id}, ${answers.manager.id})`
        );
      } else {
        db.query(
          `INSERT INTO employees (first_name, last_name, role_id, manager) VALUES (${answers.first_name}, ${answers.last_name}, ${answers.role.id}, NULL)`
        );
      }
    })
    .then(viewTable("employees"));
}

function updateEmployee() {
  inquirer
    .prompt(
      {
        type: "search-list",
        message: "Enter the employee's name:",
        name: "employee",
        choices: getList("employees"),
      },
      {
        type: "search-list",
        message: "What would you like their new role to be?",
        name: "role",
        choices: getList("roles"),
      }
    )
    .then((answers) => {
      db.query(
        `UPDATE employees SET role_id = ${answers.role.id} WHERE id = ${answers.employee.id}`
      );
    });

  viewTable("employees");
}

// TODO: Create a function to initialize app
// call the questions asynchronously
// after each response, present the options again ("What would you like to do next?")
// As long as they didn't choose Quit
// Myabe use loop instead of calling the prompt over and over
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

async function prompt() {
  const getNext = await inquirer.prompt(options);
  // All of these functions can be exported from another file to keep this shit clean

  switch (getNext) {
    case "View all departments":
      viewTable("departments");
      break;
    case "View all roles":
      viewTable("roles");
      break;
    case "View all employees":
      viewTable("employees");
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
      break;
  }

  if (getNext === "Quit") {
    console.log("Goodbye!");
  } else {
    // Otherwise, prompt again
    prompt();
  }
}

// Function call to begin the prompt
prompt();
