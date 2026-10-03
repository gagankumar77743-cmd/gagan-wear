// ======================================================
// GAGAN WEAR - MAIN JAVASCRIPT
// ======================================================

// ======================================================
// GOOGLE APPS SCRIPT ORDER API
// ======================================================

const ORDER_API_URL =
    "https://script.google.com/macros/s/AKfycbw0HwzDzU8OhHfEPgP6bMaG3HSvTcHDwAsUeA6SofEcAk5KsQJqW6DUfA1-sfoTKh8n/exec";


// ======================================================
// PRODUCTS
// ======================================================

const products = [
    {
        id: 1,
        name: "Oversized Black T-Shirt",
        price: 799,
        category: "T-Shirts",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"
    },

    {
        id: 2,
        name: "Premium White T-Shirt",
        price: 899,
        category: "T-Shirts",
        image: "https://images.unsplash.com/photo-1583743814966-8936f37f3840?w=800"
    },

    {
        id: 3,
        name: "Street Blue Jeans",
        price: 1499,
        category: "Jeans",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"
    },

    {
        id: 4,
        name: "Classic Denim Jacket",
        price: 1999,
        category: "Jackets",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"
    },

    {
        id: 5,
        name: "Black Street Jacket",
        price: 2299,
        category: "Jackets",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"
    },

    {
        id: 6,
        name: "Classic Sneakers",
        price: 2499,
        category: "Shoes",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
    },

    {
        id: 7,
        name: "White Lifestyle Shoes",
        price: 2199,
        category: "Shoes",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800"
    },

    {
        id: 8,
        name: "Urban Black Jeans",
        price: 1699,
        category: "Jeans",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800"
    }
];


// ======================================================
// LOCAL STORAGE
// ======================================================

let cart = JSON.parse(localStorage.getItem("gaganCart")) || [];

let wishlist =
    JSON.parse(localStorage.getItem("gaganWishlist")) || [];

let currentUser =
    JSON.parse(localStorage.getItem("gaganUser")) || null;


// ======================================================
// DOM ELEMENTS
// ======================================================

const productGrid =
    document.getElementById("productGrid");

const cartCount =
    document.getElementById("cartCount");

const wishlistCount =
    document.getElementById("wishlistCount");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const checkoutTotal =
    document.getElementById("checkoutTotal");

const cartDrawer =
    document.getElementById("cartDrawer");

const cartOverlay =
    document.getElementById("cartOverlay");

const checkoutModal =
    document.getElementById("checkoutModal");

const toast =
    document.getElementById("toast");


// ======================================================
// SAVE DATA
// ======================================================

function saveCart() {
    localStorage.setItem(
        "gaganCart",
        JSON.stringify(cart)
    );
}

function saveWishlist() {
    localStorage.setItem(
        "gaganWishlist",
        JSON.stringify(wishlist)
    );
}


// ======================================================
// MONEY FORMAT
// ======================================================

function formatPrice(price) {
    return "₹" + Number(price).toLocaleString("en-IN");
}


// ======================================================
// SHOW TOAST
// ======================================================

