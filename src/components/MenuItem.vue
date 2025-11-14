<template>
  <q-item clickable v-ripple @mouseenter="toggleHover" @mouseleave="toggleHover" @click="goToPage" class="q-py-sm">
    <q-item-section avatar>
      <q-img :src="`/images/icons/${icon}.png`" :width="iconSize + 'px'" class="transition-all" />
    </q-item-section>

    <q-item-section>
      <q-item-label :class="textIsHover ? 'text-white' : 'text-grey-5'" class="text-weight-medium text-body2">
        {{ name }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref, toRefs, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  iconString: String,
  iconSize: { type: Number, default: 24 },
  pageUrl: String,
  name: String,
})

const { iconString, pageUrl, name, iconSize } = toRefs(props)
const icon = ref(null)
const textIsHover = ref(false)

watchEffect(() => {
  if (route.path === pageUrl.value) {
    icon.value = `${iconString.value}-active`
    textIsHover.value = true
  } else {
    icon.value = `${iconString.value}-inactive`
    textIsHover.value = false
  }
})

const toggleHover = () => {
  if (icon.value === `${iconString.value}-active`) return

  if (icon.value === `${iconString.value}-inactive`) {
    icon.value = `${iconString.value}-inactive-hover`
    textIsHover.value = true
  } else {
    icon.value = `${iconString.value}-inactive`
    textIsHover.value = false
  }
}

const goToPage = () => {
  router.push(pageUrl.value)
}
</script>
