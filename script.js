// script.js

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    renderCart(); // Render cart on page load
});

// ✅ Load products function
function loadProducts() {
    if (localStorage.getItem("productsUpdated") === "true") {
        console.log("🔄 Products updated, refreshing list...");
        localStorage.removeItem("productsUpdated"); // Clear update flag
    }

    const products = JSON.parse(localStorage.getItem("products")) || [];
    console.log("📦 Products from localStorage:", products);
    renderProducts(products);
}

function renderProducts(products) {
    const playingCardsContainer = document.getElementById("playing-cards");
    const pokerChipsContainer = document.getElementById("poker-chips");
    const accessoriesContainer = document.getElementById("accessories");

    playingCardsContainer.innerHTML = "";
    pokerChipsContainer.innerHTML = "";
    accessoriesContainer.innerHTML = "";

    products.forEach((product, index) => {
        const productHTML = `
            <div class="product">
                <img src="${product.images[0] || 'placeholder.jpg'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>₱${product.price}</p>
                <div class="quantity-controls">
                    <button onclick="decrementQuantity(${index})">-</button>
                    <input type="number" id="quantity-${index}" value="1" min="1">
                    <button onclick="incrementQuantity(${index})">+</button>
                </div>
                <button onclick="addToCart(${index})">Add to Cart</button>
                <button onclick="viewDetails(${index})">Details</button>
            </div>
        `;

        if (product.category === "playing-cards") {
            playingCardsContainer.innerHTML += productHTML;
        } else if (product.category === "poker-chips") {
            pokerChipsContainer.innerHTML += productHTML;
        } else if (product.category === "accessories") {
            accessoriesContainer.innerHTML += productHTML;
        }
    });
}

// View Details Function
window.viewDetails = (index) => {
    window.location.href = `product-details.html?id=${index}`;
};

// Quantity Controls
window.incrementQuantity = (index) => {
    const quantityInput = document.getElementById(`quantity-${index}`);
    quantityInput.value = parseInt(quantityInput.value) + 1;
};

window.decrementQuantity = (index) => {
    const quantityInput = document.getElementById(`quantity-${index}`);
    if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
};

// Add to Cart Function
window.addToCart = (index) => {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products[index];

    if (!product) {
        alert("Product not found.");
        return;
    }

    const quantity = parseInt(document.getElementById(`quantity-${index}`).value);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if product is already in cart
    const existingProduct = cart.find(item => item.name === product.name);

    if (existingProduct) {
        existingProduct.quantity += quantity; // Increase quantity if product already exists
    } else {
        cart.push(Object.assign({}, product, { quantity })); // ✅ Fix for old browsers
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} (x${quantity}) added to cart!`);
    renderCart(); // Update the cart UI
};