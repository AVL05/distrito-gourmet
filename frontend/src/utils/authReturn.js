export const getReturnTo = (destination) => {
  if (typeof destination !== 'string' || !/^\/(cart|reservations|dashboard|profile|admin|menu)(\?|$)/.test(destination) || destination.includes('\\')) return '/dashboard';
  return destination;
};
