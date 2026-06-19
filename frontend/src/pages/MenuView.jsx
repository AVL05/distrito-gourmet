import { Helmet } from "react-helmet-async";
import { useCartStore } from "@/store/cart";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "@/services/api";
import { HAS_CONFIGURED_API, USE_STATIC_DEMO_DATA } from "@/config/demo";
import { demoMenuData } from "@/data/demoMenu";
import {
  PageTransition,
  FadeIn,
  StaggerList,
  StaggerItem,
  ScrollReveal,
  TextReveal,
  LineReveal,
  MotionButton,
} from "@/motion";

const MENU_REQUEST_TIMEOUT_MS = 7000;

// Carga y organización de la carta gastronómica por categorías desde el servidor
const MenuView = () => {
  const { addItem, totalItems, totalPrice } = useCartStore();
  const [activeCategory, setActiveCategory] = useState("carta");
  const [addedItemId, setAddedItemId] = useState(null);
  const [addedItem, setAddedItem] = useState(null);
  const [menuData, setMenuData] = useState({
    dishes: [],
    beverages: [],
    wines: [],
    tastingMenus: [],
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  // Categorías del menú para las pestañas de filtro
  const categories = [
    { id: "carta", label: "Toda la Carta" },
    { id: "bebidas", label: "Bebidas" },
    { id: "bodega", label: "Bodega" },
    { id: "menus", label: "Menús" },
  ];
  const cartCount = totalItems();
  const cartTotal = totalPrice();

  const handleAddItem = (item) => {
    addItem(item);
    setAddedItemId(item.id);
    setAddedItem(item);
    window.setTimeout(() => {
      setAddedItemId(null);
      setAddedItem(null);
    }, 1800);
  };

  // Trae los platos, vinos y demás desde la API
  useEffect(() => {
    const fetchMenu = async () => {
      if (USE_STATIC_DEMO_DATA) {
        setMenuData(demoMenuData);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/dishes", {
          timeout: MENU_REQUEST_TIMEOUT_MS,
        });
        if (!response.data || typeof response.data !== "object") {
          throw new Error("Respuesta de carta inválida");
        }
        const { platos, vinos, bebidas, menus_degustacion } = response.data;

        // Formatear platos
        const formattedDishes = (platos || [])
          .filter((d) => !!d.disponible && !!d.visible_en_carta)
          .map((d) => ({
            id: d.id,
            item_type: "plato",
            name: d.nombre,
            description: d.descripcion,
            price: parseFloat(d.precio),
            category: d.categoria ? d.categoria.nombre.toLowerCase() : "otros",
            image: d.imagen,
            allergens: d.alergenos,
            max_per_order: d.maximo_por_pedido,
            isPerUnit: !!d.es_por_unidad,
            availableTakeaway: !!d.disponible_para_llevar,
          }));

        // Formatear vinos
        const formattedWines = (vinos || []).map((w) => ({
          id: `w${w.id}`,
          item_type: "vino",
          name: w.nombre,
          description: w.notas_maridaje || "",
          price: parseFloat(w.precio_botella),
          priceGlass: w.precio_copa ? parseFloat(w.precio_copa) : null,
          wineType: w.tipo,
          image: w.imagen,
          max_per_order: w.maximo_por_pedido,
        }));

        // Formatear bebidas
        const formattedBeverages = (bebidas || []).map((b) => ({
          id: `b${b.id}`,
          item_type: "bebida",
          name: b.nombre,
          description: b.descripcion || "",
          price: parseFloat(b.precio),
          beverageType: b.tipo,
        }));

        // Formatear menús degustación
        const formattedMenus = (menus_degustacion || []).map((m) => ({
          id: `m${m.id}`,
          item_type: "menu_degustacion",
          name: m.nombre,
          description: m.descripcion || "",
          price: parseFloat(m.precio),
          courses: m.pasos,
          duration: m.duracion_estimada_minutos,
          isVegetarian: !!m.alternativa_vegetariana,
          isSeasonal: !!m.menu_de_temporada,
          pairing_available: !!m.precio_maridaje,
          pairing_price: m.precio_maridaje ? parseFloat(m.precio_maridaje) : 0,
          dishes: m.platos || [],
        }));

        setMenuData({
          dishes: formattedDishes,
          beverages: formattedBeverages,
          wines: formattedWines,
          tastingMenus: formattedMenus,
        });
        setLoadError(false);
      } catch (e) {
        if (import.meta.env.DEV) {
          console.error("No se pudo cargar la carta", e);
        }
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Categorías de platos para "Toda la Carta"
  const dishCategories = ["entrantes", "principales", "postres"];
  const getDishesForCategory = (cat) =>
    menuData.dishes.filter((d) => d.category === cat);

  // Tipos de bebidas para la pestaña de bebidas
  const beverageTypes = [
    { key: "agua", label: "Aguas" },
    { key: "refresco", label: "Refrescos & Zumos" },
    { key: "cocktail", label: "Cócteles" },
    { key: "cafe", label: "Cafés & Infusiones" },
  ];
  const getBeveragesByType = (type) =>
    menuData.beverages.filter((b) => b.beverageType === type);

  // Tipos de vinos para la pestaña de bodega
  const wineTypes = [
    { key: "Tinto", label: "Tintos" },
    { key: "Blanco", label: "Blancos" },
    { key: "Espumoso", label: "Espumosos & Champagne" },
    { key: "Rosado", label: "Rosados" },
  ];
  const getWinesByType = (type) =>
    menuData.wines.filter((w) => w.wineType === type);

  // Transición de pestañas manejada por PageTransition internamente al cambiar la key

  return (
    <PageTransition className="bg-bg-body text-text-main min-h-screen pb-32 relative overflow-hidden">
      <Helmet>
        <title>La Carta | Distrito Gourmet</title>
        <meta name="description" content="Descubre nuestra carta de temporada: entrantes, arroces, carnes, pescados, bodega y menús degustación." />
      </Helmet>
      {/* Luz ambiental de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(1000px,100vw)] h-[420px] sm:h-[600px] bg-primary/5 rounded-full blur-[120px] sm:blur-[150px] pointer-events-none"></div>

      {/* Cabecera con TextReveal inspirado en Adachi */}
      <div className="relative pt-32 sm:pt-40 pb-16 sm:pb-20 border-b border-text-main/10 z-10">
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
              style={{ maxWidth: "4rem" }}
            />
          </FadeIn>
          <FadeIn delay={0.5}>
            <p className="text-text-muted font-normal leading-relaxed sm:leading-loose text-base sm:text-lg max-w-2xl mx-auto">
              Una selección de sabores diseñada para despertar los sentidos,
              desde los clásicos reinventados hasta las creaciones más audaces
              de nuestro equipo a los mandos.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Pestañas de filtro */}
      <div className="sticky top-16 md:top-20 z-40 bg-bg-body/90 backdrop-blur-xl border-b border-text-main/10 py-3 sm:py-5 mb-12 sm:mb-16 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <div className="container overflow-x-auto no-scrollbar">
          <div className="flex justify-start sm:justify-center min-w-max gap-6 sm:gap-12 md:gap-16 px-1 sm:px-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`uppercase text-[11px] sm:text-[13px] tracking-[1.5px] sm:tracking-[2px] transition-all duration-500 pb-2 relative group whitespace-nowrap font-medium ${
                  activeCategory === cat.id
                    ? "text-primary"
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                {cat.label}
                <div
                  className="absolute bottom-0 left-0 h-[1.5px] bg-primary transition-all duration-500"
                  style={{
                    width: activeCategory === cat.id ? "100%" : "0%",
                    boxShadow:
                      activeCategory === cat.id
                        ? "0 0 10px rgba(166,138,86,0.5)"
                        : "none",
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido del menú según la categoría activa */}
      <div className="container relative z-10">
        {loading ? (
          <MenuSkeleton />
        ) : (
          <PageTransition key={activeCategory}>
            {loadError && HAS_CONFIGURED_API && <ApiUnavailableState />}

            {/* TODA LA CARTA */}
            {!loadError && activeCategory === "carta" && (
              <div className="space-y-20 sm:space-y-32">
                {dishCategories.map((catKey, index) => {
                  const items = getDishesForCategory(catKey);
                  if (items.length === 0) return null;
                  const label =
                    catKey.charAt(0).toUpperCase() + catKey.slice(1);

                  return (
                    <div key={catKey} className="mt-12 sm:mt-16 mb-16 sm:mb-24">
                      <SectionHeader index={index} label={label} />
                      <StaggerList className="flex flex-col w-full max-w-5xl mx-auto px-0 sm:px-4">
                        {items.map((item) => (
                          <StaggerItem key={item.id}>
                            <DishRow
                              item={item}
                              addItem={handleAddItem}
                              isAdded={addedItemId === item.id}
                            />
                          </StaggerItem>
                        ))}
                      </StaggerList>
                    </div>
                  );
                })}
              </div>
            )}

            {/* BEBIDAS */}
            {!loadError && activeCategory === "bebidas" && (
              <div className="space-y-20 sm:space-y-32">
                {beverageTypes.map((bt, index) => {
                  const items = getBeveragesByType(bt.key);
                  if (items.length === 0) return null;

                  return (
                    <div key={bt.key} className="mt-12 sm:mt-16 mb-16 sm:mb-24">
                      <SectionHeader index={index} label={bt.label} />
                      <StaggerList className="flex flex-col w-full max-w-5xl mx-auto px-0 sm:px-4">
                        {items.map((item) => (
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
            {!loadError && activeCategory === "bodega" && (
              <div className="space-y-20 sm:space-y-32">
                {wineTypes.map((wt, index) => {
                  const items = getWinesByType(wt.key);
                  if (items.length === 0) return null;

                  return (
                    <div key={wt.key} className="mt-12 sm:mt-16 mb-16 sm:mb-24">
                      <SectionHeader index={index} label={wt.label} />
                      <StaggerList className="flex flex-col w-full max-w-5xl mx-auto px-0 sm:px-4">
                        {items.map((item) => (
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
            {!loadError && activeCategory === "menus" && (
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
            {!loadError &&
              activeCategory === "carta" &&
              menuData.dishes.length === 0 && <EmptyState />}
            {!loadError &&
              activeCategory === "bebidas" &&
              menuData.beverages.length === 0 && <EmptyState />}
            {!loadError &&
              activeCategory === "bodega" &&
              menuData.wines.length === 0 && <EmptyState />}
          </PageTransition>
        )}
      </div>
      {addedItem && (
        <div className="fixed bottom-20 left-4 right-4 z-[53] mx-auto max-w-md border border-text-main/10 bg-bg-body/95 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl md:bottom-24 md:left-auto md:right-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="block font-body text-[10px] uppercase tracking-[1.6px] text-primary">
                Añadido
              </span>
              <p className="text-sm font-medium text-text-main">
                {addedItem.name}
              </p>
            </div>
            <Link
              to="/cart"
              className="shrink-0 font-body text-[11px] uppercase tracking-[1.5px] text-text-main border-b border-text-main pb-1 hover:text-primary hover:border-primary transition-colors"
            >
              Ver selección
            </Link>
          </div>
        </div>
      )}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 hidden border-t border-text-main/10 bg-bg-body/95 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl md:block">
          <div className="container flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <span className="block text-[10px] uppercase tracking-[3px] text-text-muted font-body">
                Selección para recogida
              </span>
              <span className="font-heading text-xl text-text-main">
                {cartCount} {cartCount === 1 ? "artículo" : "artículos"} ·{" "}
                {cartTotal.toFixed(2)}€
              </span>
            </div>
            <Link
              to="/cart"
              className="group relative w-full sm:w-auto px-8 py-3 bg-text-main text-bg-body font-body text-[11px] uppercase tracking-[2px] overflow-hidden transition-all hover:bg-primary text-center"
            >
              <span className="relative z-10 font-bold">Ver carrito</span>
            </Link>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

const SkeletonLine = ({ className = "" }) => (
  <div className={`skeleton rounded-sm ${className}`} />
);

const MenuSkeleton = () => (
  <div className="max-w-5xl mx-auto py-16 sm:py-24 space-y-20">
    {[
      { rows: 4, labelW: "w-24" },
      { rows: 5, labelW: "w-32" },
      { rows: 3, labelW: "w-28" },
    ].map((section, sIdx) => (
      <div key={sIdx}>
        {/* Cabecera de sección skeleton */}
        <div className="flex items-center gap-4 mb-16 px-4">
          <SkeletonLine className="flex-grow h-px hidden sm:block" />
          <SkeletonLine className={`h-3 ${section.labelW} flex-shrink-0`} />
          <SkeletonLine className="h-10 w-48 flex-shrink-0" />
          <SkeletonLine className="flex-grow h-px" />
        </div>

        {/* Filas de plato skeleton */}
        <div className="flex flex-col border-t border-text-main/5">
          {Array.from({ length: section.rows }).map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-start gap-6 py-8 px-4 border-b border-text-main/5"
            >
              <div className="flex-1 space-y-3">
                <SkeletonLine className={`h-5 ${i % 2 === 0 ? "w-3/5" : "w-2/5"}`} />
                <SkeletonLine className={`h-3 ${i % 3 === 0 ? "w-full" : "w-4/5"}`} />
                <SkeletonLine className="h-3 w-1/4" />
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-3 pt-1">
                <SkeletonLine className="h-5 w-16" />
                <SkeletonLine className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Cabecera de cada sección con animaciones de entrada
const SectionHeader = ({ index, label }) => (
  <ScrollReveal
    direction="up"
    distance={30}
    className="flex items-center flex-nowrap gap-4 mb-16 sm:mb-20 max-w-6xl mx-auto opacity-90 w-full overflow-hidden px-4"
  >
    <LineReveal
      className="flex-grow bg-text-main/10 hidden sm:block min-w-0"
      delay={0.3}
    />
    <span className="text-[12px] tracking-[3px] font-body text-text-muted font-bold shrink-0">
      / 0{index + 1}
    </span>
    <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl text-text-main pb-0 px-2 sm:px-4 relative top-1 whitespace-nowrap shrink-0">
      <span className="italic">{label.split(" ")[0]}</span>{" "}
      {label.split(" ").slice(1).join(" ")}
    </h2>
    <LineReveal className="flex-grow bg-text-main/10 min-w-0" delay={0.3} />
  </ScrollReveal>
);

// Fila de plato individual. Aquí es donde se añade al carrito.
const DishRow = ({ item, addItem, isAdded }) => (
  <div className="group relative py-6 md:py-10 border-b border-text-main/10 flex flex-col md:flex-row md:items-center justify-between hover:bg-text-main/5 transition-colors duration-500 gap-4">
    <div className="flex items-center gap-4 md:gap-8 w-full md:w-3/4">
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-2">
          <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl text-text-main group-hover:text-primary transition-colors leading-tight">
            {item.name}
          </h3>
          <span className="md:hidden font-body font-normal text-text-main text-lg tracking-widest">
            {item.price.toFixed(2)}€{!!item.isPerUnit && " / UD."}
          </span>
        </div>
        {item.description && (
          <p className="text-text-main text-sm md:text-base font-body font-medium max-w-2xl leading-relaxed italic opacity-80 mb-3">
            {item.description}
          </p>
        )}
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {item.availableTakeaway === false && (
            <span className="text-[10px] uppercase tracking-widest text-red-800/80">
              Solo disponible en sala
            </span>
          )}
          {item.max_per_order && item.max_per_order < 999 && (
            <span className="text-[10px] uppercase tracking-widest text-text-muted opacity-60">
              Máx. {item.max_per_order} por pedido
            </span>
          )}
          {item.allergens && (
            <span className="text-[10px] uppercase tracking-widest text-text-muted opacity-60">
              Alérgenos: {item.allergens}
            </span>
          )}
        </div>
      </div>
    </div>

    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 w-full md:w-auto mt-2 md:mt-0">
      <span className="hidden md:block font-body font-normal text-text-main text-xl tracking-widest mb-4">
        {item.price.toFixed(2)}€
        {!!item.isPerUnit && (
          <span className="text-[12px] ml-1 opacity-60">/ UD.</span>
        )}
      </span>
      <MotionButton
        onClick={() => addItem(item)}
        disabled={item.availableTakeaway === false}
        className={`group w-full md:w-auto relative px-8 py-3 border font-body text-[11px] uppercase tracking-[2px] overflow-hidden transition-all duration-500 focus:outline-none ${
          item.availableTakeaway === false
            ? "cursor-not-allowed border-text-main/10 text-text-muted/50"
            : isAdded
              ? "bg-primary border-primary text-white"
              : "bg-transparent border-text-main/30 text-text-main hover:border-primary"
        }`}
      >
        <div className="absolute inset-0 w-0 bg-primary transition-all duration-[500ms] ease-out group-hover:w-full z-0"></div>
        <span className="relative z-10 font-bold transition-colors duration-300 group-hover:text-white">
          {item.availableTakeaway === false
            ? "Solo sala"
            : isAdded
              ? "Añadido"
              : "Añadir para Recogida"}
        </span>
      </MotionButton>
    </div>
  </div>
);

// Fila informativa para bebidas y artículos sin opción de carrito directa.
const DisplayRow = ({ item }) => (
  <div className="group relative py-6 md:py-10 border-b border-text-main/10 flex flex-col md:flex-row md:items-center justify-between hover:bg-text-main/5 transition-colors duration-500 gap-4 sm:gap-6">
    <div className="flex items-center gap-8 w-full md:w-3/4">
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-2">
          <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl text-text-main group-hover:text-primary transition-colors leading-tight">
            {item.name}
          </h3>
          <span className="md:hidden font-body font-normal text-text-main text-lg tracking-widest">
            {item.price.toFixed(2)}€
          </span>
        </div>
        <p className="text-text-main text-sm md:text-base font-body font-medium max-w-2xl leading-relaxed italic opacity-80">
          {item.description}
        </p>
      </div>
    </div>
    <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
      <span className="hidden md:block font-body font-normal text-text-main text-xl tracking-widest">
        {item.price.toFixed(2)}€
      </span>
    </div>
  </div>
);

// Representación visual para los vinos, mostrando precios por copa y botella.
const WineDisplayRow = ({ item }) => (
  <div className="group relative py-6 md:py-10 border-b border-text-main/10 flex flex-col md:flex-row md:items-center justify-between hover:bg-text-main/5 transition-colors duration-500 gap-4 sm:gap-6">
    <div className="flex items-center gap-8 w-full md:w-3/4">
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-2">
          <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl text-text-main group-hover:text-primary transition-colors leading-tight">
            {item.name}
          </h3>
          <span className="md:hidden font-body font-normal text-text-main text-lg tracking-widest">
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
        <span className="font-body font-normal text-text-main text-xl tracking-widest">
          {item.price.toFixed(2)}€
          <span className="text-text-muted text-sm ml-1">/ botella</span>
        </span>
        {item.priceGlass && (
          <span className="font-body font-normal text-text-muted text-base tracking-widest mt-1">
            {item.priceGlass.toFixed(2)}€
            <span className="text-text-muted text-sm ml-1">/ copa</span>
          </span>
        )}
      </div>
    </div>
  </div>
);

// Tarjeta grande para el menú degustación con todos sus pasos
const TastingMenuCard = ({ menu }) => (
  <div className="border border-text-main/10 bg-bg-body relative overflow-hidden">
    {/* Línea decorativa superior */}
    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"></div>

    <div className="p-8 sm:p-12 md:p-16">
      {/* Cabecera del menú */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="text-primary text-[11px] tracking-[4px] font-body font-bold uppercase">
            {menu.courses} Tiempos
          </span>
          {menu.isSeasonal && (
            <span className="text-text-muted text-[9px] tracking-[2px] border border-text-main/20 px-2 py-0.5 uppercase">
              Temporada
            </span>
          )}
          {menu.isVegetarian && (
            <span className="text-green-800/60 text-[9px] tracking-[2px] border border-green-800/20 px-2 py-0.5 uppercase">
              Veggie OK
            </span>
          )}
        </div>
        <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl text-text-main mb-6 leading-tight">
          <span className="italic">{menu.name.split(" ")[0]}</span>{" "}
          {menu.name.split(" ").slice(1).join(" ")}
        </h2>
        <div className="w-12 h-[1px] bg-primary/50 mx-auto mb-6"></div>
        <p className="text-text-muted font-normal leading-relaxed text-base sm:text-lg max-w-2xl mx-auto">
          {menu.description}
        </p>
        {menu.duration && (
          <span className="block text-text-muted/40 text-[10px] tracking-[3px] uppercase mt-6">
            Duración estimada: {menu.duration} min.
          </span>
        )}
      </div>

      {/* Lista de platos del menú */}
      <div className="max-w-3xl mx-auto mb-12 sm:mb-16">
        {menu.dishes.map((dish, i) => (
          <div
            key={`${menu.id}-${dish.id}-${i}`}
            className="flex items-baseline gap-4 py-4 border-b border-text-main/5 last:border-0"
          >
            <span className="text-primary text-[11px] tracking-[3px] font-body font-bold shrink-0 w-8">
              {String(dish.pivot?.numero_paso || i + 1).padStart(2, "0")}
            </span>
            <div className="flex-grow">
              <span className="font-heading text-xl sm:text-2xl text-text-main">
                {dish.nombre || dish.name}
              </span>
              {(dish.pivot?.notas || dish.pivot?.notes) && (
                <p className="text-text-muted text-sm font-body italic mt-1">
                  {dish.pivot?.notas || dish.pivot?.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Precio del menú y maridaje opcional */}
      <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 border-t border-text-main/10 pt-12">
        <div className="text-center">
          <span className="font-heading text-4xl sm:text-5xl text-text-main">
            {menu.price.toFixed(0)}€
          </span>
          <span className="block text-text-muted text-[11px] tracking-[2px] font-body mt-1 uppercase">
            por persona
          </span>
        </div>

        {menu.pairing_available && (
          <div className="text-center border-l border-text-main/10 pl-8 sm:pl-16">
            <span className="font-heading text-4xl sm:text-5xl text-primary">
              {menu.pairing_price.toFixed(0)}€
            </span>
            <span className="block text-primary text-[11px] tracking-[2px] font-body mt-1 uppercase font-bold">
              Maridaje sugerido
            </span>
          </div>
        )}
      </div>
      <p className="text-text-muted/60 text-[11px] tracking-[1px] font-body mt-4 uppercase text-center">
        Disponible exclusivamente en sala
      </p>
    </div>

    {/* Línea decorativa inferior */}
    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
  </div>
);

// Estado visual cuando una categoría de menú no tiene elementos disponibles.
const EmptyState = ({ children }) => (
  <FadeIn className="flex flex-col items-center justify-center py-32 text-center">
    <span className="text-primary text-4xl mb-6 opacity-80">✦</span>
    <p className="text-text-muted font-normal tracking-wide text-base sm:text-lg max-w-md mx-auto">
      {children ||
        "Ahora mismo no hay referencias disponibles en esta categoría."}
    </p>
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="mt-8 min-h-11 border border-text-main/20 px-5 font-body text-[11px] uppercase tracking-[1.6px] text-text-main hover:border-primary hover:text-primary transition-colors"
    >
      Volver a categorías
    </button>
  </FadeIn>
);

const ApiUnavailableState = () => (
  <FadeIn className="flex flex-col items-center justify-center py-32 text-center">
    <span className="text-primary text-4xl mb-6 opacity-80">!</span>
    <p className="text-text-muted font-normal tracking-wide text-base sm:text-lg max-w-md mx-auto">
      La carta no está disponible en este momento. Compruebe la conexión con la
      API o vuelva a intentarlo en unos segundos.
    </p>
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="mt-8 min-h-11 border border-text-main/20 px-5 font-body text-[11px] uppercase tracking-[1.6px] text-text-main hover:border-primary hover:text-primary transition-colors font-medium"
    >
      Reintentar carga
    </button>
  </FadeIn>
);

export default MenuView;
