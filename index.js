// Import and require Inquirer
const inquirer = require("inquirer");
// Import and require mysql2
const mysql = require("mysql2");
// Import and require console.table
const consoletable = require("console.table");

// Connect to database
const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  // MySQL username,
  user: "root",
  // MySQL password
  password: "",
  database: "employee_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  console.log(`
    ╔═══╗─────╔╗──────────────╔═╗╔═╗
    ║╔══╝─────║║──────────────║║╚╝║║
    ║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
    ║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
    ║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
    ╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
    ───────║║──────╔═╝║─────────────────────╔═╝║
    ───────╚╝──────╚══╝─────────────────────╚══╝`)
  // runs the application
  init();
});

// first thing that user see
function init() {
  inquirer
    .prompt({
      type: `list`,
      name: `mainOptions`,
      message: `What would you like to do?`,
      choices: [
        "View all employees",
        "Add employee",
        "Update employee role",
        "View all roles",
        "Add role",
        "View all departments",
        "Add department",
        "Delete department",
        "Quit",
      ],
    })
    .then((response) => {
      console.log("You entered: " + response.mainOptions);
      switch (response.mainOptions) {
        case "View all employees":
          employees();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "Update employee role":
          updateEmployee();
          break;
        case "View all roles":
          roles();
          break;
        case "Add role":
          addRole();
          break;
        case "View all departments":
          departments();
          break;
        case "Add department":
          addDepartment();
          break;
        case "Delete department":
          deleteDepartment();
         break;
        case "Quit":
        default:
          //quit();
      }
    });
}

  async function departments() {
    console.log("Viewing Departments\n");
    let [res] = await connection.promise().query(`SELECT department.id,
     department.name as Department FROM department`);
    console.table(res);
    init();
  }

async function employees() {
  console.log("Viewing employees\n");
    let [res] = await connection.promise().query(`SELECT employee.id, 
    employee.first_name AS First_Name, employee.last_name AS Last_Name, roles.title AS Title,
     roles.salary AS Salary, department.name AS Department,
      CONCAT(manager.first_name, " ", manager.last_name) 
      AS Manager FROM employee LEFT JOIN employee manager ON manager.id 
      = employee.manager_id LEFT JOIN roles ON employee.roles_id = roles.id LEFT JOIN department
      ON roles.department_id = department.id`
         // if (err) throw err;
         );
         console.table(res);
         init();
 };
 
 async function roles() {
  console.log("Viewing Roles\n");
     let [res] = await connection.promise().query(`SELECT roles.id, roles.title, roles.salary, 
     department.name as Department FROM roles LEFT JOIN department ON roles.department_id= department.id `);
 
     console.table(res);
     init();
   }


   function addDepartment() {
    inquirer
      .prompt({
        type: "input",
        name: "newDep",
        message: "provide the name of new department that you like to add?",
      })
      .then(function (answer) {
        connection.query(
          "INSERT INTO department (department.name) VALUES (?)",
          [answer.newDep],
          console.log("department added"),
          function (err, res) {
            if (err) throw err;
            console.table(res);
            init();
          }
        );
        init();
      });
  }

function quit() {
  connection.end();
  process.exit();
}

function addEmployee() {
  inquirer

    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Please enter first name of employee:",
        // validate: confirmStringInput,
      },
      {
        name: "lastName",
        type: "input",
        message: "Please enter last name of employee:",
        // validate: confirmStringInput,
      },
      {
        name: "role",
        type: "input",
        message: "Enter employee role id",
        //choices: positions.map((obj) => obj.title),
      },
      {
        name: "manager",
        type: "input",
        message: "Enter the employee's manager id",
       // choices: managers.map((obj) => obj.Manager),
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        [answer.firstName, answer.lastName, answer.role, answer.manager],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          init();
        }
      );
    });
}

function updateEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "First name of the employee you like to update?",
        name: "Name",
      },

      {
        type: "input",
        message: "What do you want to update role to?",
        name: "updateRole",
      },
    ])
    .then(function (answer) {
      connection.query(
        "UPDATE employee SET role=? WHERE first_name= ?",
        [answer.updateRole, answer.Name],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          init();
        }
      );
    });
}

function addRole() {
 inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "please enter the title of the new role.",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for this new role?",
      },
      {
        type: "input",
        name: "dID",
        message:
          "Which department this role belongs to? please enter the id number?",
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
        [answer.title, answer.salary, answer.dID],
        console.log("Role added"),
        function (err, res) {
          if (err) throw err;
          console.table(res);
          init();
        }
      );
      init();
    });
}

function deleteDepartment() {
    inquirer
      .prompt({
        type: `input`,
        name: `deleteDep`,
        message: `Which department would you like to delete?`,
       // choices: await db.viewAllDepartments().map(({ id, name }) => ({name: options, value: id })),
        // [
        //   "Leadership", "Security", "Finance", "Legal",      
        //   "Engineering "
        // ],
      })
      .then(function (res) {
        connection.query(
          "REMOVE FROM department (name) VALUES (?)",
          [answer.deleteDep],
          function (err, res) {no
            if (err) throw err;
            console.table(res);
            init();
          }
        );
      });
    }

// const roleChoices= roles.map(({ id, title }) => ({
//   name: title,
//   value: id
// }));
//prompt({
// type:"list",
// name="roleID",
// message:"What is the employee's role?",
// choices: roleChoices
//})

// 
  

// function roles() {
//   // select from the db
//   let query = "SELECT * FROM roles";
//   connection.query(query, function (err, res) {
//     if (err) throw err;
//     console.table(res);
//     init();
//   });
  // show the result to the user (console.table)
//}

// function employees() {
//   console.log("Viewing employees\n");
//   // select from the db
//   let query = "SELECT * FROM employee";
//   connection.query(query, function (err, res) {
//     if (err) throw err;
//     console.table(res);
//     init();
//   });
//   // show the result to the user (console.table)
// }



// corresponding function to the second case adds a new employee after asking for name, role, and manager
// async function addEmployee() {
//     let positions = await connection.promise().query('SELECT id, title FROM roles');
//     let managers = await connection.promise().query('SELECT id, CONCAT(first_name, " ", last_name) AS Manager FROM employee');
//     managers.unshift({ id: null, Manager: "None" });

// inquirer.prompt([
//     {
//         name: "firstName",
//         type: "input",
//         message: "Please enter first name of employee:",
//         validate: confirmStringInput
//     },
//     {
//         name: "lastName",
//         type: "input",
//         message: "Please enter last name of employee:",
//         validate: confirmStringInput
//     },
//     {
//         name: "role",
//         type: "list",
//         message: "Choose employee role:",
//         choices: positions.map(obj => obj.title)
//     },
//     {
//         name: "manager",
//         type: "list",
//         message: "Choose the employee's manager:",
//         choices: managers.map(obj => obj.Manager)
//     }
//     ]).then(async answers => {
//         let positionDetails = positions.find(obj => obj.title === answers.role);
//         let manager = managers.find(obj => obj.Manager === answers.manager);
//        await connection.promise().query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)", [[answers.firstName.trim(), answers.lastName.trim(), positionDetails.id, manager.id]]);
//         //console.log("\x1b[32m", `${answers.firstName} was added to the employee database!`);
//         init();
//     });
// };

// // Updates the selected employee's role
// async function updateEmployee() {
//     let employees = await connection.promise().query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
//     employees.push({ id: null, name: "Cancel" });
//     let roles = await connection.promise().query('SELECT id, title FROM roles');

//     inquirer.prompt([
//         {
//             name: "Name",
//             type: "list",
//             message: "The employee whose role is being changed?",
//             choices: employees.map(obj => obj.name)
//         },
//         {
//             name: "newRole",
//             type: "list",
//             message: "Their role is changed to:",
//             choices: roles.map(obj => obj.title)
//         }
//     ]).then(async answers => {
//         if (answers.Name != "Cancel") {
//             let empID = employees.find(obj => obj.name === answers.Name).id
//             let roleID = roles.find(obj => obj.title === answers.newRole).id
//            await connection.promise().query("UPDATE employee SET role_id=? WHERE id=?", [roleID, empID]);
//             //console.log("\x1b[32m", `${answers.Name} new role is ${answers.newRole}`);
//         }
//         init();
//     })
// };

// //corresponding function to the first case which builds complete employee table
// function departments() {
//   // select from the db
//   let query = "SELECT * FROM department";
//   connection.query(query, function (err, res) {
//     if (err) throw err;
//     console.table(res);
//     init();
//   });
//   // show the result to the user (console.table)
// }

