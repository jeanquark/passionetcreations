<template>
    <v-main>
        <v-container fill-height>
            <v-row align="center" justify="center">
                <v-col cols="12" sm="8" md="4">
                    <!-- form.errors: {{ form.errors }} -->

                    <v-card class="elevation-12">
                        <v-toolbar color="#c49a6c" class="">
                            <v-toolbar-title class="white--text">Mot de passe oublié</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-form>
                                <v-text-field prepend-icon="mdi-account" name="email" label="Email" type="text" :error-messages="form.errors.get('email')" v-model="form.email"></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions class="">
                            <v-row no-gutters align="center">
                                <v-col cols="4">
                                    <v-btn small outlined color="#c49a6c" class="" href="/"> <v-icon>mdi-arrow-left</v-icon></v-btn>
                                </v-col>
                                <v-col cols="4" class="d-flex justify-center">
                                    <v-btn color="#c49a6c" class="white--text" :loading="form.busy" @click="send">Envoyer lien</v-btn>
                                </v-col>
                                <v-col cols="4"></v-col>
                            </v-row>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>
import Navbar from '../components/NavbarComponent'
import Form from 'vform'

export default {
    components: { Navbar },
    async created() {
        this.$store.commit('snackbars/CLEAR_SNACKBAR')
    },
    data() {
        return {
            form: new Form({
                email: '',
            }),
        }
    },
    computed: {},
    methods: {
        async send() {
            try {
                const { data } = await this.form.post('/forgot-password')
                console.log('data: ', data)
                this.form.reset()
                this.$store.commit('snackbars/SET_SNACKBAR', {
                    show: true,
                    content: 'Nous vous avons envoyé par email le lien de réinitialisation du mot de passe.',
                    color: 'success',
                })
            } catch (error) {
                console.log('error: ', error)
                console.log('error.response: ', error.response)
                console.log('error.response.data: ', error.response.data)
                this.$store.commit('snackbars/SET_SNACKBAR', {
                    show: true,
                    content: "Une erreur est survenue et l'email n'a pas pu être envoyé.",
                    color: 'error',
                })
            }
        },
    },
}
</script>

<style scoped>
/* .background-image {
        background-image: url('/images/logo_toolbar.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: right;
    } */
.primary-color {
    background-color: #c49a6c;
}
</style>
