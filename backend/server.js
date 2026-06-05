
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

function readData(filename) {
    var filepath = path.join(__dirname, "data", filename);
    if (!fs.existsSync(filepath)) {
        return [];
    }
    var content = fs.readFileSync(filepath, "utf8");
    return JSON.parse(content);
}

function saveData(filename, data) {
    var filepath = path.join(__dirname, "data", filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

// make sure data folder exists
if (!fs.existsSync(path.join(__dirname, "data"))) {
    fs.mkdirSync(path.join(__dirname, "data"));
}

// seed some products if none exist
var products = readData("products.json");
if (products.length === 0) {
    products = [
        { id: 1, name: "Wireless Headphones", price: 1299, description: "Good quality wireless headphones with noise cancellation.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" },
        { id: 2, name: "Running Shoes", price: 2499, description: "Comfortable running shoes with good grip and cushioning.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" },
        { id: 3, name: "Smart Watch", price: 3999, description: "Track your fitness, get notifications and check time.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop" },
        { id: 4, name: "Backpack", price: 899, description: "Spacious backpack with laptop compartment.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop" },
        { id: 5, name: "Sunglasses", price: 599, description: "UV protection sunglasses with lightweight frame.", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop" },
        { id: 6, name: "Water Bottle", price: 299, description: "Stainless steel bottle, keeps cold 12 hours.", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop" }
    ];
    saveData("products.json", products);
}

// ---- ROUTES ----

// GET all products
app.get("/api/products", function(req, res) {
    var products = readData("products.json");
    res.json(products);
});

// GET single product by id
app.get("/api/products/:id", function(req, res) {
    var products = readData("products.json");
    var id = parseInt(req.params.id);
    var product = null;

    for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            product = products[i];
            break;
        }
    }

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
});

// POST register new user
app.post("/api/register", function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    var users = readData("users.json");

    // check if email already exists
    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            return res.status(400).json({ message: "Email already registered" });
        }
    }

    var newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password  // note: in production always hash passwords!
    };

    users.push(newUser);
    saveData("users.json", users);

    res.json({ message: "Registration successful" });
});

// POST login
app.post("/api/login", function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    var users = readData("users.json");
    var found = null;

    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password === password) {
            found = users[i];
            break;
        }
    }

    if (!found) {
        return res.status(401).json({ message: "Wrong email or password" });
    }

    res.json({ message: "Login successful", user: { id: found.id, name: found.name, email: found.email } });
});

// POST place order
app.post("/api/orders", function(req, res) {
    var userId = req.body.userId;
    var items = req.body.items;

    if (!userId || !items || items.length === 0) {
        return res.status(400).json({ message: "Invalid order data" });
    }

    var orders = readData("orders.json");
    var newOrder = {
        id: Date.now(),
        userId: userId,
        items: items,
        status: "pending",
        date: new Date().toLocaleDateString()
    };

    orders.push(newOrder);
    saveData("orders.json", orders);

    res.json({ message: "Order placed successfully", orderId: newOrder.id });
});

// GET orders for a user
app.get("/api/orders/:userId", function(req, res) {
    var orders = readData("orders.json");
    var userId = parseInt(req.params.userId);
    var userOrders = [];

    for (var i = 0; i < orders.length; i++) {
        if (orders[i].userId === userId) {
            userOrders.push(orders[i]);
        }
    }

    res.json(userOrders);
});

// start the server
app.listen(PORT, function() {
    console.log("ShopEasy server running on http://localhost:" + PORT);
});
