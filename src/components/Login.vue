<template>
    <div>
        <b-container fluid>
            <h1>Inloggen</h1>
            <form>
                <b-row>
                    <b-col xs="12" sm="6" md="3">
                        <b-form-group>
                            <label for="username">Gebruikersnaam</label>
                            <b-form-input id="username" v-model="$v.username.$model" :class="status($v.username)" type="text"></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col xs="12" sm="6" md="3">
                        <b-form-group>
                            <label for="password">Wachtwoord</label>
                            <b-form-input id="password" v-model="$v.password.$model" :class="status($v.password)" type="password"></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col xs="12">
                        <p v-show="errored" class="error">Inloggegevens onjuist</p>
                        <b-button type="submit" @click="handleSubmit" variant="primary">Inloggen</b-button>
                    </b-col>
                </b-row>
            </form>
        </b-container>
    </div>
</template>

<script>
    import { required } from 'vuelidate/lib/validators'
    export default {
        data(){
            return {
                errored     : false,
                username    : "",
                password    : ""
            }
        },
        validations: {
            username: { required },
            password: { required }
        },
        methods : {
            status(validation) {
                return {
                  error: validation.$error,
                  dirty: validation.$dirty
                }
            },
            handleSubmit(e){
                e.preventDefault()
                this.errored = false

                this.$v.$touch()

                if (!this.$v.$invalid) {
                    this.$api.post(this.$config.api.uri + '/users/authenticate', {
                        username    : this.username,
                        password    : this.password
                    })
                    .then(response => {
                        localStorage.setItem('user',JSON.stringify(response.data.user))
                        localStorage.setItem('jwt',response.data.token)

                        if (localStorage.getItem('jwt') != null) {
                            this.$emit('loggedIn')
                            this.$store.commit('login', response.data)

                            if (this.$route.params.nextUrl != null)
                                this.$router.push(this.$route.params.nextUrl)
                            else
                                this.$router.push('/')
                        }
                    })
                    .catch(() => {
                        this.errored = true
                     });
                }
            }
        }
    }
</script>
