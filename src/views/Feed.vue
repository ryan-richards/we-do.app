<template>
  <n-space style="padding-top:4rem;"></n-space>
  <n-space
    vertical
    justify="center"
    v-for="(post, index) in postList"
    :key="post.id"
  >
    <n-space
      v-if="index < 1"
      vertical
      justify="center"
      style="padding-top: 2rem"
    >
      <n-h1
        ><n-gradient-text type="success">
          {{ post.user.username}}
        </n-gradient-text>
        needs help to
        <n-gradient-text type="info">
          {{ post.content }}
        </n-gradient-text></n-h1
      >
      <n-h3 style="margin-bottom: 0.2rem">Can you help?</n-h3>
      <n-space justify="center">
        <n-button type="error" @click="removeItem(index)" ghost>No</n-button>
        <n-button type="success" @click="sendHelp(post),removeItem(index)" ghost>
          Yes
          <template #icon>
            <n-icon>
              <mail-icon />
            </n-icon>
          </template>
        </n-button>
      </n-space>
    </n-space>
    
  </n-space>

  <n-h4 style="padding:24px;">Found {{postList.length}} matching requests you might be able to help with!</n-h4>
  
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase";
import { store } from "../store";
import { MailOutline as MailIcon } from "@vicons/ionicons5";

export default {
  components: {
    MailIcon,
  },
  setup() {
    const postList = ref([]);
    const loading = ref(false);
    const postValue = ref("");
    const tagArray = ref([]);
    const userSkills = ref([]);


    function removeItem(index) {
      postList.value.splice(index, 1);
    }

    async function sendHelp(post) {
      try {
        const { data, error } = await supabase
          .from("helpInbox")
          .insert([
            {
              message: "I think i can help you " + post.content,
              user: store.user.id,
              helped: post.user.id,
              todo_id: post.id,
            },
          ]);
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
        alert("inserted")
      }
    }

    async function getPosts() {
      try {
        loading.value = true;
        let { data, error } = await supabase
          .from("todos")
          .select(`* ,
          user:user(*)
          `)
          .not("user", "eq", store.user.id)
          .containedBy("tags", userSkills.value);
        if (data) {
          console.log(data);
          postList.value = data;
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    async function getUserSkills() {
      try {
        loading.value = true;
        let { data, error } = await supabase
          .from("profiles")
          .select(`*`)
          .eq("id", store.user.id)
          .single();
        if (data) {
          console.log(data);
          userSkills.value = data.skills;
          getPosts();
        }
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
      }
    }

    async function postItem() {
      try {
        const { data, error } = await supabase
          .from("todos")
          .insert([
            {
              content: postValue.value,
              user: store.user.id,
              tags: tagArray.value,
            },
          ]);
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
        getPosts();
      }
    }

    onMounted(() => {
      getUserSkills();
    });

    return {
      tagArray,
      loading,
      postValue,
      postList,
      postItem,
      getUserSkills,
      removeItem,
      sendHelp,
    };
  },
};
</script>

<style scoped>
.n-card {
  min-width: 300px;
  margin-left: auto;
  margin-right: auto;
}
</style>