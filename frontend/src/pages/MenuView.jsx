import { useCartStore } from '@/store/cart';
import { useState, useEffect } from 'react';
import axios from 'axios';

const MenuView = () => {
  const { addItem } = useCartStore();
  const [activeCategory, setActiveCategory] = useState('todos');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'todos', label: 'Toda la Carta' },
    { id: 'entrantes', label: 'Entrantes' },
    { id: 'principales', label: 'Principales' },
    { id: 'postres', label: 'Postres' },
    { id: 'vinos', label: 'Bodega' },
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
          image: d.image,
        }));

        // Normalize wines
        const formattedWines = wines.map(w => ({
          id: `w${w.id}`, // Add a prefix to wine to distinguish it in the checkout if needed
          item_type: 'wine',
          name: w.name,
          description: w.pairing_notes || w.type,
          price: parseFloat(w.price_bottle),
          category: 'vinos',
          image: w.image, // Optional in DB, could be null
        }));

        setMenuItems([...formattedDishes, ...formattedWines]);
      } catch (e) {
        console.error('No se pudo cargar la carta', e);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems =
    activeCategory === 'todos' ? menuItems : menuItems.filter(item => item.category === activeCategory);

  const getItemsByCategory = categoryId => menuItems.filter(item => item.category === categoryId);

  return (
    <div className="bg-bg-body text-text-main min-h-screen pb-32 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header / Intro */}
      <div className="relative pt-32 sm:pt-40 pb-16 sm:pb-20 border-b border-text-main/10 z-10 px-4">
        <div className="container text-center max-w-4xl mx-auto">
          <span className="block text-primary text-[12px] sm:text-sm md:text-base uppercase tracking-[4px] mb-6 animate-fade-in font-body font-bold">
            Gastronomía
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl uppercase tracking-widest mb-8 animate-fade-in text-text-main drop-shadow-sm leading-tight">
            La Carta
          </h1>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8 sm:mb-10 animate-fade-in"></div>
          <p className="text-text-muted font-light leading-relaxed sm:leading-loose text-base sm:text-lg animate-fade-in max-w-2xl mx-auto">
            Una selección de sabores diseñada para despertar los sentidos, desde los clásicos reinventados hasta las
            creaciones más audaces de nuestro equipo a los mandos.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-[72px] sm:top-[72px] md:top-28 z-40 bg-bg-body/90 backdrop-blur-xl border-b border-text-main/10 py-4 sm:py-5 mb-12 sm:mb-16 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <div className="container overflow-x-auto no-scrollbar">
          <div className="flex justify-start sm:justify-center min-w-max gap-8 sm:gap-12 md:gap-16 px-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`uppercase text-[12px] sm:text-[13px] tracking-[2px] transition-all duration-500 pb-2 relative group whitespace-nowrap font-medium ${
                  activeCategory === cat.id ? 'text-primary' : 'text-text-muted hover:text-text-main'
                }`}>
                {cat.label}
                <div
                  className={`absolute bottom-0 left-0 h-[1.5px] bg-primary transition-all duration-500 ${activeCategory === cat.id ? 'w-full shadow-[0_0_10px_rgba(166,138,86,0.5)]' : 'w-0 group-hover:w-1/2'}`}></div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="container relative z-10 px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-32 text-center animate-pulse">
            <span className="text-primary text-4xl mb-6 opacity-80">✦</span>
            <p className="text-text-muted font-light tracking-wide text-lg">Sintonizando nuestra bodega...</p>
          </div>
        ) : (
          <>
            {activeCategory === 'todos' ? (
              <div className="space-y-32">
                {categories
                  .filter(c => c.id !== 'todos')
                  .map((category, index) => {
                    const items = getItemsByCategory(category.id);
                    if (items.length === 0) return null;

                    return (
                      <div key={category.id} className="animate-fade-in mt-16 mb-24">
                        {/* Brand Style Category Header */}
                        <div className="flex items-center gap-4 mb-16 sm:mb-20 max-w-6xl mx-auto opacity-90">
                          <div className="flex-grow h-[1px] bg-text-main/10 hidden sm:block"></div>
                          <span className="text-[12px] tracking-[3px] font-body text-text-muted font-medium">
                            / 0{index + 1}
                          </span>
                          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-text-main pb-0 px-2 sm:px-4 relative top-1">
                            <span className="italic">{category.label.split(' ')[0]}</span>{' '}
                            {category.label.split(' ').slice(1).join(' ')}
                          </h2>
                          <div className="flex-grow h-[1px] bg-text-main/10"></div>
                        </div>
                        <div className="flex flex-col w-full max-w-5xl mx-auto px-4">
                          {items.map(item => (
                            <DishRow key={item.id} item={item} addItem={addItem} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="flex flex-col w-full max-w-5xl mx-auto px-4 mt-8">
                {filteredItems.map(item => (
                  <DishRow key={item.id} item={item} addItem={addItem} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
                <span className="text-primary text-4xl mb-6 opacity-80">✦</span>
                <p className="text-text-muted font-light tracking-wide text-base sm:text-lg max-w-md mx-auto">
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

const DishRow = ({ item, addItem }) => (
  <div className="group relative py-6 md:py-10 border-b border-text-main/10 flex flex-col md:flex-row md:items-center justify-between hover:bg-text-main/5 transition-colors duration-500 gap-4 sm:gap-6">
    <div className="flex items-center gap-8 w-full md:w-3/4">
      <div className="flex-grow">
        <div className="flex items-baseline gap-4 mb-2">
          <h3 className="font-heading text-3xl md:text-4xl text-text-main group-hover:text-primary transition-colors leading-tight">
            {item.name}
          </h3>
          {/* Price displayed inline on mobile */}
          <span className="md:hidden font-body font-light text-text-main text-lg tracking-widest">
            {item.price.toFixed(2)}€
          </span>
        </div>
        <p className="text-text-main text-sm md:text-base font-body font-medium max-w-2xl leading-relaxed italic opacity-80">
          {item.description}
        </p>
      </div>
    </div>

    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 w-full md:w-auto mt-4 md:mt-0">
      <span className="hidden md:block font-body font-light text-text-main text-xl tracking-widest mb-4">
        {item.price.toFixed(2)}€
      </span>
      <button
        onClick={() => addItem(item)}
        className="w-full md:w-auto relative px-10 py-3 bg-transparent border border-text-main text-text-main font-body text-[12px] uppercase tracking-[2px] overflow-hidden transition-all duration-500 group-hover:border-primary hover:text-bg-body focus:outline-none">
        <div className="absolute inset-0 w-0 bg-primary transition-all duration-[400ms] ease-out hover:w-full z-0"></div>
        <span className="relative z-10 font-bold transition-colors duration-300">Añadir</span>
      </button>
    </div>
  </div>
);

export default MenuView;
