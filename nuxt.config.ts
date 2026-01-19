export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  modules: ['@nuxt/ui', '@nuxt/fonts', '@nuxt/icon', '@nuxt/image', '@nuxt/test-utils'],
  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [300, 400, 500, 600, 700, 800] },
      { name: 'Roboto', provider: 'google', weights: [300, 400, 500, 700] },
      { name: 'Open Sans', provider: 'google', weights: [300, 400, 600, 700] },
      { name: 'Montserrat', provider: 'google', weights: [300, 400, 500, 600, 700, 800] },
      { name: 'Lato', provider: 'google', weights: [300, 400, 700] },
      { name: 'Poppins', provider: 'google', weights: [300, 400, 500, 600, 700] },
      { name: 'Playfair Display', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Merriweather', provider: 'google', weights: [300, 400, 700] },
      { name: 'Source Sans Pro', provider: 'google', weights: [300, 400, 600, 700] },
      { name: 'Nunito', provider: 'google', weights: [300, 400, 600, 700] },
      { name: 'Raleway', provider: 'google', weights: [300, 400, 500, 600, 700] },
      { name: 'Oswald', provider: 'google', weights: [300, 400, 500, 600, 700] },
      { name: 'Dancing Script', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Pacifico', provider: 'google', weights: [400] },
      { name: 'Permanent Marker', provider: 'google', weights: [400] },
      { name: 'Bebas Neue', provider: 'google', weights: [400] },
      { name: 'Caveat', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Abril Fatface', provider: 'google', weights: [400] },
      { name: 'Lobster', provider: 'google', weights: [400] },
      { name: 'Comfortaa', provider: 'google', weights: [300, 400, 500, 600, 700] },
    ],
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
      meta: [
        { name: 'theme-color', content: '#ffffff' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
      ],
    },
  },
});
