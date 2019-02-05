<template>
  <div id="app">
      <b-navbar toggleable="md" type="light" variant="dark">

          <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

          <b-navbar-brand href="#"><img width="40" src="./assets/logo.png"/></b-navbar-brand>

          <b-collapse is-nav id="nav_collapse">

            <b-navbar-nav>
                <b-nav-item href="#"><router-link to="/">Home</router-link></b-nav-item>
                <b-nav-item href="#"><router-link to="/settings"><span>Instellingen</span></router-link></b-nav-item>
                <b-nav-item href="#"><router-link to="/artikelen/gekeurd"><span>Gekeurde artikelen</span></router-link></b-nav-item>
                <b-nav-item href="#"><router-link to="/artikelen/ongekeurd"><span>Ongekeurde artikelen</span></router-link></b-nav-item>
                <b-nav-item href="#"><router-link to="/artikelen/verlopen"><span>Verlopen artikelen</span></router-link></b-nav-item>
            </b-navbar-nav>

          </b-collapse>
        </b-navbar>

    <router-view class="view"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
