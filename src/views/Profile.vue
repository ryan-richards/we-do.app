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
        <n-h3 style="margin-bottom: 0rem">Add some skills you can share </n-h3>
        <n-h4>Try adding <n-tag type="success">supabase</n-tag> to find some sample requests</n-h4>

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


      <n-divider></n-divider>

      <n-space vertical style="max-width:400px;margin-left:auto;margin-right:auto;">

        <n-h3>Your Help Requests</n-h3>

        <n-space  v-for="post in posts" :key="post.id">
        <n-button @click="completeRequest(post)" style="white-space:normal;padding:24px;text-align:left;" icon-placement="right" :type="post.complete ? 'success' : 'default'">
          {{post.content}}
           <template #icon>
            <n-icon v-if="!post.complete">
              <empty-icon />
            </n-icon>
             <n-icon v-else>
              <check-icon />
            </n-icon>
          </template>    
        </n-button>
        </n-space>

      </n-space>


    </n-layout-content>
       
       
  
  
  <n-layout-sider
        content-style="padding: 24px;"
        v-if="!(isMobile || isTablet)">
      <n-h3 style="margin-bottom: 0rem">Help Inbox</n-h3>
       
       <n-space
        style="padding-top: 1rem;"
        justify="center"
        v-for="message in inbox"
        :key="message.id"
        >

        <n-button @click="sendEmail(message)" icon-placement="right" style="white-space:normal;padding:24px;">
          {{message.user.username}} : {{message.message}}
           <template #icon>
            <n-icon>
              <mail-icon />
            </n-icon>
          </template>    
        </n-button>
      
      </n-space> 
    </n-layout-sider>
  </n-layout>
  
  
  <n-layout-content v-if="(isMobile || isTablet)" style="margin-bottom:5rem;">
    <n-divider></n-divider>
    <n-h3 style="margin-bottom: 0rem">Help Inbox</n-h3>
      <n-space
        style="padding-top: 1rem"
        justify="center"
        v-for="message in inbox"
        :key="message.id"
      >

        <n-button @click="sendEmail(message)" icon-placement="right">
          {{message.user.username}} : {{message.message}}
           <template #icon>
            <n-icon>
              <mail-icon />
            </n-icon>
          </template>    
        </n-button>
      </n-space> 
    </n-layout-content>



</template>

<script>
import { store } from "../store";
import { supabase } from "../supabase";
import { onMounted, ref, defineComponent, watch } from "vue";
import { useRouter } from "vue-router";
import { useIsMobile, useIsTablet } from '../utils/composables'
import { MailOutline as MailIcon,
CheckmarkCircleOutline as CheckIcon,
RadioButtonOffOutline as EmptyIcon
} from "@vicons/ionicons5";

export default defineComponent({
    components: {
    MailIcon,
    CheckIcon,
    EmptyIcon
  },
  setup() {
    const router = useRouter();
    const loading = ref(true);
    const email = ref("");
    const username = ref("");
    const tagArray = ref([]);
    const loadedTagArray = ref([]);
    const inbox = ref([]);
    const posts = ref([]);

    const complete = ref(false);

    const isMobileRef = useIsMobile()
    const isTabletRef = useIsTablet()

    store.user = supabase.auth.user();
    supabase.auth.onAuthStateChange((_, session) => {
      store.user = session.user;
    });

    watch(() => [...tagArray.value],() => {
      deleteOldSkills();
    })
    
    email.value = store.user.email;

    function sendEmail(message) {
    var email = message.user.email;
    var subject = 'We-Do your offer to help ' + username.value;
    var emailBody = 'Hi thanks for your offer to help!';
    document.location = "mailto:"+email+"?subject="+subject+"&body="+emailBody;
      }

    async function getProfile() {
      try {
        store.user = supabase.auth.user();

        let { data, error, status } = await supabase
          .from("profiles")
          .select(`*`)
          .eq("id", store.user.id)
          .single();

        if (error && status !== 406) throw error;
        if (data) {
          console.log("getting profile")
          username.value = data.username;
          tagArray.value = data.skills;
          loadedTagArray.value = data.skills;
        }
      } catch (error) {
        alert(error.message);
      } finally {
      }
    }

    async function updateProfile() {
      try {
        loading.value = true;
        store.user = supabase.auth.user();

        const updates = {
          id: store.user.id,
          username: username.value,
          email: email.value,
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

    async function completeRequest(post) {
      try {
        loading.value = true;

        if (post.complete){
          const updates = {
          id: post.id,
          complete: false
        }
          let { error } = await supabase.from("todos").upsert(updates, {
          returning: "minimal", // Don't return the value after inserting
        });
        if (error) throw error;
        } else {
          const updates = {
          id: post.id,
          complete: true
        }
          let { error } = await supabase.from("todos").upsert(updates, {
          returning: "minimal", // Don't return the value after inserting
        });
        if (error) throw error;
        }  
      } catch (error) {
        alert(error.message);
      } finally {
        loading.value = false;
        post.complete = !post.complete
      }
    }

    async function deleteOldSkills() {
      try {
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
        updateSkills();
      }
    }

    async function updateSkills() {
      try {
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
          user:user(*)
          helped:helped(username)
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

    async function getPosts() {
      try {
        loading.value = true;
        let { data, error } = await supabase
          .from("todos")
          .select(`* ,
          user:user(*)
          `)
          .eq("user", store.user.id)
          .order('created_at', { ascending: false })
        if (data) {
          console.log(data);
          posts.value = data;
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
      getPosts();
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
      sendEmail,
      getPosts,
      posts,
      complete,
      completeRequest
    };
  },
});
</script>
