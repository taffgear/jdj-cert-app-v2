<template>
  <div>
    <b-container fluid>
      <h1 class="md-title">{{ title }}</h1>

      <b-row>&nbsp;</b-row>

     <vue-bootstrap4-table v-show="rows.length" :rows="rows" :columns="columns" :config="config" @refresh-data="loadData">
       <template slot="ts" slot-scope="props">
         {{ moment(props.cell_value, 'x').format('DD-MM-YYYY HH:mm:ss') }}
       </template>
       <template slot="sort-asc-icon">
         <font-awesome-icon icon="sort-up" />
        </template>
        <template slot="sort-desc-icon">
            <font-awesome-icon icon="sort-down" />
        </template>
        <template slot="no-sort-icon">
            <font-awesome-icon icon="sort" />
        </template>
        <template slot="paginataion-previous-button">
          Vorige
        </template>
        <template slot="paginataion-next-button">
          Volgende
        </template>
        <template slot="refresh-button-text">
          <font-awesome-icon icon="sync-alt" />
        </template>
        <template slot="reset-button-text">
            <font-awesome-icon icon="broom" />
        </template>
     </vue-bootstrap4-table>
  </b-container>
  </div>
</template>

<script>
import VueBootstrap4Table from 'vue-bootstrap4-table'

export default {
  name: 'StockList',
  components: {
      VueBootstrap4Table
  },
  props: {
    title: String,
    endpoint: String,
    id: String
  },
  data: () => ({
    rows: [],
    columns: [
      { name: 'msg', label: 'Bericht', sort: true, row_text_alignment: 'text-left', column_text_alignment: 'text-left' },
      { name: 'ts', label: 'Datum/tijd', sort: true,  initial_sort: true, initial_sort_order: 'desc', slot_name: "ts", row_text_alignment: 'text-left', column_text_alignment: 'text-left' }
    ],
    config: {
      card_mode: false,
      per_page_options: [5, 10, 20, 30, 50, 100, 250, 1000],
      per_page: 10,
      global_search: {
        placeholder: "Zoeken",
        visibility: true,
        case_sensitive: false
      }
    },
    loading: true,
    errored: false
  }),
  mounted () {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$api
       .get(this.$config.api.uri + this.$props.endpoint)
       .then(response => (this.rows = response.data.body))
       .catch(() => {
         this.errored = true
       })
       .finally(() => {
         this.loading = false
       })
    }
  },
  created () {
      this.$store.commit('resetLogUpdateCounter')
      this.$store.commit('toggleLogUpdates', false)

    this.sockets.subscribe('log', data => {
      this.rows.push(data)
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
