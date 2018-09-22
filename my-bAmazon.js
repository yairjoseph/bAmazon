var inquirer = require("inquirer");
var mysql = require("mysql");
var chalk = require("chalk");
const log = console.log;
var productsForSale


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
  tableUpdate();
});

function displayItems() {
  for (let i = 0; i = productsForSale.length; i++) {
    log(chalk.yellow("Product ID: " + productsForSale[i].id));
    log(chalk.green("Product: " + productsForSale[i].name));
    log(chalk.blue("$" + productsForSale[i].price));
    log("************************");
  }
}
function tableUpdate() {
  var query = connection.query(
    "SELECT * FROM products",
    function (err, res) {
      productsForSale = res;
      displayItems();
      createOrder();
    }
  )
}

function createOrder() {
  inquirer.prompt([
    {
      name: "product",
      type: "input",
      message: "What item would you like to buy?"
    },
    {
      name: "quantity",
      type: "input",
      message: "How much would you like to buy?"
    }
  ]).then(function (res) {

    placeOrder(parseInt(res.product), parseInt(res.quantity));

  })
}

function placeOrder(inputId, quantity) {
  let desiredProduct;
  let productExists = false;
  for (let i = 0; i < productsForSale.length; i++) {
    if (productsForSale[i].id === inputId) {
      desiredProduct = productsForSale[i];
      productExists = true;
    }
  }
  if (productExists === false) {
    log("I'm sorry, we do not carry this item.")
  }
  else {
    if (quantity <= desiredProduct.stock) {
      log("Your order has been placed.");
      desiredProduct.stock -= quantity;
      uploadChanges(desiredProduct.stock, desiredProduct.id)
    }
    else {
      log("Try a different quantity");
    }
  }
}

function uploadChanges(stock, id) {
  log(stock);
  log(id);
  var query = connection.query(
    "UPDATE products SET stock = ? WHERE id = ?", [stock, id],
    function (err, res) {
      log(err);
      log("Data base updated");
      reOrder();
    }
  )
}

function reOrder() {
  inquirer.prompt([
    {
      name: "order",
      type: "confirm",
      message: "Would you like to order anything else?"
    }
  ]).then(function (response) {
    if (response.order === true) {
      displayItems();
      createOrder();
    }
    else {
      log("Thanks for shopping bAmazon");
    }
  })
}

