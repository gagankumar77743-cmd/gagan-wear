/* =========================================================
   GAGAN WEAR - FULL SCRIPT
   Cart + Wishlist + Search + Categories + Checkout
   + Google Sheets Order Management
   ========================================================= */


/* =========================================================
   PRODUCTS
   ========================================================= */

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


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

let cart =
    JSON.parse(localStorage.getItem("gaganCart")) || [];

let wishlist =
    JSON.parse(localStorage.getItem("gaganWishlist")) || [];

let currentCategory = "All";


/* =========================================================
   GOOGLE SHEETS ORDER API
   ========================================================= */

const ORDER_API_URL =
    "https://script.google.com/macros/s/AKfycbw0HwzDzU8OhHfEPgP6bMaG3HSvTcHDwAsUeA6SofEcAk5KsQJqW6DUfA1-sfoTKh8n/exec";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const productGrid =
    document.getElementById("productGrid");

const cartCount =
    document.getElementById("cartCount");

const wishlistCount =
    document.getElementById("wishlistCount");

const cartDrawer =
    document.getElementById("cartDrawer");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const toast =
    document.getElementById("toast");


/* =========================================================
   FORMAT PRICE
   ========================================================= */

function money(value) {

    return "₹" +
        Number(value).toLocaleString("en-IN");

}


/* =========================================================
   TOAST MESSAGE
   ========================================================= */

function showToast(message) {

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2200);

}


/* =========================================================
   SAVE CART + WISHLIST
   ========================================================= */

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


/* =========================================================
   DISPLAY PRODUCTS
   ========================================================= */

function displayProducts() {

    if (!productGrid) return;


    const searchInput =
        document.getElementById("searchInput");

    const sortSelect =
        document.getElementById("sortSelect");


    const search =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    const sort =
        sortSelect
            ? sortSelect.value
            : "default";


    let filtered =
        products.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search) ||

                product.category
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =
                currentCategory === "All" ||

                product.category ===
                currentCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    /* SORT */

    if (sort === "low") {

        filtered.sort(
            (a, b) => a.price - b.price
        );

    }


    if (sort === "high") {

        filtered.sort(
            (a, b) => b.price - a.price
        );

    }


    if (sort === "name") {

        filtered.sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );

    }


    productGrid.innerHTML = "";


    /* NO RESULTS */

    if (filtered.length === 0) {

        productGrid.innerHTML = `

            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:70px 20px;
                color:var(--muted);
            ">

                <h2>No products found 😕</h2>

                <p>
                    Try another search.
                </p>

            </div>

        `;

        return;

    }


    /* PRODUCT CARDS */

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

                        ${
                            isWishlisted
                                ? "❤️"
                                : "♡"
                        }

                    </button>

                </div>


                <div class="product-info">

                    <span class="product-category">

                        ${product.category}

                    </span>


                    <h3>

                        ${product.name}

                    </h3>


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


    const activeFilter =
        document.getElementById("activeFilter");


    if (activeFilter) {

        activeFilter.textContent =

            currentCategory === "All"

                ? `Showing ${filtered.length} products`

                : `${currentCategory} • ${filtered.length} products`;

    }

}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(id) {

    const existing =
        cart.find(item => item.id === id);


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


/* =========================================================
   CHANGE QUANTITY
   ========================================================= */

function changeQuantity(id, amount) {

    const item =
        cart.find(item => item.id === id);


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== id
            );

    }


    saveData();

    updateCart();

}


/* =========================================================
   REMOVE FROM CART
   ========================================================= */

function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );


    saveData();

    updateCart();

    showToast("Removed from cart");

}


/* =========================================================
   UPDATE CART
   ========================================================= */

