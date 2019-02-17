<template>
    <div id="app">
        <vue-bootstrap4-table :rows="rows"
                                :columns="columns"
                                :config="config"
                                @on-download="onDownload">
        </vue-bootstrap4-table>
    </div>
</template>

<script>
    import VueBootstrap4Table from 'vue-bootstrap4-table'

    export default {
        name: 'App',
        data: function() {
            return {
                rows: [

                ],
                columns: [

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
                  
                }
            }
        },
        methods: {
            onDownload(payload) {
                console.log(payload);
            }
        },
        components: {
            VueBootstrap4Table
        }
    }
</script>
