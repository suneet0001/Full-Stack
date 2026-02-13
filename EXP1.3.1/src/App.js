import ProductCard from "./components/ProductCard";
import headphones from "./assets/headphones.jpg";
import keyboard from "./assets/keyboard.jpg";
import watch from "./assets/watch.jpg";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-10">
      
      <h1 className="text-3xl font-bold text-center mb-10 text-white">

        Featured Products
      </h1>

      <div className="
        grid gap-10 place-items-center
        sm:grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
      ">
        <ProductCard
          name="Wireless Headphones"
          price="129.99"
          inStock={true}
          image={headphones}
        />

        <ProductCard
          name="Mechanical Keyboard"
          price="89.99"
          inStock={false}
          image={keyboard}
        />

        <ProductCard
          name="Smart Watch"
          price="199.99"
          inStock={true}
          image={watch}
        />
      </div>
    </div>
  );
}

export default App;
