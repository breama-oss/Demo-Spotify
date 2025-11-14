<template>
  <div class="search-view">
    <h3>🎧 Selettore Categorie</h3>

    <div class="category-grid">
      <CategorySelect
        v-for="cat in categories"
        :key="cat.name"
        :category="cat.name"
        :image="cat.image"
        :color="cat.color"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import uniqolor from 'uniqolor'
import CategorySelect from '../components/CategorySelect.vue'

const categories = ref([])

const genres = ['Rock', 'Pop', 'Jazz', 'Hip Hop', 'Indie', 'Classical']

// La tua Access Key Unsplash
const UNSPLASH_ACCESS_KEY = 'iGZ5cfTLayf7Dumx9ROvhXQDK6ypmx7jGAmi_woL_Oc'

async function fetchCategoryImage(genre) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${genre}&per_page=12`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    )
    const data = await response.json()
    if (data.results && data.results.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.results.length)
      return data.results[randomIndex].urls.small
    }
    return '' // fallback
  } catch (err) {
    console.error('Errore fetch Unsplash:', err)
    return ''
  }
}

// Popola categories
onMounted(async () => {
  categories.value = await Promise.all(
    genres.map(async (genre) => {
      const img = await fetchCategoryImage(genre)
      return {
        name: genre,
        image: img,
        color: uniqolor.random().color,
      }
    })
  )
})
</script>

<style scoped>
.search-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  color: white;
  background-color: #121212;
  min-height: 100vw;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}
</style>
