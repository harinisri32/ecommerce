import React, { useState } from "react";
import axios from "axios";

function App() {
  const [response, setResponse] = useState("");

  const getTopProducts = async () => {
    const res = await axios.get("http://localhost:5000/top-products");
    setResponse(JSON.stringify(res.data, null, 2));
  };

  const getOrderStatus = async () => {
    const id = prompt("Enter Order ID:");
    if (!id) return;
    try {
      const res = await axios.get(`http://localhost:5000/order-status/${id}`);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setResponse("❌ Order not found");
    }
  };

  const getStock = async () => {
    const name = prompt("Enter Product Name:");
    if (!name) return;
    try {
      const res = await axios.get(`http://localhost:5000/stock/${encodeURIComponent(name)}`);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setResponse("❌ Product not found");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🛍️ E-commerce Chatbot</h1>

      <button onClick={getTopProducts} style={{ margin: "5px" }}>
        🔝 Show Top 5 Products
      </button>

      <button onClick={getOrderStatus} style={{ margin: "5px" }}>
        📦 Check Order Status
      </button>

      <button onClick={getStock} style={{ margin: "5px" }}>
        🏷️ Check Product Stock
      </button>

      <h3>Response:</h3>
      <pre style={{ background: "#eee", padding: "10px" }}>{response}</pre>
    </div>
  );
}

export default App;
