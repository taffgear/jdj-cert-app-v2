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

    <b-modal ref="emailModal" :visible="!!emailItems.length" title="E-mail versturen met certificaat voor onderstaande artikelen" hide-footer>
        <div class="d-block">
            <ul>
                <li v-for="(item, index) in emailItems" :key="index">{{ item.itemno }}</li>
            </ul>

            <h3>Geef een of meerdere geldigde e-mailadressen op (komma gescheiden)</h3>

            <b-form-group>
                <b-form-input v-model="$v.email.recipients.$model" type="text" placeholder="Ontvanger(s)" :class="status($v.email.recipients)"></b-form-input>
            </b-form-group>

            <b-form-group>
                <b-form-input v-model="$v.email.subject.$model" type="text" placeholder="Onderwerp" :class="status($v.email.subject)"></b-form-input>
            </b-form-group>

            <b-form-group>
                <b-form-textarea v-model="$v.email.body.$model" placeholder="Bericht" :rows="3" :max-rows="6" :class="status($v.email.body)"></b-form-textarea>
            </b-form-group>
        </div>

        <div class="modal-footer">
           <button type="button" class="btn btn-secondary" v-on:click="cancelEmail">Annuleren</button>
           <button type="button" class="btn btn-primary" v-on:click="sendEmail">Verwerken</button>
       </div>
   </b-modal>

  </div>
</template>

<script>
import { required, minLength, helpers } from 'vuelidate/lib/validators'

const recipientsValid = helpers.regex('recipients', /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/)

export default {
    name: 'app',
    data: function() {
      return {
          emailItems: [],
          email: {
              recipients    : '',
              subject       : '',
              body          : ''
          }
      }
    },
    computed: {
        showUser () {
            return !!this.$store.state.user
        }
    },
    validations: {
        email: {
            recipients: { required, recipientsValid },
            subject: { required, minLength: minLength(4) },
            body: { required, minLength: minLength(4) }
        }
    },
    methods: {
        logout() {
            localStorage.removeItem('user')
            localStorage.removeItem('jwt')
            this.$store.commit('user', null)
            this.$router.push('/login')
        },
        cancelEmail () {
            this.$refs.emailModal.hide()
        },
        sendEmail () {
            this.$v.$touch()

            if (!this.$v.$invalid) {
                this.$refs.emailModal.hide()
                this.$socket.emit('email', this.email)
                this.emailItems = []
            }
        },
        status(validation) {
            return {
                error: validation.$error,
                dirty: validation.$dirty
            }
        }
    },
    created () {
        this.$store.commit('user', JSON.parse(localStorage.getItem('user')))
        this.$store.commit('jwt',  localStorage.getItem('jwt'))

        this.sockets.subscribe('email', (data) => {
            if (this.emailItems.length)
                this.emailItems.concat(data)
            else {
                this.emailItems = data
            }
        }),
        this.sockets.subscribe('email_success', recipients => {
            this.$notify({
                group: 'api',
                title: 'Email',
                text: `E-mail is verzonden naar ${recipients.join(', ')}`,
                type: 'success'
            })
        }),
        this.sockets.subscribe('email_failed', msg => {
            this.$notify({
                group: 'api',
                title: 'Email',
                text: `Het verzenden van de e-mail is mislukt: ${msg}`,
                type: 'error'
            })
        })
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
