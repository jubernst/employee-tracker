const inquirer = require("inquirer");
const mysql = require("mysql2");
require("dotenv").config();
require("console.table");

// i think we need express bc we need a listener... aka a server
const server = mysql.createServer();
const PORT = process.env.PORT || 3001;

server.listen(PORT);
// Wrap the app in server connection
server.on("connection", (conn) => {
  console.log("Connected");

  conn.on("end", remote.end.bind(remote));
});

// view all departments, view all roles, view all employees,
// add a department, add a role, add an employee, and update an employee role
// loop?

// connect to sql with promise in order to use async / await
const db = mysql
  .createConnection(
    // use dotenv
    {
      host: process.env.DB_HOST,
      // MySQL username,
      user: process.env.DB_USER,
      // MySQL password
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    console.log(`Connected to the employees_db database.`)
  )
  .promise();

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

// Query functions

// Use get functions in order to avoid incorrectly entered information
const getEmployees = async () => {
  const employeeList = await db.query("SELECT * FROM employee");
  return employeeList;
};

const getRoles = async () => {
  const roleList = await db.query("SELECT * FROM role");
  return roleList;
};

const getDepartments = async () => {
  const departmentList = await db.query("SELECT * FROM department");
  return departmentList;
};

// Prints a given table
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
    db.query(`INSERT INTO department (name) VALUES (${answers.name})`).then(
      viewTable("department")
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
      choices: getDepartments(),
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    db.query(
      `INSERT INTO role (title, salary, department) VALUES (${answers.title}, ${answers.salary}, ${answers.department})`
    );
  });

  viewTable("role");
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
      choices: getRoles(),
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
      choices: getEmployees(),
      when: (answers) => answers.hasManager,
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    if (answers.hasManager) {
      db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager) VALUES (${answers.first_name}, ${answers.last_name}, ${answers.role.id}, ${answers.manager.id})`
      );
    } else {
      db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager) VALUES (${answers.first_name}, ${answers.last_name}, ${answers.role.id}, NULL)`
      );
    }

    viewTable("employee");
  });
}

function updateEmployee() {
  inquirer
    .prompt(
      {
        type: "search-list",
        message: "Enter the employee's name:",
        name: "employee",
        choices: getEmployees(),
      },
      {
        type: "search-list",
        message: "What would you like their new role to be?",
        name: "role",
        choices: getRoles(),
      }
    )
    .then((answers) => {
      db.query(
        `UPDATE employee SET role_id = ${answers.role.id} WHERE id = ${answers.employee.id}`
      );
    });

  viewTable("employee");
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
