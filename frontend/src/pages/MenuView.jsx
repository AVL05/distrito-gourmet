/**
 * @file MenuView.jsx
 * @author Alex V. (DAW)
 * @date 2026-04-06
 * @description Vista de la carta interactiva del restaurante. Permite filtrar por categorías (platos, bebidas, bodega, menús) y añadir productos al carrito mediante un estado global (Zustand).
 */

import { useCartStore } from '@/store/cart';
import { useState, useEffect } from 'react';
import axios from '@/services/api';
import {
  PageTransition,
  FadeIn,
  StaggerList,
  StaggerItem,
  ScrollReveal,
  TextReveal,
  LineReveal,
  MotionButton,
} from '@/motion';

/**
 * @component MenuView
 * @description Componente principal que gestiona el estado de la carta, recuperando datos del backend y formateándolos para su visualización categorizada.
 */
const MenuView = () => {
  const { addItem } = useCartStore();
  const [activeCategory, setActiveCategory] = useState('carta');
  const [menuData, setMenuData] = useState({
    dishes: [],
    beverages: [],
    wines: [],
    tastingMenus: [],
  });
  const [loading, setLoading] = useState(true);

  // Categorías del menú para las pestañas de filtro
  const categories = [
    { id: 'carta', label: 'Toda la Carta' },
    { id: 'bebidas', label: 'Bebidas' },
    { id: 'bodega', label: 'Bodega' },
    { id: 'menus', label: 'Menús' },
  ];

  // Llamada a la API para obtener todos los datos del menú
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('/dishes');
        const { dishes, wines, beverages, tasting_menus } = response.data;

        // Formatear platos
        const formattedDishes = dishes.map(d => ({
          id: d.id,
          item_type: 'dish',
          name: d.name,
          description: d.description,
          price: parseFloat(d.price),
          category: d.category ? d.category.name.toLowerCase() : 'otros',
          image: d.image,
          allergens: d.allergens,
          isSignature: !!d.is_signature,
        }));

        // Formatear vinos
        const formattedWines = wines.map(w => ({
          id: `w${w.id}`,
          item_type: 'wine',
          name: w.name,
          description: w.pairing_notes || '',
          price: parseFloat(w.price_bottle),
          priceGlass: w.price_glass ? parseFloat(w.price_glass) : null,
          wineType: w.type,
          image: w.image,
        }));

        // Formatear bebidas
        const formattedBeverages = beverages.map(b => ({
          id: `b${b.id}`,
          item_type: 'beverage',
          name: b.name,
          description: b.description || '',
          price: parseFloat(b.price),
          beverageType: b.type,
        }));

        // Formatear menús degustación
        const formattedMenus = (tasting_menus || []).map(m => ({
          id: `m${m.id}`,
          item_type: 'tasting_menu',
          name: m.name,
          description: m.description || '',
          price: parseFloat(m.price),
          courses: m.courses,
          dishes: m.dishes || [],
        }));

        setMenuData({
          dishes: formattedDishes,
          beverages: formattedBeverages,
          wines: formattedWines,
          tastingMenus: formattedMenus,
        });
      } catch (e) {
        console.error('No se pudo cargar la carta', e);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Categorías de platos para "Toda la Carta"
  const dishCategories = ['entrantes', 'principales', 'postres'];
  const getDishesForCategory = cat => menuData.dishes.filter(d => d.category === cat);

  // Tipos de bebidas para la pestaña de bebidas
  const beverageTypes = [
    { key: 'agua', label: 'Aguas' },
    { key: 'refresco', label: 'Refrescos & Zumos' },
    { key: 'cocktail', label: 'Cócteles' },
    { key: 'cafe', label: 'Cafés & Infusiones' },
  ];
  const getBeveragesByType = type => menuData.beverages.filter(b => b.beverageType === type);

  // Tipos de vinos para la pestaña de bodega
  const wineTypes = [
    { key: 'Tinto', label: 'Tintos' },
    { key: 'Blanco', label: 'Blancos' },
    { key: 'Espumoso', label: 'Espumosos & Champagne' },
    { key: 'Rosado', label: 'Rosados' },
  ];
  const getWinesByType = type => menuData.wines.filter(w => w.wineType === type);

  // Transición de pestañas manejada por PageTransition internamente al cambiar la key

  return (
    <PageTransition className="bg-bg-body text-text-main min-h-screen pb-32 relative overflow-hidden">
      {/* Luz ambiental de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Cabecera con TextReveal inspirado en Adachi */}
      <div className="relative pt-32 sm:pt-40 pb-16 sm:pb-20 border-b border-text-main/10 z-10 px-4">
        <div className="container text-center max-w-4xl mx-auto">
          <FadeIn delay={0.05}>
            <span className="block text-primary text-[12px] sm:text-sm md:text-base uppercase tracking-[4px] mb-6 font-body font-bold">
              Gastronomía
            </span>
          </FadeIn>
          <TextReveal
            text="La Carta"
            splitBy="char"
            as="h1"
            staggerDelay={0.05}
            delay={0.15}
            className="font-heading text-4xl sm:text-5xl md:text-7xl uppercase tracking-widest mb-8 text-text-main drop-shadow-sm leading-tight justify-center"
          />
          <FadeIn delay={0.4}>
            <LineReveal
              className="bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8 sm:mb-10"
              style={{ maxWidth: '4rem' }}
            />
          </FadeIn>
          <FadeIn delay={0.5}>
            <p className="text-text-muted font-light leading-relaxed sm:leading-loose text-base sm:text-lg max-w-2xl mx-auto">
              Una selección de sabores diseñada para despertar los sentidos, desde los clásicos reinventados hasta las
              creaciones más audaces de nuestro equipo a los mandos.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Pestañas de filtro */}
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
                  className="absolute bottom-0 left-0 h-[1.5px] bg-primary transition-all duration-500"
                  style={{
                    width: activeCategory === cat.id ? '100%' : '0%',
                    boxShadow: activeCategory === cat.id ? '0 0 10px rgba(166,138,86,0.5)' : 'none',
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido del menú según la categoría activa */}
      <div className="container relative z-10 px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-32 text-center animate-pulse">
            <span className="text-primary text-4xl mb-6 opacity-80">✦</span>
            <p className="text-text-muted font-light tracking-wide text-lg">Sintonizando nuestra bodega...</p>
          </div>
        ) : (
          <PageTransition key={activeCategory}>
            {/* TODA LA CARTA */}
            {activeCategory === 'carta' && (
              <div className="space-y-32">
                {dishCategories.map((catKey, index) => {
                  const items = getDishesForCategory(catKey);
                  if (items.length === 0) return null;
                  const label = catKey.charAt(0).toUpperCase() + catKey.slice(1);

                  return (
                    <div key={catKey} className="mt-16 mb-24">
                      <SectionHeader index={index} label={label} />
                      <StaggerList className="flex flex-col w-full max-w-5xl mx-auto px-4">
                        {items.map(item => (
                          <StaggerItem key={item.id}>
                            <DishRow item={item} addItem={addItem} />
                          </StaggerItem>
                        ))}
                      </StaggerList>
                    </div>
                  );
                })}
              </div>
            )}

            {/* BEBIDAS */}
            {activeCategory === 'bebidas' && (
              <div className="space-y-32">
                {beverageTypes.map((bt, index) => {
                  const items = getBeveragesByType(bt.key);
                  if (items.length === 0) return null;

                  return (
                    <div key={bt.key} className="mt-16 mb-24">
                      <SectionHeader index={index} label={bt.label} />
                      <StaggerList className="flex flex-col w-full max-w-5xl mx-auto px-4">
                        {items.map(item => (
                          <StaggerItem key={item.id}>
                            <DisplayRow item={item} />
                          </StaggerItem>
                        ))}
                      </StaggerList>
                    </div>
                  );
                })}
              </div>
            )}

            {/* BODEGA */}
            {activeCategory === 'bodega' && (
              <div className="space-y-32">
                {wineTypes.map((wt, index) => {
                  const items = getWinesByType(wt.key);
                  if (items.length === 0) return null;

                  return (
                    <div key={wt.key} className="mt-16 mb-24">
                      <SectionHeader index={index} label={wt.label} />
                      <StaggerList className="flex flex-col w-full max-w-5xl mx-auto px-4">
                        {items.map(item => (
                          <StaggerItem key={item.id}>
                            <WineDisplayRow item={item} />
                          </StaggerItem>
                        ))}
                      </StaggerList>
                    </div>
                  );
                })}
              </div>
            )}

            {/* MENÚS DEGUSTACIÓN */}
            {activeCategory === 'menus' && (
              <StaggerList className="space-y-20 max-w-5xl mx-auto">
                {menuData.tastingMenus.map((menu, index) => (
                  <StaggerItem key={menu.id}>
                    <TastingMenuCard menu={menu} index={index} />
                  </StaggerItem>
                ))}
                {menuData.tastingMenus.length === 0 && <EmptyState />}
              </StaggerList>
            )}

            {/* Estado vacío si no hay datos */}
            {activeCategory === 'carta' && menuData.dishes.length === 0 && <EmptyState />}
            {activeCategory === 'bebidas' && menuData.beverages.length === 0 && <EmptyState />}
            {activeCategory === 'bodega' && menuData.wines.length === 0 && <EmptyState />}
          </PageTransition>
        )}
      </div>
    </PageTransition>
  );
};

