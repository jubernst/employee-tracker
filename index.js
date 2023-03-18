const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");

// view all departments, view all roles, view all employees,
// add a department, add a role, add an employee, and update an employee role
// loop?
const options = [
  {
    type: "list",
    name: "next",
    message: "What would you like to do next?",
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
// Connect to database
// Done with sequelize
// how do i query database with sequelize?
const db = mysql.createConnection(
  // This will be in .env
  // figure out how to use dotenv with mysql
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "jdklxw06SQL!",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

// Query functions
// will have to use cTable, pass in the tables
function viewTable(table) {
  db.query(`SELECT * FROM ${table}`, function (err, results) {
    console.table(results); // use console table
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
    // get the length of department to make the new id
    db.query(`INSERT INTO department (id, name) VALUES (1, ${answers.name})`);
    db.query("Select * FROM department", function (err, results) {
      console.table(results);
    });
  });
}

function addRole() {
  // Get input
  const questions = [
    {
      type: "input",
      name: "name",
      message: "Enter the name for the role:",
    },
    {
      type: "input",
      name: "salary",
      message: "Enter the salary for the role:",
    },
    {
      type: "input",
      name: "department",
      message: "Enter the department for the role:",
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    // get the length of department to make the new id
    db.query(
      `INSERT INTO role (id, name, salary, department) VALUES (1, ${answers.name}, ${answers.salary}, ${answers.department})`
    );
    db.query("Select * FROM role", function (err, results) {
      console.table(results);
    });
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
      type: "input",
      name: "role",
      message: "Enter the role of the employee:",
    },
    {
      // make a question "does this employee have a manager" and ask for their name if true, null else
      type: "input",
      name: "manager", // tough one. i'm gonna have to dig through the db to find a match
      message: "Enter the first and last name of the manager of the employee:",
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    // get the length of department to make the new id
    db.query(
      `INSERT INTO employee (id, first_name, last_name, role, manager) VALUES (, ${answers.first_name}, ${answers.last_name}, ${answers.role}, ${answers.manager})`
    );
    db.query("Select * FROM employee", function (err, results) {
      console.table(results);
    });
  });
}

function updateEmployee() {
  // in order to select an employee they should begin typing the employees name
  // and we should suggest matches from the db if possible
}

// TODO: Create a function to initialize app
// call the questions asynchronously
// after each response, present the options again ("What would you like to do next?")
// As long as they didn't choose Quit
// Myabe use loop instead of calling the prompt over and over
async function prompt() {
  const getNext = await inquirer.prompt(options);

  switch (getNext) {
    case "View all departments":
      viewTable("department");
      break;
    case "View all roles":
      viewTable("role");
      break;
    case "View all employees":
      viewTable("employee");
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
}

// Function call to begin the prompt
prompt();
