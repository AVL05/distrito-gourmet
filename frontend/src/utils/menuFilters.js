const normalize = (text) => String(text ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const allergensOf = (dish) => String(dish.allergens ?? '').toLowerCase().split(',').map((value) => ['leche', 'lacteos'].includes(normalize(value).trim()) ? 'lácteos' : value.trim()).filter(Boolean);

export const getAllergens = (dishes) => [...new Set(dishes.flatMap(allergensOf))].sort((a, b) => a.localeCompare(b, 'es'));

export const filterDishes = (dishes, search, excludedAllergen, takeaway) => dishes.filter((dish) => {
  const matches = normalize(`${dish.name} ${dish.description}`).includes(normalize(search).trim());
  // Un dato ausente no acredita la ausencia de alérgenos.
  const allergenMatches = !excludedAllergen || (Boolean(dish.allergens) && !allergensOf(dish).some((value) => normalize(value) === normalize(excludedAllergen)));
  return matches && allergenMatches && (!takeaway || dish.availableTakeaway === true);
});