/**
 * @component SectionHeader
 * @description Cabecera visual para cada sección del menú con animaciones ScrollReveal.
 */
const SectionHeader = ({ index, label }) => (
  <ScrollReveal
    direction="up"
    distance={30}
    className="flex items-center gap-4 mb-16 sm:mb-20 max-w-6xl mx-auto opacity-90">
    <LineReveal className="flex-grow bg-text-main/10 hidden sm:block" delay={0.3} />
    <span className="text-[12px] tracking-[3px] font-body text-text-muted font-medium">/ 0{index + 1}</span>
    <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-text-main pb-0 px-2 sm:px-4 relative top-1">
      <span className="italic">{label.split(' ')[0]}</span> {label.split(' ').slice(1).join(' ')}
    </h2>
    <LineReveal className="flex-grow bg-text-main/10" delay={0.3} />
  </ScrollReveal>
);

/**
 * @component DishRow
 * @description Fila individual para un plato de la carta con opción de compra.
 */
const DishRow = ({ item, addItem }) => (
  <div className="group relative py-6 md:py-10 border-b border-text-main/10 flex flex-col md:flex-row md:items-center justify-between hover:bg-text-main/5 transition-colors duration-500 gap-4 sm:gap-6">
    <div className="flex items-center gap-8 w-full md:w-3/4">
      <div className="flex-grow">
        <div className="flex items-baseline gap-4 mb-2">
          <h3 className="font-heading text-3xl md:text-4xl text-text-main group-hover:text-primary transition-colors leading-tight">
            {item.name} {item.isSignature && <span className="text-primary text-xl ml-2 drop-shadow-glow">✦</span>}
          </h3>
          <span className="md:hidden font-body font-light text-text-main text-lg tracking-widest">
            {item.price.toFixed(2)}€
          </span>
        </div>
        <p className="text-text-main text-sm md:text-base font-body font-medium max-w-2xl leading-relaxed italic opacity-80 mb-2">
          {item.description}
        </p>
        <div className="flex flex-wrap gap-4">
          {item.allergens && (
            <span className="text-[10px] uppercase tracking-widest text-text-muted opacity-60">
              Alérgenos: {item.allergens}
            </span>
          )}
        </div>
      </div>
    </div>

    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 w-full md:w-auto mt-4 md:mt-0">
      <span className="hidden md:block font-body font-light text-text-main text-xl tracking-widest mb-4">
        {item.price.toFixed(2)}€
      </span>
      <MotionButton
        onClick={() => addItem(item)}
        className="w-full md:w-auto relative px-10 py-3 bg-transparent border border-text-main text-text-main font-body text-[12px] uppercase tracking-[2px] overflow-hidden transition-all duration-500 group-hover:border-primary hover:text-bg-body focus:outline-none">
        <div className="absolute inset-0 w-0 bg-primary transition-all duration-[400ms] ease-out hover:w-full z-0"></div>
        <span className="relative z-10 font-bold transition-colors duration-300">Añadir</span>
      </MotionButton>
    </div>
  </div>
);

