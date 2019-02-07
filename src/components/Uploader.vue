<template>
    <div>
        <b-container fluid>
            <h1>{{ title }}</h1>
            <b-row>
                <b-col xs="12" md="1">
                    <b-button variant="primary" v-on:click="uploadFiles">Uploaden</b-button>
                </b-col>
                <b-col xs="12" md="8" offset-md="1">
                    <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'


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
        uploadFiles: function() {
            this.$refs.myVueDropzone.getQueuedFiles().forEach(file => {
                this.queued++
                this.readFile(file)
            })
        },
        readFile(file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.files.push(file);
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
                    this.$notify({
                        group: 'api',
                        title: 'Certificaten',
                        text: 'De bestanden zijn geupload naar de server!',
                        type: 'success'
                    });
                })
                .catch(() => {
                    this.$notify({
                        group: 'api',
                        title: 'Certificaten',
                        text: 'Er is iets misgegaan tijdens het uploaden!',
                        type: 'error'
                    });
                })
          ;
        }
    }
}
</script>

<style scoped>
.dropzone {
    min-height: 300px;
}
</style>
