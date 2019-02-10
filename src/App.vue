<template>
  <div id="app">
      <notifications group="api" position="top center"/>
      <b-navbar toggleable="md" variant="dark">

          <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

          <b-navbar-brand href="#"><img width="40" src="./assets/logo.png"/></b-navbar-brand>

          <b-collapse is-nav id="nav_collapse">

            <b-navbar-nav>
                <b-nav-item to="/" exact><b-badge v-show="logUpdates" variant="light">{{ logUpdates }}</b-badge> Home</b-nav-item>
                <b-nav-item to="/instellingen">Instellingen</b-nav-item>
                <b-nav-item to="/certificaten">Certificaten</b-nav-item>
                <b-nav-item to="/artikelen/gekeurd">Gekeurde artikelen</b-nav-item>
                <b-nav-item to="/artikelen/ongekeurd">Ongekeurde artikelen</b-nav-item>
                <b-nav-item to="/artikelen/verlopen">Verlopen artikelen</b-nav-item>
            </b-navbar-nav>

            <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right v-if="showUser">
                  <template slot="button-content">
                    <em>{{ this.$store.state.user.username }}</em>
                  </template>
                  <b-dropdown-item href="#" @click="logout">Uitloggen</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>

          </b-collapse>
        </b-navbar>

    <router-view class="view"></router-view>
    <vue-progress-bar></vue-progress-bar>
    <Email/>
  </div>
</template>

<script>
import Email from '@/components/Email'

export default {
    name: 'app',
    components: {
        'Email': Email
    },
    computed: {
        showUser () {
            return !!this.$store.state.user
        },
        logUpdates () {
            return this.$store.state.logUpdates.counter
        }
    },
    methods: {
        logout() {
            this.$store.commit('logout')
        }
    }
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
.form-control.dirty {
  border-color: #5A5;
  background: #EFE;
}

.form-control.dirty:focus {
  outline-color: #8E8;
}

.form-control.error {
  border-color: red;
  background: #FDD;
}

.form-control.error:focus {
  outline-color: #F99;
}
</style>
