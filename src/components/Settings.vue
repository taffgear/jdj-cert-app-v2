<template>
    <div>
        <b-container fluid>

            <h1>{{ title }}</h1>
            <b-row>
                <b-col xs="12" sm="6" md="3">
                    <b-form-group>
                        <label for="fixed-date">Datum vooor certificaten</label>
                        <b-form-input id="fixed-date" v-model="fixed_date" type="date" placeholder="Datum voor certificaten"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col xs="12" sm="6" md="3">
                    <b-form-group>
                        <label for="watch-dir">Map locatie voor certificaten</label>
                        <b-form-input id="watch-dir" v-model="watch_dir" type="text" placeholder="Map locatie voor certificaten"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col xs="12">
                    <h2>Aanvinken om artikelen te selecteren.</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col xs="12" md="4">
                    <h3>Gekeurde artikelen</h3>

                    <b-form-group v-for="(label, k) in labels" :key="'approved-' + k">
                        <b-form-checkbox :value="'status_' + k" v-model="approvedChecked">{{ label }}</b-form-checkbox>
                    </b-form-group>
                </b-col>
                <b-col xs="12" md="4">
                    <h3>Ongekeurde artikelen</h3>

                    <b-form-group v-for="(label, k) in labels" :key="'approved-' + k">
                        <b-form-checkbox :value="'status_' + k" v-model="unapprovedChecked">{{ label }}</b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col xs="12" md="4">
                    <h3>Verlopen artikelen</h3>

                    <b-form-group v-for="(label, k) in labels" :key="'approved-' + k">
                        <b-form-checkbox :value="'status_' + k" v-model="expiredChecked">{{ label }}</b-form-checkbox>
                    </b-form-group>
                </b-col>

                <b-col xs="12">
                    <div class="mb-2">&nbsp;</div>
                    <b-button variant="primary" v-on:click="updateSettings">Opslaan</b-button>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { each, map } from 'lodash'

const defaults = {
    status_0: { value: false, label: 'Beschikbaar' },
    status_1: { value: false, label: 'In Huur' },
    status_2: { value: false, label: 'In Reparatie' },
    status_3: { value: false, label: 'In Onderhoud' },
    status_4: { value: false, label: 'Onderweg' },
    status_5: { value: false, label: 'Gereserveerd' },
    status_6: { value: false, label: 'Afgekeurd' },
    status_7: { value: false, label: 'Retour, nog te testen' },
    status_8: { value: false, label: 'Verkocht' },
    status_9: { value: false, label: 'Vermist/ Gestolen' },
    status_10: { value: false, label: 'Inactief/ Foutief' },
    status_11: { value: false, label: 'Controleren in systeem' },
};

export default {
  name: 'Settings',
  props: {
    title: String
  },
  data: () => ({
    watch_dir: '',
    fixed_date: '',
    approved: defaults,
    unapproved: defaults,
    expired: defaults,
    approvedChecked: [],
    unapprovedChecked: [],
    expiredChecked: [],
    loading: true,
    errored: false,
    sending: false
  }),
  mounted () {
    this.$api
     .get(this.$config.api.uri + '/settings')
     .then(response => {
       const settings = response.data.body

       Object.keys(settings).forEach(k => this[k] = settings[k])

       each (settings.approved, (item, k) => { if (item.value) this.approvedChecked.push(k) })
       each (settings.unapproved, (item, k) => { if (item.value) this.unapprovedChecked.push(k) })
       each (settings.expired,(item, k) => { if (item.value) this.expiredChecked.push(k) })
     })
     .catch(() => {
       this.errored = true
       this.$notify({
           group: 'api',
           title: 'Instellingen',
           text: 'Helaas! Het is niet gelukt om de instellingen op te halen.',
           type: 'error'
       });
     })
     .finally(() => {
       this.loading = false
     })
  },
  computed: {
      labels: function() {
          return map(defaults, 'label')
      }
  },
  methods: {
        updateSettings: function() {
            const settings = {
              watch_dir: this.watch_dir,
              fixed_date: this.fixed_date,
              approved: {},
              unapproved: {},
              expired: {},
            }

            each (this.approved, (item, k) => { settings.approved[k] = { value: this.approvedChecked.indexOf(k) !== -1, label: item.label } })
            each (this.unapproved, (item, k) => { settings.unapproved[k] = { value: this.unapprovedChecked.indexOf(k) !== -1, label: item.label } })
            each (this.expired, (item, k) => { settings.expired[k] = { value: this.expiredChecked.indexOf(k) !== -1, label: item.label } })

          this.$api
            .put(this.$config.api.uri + '/settings', settings)
              .then(() => {
                  this.$socket.emit('settings', settings)
                  this.sending = false;

                  this.$notify({
                      group: 'api',
                      title: 'Instellingen',
                      text: 'De gekozen instellingen zijn opgeslagen!',
                      type: 'success'
                  });
              })
              .catch(() => {
                  this.$notify({
                      group: 'api',
                      title: 'Instellingen',
                      text: 'Helaas! Er is iets misgegaan tijdens het opslaan van de instellingen.',
                      type: 'error'
                  });
              })
      }
    }
}
</script>
