document.addEventListener("DOMContentLoaded", () => {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    const productForm = document.getElementById("product-form");
    const productContainer = document.getElementById("product-list");

    // Render all products
    function renderProducts() {
        productContainer.innerHTML = "";
        products.forEach((product, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <img src="${product.images[0] || 'default.jpg'}" alt="${product.name}" width="100">
                <div>
                    <strong>${product.name}</strong> - ₱${product.price} (${product.category})
                    <p>${product.description}</p>
                </div>
                <button onclick="editProduct(${index})">Edit</button>
                <button onclick="deleteProduct(${index})">Delete</button>
            `;
            productContainer.appendChild(li);
        });
    }

    // Delete a product
    window.deleteProduct = (index) => {
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        localStorage.setItem("productsUpdated", "true"); // Notify index.html
        renderProducts();
    };

    // Edit a product
    window.editProduct = (index) => {
        const product = products[index];
        document.getElementById("product-id").value = index;
        document.getElementById("product-name").value = product.name;
        document.getElementById("product-price").value = product.price;
        document.getElementById("product-description").value = product.description;
        document.getElementById("product-category").value = product.category;
    };

    // Save or update a product
    productForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const id = document.getElementById("product-id").value;
        const name = document.getElementById("product-name").value.trim();
        const price = document.getElementById("product-price").value.trim();
        const description = document.getElementById("product-description").value.trim();
        const category = document.getElementById("product-category").value;
        const mainImageFile = document.getElementById("product-image").files[0];

        if (!name || !price || !mainImageFile || !category) {
            alert("Please fill in all required fields.");
            return;
        }

        const newProduct = {
            id: id ? products[parseInt(id)].id : new Date().getTime(),
            name,
            price: parseFloat(price).toFixed(2),
            description,
            category,
            images: [URL.createObjectURL(mainImageFile)] // Store image URL
        };

        if (id !== "") {
            products[parseInt(id)] = newProduct; // Update existing product
        } else {
            products.push(newProduct); // Add new product
        }

        // Store product details in localStorage
        localStorage.setItem("products", JSON.stringify(products));
        localStorage.setItem("productsUpdated", "true"); // Notify index.html

        productForm.reset();
        document.getElementById("product-id").value = "";
        alert("Product saved successfully!");
        renderProducts();
    });

    // Render products on page load
    renderProducts();
});

