import { useState } from "react";
import "./App.css";

const products = [
  { id: 1, name: "Wireless Headphones", price: "$129.99", category: "electronics" },
  { id: 2, name: "Cotton T-Shirt", price: "$24.99", category: "clothing" },
  { id: 3, name: "Bluetooth Speaker", price: "$89.99", category: "electronics" },
  { id: 4, name: "Denim Jeans", price: "$59.99", category: "clothing" },
];

export default function App() {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? products
      : products.filter((p) => p.category === filter);

  return (
    <div className="page">
      <div className="container">
        <h1>Product Filter</h1>

        <div className="filter-row">
          <span>Filter by:</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Products</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
          </select>
        </div>

        <div className="grid">
          {filtered.map((p) => (
            <div key={p.id} className="card">
              <h2>{p.name}</h2>
              <p className="price">{p.price}</p>
              <span className={`badge ${p.category}`}>{p.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
