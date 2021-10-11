<template>
  <n-layout has-sider sider-placement="right">
    <n-layout-content content-style="padding: 24px;">
        <n-space vertical justify="center" style="max-width:300px;margin-left:auto;margin-right:auto;">
        <n-h2 v-if="!username">Welcome {{ email }}</n-h2>
        <n-h2 v-else>Welcome {{ username }}</n-h2>
        <n-input-group
          justify="start"
        >
          <n-input
            id="username"
            type="text"
            v-model:value="username"
            clearable
          />
          <n-button
            class="button block"
            @click="updateProfile"
            :disabled="loading"
          >
            Update Username
          </n-button>
        </n-input-group>

        </n-space>
      <div style="max-width: 600px; padding-top:2rem; margin-left: auto; margin-right: auto">
        <n-h3>Add some skills you can share </n-h3>
        <n-h4>Try adding supabase to find some sample requests</n-h4>

        <n-space justify="center">
          <n-form>
            <n-form-item path="tags" :show-label="false">
              <n-dynamic-tags
                type="success"
                :max="10"
                v-model:value="tagArray"
              />
            </n-form-item>
          </n-form>
        </n-space>
      </div>
      <div style="padding-top: 0rem">
        <n-button
          class="button block"
          @click="deleteOldSkills"
          :disabled="loading"
        >
          Update Skills
        </n-button>
      </div>
    </n-layout-content>
       <n-layout-sider
        content-style="padding: 24px;"
        v-if="!(isMobile || isTablet)"
>
      <n-h3 style="margin-bottom: 0rem">Help Inbox</n-h3>
      <n-space
        style="padding-top: 1rem"
        justify="center"
        v-for="message in inbox"
        :key="message.id"
      >
        <n-card>
          <n-space>
            <n-a>{{ message.user.username }}</n-a>
            <n-p>{{ message.message }} with {{ message.todo }} </n-p>
          </n-space>
        </n-card>
      </n-space>

      <div style="padding-top: 1rem">
        <n-button class="button block" @click="signOut" :disabled="loading">
          Sign Out
        </n-button>
      </div>
    </n-layout-sider>
  </n-layout>
</template>

<script>
import { store } from "../store";
import { supabase } from "../supabase";
import { onMounted, ref, defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import { useIsMobile, useIsTablet } from '../utils/composables'

export default defineComponent({
  setup() {
    const router = useRouter();
    const loading = ref(true);
    const email = ref("");
    const username = ref("");
    const tagArray = ref([]);
    const loadedTagArray = ref([]);
    const inbox = ref([]);

    const isMobileRef = useIsMobile()
    const isTabletRef = useIsTablet()

    store.user = supabase.auth.user();
    supabase.auth.onAuthStateChange((_, session) => {
      store.user = session.user;
    });
    email.value = store.user.email;

    async function getProfile() {
      try {
        loading.value = true;
        store.user = supabase.auth.user();

        let { data, error, status } = await supabase
          .from("profiles")
          .select(`*`)
          .eq("id", store.user.id)
          .single();

        if (error && status !== 406) throw error;
        if (data) {
          username.value = data.username;
          tagArray.value = data.skills;
          loadedTagArray.value = data.skills;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    async function updateProfile() {
      try {
        loading.value = true;
        store.user = supabase.auth.user();

        const updates = {
          id: store.user.id,
          username: username.value,
          updated_at: new Date(),
        };

        let { error } = await supabase.from("profiles").upsert(updates, {
          returning: "minimal", // Don't return the value after inserting
        });

        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    async function deleteOldSkills() {
      try {
        loading.value = true;
        store.user = supabase.auth.user();

        const deleteSkills = {
          id: store.user.id,
          skills: loadedTagArray.value,
          updated_at: new Date(),
        };

        let { error } = await supabase.from("profiles").delete(deleteSkills, {
          returning: "minimal",
        });
        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
        updateSkills();
      }
    }

    async function updateSkills() {
      try {
        loading.value = true;
        store.user = supabase.auth.user();

        const updates = {
          id: store.user.id,
          skills: tagArray.value,
          updated_at: new Date(),
        };

        let { error } = await supabase.from("profiles").upsert(updates, {
          returning: "minimal", // Don't return the value after inserting
        });

        if (error) throw error;
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
        getProfile();
      }
    }

    async function getHelpInbox() {
      try {
        loading.value = true;
        store.user = supabase.auth.user();
        let { data, error, status } = await supabase
          .from("helpInbox")
          .select(
            `*,
          user:user(username)
          helped:helped(username)
          todo:todo_id(content)
          `
          )
          .eq("helped", store.user.id);
        if (error && status !== 406) throw error;
        if (data) {
          console.log(data);
          inbox.value = data;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    async function signOut() {
      try {
        let { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
      } finally {
        router.push("/login");
      }
    }

    onMounted(() => {
      getProfile();
      getHelpInbox();
    });

    return {
      email,
      store,
      signOut,
      loading,
      username,
      updateProfile,
      updateSkills,
      signOut,
      tagArray,
      loadedTagArray,
      deleteOldSkills,
      inbox,
      getHelpInbox,
      isMobile: isMobileRef,
      isTablet: isTabletRef,
    };
  },
});
</script>