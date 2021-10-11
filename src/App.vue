<template>
 <n-config-provider :theme="darkTheme">
   <n-global-style />
  <Navbar />
  <div>
    <router-view />
  </div>

   </n-config-provider>
</template>

<script>
import { store } from "./store";
import { supabase } from "./supabase";
import { darkTheme } from 'naive-ui'
import Navbar from './components/Navbar.vue'


export default {
  components: {
    Navbar,
  },
  setup() {
    store.user = supabase.auth.user();
    supabase.auth.onAuthStateChange((_, session) => {
      store.user = session.user;
    });
    

    const handleLogout = async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        alert("Logged out");
      } catch (error) {
        alert(error.error_description || error.message);
      }
    };

    return {
      store,
      handleLogout,
      darkTheme,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
