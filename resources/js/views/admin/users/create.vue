<template>
    <v-main>
        <v-breadcrumbs large :items="items"></v-breadcrumbs>
        <v-row no-gutters justify="center">
            <v-col cols="12" md="10">
                <v-form @submit.prevent="createUser">
                    <v-text-field prepend-icon="mdi-account" name="name" label="Nom" type="text" :error-messages="form.errors.get('name')" v-model="form.name"></v-text-field>
                    <v-text-field prepend-icon="mdi-email" name="email" label="Email" type="email" :error-messages="form.errors.get('email')" v-model="form.email"></v-text-field>
                    
                    <v-text-field prepend-icon="mdi-lock" name="password" label="Mot de passe" type="password" :error-messages="form.errors.get('password')" v-model="form.password"></v-text-field>
                    <v-text-field
                        prepend-icon="mdi-lock"
                        name="password_confirmation"
                        label="Confirmation mot de passe"
                        type="password"
                        :error-messages="form.errors.get('password_confirmation')"
                        v-model="form.password_confirmation"
                    ></v-text-field>
                    <v-file-input prepend-icon="mdi-camera" label="Image de l'utilisateur (optionel)" :clearable="false" show-size class="my-5" @change="onFileChange" v-model="form.picture"></v-file-input>
                    <div id="preview" class="mb-4" v-if="previewImage">
                        <!-- previewImage: {{ previewImage }}<br /> -->
                        <v-row no-gutters class="">
                            <v-col cols="12" md="6" lg="4" class="ml-6 pa-2">
                                <v-img :src="previewImage" width="100"></v-img>
                            </v-col>
                        </v-row>
                    </div>
                    <div class="text-center">
                        <v-btn small type="submit" color="success" :loading="form.busy">Créer utilisateur</v-btn>
                    </div>
                </v-form>
            </v-col>
        </v-row>
    </v-main>
</template>

<script>
import Form from 'vform'
export default {
    name: 'AdminUsersCreate',
    data() {
        return {
            items: [
                {
                    text: 'Utilisateurs',
                    disabled: false,
                    to: '/admin/users',
                    exact: true
                },
                {
                    text: 'Ajouter',
                    disabled: true,
                    to: '/admin/users/create'
                }
            ],
            form: new Form({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                picture: null
            }),
            previewImage: null
        }
    },
    computed: {},
    methods: {
        onFileChange(file) {
            console.log('onFileChange: ', file)
            // // console.log(files[0].mozFullPath);
            // this.form.path = this.items[this.items.length - 1]['path']
            // this.previewImages = []
            // for (let i = 0; i < files.length; i++) {
            //     if (files[i]['type'].startsWith('image/')) {
            //         this.previewImages.push(URL.createObjectURL(files[i]))
            //     }
            // }
            this.previewImage = URL.createObjectURL(file)
        },
        async createUser() {
            try {
                console.log('createUser')
                await this.$store.dispatch('users/createUser', this.form)
                this.$store.commit('snackbars/SET_SNACKBAR', {
                    show: true,
                    content: 'Utilisateur créé avec succès.',
                    color: 'success'
                })
                this.$router.push('/admin/users')
            } catch (error) {
                console.log('error: ', error)
                this.$store.commit('snackbars/SET_SNACKBAR', {
                    show: true,
                    content: 'Une erreur est survenue et l\'utilisateur n\'a pas pu être créé.',
                    color: 'error'
                })
                throw error
            }
        }
    }
}
</script>

<style scoped></style>