function updateCart() {

    if (!cartCount ||
        !cartTotal ||
        !cartItems) {

        return;

    }


    let totalItems = 0;

    let totalPrice = 0;


    cart.forEach(item => {

        const product =
            products.find(
                p => p.id === item.id
            );


        if (!product) return;


        totalItems +=
            item.quantity;


        totalPrice +=
            product.price *
            item.quantity;

    });


    cartCount.textContent =
        totalItems;


    cartTotal.textContent =
        money(totalPrice);


    cartItems.innerHTML = "";


    /* EMPTY CART */

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div style="font-size:50px">

                    🛒

                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add something you like!
                </p>

            </div>

        `;

        return;

    }


    /* CART ITEMS */

    cart.forEach(item => {

        const product =
            products.find(
                p => p.id === item.id
            );


        if (!product) return;


        cartItems.innerHTML += `

            <div class="cart-item">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >


                <div>

                    <h4>
                        ${product.name}
                    </h4>


                    <div class="cart-item-price">

                        ${money(product.price)}

                    </div>


                    <div class="quantity">

                        <button
                            onclick="changeQuantity(
                                ${product.id},
                                -1
                            )"
                        >

                            −

                        </button>


                        <strong>

                            ${item.quantity}

                        </strong>


                        <button
                            onclick="changeQuantity(
                                ${product.id},
                                1
                            )"
                        >

                            +

                        </button>


                        <button
                            class="remove-item"
                            onclick="removeFromCart(
                                ${product.id}
                            )"
                        >

                            Remove

                        </button>

                    </div>

                </div>

            </div>

        `;

    });

}


/* =========================================================
   CART OPEN
   ========================================================= */

function openCart() {

    if (!cartDrawer ||
        !cartOverlay) return;


    cartDrawer.classList.add("active");

    cartOverlay.classList.add("active");

}


/* =========================================================
   CART CLOSE
   ========================================================= */

function closeCart() {

    if (!cartDrawer ||
        !cartOverlay) return;


    cartDrawer.classList.remove("active");

    cartOverlay.classList.remove("active");

}


/* =========================================================
   CART BUTTONS
   ========================================================= */

const cartBtn =
    document.getElementById("cartBtn");

const closeCartBtn =
    document.getElementById("closeCart");


if (cartBtn) {

    cartBtn.addEventListener(
        "click",
        openCart
    );

}


if (closeCartBtn) {

    closeCartBtn.addEventListener(
        "click",
        closeCart
    );

}


if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        closeCart
    );

}


/* =========================================================
   WISHLIST
   ========================================================= */

function toggleWishlist(id) {

    if (wishlist.includes(id)) {

        wishlist =
            wishlist.filter(
                item => item !== id
            );


        showToast(
            "Removed from wishlist"
        );

    } else {

        wishlist.push(id);


        showToast(
            "Added to wishlist ❤️"
        );

    }


    saveData();

    updateWishlist();

    displayProducts();

}


/* =========================================================
   UPDATE WISHLIST
   ========================================================= */

function updateWishlist() {

    if (!wishlistCount) return;


    wishlistCount.textContent =
        wishlist.length;

}


/* =========================================================
   WISHLIST BUTTON
   ========================================================= */

const wishlistBtn =
    document.getElementById(
        "wishlistBtn"
    );


if (wishlistBtn) {

    wishlistBtn.addEventListener(
        "click",
        () => {

            const wishlistProducts =
                products.filter(
                    p =>
                        wishlist.includes(p.id)
                );


            if (
                wishlistProducts.length === 0
            ) {

                showToast(
                    "Your wishlist is empty ❤️"
                );

                return;

            }


            const searchInput =
                document.getElementById(
                    "searchInput"
                );


            if (searchInput) {

                searchInput.value = "";

            }


            currentCategory =
                "All";


            displayProducts();


            if (productGrid) {

                productGrid.scrollIntoView({

                    behavior: "smooth"

                });

            }


            showToast(
                `${wishlistProducts.length} item(s) in your wishlist ❤️`
            );

        }
    );

}


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

document
    .querySelectorAll(".category-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                currentCategory =
                    card.dataset.category;


                displayProducts();


                const productsSection =
                    document.getElementById(
                        "products"
                    );


                if (productsSection) {

                    productsSection.scrollIntoView({

                        behavior: "smooth"

                    });

                }

            }
        );

    });


/* =========================================================
   SEARCH
   ========================================================= */

const searchInput =
    document.getElementById(
        "searchInput"
    );


if (searchInput) {

    searchInput.addEventListener(
        "input",
        displayProducts
    );

}


/* =========================================================
   SORT
   ========================================================= */

const sortSelect =
    document.getElementById(
        "sortSelect"
    );


if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        displayProducts
    );

}


/* =========================================================
   ALL PRODUCTS
   ========================================================= */

const allProductsBtn =
    document.getElementById(
        "allProductsBtn"
    );


if (allProductsBtn) {

    allProductsBtn.addEventListener(
        "click",
        () => {

            currentCategory =
                "All";


            if (searchInput) {

                searchInput.value = "";

            }


            displayProducts();

        }
    );

}


/* =========================================================
   DARK / LIGHT MODE
   ========================================================= */

const savedTheme =
    localStorage.getItem(
        "gaganTheme"
    );


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark"
    );

}


function updateThemeIcon() {

    const themeBtn =
        document.getElementById(
            "themeBtn"
        );


    if (!themeBtn) return;


    themeBtn.textContent =

        document.body.classList.contains(
            "dark"
        )

            ? "☀️"

            : "🌙";

}


const themeBtn =
    document.getElementById(
        "themeBtn"
    );


if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );


            localStorage.setItem(
                "gaganTheme",

                document.body.classList.contains(
                    "dark"
                )
                    ? "dark"
                    : "light"
            );


            updateThemeIcon();

        }
    );

}


updateThemeIcon();


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuBtn =
    document.getElementById(
        "menuBtn"
    );


const navMenu =
    document.getElementById(
        "navMenu"
    );


if (menuBtn && navMenu) {

    menuBtn.addEventListener(
        "click",
        () => {

            navMenu.classList.toggle(
                "active"
            );

        }
    );

}


/* =========================================================
   CHECKOUT
   ========================================================= */

const checkoutModal =
    document.getElementById(
        "checkoutModal"
    );


const checkoutBtn =
    document.getElementById(
        "checkoutBtn"
    );


/* =========================================================
   OPEN CHECKOUT
   ========================================================= */

if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                showToast(
                    "Your cart is empty 🛒"
                );

                return;

            }


            let total = 0;


            cart.forEach(item => {

                const product =
                    products.find(
                        p => p.id === item.id
                    );


                if (product) {

                    total +=
                        product.price *
                        item.quantity;

                }

            });


            const checkoutTotal =
                document.getElementById(
                    "checkoutTotal"
                );


            if (checkoutTotal) {

                checkoutTotal.textContent =
                    money(total);

            }


            if (checkoutModal) {

                checkoutModal.classList.add(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   CLOSE CHECKOUT
   ========================================================= */

const closeCheckout =
    document.getElementById(
        "closeCheckout"
    );


if (closeCheckout) {

    closeCheckout.addEventListener(
        "click",
        () => {

            if (checkoutModal) {

                checkoutModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   PLACE ORDER
   ========================================================= */

const checkoutForm =
    document.getElementById(
        "checkoutForm"
    );


if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            /* CUSTOMER DETAILS */

            const customerInput =
                document.getElementById(
                    "customerName"
                );


            const phoneInput =
                document.getElementById(
                    "customerPhone"
                );


            const addressInput =
                document.getElementById(
                    "customerAddress"
                );


            const paymentInput =
                document.getElementById(
                    "paymentMethod"
                );


            const customer =
                customerInput
                    ? customerInput.value.trim()
                    : "";


            const phone =
                phoneInput
                    ? phoneInput.value.trim()
                    : "";


            const address =
                addressInput
                    ? addressInput.value.trim()
                    : "";


            const payment =
                paymentInput
                    ? paymentInput.value
                    : "cod";


            /* VALIDATION */

            if (
                !customer ||
                !phone ||
                !address
            ) {

                showToast(
                    "Please fill all delivery details"
                );

                return;

            }


            /* PHONE VALIDATION */

            const phoneDigits =
                phone.replace(
                    /\D/g,
                    ""
                );


            if (
                phoneDigits.length < 10
            ) {

                showToast(
                    "Please enter a valid phone number"
                );

                return;

            }


            /* ONLINE PAYMENT */

            if (
                payment === "online"
            ) {

                showToast(
                    "Online payment is coming soon 💳"
                );

                return;

            }


            /* BUILD ORDER ITEMS */

            let total = 0;


            const orderItems =
                cart
                    .map(item => {

                        const product =
                            products.find(
                                p =>
                                    p.id === item.id
                            );


                        if (!product) {

                            return null;

                        }


                        total +=
                            product.price *
                            item.quantity;


                        return {

                            id: product.id,

                            name: product.name,

                            price: product.price,

                            quantity:
                                item.quantity

                        };

                    })
                    .filter(Boolean);


            /* CHECK CART */

            if (
                orderItems.length === 0
            ) {

                showToast(
                    "Your cart is empty 🛒"
                );

                return;

            }


            /* ORDER OBJECT */

            const orderData = {

                customer:
                    customer,

                phone:
                    phone,

                address:
                    address,

                items:
                    orderItems,

                total:
                    total,

                payment:
                    "Cash on Delivery"

            };


            /* SUBMIT BUTTON */

            const submitButton =
                checkoutForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "PLACING ORDER...";

            }


            try {

                /*
                 * Send order to Google Apps Script.
                 *
                 * no-cors is used because this public
                 * Apps Script endpoint does not expose a
                 * normal CORS response to the browser.
                 */

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
                            JSON.stringify(
                                orderData
                            )

                    }
                );


                /*
                 * The browser cannot read the response
                 * when no-cors is used.
                 *
                 * The request has been sent to the
                 * Apps Script endpoint.
                 */


                if (checkoutModal) {

                    checkoutModal.classList.remove(
                        "active"
                    );

                }


                /* CLEAR CART */

                cart = [];


                saveData();

                updateCart();

                closeCart();


                /* RESET FORM */

                checkoutForm.reset();


                /* SUCCESS MESSAGE */

                alert(

                    "🎉 ORDER PLACED SUCCESSFULLY!\n\n" +

                    "Your order has been sent to GAGAN WEAR.\n\n" +

                    "Thank you for shopping with us! 🛍️"

                );


            } catch (error) {

                console.error(
                    "Order submission error:",
                    error
                );


                showToast(
                    "Could not send order. Please try again."
                );

            }


            /* ENABLE BUTTON */

            if (submitButton) {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "PLACE ORDER";

            }

        }
    );

}


/* =========================================================
   ACCOUNT / AUTH
   ========================================================= */

const authModal =
    document.getElementById(
        "authModal"
    );


const accountBtn =
    document.getElementById(
        "accountBtn"
    );


const closeAuth =
    document.getElementById(
        "closeAuth"
    );


/* OPEN ACCOUNT */

if (accountBtn) {

    accountBtn.addEventListener(
        "click",
        () => {

            if (authModal) {

                authModal.classList.add(
                    "active"
                );

            }

        }
    );

}


/* CLOSE ACCOUNT */

if (closeAuth) {

    closeAuth.addEventListener(
        "click",
        () => {

            if (authModal) {

                authModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   LOGIN / SIGNUP SWITCH
   ========================================================= */

const showSignup =
    document.getElementById(
        "showSignup"
    );


const showLogin =
    document.getElementById(
        "showLogin"
    );


if (showSignup) {

    showSignup.addEventListener(
        "click",
        () => {

            const loginForm =
                document.getElementById(
                    "loginForm"
                );


            const signupForm =
                document.getElementById(
                    "signupForm"
                );


            if (loginForm) {

                loginForm.classList.add(
                    "hidden"
                );

            }


            if (signupForm) {

                signupForm.classList.remove(
                    "hidden"
                );

            }

        }
    );

}


if (showLogin) {

    showLogin.addEventListener(
        "click",
        () => {

            const loginForm =
                document.getElementById(
                    "loginForm"
                );


            const signupForm =
                document.getElementById(
                    "signupForm"
                );


            if (signupForm) {

                signupForm.classList.add(
                    "hidden"
                );

            }


            if (loginForm) {

                loginForm.classList.remove(
                    "hidden"
                );

            }

        }
    );

}


/* =========================================================
   DEMO SIGNUP
   ========================================================= */

const signupBtn =
    document.getElementById(
        "signupBtn"
    );


if (signupBtn) {

    signupBtn.addEventListener(
        "click",
        () => {

            const name =
                document
                    .getElementById(
                        "signupName"
                    )
                    ?.value
                    .trim();


            const email =
                document
                    .getElementById(
                        "signupEmail"
                    )
                    ?.value
                    .trim();


            const password =
                document
                    .getElementById(
                        "signupPassword"
                    )
                    ?.value;


            if (
                !name ||
                !email ||
                !password
            ) {

                showToast(
                    "Please fill all fields"
                );

                return;

            }


            localStorage.setItem(

                "gaganUser",

                JSON.stringify({

                    name:
                        name,

                    email:
                        email,

                    password:
                        password

                })

            );


            showToast(
                "Account created 🎉"
            );


            const signupForm =
                document.getElementById(
                    "signupForm"
                );


            const loginForm =
                document.getElementById(
                    "loginForm"
                );


            if (signupForm) {

                signupForm.classList.add(
                    "hidden"
                );

            }


            if (loginForm) {

                loginForm.classList.remove(
                    "hidden"
                );

            }

        }
    );

}


/* =========================================================
   DEMO LOGIN
   ========================================================= */

const loginBtn =
    document.getElementById(
        "loginBtn"
    );


if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        () => {

            const email =
                document
                    .getElementById(
                        "loginEmail"
                    )
                    ?.value
                    .trim();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    ?.value;


            const user =
                JSON.parse(

                    localStorage.getItem(
                        "gaganUser"
                    )

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

                if (authModal) {

                    authModal.classList.remove(
                        "active"
                    );

                }


                showToast(
                    `Welcome back, ${user.name}! 👋`
                );

            } else {

                showToast(
                    "Incorrect email or password"
                );

            }

        }
    );

}


/* =========================================================
   INITIAL LOAD
   ========================================================= */

displayProducts();

updateCart();

updateWishlist();
