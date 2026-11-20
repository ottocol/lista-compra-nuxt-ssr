<script setup>
 import { ref } from 'vue';

 const props = defineProps(["nombre","comprado","id"])
 const emit = defineEmits(["toggle_prod", "borrar_prod", "editar_prod"])

 //estado local del componente: ¿estamos editando el nombre?
 const editando = ref(false)
 const nombreEditado = ref("")

 function calcClass() {
    return "producto " + (props.comprado ? "comprado" : "")
 }

 function empezarEdicion() {
    nombreEditado.value = props.nombre
    editando.value = true
 }

 function guardarEdicion() {
    const limpio = nombreEditado.value.trim()
    if (limpio && limpio != props.nombre)
       emit("editar_prod", props.id, limpio)
    editando.value = false
 }

 function cancelarEdicion() {
    editando.value = false
 }
</script>

<template>
    <li v-if="!editando">
        <button :class="calcClass()" @click="$emit('toggle_prod', id)">
            {{nombre}}
        </button>
        <button class="accion" title="Editar" @click="empezarEdicion">
            ✎
        </button>
        <button class="accion eliminar" title="Eliminar" @click="$emit('borrar_prod', id)">
            x
        </button>
    </li>
    <li v-else>
        <form class="edicion" @submit.prevent="guardarEdicion">
            <input type="text" required v-model="nombreEditado"
                   @keyup.esc="cancelarEdicion">
            <button type="submit" class="accion">Guardar</button>
            <button type="button" class="accion" @click="cancelarEdicion">Cancelar</button>
        </form>
    </li>
</template>

<style scoped>
li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 76px;
  padding: 0.7rem 1.25rem;
}

li + li {
  border-top: 1px solid #e8eee8;
}

li:hover {
  background: #f9fbf8;
}

.producto {
  flex: 1;
  padding: 0.5rem 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 1.4rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.producto.comprado {
  color: #8b988e;
  text-decoration: line-through;
}

.accion {
  padding: 0.4rem 0.7rem;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #367b57;
  font: inherit;
  font-size: 1.1rem;
  cursor: pointer;
}

.accion:hover {
  background: #eef5ef;
}

.eliminar {
  color: #9b5b55;
  font-size: 1.6rem;
}

.eliminar:hover {
  background: #fff0ed;
}

.edicion {
  display: flex;
  flex: 1;
  gap: 0.5rem;
}

.edicion input {
  flex: 1;
  min-width: 0;
  padding: 0.6rem 0.8rem;
  border: 1px solid #cbd8cc;
  border-radius: 10px;
  font: inherit;
  font-size: 1.2rem;
}

</style>
