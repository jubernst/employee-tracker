// The inquirer and mysql2 packages
const inquirer = require("inquirer");
const mysql = require("mysql2");

// view all departments, view all roles, view all employees,
// add a department, add a role, add an employee, and update an employee role
const questions = [
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
    ],
  },
];

// Connect to database
const db = mysql.createConnection(
  // This will be in .env
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

// Query database
// This is how you'll get the users choices
db.query("SELECT * FROM employees", function (err, results) {
  console.log(results);
});

// TODO: Create a function to initialize app
// call the questions asynchronously
// after each response, present the options again ("What would you like to do next?")
function init() {
  inquirer.prompt(questions);
}

// Function call to initialize app
init();
