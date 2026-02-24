import { useCartStore } from "@/store/cart";
import { useState, useEffect } from "react";
import axios from "axios";

const MenuView = () => {
  const { addItem } = useCartStore();
  const [activeCategory, setActiveCategory] = useState("todos");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "todos", label: "Toda la Carta" },
    { id: "entrantes", label: "Entrantes" },
    { id: "principales", label: "Principales" },
    { id: "postres", label: "Postres" },
    { id: "vinos", label: "Bodega" },
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('/dishes');
        const { dishes, wines } = response.data;

        // Normalize dishes
        const formattedDishes = dishes.map(d => ({
          id: d.id, // Points directly to the Dish DB ID for cart checkout
          item_type: 'dish',
          name: d.name,
          description: d.description,
          price: parseFloat(d.price),
          category: d.category ? d.category.name.toLowerCase() : 'otros',
          image: d.image
        }));

        // Normalize wines
        const formattedWines = wines.map(w => ({
          id: `w${w.id}`, // Add a prefix to wine to distinguish it in the checkout if needed
          item_type: 'wine',
          name: w.name,
          description: w.pairing_notes || w.type,
          price: parseFloat(w.price_bottle),
          category: 'vinos',
          image: w.image // Optional in DB, could be null
        }));

        setMenuItems([...formattedDishes, ...formattedWines]);
      } catch (e) {
        console.error("No se pudo cargar la carta", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems =
    activeCategory === "todos"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const getItemsByCategory = (categoryId) => menuItems.filter((item) => item.category === categoryId);

  return (
    <div className="bg-bg-body text-gray-900 min-h-screen pb-32 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header / Intro */}
      <div className="relative pt-40 pb-20 border-b border-gray-100 z-10">
        <div className="container text-center max-w-4xl mx-auto px-4">
          <span className="block text-primary text-xs md:text-sm uppercase tracking-[8px] mb-6 animate-fade-in font-body opacity-90">
            Gastronomía
          </span>
          <h1 className="font-heading text-5xl md:text-7xl uppercase tracking-widest mb-8 animate-fade-in text-gray-900 drop-shadow-sm">
            La Carta
          </h1>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-10 animate-fade-in"></div>
          <p className="text-gray-500 font-light leading-loose text-lg animate-fade-in">
            Una selección de sabores diseñada para despertar los sentidos, desde
            los clásicos reinventados hasta las creaciones más audaces de
            nuestro equipo a los mandos.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-[72px] z-40 bg-bg-body/80 backdrop-blur-xl border-b border-gray-200 py-5 mb-16 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="container overflow-x-auto no-scrollbar">
          <div className="flex justify-center min-w-max gap-12 md:gap-16 px-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`uppercase text-xs tracking-[4px] transition-all duration-500 pb-2 relative group ${
                  activeCategory === cat.id
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {cat.label}
                <div className={`absolute bottom-0 left-0 h-[1px] bg-primary transition-all duration-500 ${activeCategory === cat.id ? "w-full shadow-[0_0_10px_rgba(197,160,89,0.8)]" : "w-0 group-hover:w-1/2"}`}></div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="container relative z-10 px-4">
        {loading ? (
             <div className="flex flex-col items-center justify-center py-32 text-center animate-pulse">
             <span className="text-primary text-4xl mb-6 opacity-50">✦</span>
             <p className="text-gray-500 font-light tracking-wide text-lg">
               Sintonizando nuestra bodega...
             </p>
           </div>
        ) : (
          <>
            {activeCategory === "todos" ? (
              <div className="space-y-32">
                {categories.filter(c => c.id !== 'todos').map((category) => {
                  const items = getItemsByCategory(category.id);
                  if (items.length === 0) return null;

                  return (
                    <div key={category.id} className="animate-fade-in">
                      <div className="text-center mb-16">
                        <span className="text-primary text-xl mb-4 opacity-50 block font-light">✦</span>
                        <h2 className="font-heading text-4xl uppercase tracking-[0.2em] text-gray-900">
                          {category.label}
                        </h2>
                        <div className="w-12 h-[1px] bg-primary mx-auto mt-6"></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {items.map((item) => (
                          <DishCard key={item.id} item={item} addItem={addItem} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {filteredItems.map((item) => (
                  <DishCard key={item.id} item={item} addItem={addItem} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
                <span className="text-primary text-4xl mb-6 opacity-50">✦</span>
                <p className="text-gray-500 font-light tracking-wide text-lg">
                  La colección para esta categoría se encuentra en desarrollo por nuestro Chef.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const DishCard = ({ item, addItem }) => (
  <div className="group relative bg-white shadow-sm border border-gray-100 hover:border-primary/40 transition-all duration-500 overflow-hidden flex flex-col h-full hover:shadow-lg rounded-sm">
    <div className="relative h-72 overflow-hidden bg-bg-surface">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-bg-surface flex items-center justify-center">
          <span className="font-heading text-primary/30 text-4xl">DG</span>
        </div>
      )}
    </div>

    <div className="p-8 flex flex-col flex-grow relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="flex justify-between items-start mb-4 gap-4">
        <h3 className="font-heading text-2xl text-gray-900 tracking-wider group-hover:text-primary-hover transition-colors leading-tight">
          {item.name}
        </h3>
        <span className="font-body font-light text-primary text-xl relative top-1">
          {item.price.toFixed(2)}€
        </span>
      </div>
      <p className="text-gray-500 text-sm font-light leading-relaxed mb-10 flex-grow italic">
        {item.description}
      </p>
      <button
        onClick={() => addItem(item)}
        className="w-full relative px-6 py-4 bg-transparent border border-gray-200 text-gray-900 font-body text-xs uppercase tracking-[4px] overflow-hidden transition-all duration-500 group-hover:border-primary focus:outline-none"
      >
        <div className="absolute inset-0 w-0 bg-primary transition-all duration-[400ms] ease-out group-hover:w-full z-0"></div>
        <span className="relative z-10 font-bold group-hover:text-black transition-colors duration-300">Añadir a la Selección</span>
      </button>
    </div>
  </div>
);

export default MenuView;
