var inquirer = require("inquirer");
var mysql = require("mysql");
var chalk = require("chalk");
var table = require('cli-table');
const log = console.log;

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
    database: "bAmazon_db"
  });
  connection.connect(function (err) {
    if (err) throw err;
    log("Connected as id" + connection.threadId + "\n");
});
// supervisorPrompt();
getChanges();
function getChanges() {
    var query = connection.query(
        "SELECT products.name, products.department, products.productsales, departments.overheadcosts FROM products,departments",
        function (err, res) {
            if (err) throw err;
            log(res);
            // supervisorPrompt();
        }
    )};

// function supervisorPrompt() {

//     inquirer.prompt([
//         {
//             name: "menu",
//             type: "list",
//             choices: ["View Product Sales by Department", "Create New Department"],
//             message: "Supervisor Menu",
//         }
//     ]).then(function (res) {
//         switch (res.menu) {
//             case "View Products For Sale":
//                 uploadChanges();
//                 break;

//             case "Create New Department":
//                 break;
//         }
//     })
// }