<template>
  <div>
    <b-container fluid>
      <h1 class="md-title">{{ title }} ({{ items.length }})</h1>

      <b-row>&nbsp;</b-row>

      <!-- User Interface controls -->
     <b-row>
       <b-col md="4" class="my-1">
         <b-form-group horizontal label="Filteren" class="mb-0">
           <b-input-group>
             <b-form-input v-model="filter" placeholder="Typen om te zoeken" />
             <b-input-group-append>
               <b-btn :disabled="!filter" @click="filter = ''">Reset</b-btn>
             </b-input-group-append>
           </b-input-group>
         </b-form-group>
       </b-col>
       <b-col md="4" class="my-1">
         <b-form-group horizontal label="Sorteren" class="mb-0">
           <b-input-group>
             <b-form-select v-model="sortBy" :options="sortOptions">
               <option slot="first" :value="null">-- geen --</option>
             </b-form-select>
             <b-form-select :disabled="!sortBy" v-model="sortDesc" slot="append">
               <option :value="false">Oplopend</option>
               <option :value="true">Aflopend</option>
             </b-form-select>
           </b-input-group>
         </b-form-group>
       </b-col>
       <b-col md="4" class="my-1">
         <b-form-group horizontal label="Per pagina" class="mb-0">
           <b-form-select :options="pageOptions" v-model="perPage" />
         </b-form-group>
       </b-col>
     </b-row>

     <b-row>&nbsp;</b-row>

      <b-table id="logs-list" striped hover
        stacked="md"
        ref="stock"
       :items="items"
       :fields="fields"
       :current-page="currentPage"
       :per-page="perPage"
       :filter="filter"
       :sort-by.sync="sortBy"
       :sort-desc.sync="sortDesc"
       :sort-direction="sortDirection"
       @filtered="onFiltered"
       >
       <template slot="ts" slot-scope="data">
         {{ moment(data.item.ts, 'x').format('DD-MM-YYYY HH:mm:ss') }}
       </template>
     </b-table>
     <b-row>
      <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
    </b-row>
  </b-container>
  </div>
</template>

<script>
import saveState from 'vue-save-state'
export default {
  name: 'StockList',
  mixins: [saveState],
  props: {
    title: String,
    endpoint: String,
    id: String
  },
  data: () => ({
    items: [],
    fields: [
      { key: 'msg', label: 'Bericht', sortable: true, class: 'text-left' },
      { key: 'ts', label: 'Datum/tijd', sortable: true, sortDirection: 'desc', class: 'text-left' }
    ],
    currentPage: 1,
    perPage: 10,
    totalRows: 0,
    pageOptions: [ 10, 15, 25, 50, 100, 200, 500 ],
    sortBy: null,
    sortDesc: true,
    sortDirection: 'desc',
    filter: null,
    loading: true,
    errored: false
  }),
  mounted () {
    this.$api
     .get(this.$config.api.uri + this.$props.endpoint)
     .then(response => (this.items = response.data.body))
     .catch(() => {
       this.errored = true
     })
     .finally(() => {
       this.loading = false
       this.totalRows = this.items.length
     })
  },
  computed: {
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => { return { text: f.label, value: f.key } })
    }
  },
  methods: {
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    getSaveStateConfig() {
        return {
            'cacheKey': 'stock-' + this.$props.id,
            'saveProperties': ['currentPage', 'filter', 'sortBy', 'sortDirection', 'sortDesc', 'perPage', 'totalRows'],
        };
    },
  },
  created () {
      this.$store.commit('resetLogUpdateCounter')
      this.$store.commit('toggleLogUpdates', false)

    this.sockets.subscribe('log', (data) => {
      this.items.push(data)
    })
  },
  beforeDestroy() {
      this.$store.commit('toggleLogUpdates', true)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
