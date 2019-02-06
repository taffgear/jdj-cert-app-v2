<template>
  <div id="app">
      <notifications group="api" position="top center"/>
      <b-navbar toggleable="md" variant="dark">

          <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

          <b-navbar-brand href="#"><img width="40" src="./assets/logo.png"/></b-navbar-brand>

          <b-collapse is-nav id="nav_collapse">

            <b-navbar-nav>
                <b-nav-item to="/" exact>Home</b-nav-item>
                <b-nav-item to="/instellingen">Instellingen</b-nav-item>
                <b-nav-item to="/certificaten">Certificaten</b-nav-item>
                <b-nav-item to="/artikelen/gekeurd">Gekeurde artikelen</b-nav-item>
                <b-nav-item to="/artikelen/ongekeurd">Ongekeurde artikelen</b-nav-item>
                <b-nav-item to="/artikelen/verlopen">Verlopen artikelen</b-nav-item>
            </b-navbar-nav>

          </b-collapse>
        </b-navbar>

    <router-view class="view"></router-view>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.view {
    margin-top: 20px;
}
</style>
