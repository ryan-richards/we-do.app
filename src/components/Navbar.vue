<template>
<n-layout>
<n-layout-header align="left">
    <n-space justify="space-between" >
<n-h2 align="left">
  <router-link to="/feed">We-Do</router-link>
  </n-h2> 
<n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" v-if="!(isMobile || isTablet)"/>

<n-dropdown
    v-if="isMobile || isTablet"
    trigger="click"
    :options="menuOptions"
    :show-arrow="true"
    placement="bottom-end"
  >
<n-button>
      <template #icon>
        <n-icon>
          <menu-outline />
        </n-icon>
      </template>
    </n-button>
</n-dropdown>

    </n-space>
</n-layout-header>
</n-layout>
</template>

<script>

import { defineComponent, h, ref } from 'vue'
import { NIcon } from 'naive-ui'
import { RouterLink } from 'vue-router'
import {
  MenuOutline,
  NewspaperOutline as FeedIcon,
  AddCircleOutline as PostIcon,
  PersonOutline as UserIcon
} from '@vicons/ionicons5'
import { useIsMobile, useIsTablet } from '../utils/composables'

function renderIcon (icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
   {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/post',
          }
        },
        { default: () => 'Request Help' }
      ),
    key: 'request-help',
    icon: renderIcon(PostIcon)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/feed'
          }
        },
        { default: () => 'Feed' }
      ),
    key: 'feed',
    icon: renderIcon(FeedIcon)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'Profile',
          }
        },
        { default: () => 'Profile' }
      ),
    key: 'go-back-home',
    icon: renderIcon(UserIcon)
  },
 
]

export default defineComponent({
components: {
   MenuOutline
  },
  setup () {


    const isMobileRef = useIsMobile()
    const isTabletRef = useIsTablet()




    return {
      overlap: ref(false),
      activeKey: ref(null),
      isMobile: isMobileRef,
      isTablet: isTabletRef,
      menuOptions
    }
  }
})

</script>


<style scoped>

.n-layout-header,
.n-layout-footer {
  background: rgb(16, 16, 20);
  padding: 24px;
}

a{
  color: rgb(255, 255, 255);
  text-decoration: none;
}

</style>