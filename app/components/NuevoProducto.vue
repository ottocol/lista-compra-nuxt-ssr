<script setup>
    import { ref } from 'vue';

    const emit = defineEmits(["nuevo_prod"])
    const nombre = ref("")

    function doAnyadir() {
        const limpio = nombre.value.trim()
        if (limpio) {
            emit("nuevo_prod", limpio)
            nombre.value = ""
        }
    }
</script>

<template>
    <form id="form_producto" @submit.prevent="doAnyadir">
        <label for="nuevo_producto">Nuevo producto</label>
        <div class="campos">
            <input
                id="nuevo_producto"
                name="nombre"
                type="text"
                placeholder="Por ejemplo, café"
                required
                v-model="nombre"
            >
            <button type="submit">Añadir</button>
        </div>
    </form>

</template>

<style scoped>
form {
  margin-bottom: 1.5rem;
}

form label {
  display: block;
  margin-bottom: 0.6rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.campos {
  display: flex;
  gap: 0.75rem;
}

.campos input {
  min-width: 0;
  flex: 1;
  padding: 0.9rem 1rem;
  border: 1px solid #cbd8cc;
  border-radius: 10px;
  background: white;
  color: inherit;
  font: inherit;
  font-size: 1.15rem;
}

.campos button {
  padding: 0.9rem 1.4rem;
  border: 0;
  border-radius: 10px;
  background: #367b57;
  color: white;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.campos button:hover {
  background: #286245;
}


</style>
