<template>
    <div>
        <b-modal ref="emailModal" :visible="emailItems" title="E-mail versturen met certificaat voor onderstaande artikelen" hide-footer>
            <div class="d-block">
                <ul>
                    <li v-for="(item, index) in this.$store.state.emailItems" :key="index">{{ item.itemno }}</li>
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
    name: 'Email',
    data: function() {
      return {
          email: {
              recipients    : '',
              subject       : '',
              body          : '',
              articles      : []
          }
      }
    },
    computed: {
        emailItems() {
            return !!this.$store.state.emailItems.length
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
        cancelEmail () {
            this.$refs.emailModal.hide()
        },
        sendEmail () {
            this.$v.$touch()

            if (!this.$v.$invalid) {
                this.$refs.emailModal.hide()
                this.email.articles = this.$store.state.emailItems
                this.$socket.emit('email', this.email)
                this.$store.commit('resetEmailItems')
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
