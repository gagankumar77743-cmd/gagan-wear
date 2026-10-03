const products = [

    {
        id: 1,
        name: "Oversized Black T-Shirt",
        category: "T-Shirts",
        price: 799,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85"
    },

    {
        id: 2,
        name: "Premium White T-Shirt",
        category: "T-Shirts",
        price: 899,
        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=700&q=85"
    },

    {
        id: 3,
        name: "Street Blue Jeans",
        category: "Jeans",
        price: 1499,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=85"
    },

    {
        id: 4,
        name: "Classic Denim Jacket",
        category: "Jackets",
        price: 1999,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=85"
    },

    {
        id: 5,
        name: "Black Street Jacket",
        category: "Jackets",
        price: 2299,
        image: "https://images.unsplash.com/photo-1520975958225-8e4b4b4f2d7b?auto=format&fit=crop&w=700&q=85"
    },

    {
        id: 6,
        name: "Classic Sneakers",
        category: "Shoes",
        price: 2499,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"
    },

    {
        id: 7,
        name: "White Lifestyle Shoes",
        category: "Shoes",
        price: 2199,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=85"
    },

    {
        id: 8,
        name: "Urban Black Jeans",
        category: "Jeans",
        price: 1699,
        image: "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?auto=format&fit=crop&w=700&q=85"
    }

];


let cart = JSON.parse(localStorage.getItem("gaganCart")) || [];

let wishlist =
    JSON.parse(localStorage.getItem("gaganWishlist")) || [];

let currentCategory = "All";


const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const wishlistCount = document.getElementById("wishlistCount");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");


/* FORMAT PRICE */

function money(value) {
    return "₹" + value.toLocaleString("en-IN");
}


/* TOAST */

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);

}


/* SAVE */

function saveData() {

    localStorage.setItem(
        "gaganCart",
        JSON.stringify(cart)
    );

    localStorage.setItem(
        "gaganWishlist",
        JSON.stringify(wishlist)
    );

}


/* PRODUCT DISPLAY */

function displayProducts() {

    let search =
        document.getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    let sort =
        document.getElementById("sortSelect").value;


    let filtered = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search);

        const matchesCategory =
            currentCategory === "All" ||
            product.category === currentCategory;

        return matchesSearch && matchesCategory;

    });


    if (sort === "low") {

        filtered.sort((a, b) =>
            a.price - b.price
        );

    }

    if (sort === "high") {

        filtered.sort((a, b) =>
            b.price - a.price
        );

    }

    if (sort === "name") {

        filtered.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    }


    productGrid.innerHTML = "";


    if (filtered.length === 0) {

        productGrid.innerHTML = `
            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:70px 20px;
                color:var(--muted);
            ">
                <h2>No products found 😕</h2>
                <p>Try another search.</p>
            </div>
        `;

        return;

    }


    filtered.forEach(product => {

        const isWishlisted =
            wishlist.includes(product.id);

        productGrid.innerHTML += `

            <article class="product">

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                    >

                    <button
                        class="wishlist ${isWishlisted ? "active" : ""}"
                        onclick="toggleWishlist(${product.id})"
                    >
                        ${isWishlisted ? "❤️" : "♡"}
                    </button>

                </div>

                <div class="product-info">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h3>${product.name}</h3>

                    <div class="product-price">
                        ${money(product.price)}
                    </div>

                    <button
                        class="add-btn"
                        onclick="addToCart(${product.id})"
                    >
                        ADD TO CART
                    </button>

                </div>

            </article>

        `;

    });


    document.getElementById("activeFilter").textContent =
        currentCategory === "All"
            ? `Showing ${filtered.length} products`
            : `${currentCategory} • ${filtered.length} products`;

}


/* ADD CART */

function addToCart(id) {

    const existing = cart.find(
        item => item.id === id
    );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            id: id,
            quantity: 1
        });

    }


    saveData();
    updateCart();

    showToast("Added to cart 🛒");

}


/* CHANGE QUANTITY */

function changeQuantity(id, amount) {

    const item = cart.find(
        item => item.id === id
    );

    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart = cart.filter(
            item => item.id !== id
        );

    }


    saveData();
    updateCart();

}


/* REMOVE */

function removeFromCart(id) {

    cart = cart.filter(
        item => item.id !== id
    );

    saveData();
    updateCart();

    showToast("Removed from cart");

}


/* UPDATE CART */

