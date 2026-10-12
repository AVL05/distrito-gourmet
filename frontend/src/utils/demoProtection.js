export const isDemoWrite = (method, isDemo) => isDemo && ['post', 'put', 'patch', 'delete'].includes(String(method).toLowerCase());
