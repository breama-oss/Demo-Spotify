import { defineStore } from 'pinia'
import artistData from '../artist.json'

export const useSongStore = defineStore('song', {
  state: () => ({
    isPlaying: false,
    audio: null,
    currentArtist: null,
    currentTrack: null,
    currentTime: 0,
    duration: 0,

  }),

  actions: {
    async loadArtistData() {
  try {
    this.currentArtist = { ...artistData }

    const artistName = artistData.name
    const albumName = artistData.album.toLowerCase()

    //
    // 1️⃣ CERCA L’ARTISTA SU ITUNES
    //
    const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=musicArtist&limit=1`
    const artistRes = await fetch(searchUrl)
    if (!artistRes.ok) throw new Error('Errore API artista')

    const artistDataJson = await artistRes.json()
    const artistResult = artistDataJson.results[0]

    if (!artistResult) {
      console.warn("Artista non trovato su iTunes")
      this.currentArtist.albumCover = '/assets/default_cover.jpg'
      return
    }

    const artistId = artistResult.artistId

    //
    // 2️⃣ PRENDI TUTTI GLI ALBUM UFFICIALI DELL’ARTISTA
    //
    const lookupUrl = `https://itunes.apple.com/lookup?id=${artistId}&entity=album&limit=200`
    const albumRes = await fetch(lookupUrl)
    if (!albumRes.ok) throw new Error('Errore lookup album')

    const albumJson = await albumRes.json()

    // i risultati degli album iniziano da index 1 in poi
    const albums = albumJson.results.filter(r => r.collectionType === "Album")

    
    // 3️⃣ TROVA L’ALBUM GIUSTO
    //
    let album = albums.find(a =>
    a.collectionName.toLowerCase().replace(/[^a-z0-9]/g, '') === albumName.replace(/[^a-z0-9]/g, '')
  ) || albums.find(a =>
    a.collectionName.toLowerCase().includes(albumName)
  ) || albums[0];

    if (!album) {
      console.warn("Album non trovato nei risultati lookup")
      this.currentArtist.albumCover = '/assets/default_cover.jpg'
      return
    }

    //
    // 4️⃣ SET COPERTINA (600x600)
    //
    const cover = album.artworkUrl100?.replace(/100x100bb/, '600x600bb')
    this.currentArtist.albumCover = cover || '/assets/default_cover.jpg'

    //
    // 5️⃣ IMMAGINE ARTISTA (fallback)
    //
    await this.loadArtistImageFromItunes(artistName)

  } catch (err) {
    console.error("Errore caricando dati album:", err)
    this.currentArtist.albumCover = "/assets/default_cover.jpg"
    this.currentArtist.artistImage = "/assets/default_artist.jpg"
  }
},



    async loadArtistImageFromItunes(artistName) {
      try {
        const query = encodeURIComponent(artistName)
        const url = `https://itunes.apple.com/search?term=${query}&entity=album&limit=1`
        const response = await fetch(url)

        if (!response.ok) throw new Error('Errore nella risposta API iTunes artista')

        const data = await response.json()

        if (data.results && data.results.length > 0) {
          const artistArtwork = data.results[0].artworkUrl100?.replace(/100x100bb/, '300x300bb')
          this.currentArtist.artistImage = artistArtwork || '/assets/default_artist.jpg'
        } else {
          this.currentArtist.artistImage = '/assets/default_artist.jpg'
        }
      } catch (err) {
        console.error('Errore caricando immagine artista da iTunes:', err)
        this.currentArtist.artistImage = '/assets/default_artist.jpg'
      }
    },

    loadSong(artist, track) {
      this.currentArtist = artist
      this.currentTrack = track

      if (this.audio && this.audio.src) {
        this.audio.pause()
        this.isPlaying = false
        this.audio.src = ''
      }

      this.audio = new Audio(track.path)

      setTimeout(() => {
        this.isPlaying = true
        this.audio.play()
      }, 200)
    },

    playOrPauseSong() {
      if (!this.audio) return
      if (this.audio.paused) {
        this.isPlaying = true
        this.audio.play()
      } else {
        this.isPlaying = false
        this.audio.pause()
      }
    },

    playOrPauseThisSong(artist, track) {
      if (!this.audio || !this.audio.src || this.currentTrack?.id !== track.id) {
        this.loadSong(artist, track)
        return
      }
      this.playOrPauseSong()
    },

    prevSong(currentTrack) {
      const index = currentTrack.id - 2
      if (index >= 0) {
        const track = artistData.tracks[index]
        this.loadSong(artistData, track)
      }
    },

    nextSong(currentTrack) {
      const index = currentTrack.id
      const track = artistData.tracks[index % artistData.tracks.length]
      this.loadSong(artistData, track)
    },

    playFromFirst() {
      this.resetState()
      const firstTrack = artistData.tracks[0]
      this.loadSong(artistData, firstTrack)
    },

    resetState() {
      this.isPlaying = false
      this.audio = null
      this.currentArtist = null
      this.currentTrack = null
    },
  },

  persist: true,
})
