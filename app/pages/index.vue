<script setup>
    import { logout, obtenerProductos, setComprado, crearProducto,
             borrarProducto, setNombre, getUsuario } from '~/servicios/api';

    //En Nuxt, useAsyncData hace la carga en el servidor durante el SSR y manda
    //el resultado al navegador junto con el HTML, para no repetir la petición
    const { data: usuario } = await useAsyncData('usuario', getUsuario)
    //deep: true porque en Nuxt 4 los datos de useAsyncData son un shallowRef: sin él,
    //un push o un prod.comprado = true no se verían en pantalla
    const { data: productos } = await useAsyncData('lista', obtenerProductos, { default: () => [], deep: true })
    const email = computed(() => usuario.value?.email)

    async function doLogout() {
        await logout()
        await navigateTo('/login')
    }

    async function doToggle(id) {
      let prod = productos.value.find((p)=>p.id==id)
      if (prod) {
        let nuevoValor = !prod.comprado
        //actualiza en servidor
        await setComprado(id, nuevoValor)
        //actualiza en cliente
        prod.comprado = nuevoValor
      }
    }

    async function doNuevo(nombre) {
      try {
        //el servidor nos devuelve el producto con su id
        let nuevo = await crearProducto(nombre)
        productos.value.push(nuevo)
      }
      catch (error) {
        alert(error.message)
      }
    }

    async function doBorrar(id) {
      let prod = productos.value.find((p)=>p.id==id)
      if (prod && confirm(`¿Eliminar "${prod.nombre}"?`)) {
        await borrarProducto(id)
        productos.value = productos.value.filter((p)=>p.id!=id)
      }
    }

    async function doEditar(id, nombre) {
      let prod = productos.value.find((p)=>p.id==id)
      if (prod) {
        await setNombre(id, nombre)
        prod.nombre = nombre
      }
    }
</script>

<template>
    <p>Bienvenid@, <span id="usuario">{{ email }}</span> <button @click="doLogout">Logout</button></p>
    <NuevoProducto @nuevo_prod="doNuevo"/>
    <p class="ayuda">Pulsa un producto para marcarlo como comprado.</p>
    <ul id="lista" v-if="productos.length>0">
       <Producto v-for="prod in productos" :key="prod.id"
        :nombre="prod.nombre" :comprado="prod.comprado" :id="prod.id"
        @toggle_prod="doToggle" @borrar_prod="doBorrar" @editar_prod="doEditar"/>
    </ul>
    <p v-else class="ayuda">La lista está vacía.</p>
</template>

<style scoped>
.ayuda {
  margin: 0 0 0.75rem;
  color: #66766a;
  font-size: 0.95rem;
}

#lista {
  margin: 0 0 1rem;
  padding: 0;
  list-style: none;
  overflow: hidden;
  border: 1px solid #dce5dc;
  border-radius: 14px;
  background: white;
  box-shadow: 0 12px 32px rgb(36 67 45 / 8%);
}

</style>
