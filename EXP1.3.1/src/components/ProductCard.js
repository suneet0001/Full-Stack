function ProductCard({ name, price, inStock, image }) {
  return (
    <div
      className="
        group bg-white/80 backdrop-blur
        rounded-3xl p-6 text-center
        shadow-lg border border-gray-100
        transition-all duration-300
        hover:shadow-2xl hover:-translate-y-3
      "
    >
      {/* Image */}
      <div className="h-44 flex items-center justify-center mb-4 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="
            max-h-full max-w-full object-contain
            transition-transform duration-300
            group-hover:scale-110
          "
        />
      </div>

      {/* Product Name */}
      <h3 className="text-lg font-semibold text-gray-800">
        {name}
      </h3>

      {/* Price */}
      <p className="text-2xl font-extrabold mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        ${price}
      </p>

      {/* Stock Status */}
      <span
        className={`inline-flex items-center gap-2 mt-4 px-5 py-1.5 rounded-full text-sm font-medium
        ${inStock
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"}`}
      >
        {inStock ? "✔ In Stock" : "✖ Out of Stock"}
      </span>
    </div>
  );
}

export default ProductCard;
