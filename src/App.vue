<template>
  <div id="app">
    <Slide noOverlay>
      <router-link to="/"><span>Home</span></router-link>
      <router-link to="/artikelen/gekeurd"><span>Gekeurde artikelen</span></router-link>
      <router-link to="/artikelen/ongekeurd"><span>Ongekeurde artikelen</span></router-link>
      <router-link to="/artikelen/verlopen"><span>Verlopen artikelen</span></router-link>
    </Slide>
    <router-view class="view"></router-view>
  </div>
</template>

<script>
import { Slide } from 'vue-burger-menu'
export default {
  name: 'app',
  components: {
     Slide
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
.bm-burger-button {
  top: 0;
}

</style>
