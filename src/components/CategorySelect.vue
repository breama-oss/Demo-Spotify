<template>
  <q-card
    flat
    bordered
    class="category-card cursor-pointer relative overflow-hidden"
    :style="{ backgroundColor: randColor.color }"
    @click="goToLibrary"
  >
    <!-- Nome categoria -->
    <div class="category-name">{{ category }}</div>

    <!-- Immagine -->
    <img :src="image" alt="" class="category-image" />
  </q-card>
</template>

<script setup>
import { ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import uniqolor from 'uniqolor'

const router = useRouter()

const props = defineProps({
  category: String,
  image: String,
})

const { category, image } = toRefs(props)
const randColor = ref(uniqolor.random())

const goToLibrary = () => {
  router.push('/library')
}
</script>

<style scoped>
.category-card {
  height: 140px; /* match SearchView */
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s;
}

.category-card:hover {
  transform: scale(1.05);
}

.category-name {
  position: absolute;
  top: 10px;
  left: 10px;
  font-weight: bold;
  font-size: 1.1rem;
  color: white;
  z-index: 2;
}

.category-image {
  position: absolute;
  bottom: -10px;
  right: -15px;
  width: 120px;
  height: 120px;
  opacity: 0.6;
  transform: rotate(20deg);
  object-fit: cover;
  border-radius: 5px;
  z-index: 1;
}
</style>