function showToast(message) {

    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


// ======================================================
// RENDER PRODUCTS
// ======================================================

function renderProducts(list = products) {

    if (!productGrid) return;

    if (list.length === 0) {

        productGrid.innerHTML = `
            <div class="no-products">
                <h3>No products found 😢</h3>
                <p>Try another search or category.</p>
            </div>
        `;

        return;
    }

    productGrid.innerHTML = list.map(product => {

        const isWishlisted =
            wishlist.includes(product.id);

        return `
            <div class="product-card">

                <div class="product-image">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                    >

                    <button
                        class="wishlist-btn ${isWishlisted ? "active" : ""}"
                        type="button"
                        onclick="toggleWishlist(${product.id})"
                        aria-label="Add to wishlist"
                    >
                        ${isWishlisted ? "♥" : "♡"}
                    </button>
                </div>

                <div class="product-info">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h3>
                        ${product.name}
                    </h3>

                    <div class="product-bottom">

                        <strong>
                            ${formatPrice(product.price)}
                        </strong>

                        <button
                            class="add-cart-btn"
                            type="button"
                            onclick="addToCart(${product.id})"
                        >
                            ADD TO CART
                        </button>

                    </div>

                </div>

            </div>
        `;
    }).join("");
}


// ======================================================
// ADD TO CART
// ======================================================

function addToCart(productId) {

    const product =
        products.find(p => p.id === productId);

    if (!product) return;

    const existingItem =
        cart.find(item => item.id === productId);

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();

    updateCart();

    showToast("🛒 Added to cart!");
}


// ======================================================
// REMOVE FROM CART
// ======================================================

function removeFromCart(productId) {

    cart =
        cart.filter(item => item.id !== productId);

    saveCart();

    updateCart();

    showToast("Item removed");
}


// ======================================================
// CHANGE QUANTITY
// ======================================================

function changeQuantity(productId, change) {

    const item =
        cart.find(item => item.id === productId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {

        cart =
            cart.filter(item => item.id !== productId);
    }

    saveCart();

    updateCart();
}


// ======================================================
// CALCULATE CART TOTAL
// ======================================================

function getCartTotal() {

    return cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );
}


// ======================================================
// UPDATE CART
// ======================================================

function updateCart() {

    if (cartCount) {

        const quantity =
            cart.reduce(
                (total, item) =>
                    total + item.quantity,
                0
            );

        cartCount.textContent = quantity;
    }

    if (wishlistCount) {

        wishlistCount.textContent =
            wishlist.length;
    }

    if (!cartItems) return;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty 🛒</h3>
                <p>Add something you like!</p>
            </div>
        `;

    } else {

        cartItems.innerHTML = cart.map(item => {

            return `
                <div class="cart-item">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                    <div class="cart-item-info">

                        <h4>
                            ${item.name}
                        </h4>

                        <p>
                            ${formatPrice(item.price)}
                        </p>

                        <div class="quantity-controls">

                            <button
                                type="button"
                                onclick="changeQuantity(${item.id}, -1)"
                            >
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                type="button"
                                onclick="changeQuantity(${item.id}, 1)"
                            >
                                +
                            </button>

                        </div>

                    </div>

                    <button
                        class="remove-item"
                        type="button"
                        onclick="removeFromCart(${item.id})"
                    >
                        ×
                    </button>

                </div>
            `;

        }).join("");
    }

    const total =
        getCartTotal();

    if (cartTotal) {

        cartTotal.textContent =
            formatPrice(total);
    }

    if (checkoutTotal) {

        checkoutTotal.textContent =
            formatPrice(total);
    }
}


// ======================================================
// OPEN CART
// ======================================================

function openCart() {

    if (cartDrawer) {
        cartDrawer.classList.add("active");
    }

    if (cartOverlay) {
        cartOverlay.classList.add("active");
    }
}


// ======================================================
// CLOSE CART
// ======================================================

function closeCart() {

    if (cartDrawer) {
        cartDrawer.classList.remove("active");
    }

    if (cartOverlay) {
        cartOverlay.classList.remove("active");
    }
}


// ======================================================
// WISHLIST
// ======================================================

function toggleWishlist(productId) {

    if (wishlist.includes(productId)) {

        wishlist =
            wishlist.filter(id => id !== productId);

        showToast("💔 Removed from wishlist");

    } else {

        wishlist.push(productId);

        showToast("❤️ Added to wishlist");
    }

    saveWishlist();

    renderProducts();

    updateCart();
}


// ======================================================
// SEARCH
// ======================================================

function searchProducts() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) return;

    const query =
        searchInput.value
            .toLowerCase()
            .trim();

    const filtered =
        products.filter(product =>

            product.name
                .toLowerCase()
                .includes(query)

            ||

            product.category
                .toLowerCase()
                .includes(query)
        );

    renderProducts(filtered);
}


// ======================================================
// CATEGORY FILTER
// ======================================================

function filterCategory(category) {

    if (!category || category === "All") {

        renderProducts(products);

        return;
    }

    const filtered =
        products.filter(
            product =>
                product.category === category
        );

    renderProducts(filtered);
}


// ======================================================
// SORT PRODUCTS
// ======================================================

function sortProducts(value) {

    let sorted =
        [...products];

    if (value === "price-low") {

        sorted.sort(
            (a, b) =>
                a.price - b.price
        );

    } else if (value === "price-high") {

        sorted.sort(
            (a, b) =>
                b.price - a.price
        );

    } else if (value === "name") {

        sorted.sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );
    }

    renderProducts(sorted);
}


// ======================================================
// CHECKOUT
// ======================================================

function openCheckout() {

    if (cart.length === 0) {

        showToast("🛒 Your cart is empty!");

        return;
    }

    closeCart();

    if (checkoutModal) {

        checkoutModal.classList.add("active");
    }

    if (checkoutTotal) {

        checkoutTotal.textContent =
            formatPrice(getCartTotal());
    }
}


// ======================================================
// CLOSE CHECKOUT
// ======================================================

function closeCheckout() {

    if (checkoutModal) {

        checkoutModal.classList.remove("active");
    }
}


// ======================================================
// PLACE ORDER
// ======================================================

async function placeOrder(event) {

    event.preventDefault();

    // --------------------------------------------------
    // GET FORM VALUES
    // --------------------------------------------------

    const customerName =
        document
            .getElementById("customerName")
            ?.value
            .trim();

    const customerEmail =
        document
            .getElementById("customerEmail")
            ?.value
            .trim();

    const customerPhone =
        document
            .getElementById("customerPhone")
            ?.value
            .trim();

    const customerAddress =
        document
            .getElementById("customerAddress")
            ?.value
            .trim();

    const paymentMethod =
        document
            .getElementById("paymentMethod")
            ?.value;


    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!customerName) {

        showToast("Please enter your name.");

        return;
    }


    if (!customerEmail) {

        showToast("Please enter your email.");

        return;
    }


    // Basic email validation

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(customerEmail)) {

        showToast("Please enter a valid email.");

        return;
    }


    if (!customerPhone) {

        showToast("Please enter your phone number.");

        return;
    }


    const cleanPhone =
        customerPhone.replace(/\D/g, "");

    if (cleanPhone.length < 10) {

        showToast(
            "Please enter a valid phone number."
        );

        return;
    }


    if (!customerAddress) {

        showToast("Please enter your address.");

        return;
    }


    if (!paymentMethod) {

        showToast(
            "Please select a payment method."
        );

        return;
    }


    if (cart.length === 0) {

        showToast("Your cart is empty.");

        closeCheckout();

        return;
    }


    // --------------------------------------------------
    // CALCULATE TOTAL
    // --------------------------------------------------

    const total =
        getCartTotal();


    // --------------------------------------------------
    // PREPARE ITEMS
    // --------------------------------------------------

    const orderItems =
        cart.map(item => {

            return {
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                subtotal:
                    item.price * item.quantity
            };

        });


    // --------------------------------------------------
    // PREPARE ORDER
    // --------------------------------------------------

    const orderData = {

        customer:
            customerName,

        email:
            customerEmail,

        phone:
            cleanPhone,

        address:
            customerAddress,

        items:
            orderItems,

        total:
            total,

        payment:
            paymentMethod === "cod"
                ? "Cash on Delivery"
                : paymentMethod

    };


    // --------------------------------------------------
    // BUTTON
    // --------------------------------------------------

    const placeOrderBtn =
        document.getElementById(
            "placeOrderBtn"
        );

    const checkoutStatus =
        document.getElementById(
            "checkoutStatus"
        );


    if (placeOrderBtn) {

        placeOrderBtn.disabled = true;

        placeOrderBtn.textContent =
            "PLACING ORDER...";
    }


    if (checkoutStatus) {

        checkoutStatus.style.display =
            "block";

        checkoutStatus.textContent =
            "Sending your order...";
    }


    // --------------------------------------------------
    // SEND TO GOOGLE APPS SCRIPT
    // --------------------------------------------------

    try {

        await fetch(
            ORDER_API_URL,
            {
                method: "POST",

                mode: "no-cors",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body:
                    JSON.stringify(orderData)
            }
        );


        // ------------------------------------------------
        // SUCCESS UI
        // ------------------------------------------------

        cart = [];

        saveCart();

        updateCart();


        if (checkoutStatus) {

            checkoutStatus.textContent =
                "✅ Order request sent successfully!";
        }


        if (placeOrderBtn) {

            placeOrderBtn.textContent =
                "ORDER PLACED ✓";
        }


        showToast(
            "🎉 Order request sent successfully!"
        );


        // Clear form

        const checkoutForm =
            document.getElementById(
                "checkoutForm"
            );

        if (checkoutForm) {

            checkoutForm.reset();
        }


        // Close after a short delay

        setTimeout(() => {

            closeCheckout();

            if (placeOrderBtn) {

                placeOrderBtn.disabled =
                    false;

                placeOrderBtn.textContent =
                    "PLACE ORDER";
            }

            if (checkoutStatus) {

                checkoutStatus.style.display =
                    "none";
            }

        }, 1800);


    } catch (error) {

        console.error(
            "ORDER ERROR:",
            error
        );


        if (checkoutStatus) {

            checkoutStatus.style.display =
                "block";

            checkoutStatus.textContent =
                "❌ Something went wrong. Please try again.";
        }


        showToast(
            "❌ Could not send the order."
        );


        if (placeOrderBtn) {

            placeOrderBtn.disabled =
                false;

            placeOrderBtn.textContent =
                "PLACE ORDER";
        }
    }
}


// ======================================================
// DARK / LIGHT MODE
// ======================================================

function toggleTheme() {

    document.body.classList.toggle(
        "dark-mode"
    );

    const isDark =
        document.body.classList.contains(
            "dark-mode"
        );

    localStorage.setItem(
        "gaganTheme",
        isDark ? "dark" : "light"
    );
}


// ======================================================
// LOAD THEME
// ======================================================

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "gaganTheme"
        );

    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );
    }
}


// ======================================================
// MOBILE MENU
// ======================================================

function toggleMobileMenu() {

    const navMenu =
        document.querySelector(
            ".nav-menu"
        );

    if (!navMenu) return;

    navMenu.classList.toggle(
        "active"
    );
}


// ======================================================
// LOGIN / SIGNUP
// ======================================================

function openAuth() {

    const authModal =
        document.getElementById(
            "authModal"
        );

    if (authModal) {

        authModal.classList.add(
            "active"
        );
    }
}


function closeAuth() {

    const authModal =
        document.getElementById(
            "authModal"
        );

    if (authModal) {

        authModal.classList.remove(
            "active"
        );
    }
}


// ======================================================
// SIGNUP
// ======================================================

function signupUser(event) {

    event.preventDefault();

    const name =
        document.getElementById(
            "signupName"
        )?.value.trim();

    const email =
        document.getElementById(
            "signupEmail"
        )?.value.trim();

    const password =
        document.getElementById(
            "signupPassword"
        )?.value;


    if (!name || !email || !password) {

        showToast(
            "Please fill all signup fields."
        );

        return;
    }


    const user = {

        name:
            name,

        email:
            email,

        password:
            password
    };


    localStorage.setItem(
        "gaganUser",
        JSON.stringify(user)
    );


    currentUser =
        user;


    showToast(
        "🎉 Account created!"
    );


    closeAuth();
}


// ======================================================
// LOGIN
// ======================================================

function loginUser(event) {

    event.preventDefault();

    const email =
        document.getElementById(
            "loginEmail"
        )?.value.trim();

    const password =
        document.getElementById(
            "loginPassword"
        )?.value;


    const savedUser =
        JSON.parse(
            localStorage.getItem(
                "gaganUser"
            )
        );


    if (!savedUser) {

        showToast(
            "No account found. Please sign up."
        );

        return;
    }


    if (
        savedUser.email === email &&
        savedUser.password === password
    ) {

        currentUser =
            savedUser;

        showToast(
            "👋 Welcome back, " +
            savedUser.name
        );

        closeAuth();

    } else {

        showToast(
            "❌ Wrong email or password."
        );
    }
}


// ======================================================
// LOGOUT
// ======================================================

function logoutUser() {

    localStorage.removeItem(
        "gaganUser"
    );

    currentUser = null;

    showToast(
        "Logged out successfully."
    );
}


// ======================================================
// CLOSE MODALS WHEN CLICKING OUTSIDE
// ======================================================

window.addEventListener(
    "click",
    function(event) {

        if (
            event.target === checkoutModal
        ) {

            closeCheckout();
        }

        const authModal =
            document.getElementById(
                "authModal"
            );

        if (
            authModal &&
            event.target === authModal
        ) {

            closeAuth();
        }
    }
);


// ======================================================
// KEYBOARD ESC
// ======================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeCart();

            closeCheckout();

            closeAuth();
        }
    }
);


// ======================================================
// EVENT LISTENERS
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // Load theme

        loadTheme();


        // Render products

        renderProducts();


        // Update cart

        updateCart();


        // ----------------------------------------------
        // SEARCH
        // ----------------------------------------------

        const searchInput =
            document.getElementById(
                "searchInput"
            );

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchProducts
            );
        }


        // ----------------------------------------------
        // CART BUTTON
        // ----------------------------------------------

        const cartBtn =
            document.getElementById(
                "cartBtn"
            );

        if (cartBtn) {

            cartBtn.addEventListener(
                "click",
                openCart
            );
        }


        // ----------------------------------------------
        // CLOSE CART
        // ----------------------------------------------

        const closeCartBtn =
            document.getElementById(
                "closeCart"
            );

        if (closeCartBtn) {

            closeCartBtn.addEventListener(
                "click",
                closeCart
            );
        }


        // ----------------------------------------------
        // CART OVERLAY
        // ----------------------------------------------

        if (cartOverlay) {

            cartOverlay.addEventListener(
                "click",
                closeCart
            );
        }


        // ----------------------------------------------
        // CHECKOUT BUTTON
        // ----------------------------------------------

        const checkoutBtn =
            document.getElementById(
                "checkoutBtn"
            );

        if (checkoutBtn) {

            checkoutBtn.addEventListener(
                "click",
                openCheckout
            );
        }


        // ----------------------------------------------
        // CLOSE CHECKOUT
        // ----------------------------------------------

        const closeCheckoutBtn =
            document.getElementById(
                "closeCheckout"
            );

        if (closeCheckoutBtn) {

            closeCheckoutBtn.addEventListener(
                "click",
                closeCheckout
            );
        }


        // ----------------------------------------------
        // CHECKOUT FORM
        // ----------------------------------------------

        const checkoutForm =
            document.getElementById(
                "checkoutForm"
            );

        if (checkoutForm) {

            checkoutForm.addEventListener(
                "submit",
                placeOrder
            );
        }


        // ----------------------------------------------
        // AUTH BUTTON
        // ----------------------------------------------

        const signupBtn =
            document.getElementById(
                "signupBtn"
            );

        if (signupBtn) {

            signupBtn.addEventListener(
                "click",
                openAuth
            );
        }


        const loginBtn =
            document.getElementById(
                "loginBtn"
            );

        if (loginBtn) {

            loginBtn.addEventListener(
                "click",
                openAuth
            );
        }


        // ----------------------------------------------
        // CLOSE AUTH
        // ----------------------------------------------

        const closeAuthBtn =
            document.getElementById(
                "closeAuth"
            );

        if (closeAuthBtn) {

            closeAuthBtn.addEventListener(
                "click",
                closeAuth
            );
        }


        // ----------------------------------------------
        // LOGIN FORM
        // ----------------------------------------------

        const loginForm =
            document.getElementById(
                "loginForm"
            );

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                loginUser
            );
        }


        // ----------------------------------------------
        // SIGNUP FORM
        // ----------------------------------------------

        const signupForm =
            document.getElementById(
                "signupForm"
            );

        if (signupForm) {

            signupForm.addEventListener(
                "submit",
                signupUser
            );
        }


        // ----------------------------------------------
        // SHOW SIGNUP
        // ----------------------------------------------

        const showSignup =
            document.getElementById(
                "showSignup"
            );

        if (showSignup) {

            showSignup.addEventListener(
                "click",
                function() {

                    const loginBox =
                        document.getElementById(
                            "loginBox"
                        );

                    const signupBox =
                        document.getElementById(
                            "signupBox"
                        );

                    if (loginBox)
                        loginBox.style.display =
                            "none";

                    if (signupBox)
                        signupBox.style.display =
                            "block";
                }
            );
        }


        // ----------------------------------------------
        // SHOW LOGIN
        // ----------------------------------------------

        const showLogin =
            document.getElementById(
                "showLogin"
            );

        if (showLogin) {

            showLogin.addEventListener(
                "click",
                function() {

                    const loginBox =
                        document.getElementById(
                            "loginBox"
                        );

                    const signupBox =
                        document.getElementById(
                            "signupBox"
                        );

                    if (signupBox)
                        signupBox.style.display =
                            "none";

                    if (loginBox)
                        loginBox.style.display =
                            "block";
                }
            );
        }


        // ----------------------------------------------
        // INITIAL USER
        // ----------------------------------------------

        if (currentUser) {

            console.log(
                "Logged in as:",
                currentUser.name
            );
        }

    }
);
