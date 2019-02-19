<template>
  <div>
    <b-container fluid>
      <h1 class="md-title">{{ title }}</h1>

      <b-button variant="secondary" class="float-right" v-show="rows.length" v-on:click="download">Exporteer als CSV</b-button>
      <b-row>&nbsp;</b-row>
      <div class="clearfix">&nbsp;</div>

    <vue-bootstrap4-table v-show="rows.length" :rows="rows" :columns="columns" :config="config" @refresh-data="loadData">
      <template slot="LASTSER#3" slot-scope="props">
        {{ moment(props.cell_value).format('DD-MM-YYYY HH:mm:ss') }}
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
import { findKey } from 'lodash'
import Papa from 'papaparse'
export default {
  name: 'StockList',
  components: {
      VueBootstrap4Table
  },
  props: {
    title: String,
    type: String,
    endpoint: String,
    limit: String,
    id: String
  },
  data: () => ({
    rows: [],
    columns: [
      { name: 'PGROUP', label: 'Grp', sort: true, row_text_alignment: 'text-left', column_text_alignment: 'text-left' },
      { name: 'GRPCODE', label: 'Grp code', sort: true, row_text_alignment: 'text-left', column_text_alignment: 'text-left' },
      { name: 'ITEMNO', label: 'SKU', sort: true, row_text_alignment: 'text-left', column_text_alignment: 'text-left' },
      { name: 'DESC#1', label: 'Omschr. 1', sort: true, row_text_alignment: 'text-left', column_text_alignment: 'text-left' },
      { name: 'DESC#2', label: 'Omschr. 2', sort: true, row_text_alignment: 'text-left', column_text_alignment: 'text-left' },
      { name: 'DESC#3', label: 'Omschr. 3', sort: true, row_text_alignment: 'text-left', column_text_alignment: 'text-left' },
      { name: 'LASTSER#3', label: 'Keuring', sort: true, initial_sort: true, initial_sort_order: 'desc', slot_name: "LASTSER#3", row_text_alignment: 'text-left', column_text_alignment: 'text-left' },
      { name: 'PERIOD#1', label: 'Geldig', sort: true, row_text_alignment: 'text-left', column_text_alignment: 'text-left' },
      { name: 'CURRDEPOT', label: 'Mag', sort: true, row_text_alignment: 'text-left', column_text_alignment: 'text-left' }
    ],
    actions: [
        {
            btn_text: "Download",
            event_name: "on-download",
            event_payload: {
                msg: "my custom msg"
            }
        }
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
    this.rows = this.$store.state.stock[this.$props.type]
  },
  methods: {
    loadData() {
      this.$api
       .get(this.$config.api.uri + this.$props.endpoint + (this.$props.limit ? '/' + this.$props.limit : ''))
       .then(response => {
         this.rows = response.data.body
         this.$store.commit('updateStock', { rows: this.rows, type: this.$props.type })
       })
       .catch(() => {
         this.errored = true
         this.$notify({
             group: 'api',
             title: this.$props.title,
             text: 'Helaas! Het is niet gelukt om de artikelen op te halen.',
             type: 'error'
         });
       })
       .finally(() => {
         this.loading = false
       })
    },
    download() {
        const csv = Papa.unparse(this.rows);

        const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const csvURL = window.URL.createObjectURL(csvData);
        const tempLink = document.createElement('a');

        tempLink.href = csvURL;
        tempLink.setAttribute('download', this.$props.id + '.csv');
        tempLink.click();
    }
  },
  created () {
    if (!this.$store.state.stock[this.$props.type].length) this.loadData()

    this.sockets.subscribe('stockItem', (data) => {
      if (this.$props.id === 'stock-approved') {
        this.rows.push(data)
      } else {
        const k = findKey(this.rows, { ITEMNO: data.ITEMNO })
        if (k) this.rows.splice(k, 1)
      }
    })
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
