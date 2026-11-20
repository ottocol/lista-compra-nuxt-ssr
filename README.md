# Lista de la compra en Nuxt (SSR)

La misma lista de la compra que la versión Vite, renderizada en el servidor con Nuxt.
El repositorio tiene dos versiones para ver **el problema de la sesión en SSR**:

| Rama | Dónde está la sesión | Qué pasa al recargar estando dentro |
| --- | --- | --- |
| `ssr-ingenuo` | `localStorage` (como en la versión Vite) | El servidor no sabe quién eres: responde con un 302 al login, el navegador pinta el login, se da cuenta de que sí hay sesión y vuelve a `/`. La lista la pide siempre el navegador. Aparece además un aviso de *hydration mismatch* |
| `main` | Cookies (módulo `@nuxtjs/supabase`) | El navegador manda la cookie, el servidor sabe quién eres, pide la lista a Supabase y el HTML llega con la lista ya pintada |

`git diff ssr-ingenuo main` enseña el arreglo: el módulo en `nuxt.config.ts` y de dónde sale el cliente de Supabase en `app/servicios/api.js`.

## Ejecutar

```bash
npm install
npm run build
node .output/server/index.mjs     # o: npm run preview
```

Abre `http://localhost:3000`. Usa el mismo Supabase que la versión Vite (URL y clave pública en `nuxt.config.ts`; se pueden cambiar con `NUXT_PUBLIC_SUPABASE_URL` y `NUXT_PUBLIC_SUPABASE_KEY`). Para medir, siempre la versión compilada, nunca `npm run dev`.

## Qué mirar en clase

1. Entra con tu usuario y recarga `/` con el panel Network abierto (filtro *Doc*):
   - `ssr-ingenuo`: un 302 a `/login` y después el login; en la pestaña se ve pasar por el login.
   - `main`: un único 200 con la lista.
2. Ver código fuente de la página (Ctrl+U) en `main`: los productos y el email están en el HTML. En `ssr-ingenuo`, no.
3. Application → Cookies: en `main` está la sesión en una cookie (`sb-…-auth-token`); en `ssr-ingenuo` está en Local Storage, que el servidor no puede leer.

## Detalles que merece la pena contar

- **Un módulo, todos los usuarios.** En la versión ingenua, `api.js` crea un único cliente de Supabase. En el servidor, ese módulo lo comparten todas las peticiones de todos los usuarios: si el servidor llegara a iniciar sesión con ese cliente, la sesión se mezclaría entre usuarios. El módulo `@nuxtjs/supabase` crea un cliente por petición.
- **El cliente se pide antes del primer `await`.** En el servidor, `useSupabaseClient()` solo funciona mientras Nuxt sabe a qué petición pertenece el código; después de un `await` puede haberlo olvidado. Por eso cada función de `api.js` guarda el cliente en una constante al empezar.
- **`deep: true` en `useAsyncData`.** En Nuxt 4 los datos de `useAsyncData` son un `shallowRef`: sin `deep: true`, un `push` o un `prod.comprado = true` se guardarían en Supabase pero no se verían en pantalla.
- **Coste:** cada visita hace trabajo en el servidor (comprobar el usuario y pedir la lista) y el resultado no se puede cachear, porque cada usuario tiene su lista.
