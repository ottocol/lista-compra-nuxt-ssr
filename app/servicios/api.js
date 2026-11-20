import { useSupabaseClient, useSupabaseUser } from '#imports'

//Ahora el cliente lo crea el módulo @nuxtjs/supabase. En el navegador guarda la
//sesión en cookies (no en localStorage), que viajan con cada petición al servidor.
//En el servidor crea un cliente para cada petición que lee esas cookies: así el
//servidor sabe quién es el usuario y Supabase le devuelve SU lista.
//Ojo: en el servidor solo se puede pedir el cliente antes del primer await de
//cada función, por eso cada función lo guarda en una constante al empezar
function supabase() {
  return useSupabaseClient()
}

async function login(email, password) {
  const cliente = supabase()
  const { data, error } = await cliente.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw new Error('Error al hacer login: ' + error.message)
  return data // { user, session }
}


async function logout() {
  const cliente = supabase()
  const { error } = await cliente.auth.signOut({ scope: 'local' })
  if (error) throw new Error('Error al cerrar sesión: ' + error.message)
}

//Devuelve la sesión actual o null si no hay usuario autenticado
async function getSesion() {
  const cliente = supabase()
  const { data: { session }, error } = await cliente.auth.getSession()
  if (error) throw error
  return session
}

async function obtenerProductos() {
  const cliente = supabase()
  if (!await getSesion()) return []

  const { data, error } = await cliente
    .from('lista')
    .select('id, nombre, comprado, usuario')
    .order('id')

  if (error) throw new Error('Error al obtener productos: ' + error.message)
  return data
}

//Crea un producto y devuelve el objeto creado (con su id asignado por la BD)
async function crearProducto(nombre) {
  const cliente = supabase()
  const session = await getSesion()
  if (!session) return

  const { data, error } = await cliente
    .from('lista')
    .insert({ nombre, comprado: false, usuario: session.user.id })
    .select('id, nombre, comprado, usuario')
    .single()

  if (error) throw new Error('Error al crear producto: ' + error.message)
  return data
}

async function borrarProducto(id) {
  const cliente = supabase()
  if (!await getSesion()) return

  const { error } = await cliente
    .from('lista')
    .delete()
    .eq('id', id)

  if (error) throw new Error('Error al borrar producto: ' + error.message)
}

async function setComprado(id, valor) {
  const cliente = supabase()
  if (!await getSesion()) return

  const { error } = await cliente
    .from('lista')
    .update({ comprado: valor })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

async function setNombre(id, nombre) {
  const cliente = supabase()
  if (!await getSesion()) return

  const { error } = await cliente
    .from('lista')
    .update({ nombre })
    .eq('id', id)

  if (error) throw new Error('Error al editar producto: ' + error.message)
}

async function getUsuario() {
  const cliente = supabase()
  //el módulo ya ha comprobado el usuario al empezar (en el servidor, con la cookie)
  const usuario = useSupabaseUser()
  if (usuario.value) return usuario.value
  //si aún no lo sabe (por ejemplo, justo después de hacer login), lo comprobamos
  const { data } = await cliente.auth.getClaims()
  return data?.claims ?? null    //{ sub, email, ... }
}

export { login, logout, obtenerProductos, crearProducto, borrarProducto,
         setComprado, setNombre, getUsuario }
