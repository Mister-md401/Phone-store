const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const productsFile = path.join(
  __dirname,
  "products",
  "products.json"
);

// Li pwodwi yo
function getProducts() {
  try {
    const data = fs.readFileSync(productsFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ Erè products.json:", error);
    return [];
  }
}

// API pwodwi yo
app.get("/api/products", (req, res) => {
  const products = getProducts();

  res.json({
    success: true,
    products: products
  });
});

// API status
app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    message: "Phone Store ap mache!"
  });
});

app.listen(PORT, () => {
  console.log(`📱 Phone Store ap mache sou port ${PORT}`);
});