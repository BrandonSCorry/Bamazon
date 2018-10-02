//dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");

// info to mysql DB
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// mysql DB connection
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user and get DB values
  showDB();
});


// function to show DB & query user at start
function showDB() {
  var query = connection.query("SELECT * FROM products ORDER BY item_id ASC", function(err, res) {
    console.log("\nBamazon Product List\n");
    console.log(" ID | Item | Category |  $  |  Quantity");
    console.log("-------------------------------------------------");


    res.forEach((product) => {
      console.log(" " + product.item_id + " | " + product.product_name + " | " + product.department_name + " | $" + product.price + " | " + product.stock_quantity);
      console.log("---------------------------------------------------------");
    });


    //start inquirer prompts
    startPrompt();
  });
}

//prompts, select item & quantity from user input, then check DB if we have enough stock to sell to user
function startPrompt() {

inquirer
  .prompt([
    {
      name: "itemId",
      type: "input",
      message: "Enter the ID number of the product you wish to buy:",
      validate: function(value) {
        return (isNaN(value) || value > 10 || value == "") === false;

      }
    },
    {
      name: "quantity",
      type: "input",
      message: "How many of these would you like to buy?",
      validate: function(value) {
        return (isNaN(value) || value == "") === false;
      }
    }
  ])
  .then(function(input) {

    var query = connection.query(
      "SELECT * FROM products WHERE item_id = ?", [parseInt(input.itemId)],
      function(err, res) {

        // get DB stock quantity, easier way to do this?

        Object.keys(res).forEach(function(key) {

          let match = res[key];

          const isInStock = match.stock_quantity >= input.quantity;

          //conditional statement - if we have enough stock_quantity or not
          const checkStock = isInStock? updateDB(input, match) : notEnoughStock(input, match);

        });

      }
    );

  });
}





function updateDB (input, match) {

  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: parseInt(match.stock_quantity - input.quantity)
      },
      {
        item_id: input.itemId
      }
    ],
    function(err, res) {
      console.log("\nPurchase successful! Total cost: $" + (match.price * input.quantity));
     }
  );

  setTimeout(reset, 2000)


}
//return message if not enough of product in stock
function notEnoughStock (input, match) {
  console.log("\nSorry, we don't have " + input.quantity + " " + match.product_name +"'s in stock.\nWe have " + match.stock_quantity + " currently in stock. \nPlease call us for special orders at 888-888-8888.");

  setTimeout(reset, 2000)
}


//reset function to prompt user to return to store or exit
function reset() {
  inquirer
    .prompt({
      name: "restart",
      type: "rawlist",
      message: "What would you like to do?",
      choices: ["Return to Bamazon", "Exit"]
    })
    .then(function(input) {
      // based on their answer, either call the bid or the post functions
      if (input.restart.toUpperCase() === "RETURN TO BAMAZON") {
        showDB();
      }
      else {
        process.exit();
      }
    });
}