/**
 * @component DisplayRow
 * @description Fila informativa para bebidas y artículos sin opción de carrito directa.
 */
const DisplayRow = ({ item }) => (
  <div className="group relative py-6 md:py-10 border-b border-text-main/10 flex flex-col md:flex-row md:items-center justify-between hover:bg-text-main/5 transition-colors duration-500 gap-4 sm:gap-6">
    <div className="flex items-center gap-8 w-full md:w-3/4">
      <div className="flex-grow">
        <div className="flex items-baseline gap-4 mb-2">
          <h3 className="font-heading text-3xl md:text-4xl text-text-main group-hover:text-primary transition-colors leading-tight">
            {item.name}
          </h3>
          <span className="md:hidden font-body font-light text-text-main text-lg tracking-widest">
            {item.price.toFixed(2)}€
          </span>
        </div>
        <p className="text-text-main text-sm md:text-base font-body font-medium max-w-2xl leading-relaxed italic opacity-80">
          {item.description}
        </p>
      </div>
    </div>
    <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
      <span className="hidden md:block font-body font-light text-text-main text-xl tracking-widest">
        {item.price.toFixed(2)}€
      </span>
    </div>
  </div>
);

/**
 * @component WineDisplayRow
 * @description Representación visual para los vinos, mostrando precios por copa y botella.
 */
