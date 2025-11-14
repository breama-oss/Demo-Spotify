<template>
  <q-item clickable v-ripple @mouseenter="isHover = true" @mouseleave="isHover = false"
    class="rounded-borders bg-transparent hover:bg-grey-9 text-white">
    <q-item-section avatar class="q-ml-sm">
      <!--Numero o Play/Pause-->
      <div v-if="isHover">
        <q-btn round dense flat color="white" icon="play_arrow" v-if="!isPlaying"
          @click="useSong.playOrPauseThisSong(artist, track)" />
        <q-btn round dense flat color="white" icon="play_arrow"
          v-else-if="isPlaying && currentTrack.name !== track.name" @click="useSong.loadSong(artist, track)" />
        <q-btn round dense flat color="white" icon="pause" v-else @click="useSong.playOrPauseSong()" />
      </div>
      <div v-else class="text-white text-weight-bold">
        <span :class="currentTrack?.name === track.name ? 'text-green' : ''">
          {{ index }}
        </span>
      </div>
    </q-item-section>

    <!--Titolo e artista -->
    <q-item-section>
      <q-item-label :class="currentTrack?.name === track.name ? 'text-green' : 'text-white'" class="text-weight-medium">
        {{ track.name }}
      </q-item-label>
      <q-item-label caption class="text-grey">
        {{ artist.name }}
      </q-item-label>
    </q-item-section>

    <!--durata-->
    <q-item-section side class="row items-center q-gutter-sm q-pr-sm">
      <q-btn v-if="isHover" flat round dense color="green" icon="favorite" />
      <div v-if="isTrackTime" class="text-caption text-grey-5">
        {{ isTrackTime }}
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref, toRefs, onMounted } from 'vue'
import { useSongStore } from '../stores/song'
import { storeToRefs } from 'pinia'

const useSong = useSongStore()
const { isPlaying, currentTrack } = storeToRefs(useSong)

const props = defineProps({
  track: Object,
  artist: Object,
  index: Number,
})

const { track, artist, index } = toRefs(props)
const isHover = ref(false)
const isTrackTime = ref(null)

onMounted(() => {
  const audio = new Audio(track.value.path)
  audio.addEventListener('loadedmetadata', () => {
    const duration = audio.duration
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)
    isTrackTime.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
  })
})
</script>

<style scoped>
.hover\:bg-grey-9:hover {
  background-color: #2a2929;
}
</style>
