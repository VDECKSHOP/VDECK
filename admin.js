// admin.js

document.addEventListener("DOMContentLoaded", () => {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    const productForm = document.getElementById("product-form");
    const productContainer = document.getElementById("product-list");

    // Open IndexedDB
    let db;
    const request = indexedDB.open("ProductDB", 1);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains("products")) {
            db.createObjectStore("products", { keyPath: "id", autoIncrement: true });
        }
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        renderProducts();
    };

    request.onerror = (event) => {
        console.error("IndexedDB error:", event.target.error);
    };

    // Render all products
    function renderProducts() {
        productContainer.innerHTML = "";
        products.forEach((product, index) => {
            const li = document.createElement("li");
            getImageFromDB(product.id, (imageUrl) => {
                li.innerHTML = `
                    <img src="${imageUrl || 'default.jpg'}" alt="${product.name}" width="100">
                    <div>
                        <strong>${product.name}</strong> - ₱${product.price} (${product.category})
                        <p>${product.description}</p>
                    </div>
                    <button onclick="editProduct(${index})">Edit</button>
                    <button onclick="deleteProduct(${index})">Delete</button>
                `;
                productContainer.appendChild(li);
            });
        });
    }

    // Delete a product
    window.deleteProduct = (index) => {
        const productId = products[index].id;
        deleteImageFromDB(productId);
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
            category
        };

        if (id !== "") {
            products[parseInt(id)] = newProduct;
        } else {
            products.push(newProduct);
        }

        // Store product details in localStorage
        localStorage.setItem("products", JSON.stringify(products));
        localStorage.setItem("productsUpdated", "true"); // Notify index.html

        // Store image in IndexedDB
        saveImageToDB(newProduct.id, mainImageFile);

        productForm.reset();
        document.getElementById("product-id").value = "";
        alert("Product saved successfully!");
        renderProducts();
    });

    // Save image to IndexedDB
    function saveImageToDB(productId, imageFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const transaction = db.transaction("products", "readwrite");
            const store = transaction.objectStore("products");
            store.put({ id: productId, image: event.target.result });
        };
        reader.readAsDataURL(imageFile);
    }

    // Get image from IndexedDB
    function getImageFromDB(productId, callback) {
        const transaction = db.transaction("products", "readonly");
        const store = transaction.objectStore("products");
        const request = store.get(productId);
        request.onsuccess = () => {
            callback(request.result ? request.result.image : null);
        };
    }

    // Delete image from IndexedDB
    function deleteImageFromDB(productId) {
        const transaction = db.transaction("products", "readwrite");
        const store = transaction.objectStore("products");
        store.delete(productId);
    }
});


