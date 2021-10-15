<template>

<n-space vertical style="padding:24px;">
<n-h2 style="padding-top:4rem;margin-bottom:0rem;">Post a help request</n-h2>
<n-h3 style="margin-top:0rem;">Add tags so others can be matched with your request.</n-h3>
</n-space>

    
  <n-space
    justify="center"
    style="padding-bottom: 0.2rem; margin-left: auto; margin-right: auto;"
  >
    <n-input-group justify="start">
      <n-input
        style="min-width: 250px; max-width: 250px"
        v-model:value="postValue"
        placeholder="Something you need help with."
        type="textarea"
        size="medium"
        :autosize="{
          minRows: 1,
          maxRows: 5,
        }"
      />
      <n-button type="primary" @click="postItem" ghost>Post</n-button>
    </n-input-group>
  </n-space>
  <n-space justify="center">
    <n-form>
      <n-form-item path="tags" :show-label="false">
        <n-dynamic-tags :max="4" v-model:value="tagArray" />
      </n-form-item>
    </n-form>
  </n-space>

  <n-space justify="center" v-if="success">
    <n-h4>Your help request was posted successfully!</n-h4>
  </n-space>

</template>

<script>
import { ref} from "vue";
import { supabase } from "../supabase";
import { store } from "../store";

export default {
  setup() {
    const loading = ref(false);
    const postValue = ref("");
    const tagArray = ref(["logo design","supabase"]);

    const success = ref(false);

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
        success.value = true;
        postValue.value = "";
        successfulPost()
      }
    }

    function successfulPost(){
      setTimeout(() => {
        success.value = false;
      }, 3000);
    }

    return {
      tagArray,
      loading,
      postValue,
      postItem,
      success,
      successfulPost
    };
  },
};
</script>