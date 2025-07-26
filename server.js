const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const app = express();
app.use(cors());


const PORT = 5000;

let orders = [];
let orderItems = [];
let products = [];
let inventory = [];

const loadCSV = (filePath) => {
  return new Promise((resolve) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results));
  });
};

const loadData = async () => {
  orders = await loadCSV(path.join(__dirname, "archive", "orders.csv"));
  orderItems = await loadCSV(path.join(__dirname, "archive", "order_items.csv"));
  products = await loadCSV(path.join(__dirname, "archive", "products.csv"));
  inventory = await loadCSV(path.join(__dirname, "archive", "inventory_items.csv"));
};


app.get("/top-products", (req, res) => {
  const productSales = {};

  orderItems.forEach((item) => {
    const productId = item.product_id;
    const quantity = parseInt(item.quantity, 10);
    if (!productSales[productId]) productSales[productId] = 0;
    productSales[productId] += quantity;
  });

  const sorted = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, qty]) => {
      const product = products.find((p) => p.id === id);
      return {
        product: product ? product.name : `Product ${id}`,
        sold: qty,
      };
    });

  res.json(sorted);
});


app.get("/order-status/:id", (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  res.json({ orderId: order.id, status: order.status });
});


app.get("/stock/:name", (req, res) => {
  const name = req.params.name.toLowerCase();
  const product = products.find((p) => p.name.toLowerCase().includes(name));
  if (!product) return res.status(404).json({ message: "Product not found" });

  const inventoryItem = inventory.find((i) => i.product_id === product.id);
  const stock = inventoryItem ? parseInt(inventoryItem.stock_quantity, 10) : 0;

  res.json({ product: product.name, stock });
});


loadData().then(() => {
  app.listen(PORT, () =>
    console.log(` Server running at http://localhost:${PORT}`)
  );
});
