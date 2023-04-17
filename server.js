// Import and require Inquirer
const inquirer = require("inquirer");
// Import and require mysql2
const mysql = require('mysql2');
// Import and require console.table
const consoletable = require('console.table');


// Connect to database
const connection = mysql.createConnection(
    {
      host: '127.0.0.1',
      port: 3306,
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '',
      database: 'employee_db'
    }
  );

  connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // runs the app
    init();
});
 
// first thing that user see
function init() {
    inquirer.prompt(
        {
            type: `list`,
            name: `mainOptions`,
            message: `What would you like to do?`, 
            choices:["View all employees", "Add employee",
            "Update employee role",
            "View all roles", "Add role",
            "View all departments", "Add department",
            "Quit"], 
        }
    )
    .then(response => {
        console.log("You entered: " + response.mainOptions);
     switch(response.mainOptions){
        case "View all employees":
            employees();
            break;
        case "Add employees":
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
        case "Quit":
            default:
            quit();              
     }
    });
}

//corresponding function to the first case which builds complete employee table
async function employees() {
   let [res] = await connection.promise().query('SELECT e.id, e.first_name AS First_Name, e.last_name AS Last_Name, title AS Title, salary AS Salary, name AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN roles r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id'
        // if (err) throw err;
        );
        console.table(res);
        init();
};
// corresponding function to the second case adds a new employee after asking for name, role, and manager
async function addEmployee() {
    let positions = await connection.promise().query('SELECT id, title FROM roles');
    let managers = await connection.promise().query('SELECT id, CONCAT(first_name, " ", last_name) AS Manager FROM employee');
    managers.unshift({ id: null, Manager: "None" });

    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Please enter first name of employee:",
            validate: confirmStringInput
        },
        {
            name: "lastName",
            type: "input",
            message: "Please enter last name of employee:",
            validate: confirmStringInput
        },
        {
            name: "role",
            type: "list",
            message: "Choose employee role:",
            choices: positions.map(obj => obj.title)
        },
        {
            name: "manager",
            type: "list",
            message: "Choose the employee's manager:",
            choices: managers.map(obj => obj.Manager)
        }
    ]).then(async answers => {
        let positionDetails = positions.find(obj => obj.title === answers.role);
        let manager = managers.find(obj => obj.Manager === answers.manager);
       await connection.promise().query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)", [[answers.firstName.trim(), answers.lastName.trim(), positionDetails.id, manager.id]]);
        //console.log("\x1b[32m", `${answers.firstName} was added to the employee database!`);
        init();
    });
};

// Updates the selected employee's role
async function updateEmployee() {
    let employees = await connection.promise().query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
    employees.push({ id: null, name: "Cancel" });
    let roles = await db.query('SELECT id, title FROM role');

    inquirer.prompt([
        {
            name: "Name",
            type: "list",
            message: "The employee whose role is being changed?",
            choices: employees.map(obj => obj.name)
        },
        {
            name: "newRole",
            type: "list",
            message: "Their role is changed to:",
            choices: roles.map(obj => obj.title)
        }
    ]).then(async answers => {
        if (answers.Name != "Cancel") {
            let empID = employees.find(obj => obj.name === answers.Name).id
            let roleID = roles.find(obj => obj.title === answers.newRole).id
           await connection.promise().query("UPDATE employee SET role_id=? WHERE id=?", [roleID, empID]);
            //console.log("\x1b[32m", `${answers.Name} new role is ${answers.newRole}`);
        }
        init();
    })
};