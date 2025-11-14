<template>
  <q-page class="bg-dark text-white q-pa-xl">

    <!-- LOADER -->
    <div v-if="loading" class="flex flex-center" style="height: 60vh;">
      <q-spinner-tail color="white" size="60px" />
    </div>

    <!-- CONTENUTO PRINCIPALE -->
    <div v-else>

      <!-- Header album -->
      <div class="flex items-end q-mb-xl">

        <!-- Copertina album -->
        <q-img
          :src="artist?.albumCover"
          width="280px"
          ratio="1"
          class="rounded-borders shadow-4"
        />

        <!-- Info album -->
        <div class="q-ml-xl column justify-end">
          <div class="text-caption text-uppercase text-grey-5 q-mb-sm">Album</div>

          <div class="text-h2 text-weight-bolder text-white">
            {{ artist?.album }}
          </div>

          <div class="text-subtitle1 text-grey-4 q-mt-sm">
            {{ artist?.name }}
          </div>

          <div class="text-body2 text-grey-5 q-mt-xs flex items-center">
            <span>Album</span>
            <div class="q-mx-sm bg-grey-6 rounded-full" style="width: 4px; height: 4px"></div>
            <span>{{ artist?.releaseYear }}</span>
            <div class="q-mx-sm bg-grey-6 rounded-full" style="width: 4px; height: 4px"></div>
            <span>{{ artist?.tracks?.length }} songs</span>
          </div>
        </div>
      </div>

      <!-- Pulsanti principali -->
      <div class="q-mt-lg flex items-center q-gutter-md">
        <q-btn round size="20px" color="positive" @click="playFunc">
          <q-icon v-if="!isPlaying" name="play_arrow" color="black" size="40px" />
          <q-icon v-else name="pause" color="black" size="40px" />
        </q-btn>

        <q-btn flat round color="white" size="md">
          <q-icon name="favorite" size="28px" />
        </q-btn>

        <q-btn flat round color="white">
          <q-icon name="more_horiz" size="28px" />
        </q-btn>
      </div>

      <!-- Intestazione lista tracce -->
      <div class="q-mt-xl flex items-center justify-between q-px-md">
        <div class="flex items-center text-grey-5">
          <div class="q-mr-md">#</div>
          <div class="text-subtitle2">Title</div>
        </div>
        <q-icon name="schedule" color="white" size="20px" />
      </div>

      <q-separator dark spaced class="q-my-sm" color="grey-8" />

      <!-- Lista tracce -->
      <ul class="no-padding">
        <li v-for="(track, index) in artist?.tracks" :key="track.name" class="q-py-xs">
          <SongRow :artist="artist" :track="track" :index="index + 1" />
        </li>
      </ul>
    </div>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSongStore } from 'src/stores/song'
import SongRow from 'src/components/SongRow.vue'

// STORE
const songStore = useSongStore()
const { isPlaying, currentTrack, currentArtist } = storeToRefs(songStore)

// Computed artist
const artist = computed(() => currentArtist.value)

// Loader
const loading = ref(true)

// Recupero dati artista e album da iTunes al mount
onMounted(async () => {
  await songStore.loadArtistData()
  loading.value = false
})

// Funzione Play/Pause
const playFunc = () => {
  if (currentTrack.value) {
    songStore.playOrPauseThisSong(currentArtist.value, currentTrack.value)
  } else {
    songStore.playFromFirst()
  }
}
</script>

<style scoped>
.hover-underline:hover {
  text-decoration: underline;
}

.shadow-4 {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.bg-dark {
  background: #121212;
}
</style>
