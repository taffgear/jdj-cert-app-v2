<template>
    <div>
        <b-container fluid>
            <h1>{{ title }}</h1>
            <b-row>
                <b-col xs="12" md="1">
                    <b-button variant="primary" v-show="files.length" v-on:click="uploadFiles">Uploaden</b-button>
                </b-col>
                <b-col xs="12" md="8" offset-md="1">
                    <vue-dropzone ref="myVueDropzone" id="dropzone"
                        :options="dropzoneOptions"
                        @vdropzone-file-added="addedFile"
                        @vdropzone-removed-file="removedFile"
                    ></vue-dropzone>
                </b-col>
            </b-row>
            <b-modal ref="csvModal" size="lg" title="CSV Mapping maken" hide-footer>
                <div class="d-block">
                    <h3>Selecteer voor elke veldnaam hieronder een kolom naam uit het CSV bestand</h3>
                </div>
                <b-form inline>
                    <b-form-group v-for="field in csv.fields" :key="'field-' + field.name" :id="'field-' + field.name" :label="field.label">
                        <b-form-select :options="csv.headers" v-model="csv.selected[field.name]" class="mb-2 mr-sm-2 mb-sm-0"></b-form-select>
                    </b-form-group>
                </b-form>
                <div class="modal-footer">
                   <button type="button" class="btn btn-secondary" v-on:click="cancelMapping">Annuleren</button>
                   <button type="button" class="btn btn-primary" v-on:click="processMapping">Verwerken</button>
               </div>
           </b-modal>
        </b-container>
    </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import { findKey, reduce } from 'lodash'
import Papa from 'papaparse'

