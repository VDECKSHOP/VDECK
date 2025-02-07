import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3000;

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads/";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Serve static files
app.use("/uploads", express.static("uploads"));

// Handle product creation
app.post("/api/products", upload.single("image"), (req, res) => {
    const { name, price, category } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !price || !category || !image) {
        return res.status(400).json({ error: "Please fill in all fields." });
    }

    const product = { name, price, category, image };
    const products = JSON.parse(fs.readFileSync("products.json", "utf-8")) || [];
    products.push(product);
    fs.writeFileSync("products.json", JSON.stringify(products, null, 2));

    res.status(201).json({ message: "Product added successfully!", product });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});