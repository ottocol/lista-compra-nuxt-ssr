<script setup>
    import { reactive } from 'vue';
    import { login } from '~/servicios/api';

    let usuario = reactive({email:"", password:""})
    const route = useRoute()

    async function doLogin() {
        try {
            await login(usuario.email, usuario.password)
            //volvemos a donde quería ir el usuario (lo pone el guard en la query) o a la lista
            await navigateTo(route.query.volver || '/')
        }
        catch (error){
            console.log(error)
            alert("Usuario y/o contraseña incorrectos")
        }
    }
</script>

<template>
    <form @submit.prevent="doLogin">
      <label for="email">Email:</label>
      <input type="email" id="email" required v-model="usuario.email"/>
      <label for="password">Contraseña:</label>
      <input type="password" id="password" minlength="8" required v-model="usuario.password"/>
      <input type="submit" value="Entrar"/>
    </form>
</template>

<style scoped>
form {
  display: grid;
  gap: 0.6rem;
  width: min(100%, 440px);
  margin: 0 auto 2rem;
  padding: 1.75rem;
  border: 1px solid #dce5dc;
  border-radius: 14px;
  background: white;
  box-shadow: 0 12px 32px rgb(36 67 45 / 8%);
}

form label {
  margin-top: 0.5rem;
  font-size: 1.05rem;
  font-weight: 600;
}

form label:first-child {
  margin-top: 0;
}

form input:not([type="submit"]) {
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid #cbd8cc;
  border-radius: 10px;
  background: white;
  color: inherit;
  font: inherit;
  font-size: 1.1rem;
}

form input[type="submit"] {
  margin-top: 1rem;
  padding: 0.9rem 1.4rem;
  border: 0;
  border-radius: 10px;
  background: #367b57;
  color: white;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

form input[type="submit"]:hover {
  background: #286245;
}

</style>