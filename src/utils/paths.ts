// Astro supplies this value from the single deployment base configuration.
export const basePath = import.meta.env.BASE_URL;
export const sitePath = (path = '') => `${basePath}${path.replace(/^\/+/, '')}`;