const WineDisplayRow = ({ item }) => (
  <div className="group relative py-6 md:py-10 border-b border-text-main/10 flex flex-col md:flex-row md:items-center justify-between hover:bg-text-main/5 transition-colors duration-500 gap-4 sm:gap-6">
    <div className="flex items-center gap-8 w-full md:w-3/4">
      <div className="flex-grow">
        <div className="flex items-baseline gap-4 mb-2">
          <h3 className="font-heading text-3xl md:text-4xl text-text-main group-hover:text-primary transition-colors leading-tight">
            {item.name}
          </h3>
          <span className="md:hidden font-body font-light text-text-main text-lg tracking-widest">
            {item.price.toFixed(2)}€
          </span>
        </div>
        <p className="text-text-main text-sm md:text-base font-body font-medium max-w-2xl leading-relaxed italic opacity-80">
          {item.description}
        </p>
      </div>
    </div>
    <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
      <div className="hidden md:flex flex-col items-end">
        <span className="font-body font-light text-text-main text-xl tracking-widest">
          {item.price.toFixed(2)}€<span className="text-text-muted text-sm ml-1">/ botella</span>
        </span>
        {item.priceGlass && (
          <span className="font-body font-light text-text-muted text-base tracking-widest mt-1">
            {item.priceGlass.toFixed(2)}€<span className="text-text-muted text-sm ml-1">/ copa</span>
          </span>
        )}
      </div>
    </div>
  </div>
);

/**
 * @component TastingMenuCard
 * @description Tarjeta informativa para menús degustación, listando los pasos incluidos.
 */
const TastingMenuCard = ({ menu, index }) => (
  <div className="border border-text-main/10 bg-bg-body relative overflow-hidden">
    {/* Línea decorativa superior */}
    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"></div>

    <div className="p-8 sm:p-12 md:p-16">
      {/* Cabecera del menú */}
      <div className="text-center mb-12 sm:mb-16">
        <span className="text-primary text-[11px] tracking-[4px] font-body font-bold uppercase mb-4 block">
          {menu.courses} Tiempos
        </span>
        <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-text-main mb-6 leading-tight">
          <span className="italic">{menu.name.split(' ')[0]}</span> {menu.name.split(' ').slice(1).join(' ')}
        </h2>
        <div className="w-12 h-[1px] bg-primary/50 mx-auto mb-6"></div>
        <p className="text-text-muted font-light leading-relaxed text-base sm:text-lg max-w-2xl mx-auto">
          {menu.description}
        </p>
      </div>

      {/* Lista de platos del menú */}
      <div className="max-w-3xl mx-auto mb-12 sm:mb-16">
        {menu.dishes.map((dish, i) => (
          <div
            key={`${menu.id}-${dish.id}-${i}`}
            className="flex items-baseline gap-4 py-4 border-b border-text-main/5 last:border-0">
            <span className="text-primary text-[11px] tracking-[3px] font-body font-bold shrink-0 w-8">
              {String(dish.pivot?.course_number || i + 1).padStart(2, '0')}
            </span>
            <div className="flex-grow">
              <span className="font-heading text-xl sm:text-2xl text-text-main">{dish.name}</span>
              {dish.pivot?.notes && <p className="text-text-muted text-sm font-body italic mt-1">{dish.pivot.notes}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Precio del menú */}
      <div className="text-center">
        <span className="font-heading text-4xl sm:text-5xl text-text-main">{menu.price.toFixed(0)}€</span>
        <span className="block text-text-muted text-[11px] tracking-[2px] font-body mt-1 uppercase">por persona</span>
        <p className="text-text-muted/60 text-[11px] tracking-[1px] font-body mt-4 uppercase">
          Disponible exclusivamente en sala
        </p>
      </div>
    </div>

    {/* Línea decorativa inferior */}
    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
  </div>
);

/**
 * @component EmptyState
 * @description Estado visual cuando una categoría de menú no tiene elementos disponibles.
 */
const EmptyState = () => (
  <FadeIn className="flex flex-col items-center justify-center py-32 text-center">
    <span className="text-primary text-4xl mb-6 opacity-80">✦</span>
    <p className="text-text-muted font-light tracking-wide text-base sm:text-lg max-w-md mx-auto">
      La colección para esta categoría se encuentra en desarrollo por nuestro Chef.
    </p>
  </FadeIn>
);

export default MenuView;