export default {
  name: 'Uploader',
  components: {
    vueDropzone: vue2Dropzone
  },
  props: {
      title: String
  },
  data: function () {
        return {
            csv: {
                fields: [
                  { label: 'Test datum', name: 'testDate', value: '', columnIndex: 28 },
                  { label: 'Test tijd', name: 'testTime', value: '', columnIndex: 29 },
                  { label: 'Getest bij', name: 'testedWith', value: '', columnIndex: 105 },
                  { label: 'Klant naam', name: 'customerName', value: '', columnIndex: 2 },
                  { label: 'Klant adres 1', name: 'customerAddress1', value: '', columnIndex: 3 },
                  { label: 'Klant adres 2', name: 'customerAddress2', value: '', columnIndex: 4 },
                  { label: 'Klant adres 3', name: 'customerAddress3', value: '', columnIndex: 5 },
                  { label: 'Klant adres 4', name: 'customerAddress4', value: '', columnIndex: 6 },
                  { label: 'Klant postcode', name: 'customerPostcode', value: '', columnIndex: 7 },
                  { label: 'PAT Model', name: 'PATModel', value: '', columnIndex: 0 },
                  { label: 'PAT Serienummer', name: 'PATSerialnumber', value: '', columnIndex: 1 },
                  { label: 'Artikel nummer', name: 'articleNumber', value: '', columnIndex: 19 },
                  { label: 'Artikel Serienummer', name: 'articleSerialnumber', value: '', columnIndex: 20 },
                  { label: 'Artikel omschrijving', name: 'articleDescription', value: '', columnIndex: 21 },
                  { label: 'Complete test status', name: 'testStatus', value: '', columnIndex: 106 },
                  { label: 'Testgroep', name: 'testGroup', value: '', columnIndex: 14 },
                  { label: 'Testgroep spanning', name: 'testGroupVoltage', value: '', columnIndex: 15 },
                  { label: 'Testgroep omschrijving', name: 'testGroupDescription', value: '', columnIndex: 17 },
                  { label: 'Testgroep status', name: 'testGroupStatus', value: '', columnIndex: 16 },
                  { label: 'Test #1', name: 'test1', value: '', columnIndex: 41 },
                  { label: 'Test #2', name: 'test2', value: '', columnIndex: 42 },
                  { label: 'Test #3', name: 'test3', value: '', columnIndex: 43 },
                  { label: 'Test #4', name: 'test4', value: '', columnIndex: 44 },
                  { label: 'Test #5', name: 'test5', value: '', columnIndex: 45 },
                  { label: 'Test #6', name: 'test6', value: '', columnIndex: 46 },
                  { label: 'Test #7', name: 'test7', value: '', columnIndex: 47 },
                  { label: 'Test #8', name: 'test8', value: '', columnIndex: 48 },
                ],
                selected: {},
                fileName: '',
                headers: [],
                data: [],
                mapped: []
            },
            files: [],
            queued: 0,
            dropzoneOptions: {
                url: this.$config.api.uri + '/files',
                thumbnailWidth: 150,
                maxFilesize: 20,
                maxFiles: 10,
                uploadMultiple: true,
                acceptedFiles: 'text/csv, application/pdf, application/vnd.ms-excel',
                autoProcessQueue: false,
                addRemoveLinks: true,
                dictDefaultMessage: 'Sleep bestanden in dit vlak',
                dictRemoveFile: 'Verwijder',
                dictMaxFilesExceeded: 'Maximaal aantal bestanden van {{ maxFiles }} bereikt.'
            }
        }
    },
    methods: {
        addedFile: function(file) {
            if (file.type.toLowerCase().indexOf('csv') > -1)
                return this.initCSVMapper(file)

            this.files.push(file)
        },
        removedFile: function(file) {
            const key = findKey(this.files, { upload: { uuid: file.upload.uuid } })
            if (key) this.files.splice(key, 1)
        },
        uploadFiles: function() {
            this.$refs.myVueDropzone.getQueuedFiles().forEach(file => {
                this.readFile(file)
            })
        },
        readFile(file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.queued++

                if (this.files.length === this.queued) { this.upload(); }
            };
            reader.readAsDataURL(file);
        },
        upload: function() {
            const formData = new FormData();

            this.files.forEach(file => formData.append('documents', file))

            this.$api.post(this.$config.api.uri + '/files', formData, { auth: this.$config.api.auth })
                .then(() => {
                    this.$refs.myVueDropzone.removeAllFiles()
                    this.files  = []
                    this.queued = 0
                    this.$notify({
                        group: 'api',
                        title: 'Certificaten',
                        text: 'De bestanden zijn geupload naar de server!',
                        type: 'success'
                    })
                })
                .catch(() => {
                    this.$notify({
                        group: 'api',
                        title: 'Certificaten',
                        text: 'Er is iets misgegaan tijdens het uploaden!',
                        type: 'error'
                    })
                })
          ;
      },
      initCSVMapper: function(file) {
          Papa.parse(file, {
              complete: results => {
                const headers = results.data[0]

                if (headers && headers.length) {
                    results.data.splice(0, 1)

                    this.csv.selected = reduce(this.csv.fields, (acc, field) => {
                        acc[field.name] = null

                        if (field.columnIndex >= 0 && headers[field.columnIndex])
                            acc[field.name] = headers[field.columnIndex]

                        return acc
                    }, {})

                    this.csv.fileName   = file.name.toLowerCase()
                    this.csv.headers    = reduce(headers, (acc, header) => {
                        acc.push({ value: header, text: header })
                        return acc
                    }, [])
                    this.csv.data = results.data

                    this.$refs.myVueDropzone.removeFile(file)

                    this.$refs.csvModal.show()
                }

                return false;
            }
        });
    },
    cancelMapping () {
        this.$refs.csvModal.hide()
    },
    processMapping () {
        this.$refs.csvModal.hide()

        this.csv.fields = reduce(this.csv.fields, (acc, field) => {
            field.value = this.csv.selected[field.name]
            acc.push(field)
            return acc
        }, [])

        const fields = this.csv.fields
        const testHeaders = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8']

        this.csv.mapped = reduce(this.csv.data, (acc, arr) => {
            const row = {};

            fields.forEach(field => {
                const name = (testHeaders.indexOf(field.name) >= 0 ? field.name + '@' + field.value : field.name)
                row[name] = (field.columnIndex >= 0 && arr[field.columnIndex] ? arr[field.columnIndex] : '')
            })

            acc.push(row)
            return acc
        }, [])

        const csv       = Papa.unparse(this.csv.mapped)
        const blob      = new Blob([csv], { type: 'text/csv' })
        const formData  = new FormData()

        formData.append('documents', blob, this.csv.fileName)

        this.$api.post(this.$config.api.uri + '/files', formData, { auth: this.$config.api.auth })
            .then(() => {
                this.csv.file       = null
                this.csv.mapped     = []
                this.csv.headers    = []
                this.csv.selected   = {}

                this.$notify({
                    group: 'api',
                    title: 'Certificaten',
                    text: 'Het CSV bestand is geupload naar de server!',
                    type: 'success'
                })
            })
            .catch (() => {
                this.$notify({
                    group: 'api',
                    title: 'Certificaten',
                    text: 'Er is iets misgegaan tijdens het uploaden!',
                    type: 'error'
                })
            })
    }
    }
}
</script>

<style scoped>
#dropzone {
    min-height: 300px;
}
.form-group {
    margin-bottom: 10px;
}
</style>
