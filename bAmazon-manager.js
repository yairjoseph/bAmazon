var inquirer = require("inquirer");
var mysql = require("mysql");
var chalk = require("chalk");
const log = console.log;
var productsForSale;


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
displayTable();
function displayTable() {
    var query = connection.query(
        "SELECT * FROM products",
        function (err, res) {
            if (err) throw err;
            productsForSale = res;
            // log(productsForSale)
            displayMenu();
        }
    )
}
function displayItems() {
    for (let i = 0; i < productsForSale.length; i++) {
        log("\n");
        log(chalk.yellow("Product ID: " + productsForSale[i].id + "\n"));
        log(chalk.green("Product: " + productsForSale[i].name + "\n"));
        log(chalk.blue("$" + productsForSale[i].price + "\n"));
        log(chalk.red("Stock: " + productsForSale[i].stock + "\n"));
        log("************************" + "\n");
    }
}

function lowInventory() {
    let inventoryLow = false;
    for (let i = 0; i < productsForSale.length; i++) {
        if (productsForSale[i].stock < 5) {
            log("\n");
            log(productsForSale[i].name + " Has a low inventory" + "\n");
            log("Inventory: " + productsForSale[i].stock + "\n")
            inventoryLow = true;
        }
    }
    if (inventoryLow === false) {
        log("\n");
        log(chalk.yellow("All inventories are up to date" + "\n"));
    }
}
function addInventory() {
    inquirer.prompt([
        {
            name: "itemToUpdate",
            type: "input",
            message: "What item would you like to update?(By ID Number)",
        },
        {
            name: "inputAmount",
            type: "input",
            message: "How much would you like to add to the inventory?"
        }
    ]).then(function (response) {
        let inputId = parseInt(response.itemToUpdate);
        let quantity = parseInt(response.inputAmount);
        let desiredProduct;
        let productExists = false;
        for (let i = 0; i < productsForSale.length; i++) {
            if (productsForSale[i].id === inputId) {
                desiredProduct = productsForSale[i];
                productExists = true;
            }
        }
        if (productExists === false) {
            log("\n");
            log("I'm sorry, we do not carry this item." + "\n")
        }
        else {
            quantity <= desiredProduct.stock
            desiredProduct.stock += quantity;
            uploadChanges(desiredProduct.stock, desiredProduct.id);
            log("\n");
            log(chalk.yellow("New inventory: " + desiredProduct.name + "\n"));
            log(chalk.green("New inventory: " + desiredProduct.stock + "\n"));
            displayMenu();
        }
    })

}

function uploadChanges(stock, id) {
    // log(stock);
    // log(id);
    var query = connection.query(
        "UPDATE products SET stock = ? WHERE id = ?", [stock, id],
        function (err, res) {
            // log(err);
            log("\n");
            log("Inventory has been updated" + "\n");
        }
    )
}

function newProduct() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Name Your New Product",
        },
        {
            name: "price",
            type: "input",
            message: "Product Price",
        },
        {
            name: "stock",
            type: "input",
            message: "Product quantity",
        },
        {
            name: "department",
            type: "input",
            message: "Department Name",
        }
    ]).then(function (response) {
        let name = response.name;
        let price = response.price;
        let stock = response.stock;
        let department = response.department;

        var query = connection.query(
            "UPDATE products SET name = ?,  stock = ?,  price = ?, department = ?", [name, stock, price, department],
            function (err, res) {
                if (err) throw err;
                // log(err);
                // log("Inventory has been updated");
                log("\n");
                log("Your New Item Has Been Successfully added!" + "\n");
                log(chalk.yellow("Product: " + name + "\n"));
                log(chalk.blue("$" + price + "\n"));
                log(chalk.red("Stock: " + stock + "\n"));
                log(chalk.green("Added to department: " + department + "\n"));
                log("************************" + "\n");
                displayTable();
            }
        )
    })
}
function displayMenu() {
    inquirer.prompt([
        {
            name: "menu",
            type: "list",
            message: "Choose an action",
            choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product"]
        }
    ]).then(function (response) {
        switch (response.menu) {

            case "View Products For Sale":
                displayItems();
                displayMenu();
                break;

            case "View Low Inventory":
                lowInventory();
                displayMenu();
                break;

            case "Add To Inventory":
                addInventory();
                break;

            case "Add New Product":
                newProduct();
                break;
            case "Exit":
                connection.end();
                break;
        }
    })
}