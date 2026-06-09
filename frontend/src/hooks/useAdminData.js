import { useCallback, useEffect, useState } from "react";
import axios from "@/services/api";
import Swal from "sweetalert2";
import { USE_STATIC_DEMO_DATA } from "@/config/demo";
import { demoAdminData } from "@/data/demoAdmin";

const sortDishesByCategory = (dishes = []) =>
  [...dishes].sort((a, b) => {
    const order = { entrantes: 1, principales: 2, postres: 3 };
    const orderA = order[a.categoria?.nombre?.toLowerCase?.()] || 99;
    const orderB = order[b.categoria?.nombre?.toLowerCase?.()] || 99;
    return orderA - orderB;
  });

export const useAdminData = ({ activeSection, newDishCategoryId, setNewDish }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    orders: [],
    menu: [],
    reservations: [],
    users: [],
    categories: [],
    wines: [],
    beverages: [],
    tasting_menus: [],
  });

  const fetchData = useCallback(async () => {
    if (USE_STATIC_DEMO_DATA) {
      setLoading(false);
      setData((current) => ({
        ...current,
        orders: demoAdminData.orders,
        reservations: demoAdminData.reservations,
        menu: demoAdminData.menu,
        categories: demoAdminData.categories,
        wines: demoAdminData.wines,
        beverages: demoAdminData.beverages,
        tasting_menus: demoAdminData.tasting_menus,
        users: demoAdminData.users,
      }));
      if (!newDishCategoryId) {
        setNewDish((prev) => ({
          ...prev,
          categoria_menu_id: demoAdminData.categories[0]?.id || "",
        }));
      }
      return;
    }

    setLoading(true);
    try {
      if (activeSection === "orders") {
        const res = await axios.get("/admin/orders");
        setData((d) => ({ ...d, orders: res.data }));
      } else if (activeSection === "reservations") {
        const res = await axios.get("/admin/reservations");
        setData((d) => ({ ...d, reservations: res.data }));
      } else if (activeSection === "menu") {
        const res = await axios.get("/dishes");
        const sortedDishes = sortDishesByCategory(res.data.platos || []);
        setData((d) => ({
          ...d,
          menu: sortedDishes,
          categories: res.data.categorias || [],
        }));
        if (res.data.categorias?.length > 0 && !newDishCategoryId) {
          setNewDish((prev) => ({
            ...prev,
            categoria_menu_id: res.data.categorias[0].id,
          }));
        }
      } else if (activeSection === "wines") {
        const res = await axios.get("/admin/wines");
        setData((d) => ({ ...d, wines: res.data }));
      } else if (activeSection === "beverages") {
        const res = await axios.get("/admin/beverages");
        setData((d) => ({ ...d, beverages: res.data }));
      } else if (activeSection === "tasting_menus") {
        const [menusRes, dishesRes] = await Promise.all([
          axios.get("/admin/tasting-menus"),
          axios.get("/dishes"),
        ]);
        const sortedDishes = sortDishesByCategory(dishesRes.data.platos || []);
        setData((d) => ({
          ...d,
          tasting_menus: menusRes.data,
          menu: sortedDishes,
        }));
      } else if (activeSection === "users") {
        const res = await axios.get("/admin/users");
        setData((d) => ({ ...d, users: res.data }));
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error de carga",
        text: "No se pudieron recuperar los datos del servidor.",
        background: "#fdfaf6",
        color: "#2c302e",
      });
    } finally {
      setLoading(false);
    }
  }, [activeSection, newDishCategoryId, setNewDish]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, setData, loading, fetchData };
};
