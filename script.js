// ========================================
// GAGAN WEAR - JAVASCRIPT
// ========================================


// CART
let cart = [];


// ========================================
// ADD TO CART
// ========================================

const addButtons = document.querySelectorAll(".product button");

addButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const product = button.closest(".product");

        const name = product.querySelector("h3").textContent;

        const priceText = product.querySelector("p").textContent;

        const price = parseInt(
            priceText
                .replace("₹", "")
                .replace(",", "")
        );


        // Add product
        cart.push({
            name: name,
            price: price
        });


        // Update cart number
        updateCart();


        // Change button
        button.textContent = "Added ✓";


        setTimeout(function() {
            button.textContent = "Add to Cart";
        }, 1000);


        // Message
        alert(
            name +
            " has been added to your cart! 🛒"
        );

    });

});


// ========================================
// UPDATE CART
// ========================================

function updateCart() {

    const cartButton = document.querySelector(".cart");

    cartButton.textContent =
        "🛒 Cart (" + cart.length + ")";

}


// ========================================
// SHOP NOW
// ========================================

const shopButton = document.querySelector(".shop-btn");

shopButton.addEventListener("click", function() {

    const products = document.querySelector("#products");

    products.scrollIntoView({
        behavior: "smooth"
    });

});


// ========================================
// CART BUTTON
// ========================================

const cartButton = document.querySelector(".cart");

cartButton.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Your cart is empty! 🛒");

        return;
    }


    let message = "🛒 GAGAN WEAR CART\n\n";

    let total = 0;


    cart.forEach(function(product, index) {

        message +=
            (index + 1) +
            ". " +
            product.name +
            " - ₹" +
            product.price +
            "\n";

        total += product.price;

    });


    message += "\n----------------------\n";

    message += "TOTAL: ₹" + total;


    alert(message);

});


// ========================================
// CATEGORIES
// ========================================

const categories = document.querySelectorAll(".category");

categories.forEach(function(category) {

    category.addEventListener("click", function() {

        const categoryName =
            category.querySelector("h3").textContent;

        alert(
            "You selected " +
            categoryName +
            " 👕"
        );

    });

});


// ========================================
// TEST
// ========================================

console.log(
    "GAGAN WEAR JavaScript is working! 🚀"
);


// ========================================
// GAGAN WEAR LOGIN / SIGNUP
// ========================================


// OPEN AUTH
function openAuth() {

    document.getElementById("authOverlay").style.display = "flex";

    showLogin();
}


// CLOSE AUTH
function closeAuth() {

    document.getElementById("authOverlay").style.display = "none";

}


// SHOW LOGIN
function showLogin() {

    document.getElementById("loginForm").classList.remove("hidden");

    document.getElementById("signupForm").classList.add("hidden");

}


// SHOW SIGNUP
function showSignup() {

    document.getElementById("loginForm").classList.add("hidden");

    document.getElementById("signupForm").classList.remove("hidden");

}


// SHOW / HIDE PASSWORD
function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (input.type === "password") {

        input.type = "text";

        button.textContent = "🙈";

    } else {

        input.type = "password";

        button.textContent = "👁";

    }

}


// ========================================
// SIGNUP
// ========================================

function signupUser() {

    const name =
        document.getElementById("signupName").value.trim();

    const email =
        document.getElementById("signupEmail").value.trim();

    const password =
        document.getElementById("signupPassword").value;


    if (name === "" || email === "" || password === "") {

        alert("Please fill in all fields! ⚠️");

        return;
    }


    if (password.length < 6) {

        alert("Password must be at least 6 characters! 🔐");

        return;
    }


    const user = {
        name: name,
        email: email,
        password: password
    };


    localStorage.setItem(
        "gaganWearUser",
        JSON.stringify(user)
    );


    alert(
        "Account created successfully! 🎉\n\nWelcome to GAGAN WEAR, " +
        name + "!"
    );


    showLogin();


    document.getElementById("loginEmail").value = email;

    document.getElementById("loginPassword").value = "";

}


// ========================================
// LOGIN
// ========================================

function loginUser() {

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    const savedUser =
        localStorage.getItem("gaganWearUser");


    if (!savedUser) {

        alert(
            "No account found! Please sign up first. 📝"
        );

        showSignup();

        return;
    }


    const user = JSON.parse(savedUser);


    if (
        email === user.email &&
        password === user.password
    ) {

        alert(
            "Welcome back, " +
            user.name +
            "! 👋"
        );

        closeAuth();


        // Change account button
        const accountButton =
            document.querySelector(".account-btn");

        accountButton.textContent =
            "👤 " + user.name;

    } else {

        alert(
            "Incorrect email or password! ❌"
        );

    }

}


// ========================================
// CLOSE AUTH WHEN CLICKING OUTSIDE
// ========================================

document
    .getElementById("authOverlay")
    .addEventListener("click", function(event) {

        if (event.target === this) {

            closeAuth();

        }

    });