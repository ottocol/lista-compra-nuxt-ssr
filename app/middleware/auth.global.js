import { getUsuario } from '~/servicios/api'

//El guard de la versión Vite, convertido en middleware de Nuxt.
//Se ejecuta en el servidor al cargar la página y en el navegador al navegar
export default defineNuxtRouteMiddleware(async (to) => {
  const usuario = await getUsuario()
  //ruta protegida sin sesión: al login, recordando adónde quería ir
  if (to.path !== '/login' && !usuario)
    return navigateTo({ path: '/login', query: to.fullPath != '/' ? { volver: to.fullPath } : {} })
  //ya autenticado: no tiene sentido mostrar el login
  if (to.path === '/login' && usuario)
    return navigateTo('/')
})
