// list of products for the store
// in a real project these would come from the backend/database
var products = [
    {
        id:1,
        name:"Guitar",
        price:2670,
        description:"A Premium Brown Colour Ukelele with Nylon strings",
        image:"https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=600&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Wireless Headphones",
        price: 1299,
        description: "Good quality wireless headphones with noise cancellation. Battery lasts up to 20 hours.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 2499,
        description: "Comfortable running shoes with good grip and cushioning. Available in multiple sizes.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop"
    },
    {
        id: 4,
        name: "Smart Watch",
        price: 3999,
        description: "Track your fitness, get notifications and check time. Water resistant design.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
    },
    {
        id: 5,
        name: "Backpack",
        price: 899,
        description: "Spacious backpack with laptop compartment. Good for college and travel.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop"
    },
    {
        id: 6,
        name: "Sunglasses",
        price: 599,
        description: "UV protection sunglasses. Lightweight and stylish frame.",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop"
    },
    {
        id: 7,
        name: "Water Bottle",
        price: 299,
        description: "Stainless steel water bottle. Keeps water cold for 12 hours and hot for 6 hours.",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop"
    }
];

// this function loads and shows all products on the page
function showProducts() {
    var grid = document.getElementById("product-grid");
    if (!grid) return; // in case we are on a different page

    grid.innerHTML = ""; // clear old content first

    for (var i = 0; i < products.length; i++) {
        var p = products[i];

        // create a card for each product
        var card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="price">₹${p.price}</div>
                <p>${p.description.substring(0, 60)}...</p>
                <button onclick="viewProduct(${p.id})">View Details</button>
            </div>
        `;

        grid.appendChild(card);
    }
}

// go to product detail page with the id in the URL
function viewProduct(productId) {
    window.location.href = "product.html?id=" + productId;
}

// add a product to the cart (saved in localStorage)
function addToCart(productId) {
    // check if user is logged in first
    var user = localStorage.getItem("loggedInUser");
    if (!user) {
        alert("Please login first to add items to cart!");
        window.location.href = "login.html";
        return;
    }

    // get existing cart or start a new empty cart
    var cart = JSON.parse(localStorage.getItem("cart")) || [];

    // check if this product is already in the cart
    var found = false;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].qty = cart[i].qty + 1; // increase quantity
            found = true;
            break;
        }
    }

    // if not found, add it fresh
    if (!found) {
        // find the product details
        var product = null;
        for (var i = 0; i < products.length; i++) {
            if (products[i].id === productId) {
                product = products[i];
                break;
            }
        }
        if (product) {
            cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
        }
    }

    // save cart back
    localStorage.setItem("cart", JSON.stringify(cart));

    // update the count shown in navbar
    updateCartCount();
    showToast("Item added to cart!");
}

// update the number shown next to "Cart" in navbar
function updateCartCount() {
    var countEl = document.getElementById("cart-count");
    if (!countEl) return;

    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        total += cart[i].qty;
    }
    countEl.textContent = total;
}

// show a quick popup message at the bottom
function showToast(message) {
    var toast = document.getElementById("toast");
    if (!toast) {
        // create it if it doesn't exist
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.display = "block";

    // hide it after 2.5 seconds
    setTimeout(function() {
        toast.style.display = "none";
    }, 2500);
}

// check if user is logged in and update nav links
function checkLoginStatus() {
    var user = localStorage.getItem("loggedInUser");
    var loginLink = document.getElementById("login-link");
    var logoutLink = document.getElementById("logout-link");

    if (user && loginLink && logoutLink) {
        loginLink.style.display = "none";
        logoutLink.style.display = "inline";
    }
}

// log the user out
function logoutUser() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}

// run when page loads
window.onload = function() {
    showProducts();
    updateCartCount();
    checkLoginStatus();
};