function updateCart() {

    let totalItems = 0;
    let totalPrice = 0;


    cart.forEach(item => {

        const product =
            products.find(p => p.id === item.id);

        if (!product) return;

        totalItems += item.quantity;

        totalPrice +=
            product.price * item.quantity;

    });


    cartCount.textContent = totalItems;

    cartTotal.textContent =
        money(totalPrice);


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <div style="font-size:50px">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add something you like!</p>
            </div>
        `;

        return;

    }


    cart.forEach(item => {

        const product =
            products.find(p => p.id === item.id);

        if (!product) return;


        cartItems.innerHTML += `

            <div class="cart-item">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div>

                    <h4>${product.name}</h4>

                    <div class="cart-item-price">
                        ${money(product.price)}
                    </div>

                    <div class="quantity">

                        <button
                            onclick="changeQuantity(${product.id}, -1)"
                        >
                            −
                        </button>

                        <strong>
                            ${item.quantity}
                        </strong>

                        <button
                            onclick="changeQuantity(${product.id}, 1)"
                        >
                            +
                        </button>

                        <button
                            class="remove-item"
                            onclick="removeFromCart(${product.id})"
                        >
                            Remove
                        </button>

                    </div>

                </div>

            </div>

        `;

    });

}


/* CART OPEN/CLOSE */

function openCart() {

    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");

}

function closeCart() {

    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");

}


document.getElementById("cartBtn")
    .addEventListener("click", openCart);

document.getElementById("closeCart")
    .addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);


/* WISHLIST */

function toggleWishlist(id) {

    if (wishlist.includes(id)) {

        wishlist =
            wishlist.filter(item => item !== id);

        showToast("Removed from wishlist");

    } else {

        wishlist.push(id);

        showToast("Added to wishlist ❤️");

    }


    saveData();

    updateWishlist();

    displayProducts();

}


function updateWishlist() {

    wishlistCount.textContent =
        wishlist.length;

}


document.getElementById("wishlistBtn")
    .addEventListener("click", () => {

        const wishlistProducts =
            products.filter(p =>
                wishlist.includes(p.id)
            );

        if (wishlistProducts.length === 0) {

            showToast("Your wishlist is empty ❤️");
            return;

        }

        document.getElementById("searchInput").value = "";

        currentCategory = "All";

        productGrid.scrollIntoView({
            behavior: "smooth"
        });

        showToast(
            `${wishlistProducts.length} item(s) in your wishlist ❤️`
        );

    });


/* CATEGORY FILTER */

document.querySelectorAll(".category-card")
    .forEach(card => {

        card.addEventListener("click", () => {

            currentCategory =
                card.dataset.category;

            displayProducts();

            document.getElementById("products")
                .scrollIntoView({
                    behavior: "smooth"
                });

        });

    });


/* SEARCH */

document.getElementById("searchInput")
    .addEventListener("input", displayProducts);


/* SORT */

document.getElementById("sortSelect")
    .addEventListener("change", displayProducts);


/* ALL PRODUCTS */

document.getElementById("allProductsBtn")
    .addEventListener("click", () => {

        currentCategory = "All";

        document.getElementById("searchInput").value = "";

        displayProducts();

    });


/* THEME */

const savedTheme =
    localStorage.getItem("gaganTheme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

}


function updateThemeIcon() {

    document.getElementById("themeBtn").textContent =
        document.body.classList.contains("dark")
            ? "☀️"
            : "🌙";

}


document.getElementById("themeBtn")
    .addEventListener("click", () => {

        document.body.classList.toggle("dark");

        localStorage.setItem(
            "gaganTheme",
            document.body.classList.contains("dark")
                ? "dark"
                : "light"
        );

        updateThemeIcon();

    });


updateThemeIcon();


/* MOBILE MENU */

document.getElementById("menuBtn")
    .addEventListener("click", () => {

        document.getElementById("navMenu")
            .classList.toggle("active");

    });


/* CHECKOUT */

const checkoutModal =
    document.getElementById("checkoutModal");


document.getElementById("checkoutBtn")
    .addEventListener("click", () => {

        if (cart.length === 0) {

            showToast("Your cart is empty 🛒");
            return;

        }


        let total = 0;

        cart.forEach(item => {

            const product =
                products.find(p => p.id === item.id);

            total +=
                product.price * item.quantity;

        });


        document.getElementById("checkoutTotal")
            .textContent = money(total);

        checkoutModal.classList.add("active");

    });


document.getElementById("closeCheckout")
    .addEventListener("click", () => {

        checkoutModal.classList.remove("active");

    });


document.getElementById("checkoutForm")
    .addEventListener("submit", event => {

        event.preventDefault();


        const payment =
            document.getElementById("paymentMethod").value;


        if (payment === "online") {

            showToast(
                "Online payment is coming soon 💳"
            );

            return;

        }


        const orderNumber =
            "GW" +
            Math.floor(
                100000 + Math.random() * 900000
            );


        checkoutModal.classList.remove("active");

        cart = [];

        saveData();
        updateCart();

        closeCart();

        event.target.reset();


        alert(
            `🎉 Order placed successfully!\n\nOrder ID: ${orderNumber}\n\nThank you for shopping with GAGAN WEAR!`
        );

    });


/* ACCOUNT */

const authModal =
    document.getElementById("authModal");


document.getElementById("accountBtn")
    .addEventListener("click", () => {

        authModal.classList.add("active");

    });


document.getElementById("closeAuth")
    .addEventListener("click", () => {

        authModal.classList.remove("active");

    });


/* LOGIN / SIGNUP SWITCH */

document.getElementById("showSignup")
    .addEventListener("click", () => {

        document.getElementById("loginForm")
            .classList.add("hidden");

        document.getElementById("signupForm")
            .classList.remove("hidden");

    });


document.getElementById("showLogin")
    .addEventListener("click", () => {

        document.getElementById("signupForm")
            .classList.add("hidden");

        document.getElementById("loginForm")
            .classList.remove("hidden");

    });


/* DEMO SIGNUP */

document.getElementById("signupBtn")
    .addEventListener("click", () => {

        const name =
            document.getElementById("signupName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value;


        if (!name || !email || !password) {

            showToast("Please fill all fields");

            return;

        }


        localStorage.setItem(
            "gaganUser",
            JSON.stringify({
                name,
                email,
                password
            })
        );


        showToast("Account created 🎉");


        document.getElementById("signupForm")
            .classList.add("hidden");

        document.getElementById("loginForm")
            .classList.remove("hidden");

    });


/* DEMO LOGIN */

document.getElementById("loginBtn")
    .addEventListener("click", () => {

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        const user =
            JSON.parse(
                localStorage.getItem("gaganUser")
            );


        if (!user) {

            showToast(
                "Create an account first"
            );

            return;

        }


        if (
            email === user.email &&
            password === user.password
        ) {

            authModal.classList.remove("active");

            showToast(
                `Welcome back, ${user.name}! 👋`
            );

        } else {

            showToast(
                "Incorrect email or password"
            );

        }

    });


/* INITIAL LOAD */

displayProducts();
updateCart();
updateWishlist();