<template>
    <v-main>
        <v-breadcrumbs large :items="items"></v-breadcrumbs>
        <v-row no-gutters justify="center">
            <!-- form.busy: {{ form.busy }}<br /><br /> -->
            <!-- form.errors: {{ form.errors }}<br /><br /> -->
            <!-- form.images: {{ form.image }}<br /><br /> -->
            <v-col cols="12" md="10">
                <v-form @submit.prevent="createPortfolio" v-if="form">
                    <v-text-field prepend-icon="mdi-text-short" name="title" label="Titre" type="text" :error-messages="form.errors.get('title')" v-model="form.title"></v-text-field>
                    <!-- <v-text-field prepend-icon="mdi-lock" name="description" label="Description" type="text" :error-messages="form.errors.get('description')" v-model="form.description"></v-text-field> -->
                    <text-editor-component @toggleShowHTML="toggleShowHTML" :formContent="form.description" />

                    <v-checkbox v-model="form.is_active" label="Actif?"></v-checkbox>

                    <v-row no-gutters class="my-4" style="border: 0px solid orange">
                        <v-col cols="12">
                            <span class="pl-2" style="color: grey; font-size: 1em">Images</span>
                            <span class="error--text">{{ form.errors.get('images') }}</span>
                        </v-col>
                        <v-col cols="12">
                            <draggable class="row no-gutters" group="images" handle=".draggable" v-model="form.images">
                                <v-col cols="12" md="6" lg="4" class="pa-2 draggable" style="border: 0px solid green" v-for="(image, index) in form.images" :key="index">
                                    <v-hover v-slot="{ hover }">
                                        <v-card
                                            min-height="200"
                                            :elevation="hover ? 12 : 2"
                                            :class="{ 'on-hover': hover }"
                                            class="d-flex justify-center align-center image"
                                            style="border: 0px dashed #ccc"
                                        >
                                            <v-card-text class="text-center">
                                                <v-img :src="`/medias/${image.path}`" max-width="100%" class=""></v-img>
                                                <p class="text-center mt-2 mb-0" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">{{ image.name }}</p>
                                                <v-chip small color="success" v-if="index == 0">Image principale</v-chip>
                                                <v-btn x-small color="error" class="mb-0" :class="hover ? '' : 'transparent'" @click="removeImage(index)">Supprimer</v-btn>
                                            </v-card-text>
                                        </v-card>
                                    </v-hover>
                                </v-col>

                                <v-col cols="12" md="4" lg="4" class="pa-2" style="">
                                    <v-hover v-slot="{ hover }">
                                        <v-card
                                            height="200"
                                            width="100%"
                                            :elevation="hover ? 12 : 2"
                                            :class="{ 'on-hover': hover }"
                                            class="d-flex justify-center align-center"
                                            style="border: 2px dashed #ccc"
                                            @click="dialog = !dialog"
                                        >
                                            <v-card-text class="text-center" style="">
                                                <v-icon x-large>mdi-plus</v-icon>
                                            </v-card-text>
                                        </v-card>
                                    </v-hover>
                                </v-col>
                            </draggable>
                        </v-col>
                    </v-row>

                    <div class="text-center mt-5">
                        <v-btn type="submit" color="success" :loading="form.busy">Ajouter</v-btn>
                    </div>
                </v-form>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" width="80%">
            <medias-component @addFile="onAddFile"></medias-component>
        </v-dialog>
    </v-main>
</template>

<script>
import Form from 'vform'
import draggable from 'vuedraggable'
import MediasComponent from '../../../components/MediasComponent'
import TextEditorComponent from '../../../components/TextEditorComponent'
export default {
    name: 'AdminPortfoliosCreate',
    components: { MediasComponent, TextEditorComponent, draggable },
    data() {
        return {
            items: [
                {
                    text: 'Portfolios',
                    disabled: false,
                    to: '/admin/portfolios',
                    exact: true,
                },
                {
                    text: 'Ajouter',
                    disabled: true,
                    to: '/admin/portfolio/create',
                },
            ],
            form: new Form({
                title: '',
                description: '',
                is_active: true,
                images: [],
            }),
            showModal: false,
            dialog: false,
        }
    },
    computed: {},
    methods: {
        toggleShowHTML(value) {
            console.log('toggleShowHTML2: ', value)
            this.showHTML = value
        },
        selectFile(e) {
            console.log('selectFile e: ', e)
            this.form.image = e.File
            this.image = e.File
        },
        onAddFile(file) {
            try {
                this.dialog = false
                console.log('onAddFile file: ', file)
                // this.form.front_image_id = file.id
                if (this.form.images.length < 1) {
                    file['is_front_image'] = true
                } else {
                    file['is_front_image'] = false
                }
                this.form.images.push(file)
            } catch (error) {
                console.log('error: ', error)
            }
        },
        removeImage(index) {
            try {
                console.log('removeImage index: ', index)
                console.log('form.images: ', this.form.images)
                this.form.images.splice(index, 1)
            } catch (error) {
                console.log('error: ', error)
            }
        },
        async createPortfolio() {
            try {
                // console.log('createPortfolio form: ', this.form)
                // 1) Format description
                let description
                if (!this.showHTML) {
                    description = document.getElementById('textBox').innerHTML
                } else {
                    description = document.getElementById('textBox').innerText
                }
                console.log('description: ', description)

                this.form['description'] = description

                // 2) Add images
                this.form.images.forEach((image, index) => {
                    image.order = index
                    if (index == 0) {
                        image.is_front_image = true
                    }
                })

                await this.$store.dispatch('portfolios/createPortfolio', this.form)
                this.$store.commit('snackbars/SET_SNACKBAR', {
                    show: true,
                    content: 'Portfolio créé avec succès.',
                    color: 'success',
                })
                this.$router.push('/admin/portfolios')
            } catch (error) {
                console.log('error: ', error)
                this.$store.commit('snackbars/SET_SNACKBAR', {
                    show: true,
                    content: "Une erreur est survenue et le portfolio n'a pas pu être créé.",
                    color: 'error',
                })
            }
        },
    },
}
</script>

<style scoped>
.image:hover {
    cursor: pointer;
}
</style>
