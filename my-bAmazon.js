var inquirer = require("inquirer");
var mysql = require("mysql");
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


function tableUpdate() {
  var query = connection.query(
    "SELECT id,name, price FROM products",
    function (err, res) {
      productsForSale = res;
      log(productsForSale);
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

    placeOrder(res.product, res.quantity)

  })
}

function placeOrder(inputId, quantity) {
  let productExists = false;
  for (let i = 0, i < productsForSale.length; i++ ) {
    if (productsForSale[i].id === inputId){
        return productExists = true;
    }
  }
  if(productExists === false){
    log("I'm sorry, we do not carry this item.")
  }
}