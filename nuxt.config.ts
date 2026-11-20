export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  ssr: true,
  css: ['~/assets/style.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Lista de la compra',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  runtimeConfig: {
    public: {
      //se pueden cambiar con NUXT_PUBLIC_SUPABASE_URL y NUXT_PUBLIC_SUPABASE_KEY
      supabaseUrl: 'https://tynmtgjjapyxukbxxpoc.supabase.co',
      supabaseKey: 'sb_publishable_J6r6CiO19PjO5sAHXMd6mA_AS1ZF9pj',
    },
  },
})
