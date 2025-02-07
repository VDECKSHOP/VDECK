document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find(p => p.id == productId);

    if (!product) {
        alert("Product not found!");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-price").textContent = product.price;
    document.getElementById("product-description").textContent = product.description || "No description available";

    const mainImage = document.getElementById("main-product-image");
    const thumbnailContainer = document.getElementById("thumbnails");

    if (product.images && product.images.length > 0) {
        mainImage.src = product.images[0];

        product.images.forEach((imgSrc, index) => {
            const thumbnail = document.createElement("img");
            thumbnail.className = "thumbnail";
            thumbnail.src = imgSrc;
            thumbnail.alt = `${product.name} thumbnail ${index + 1}`;
            thumbnail.addEventListener("click", () => {
                mainImage.src = imgSrc;
            });
            thumbnailContainer.appendChild(thumbnail);
        });
    } else {
        mainImage.src = "placeholder-image.jpg";
        thumbnailContainer.innerHTML = "<p>No images available</p>";
    }
});

window.incrementQuantity = () => {
    const quantityInput = document.getElementById("quantity");
    quantityInput.value = parseInt(quantityInput.value) + 1;
};

window.decrementQuantity = () => {
    const quantityInput = document.getElementById("quantity");
    if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
};
