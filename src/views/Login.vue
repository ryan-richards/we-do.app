<template>
<n-space vertical justify="center" style="padding:24px;max-width:500px;margin-left:auto;margin-right:auto;padding-top:4rem;">
      <n-h1>Help with your to-do list from a <n-gradient-text type="success">
          community
        </n-gradient-text> of doers.</n-h1>
        <n-form>
          <n-form-item-row label="Email">
            <n-input placeholder="hello@email.com" type="email" v-model:value="email"/>
          </n-form-item-row>
        </n-form>
        <n-button type="primary" @click="handleLogin" block>Sign in with Magic Link</n-button>
</n-space>




</template>
<script>
import { ref } from "vue"
import { supabase } from "../supabase"
import { useRouter } from "vue-router";

export default {
  setup() {
    const loading = ref(false)
    const email = ref("")
    const router = useRouter()

    const handleLogin = async () => {
      try {
        loading.value = true
        const {user, error } = await supabase.auth.signIn({ 
            email: email.value,
            })
        if (error) throw error
        router.push('/')
      } catch (error) {
        alert(error.error_description || error.message)
      } finally {
        loading.value = false
        email.value = ""
        password.value = ""
      }
    }

    return {
      loading,
      email,
      handleLogin,
    }
  },
}
</script>