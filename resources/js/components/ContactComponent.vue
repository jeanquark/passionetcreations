<template>
    <v-main>
        <v-row no-gutters justify="center" id="contact" class="mb-10 px-0" style="border: 0px solid orange">
            <v-col cols="12" md="6" class="pr-5">
                <!-- <GmapMap :center="{ lat: 46.4776, lng: 6.4272 }" :zoom="14" map-type-id="terrain" style="width: 100%; height: 300px">
                    <GmapMarker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true" :draggable="true" @click="center = m.position" />
                </GmapMap> -->
                <l-map :zoom="zoom" :center="center" class="" style="z-index: 0;">
                    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                    <l-circle-marker :lat-lng="circle.center" :radius="circle.radius" :color="circle.color" />
                </l-map>
            </v-col>
            <v-col cols="12" md="4" class="px-10">
                <v-list dense class="mb-3">
                    <v-subheader class="text-center text-h5">Formulaire de contact</v-subheader>
                </v-list>
                <v-form @submit.prevent="sendContactForm">
                    <v-text-field prepend-icon="mdi-account" name="name" label="Nom" type="text" :error-messages="form.errors.get('name')" v-model="form.name"></v-text-field>
                    <v-text-field prepend-icon="mdi-lock" name="email" label="E-mail" type="email" :error-messages="form.errors.get('email')" v-model="form.email"></v-text-field>
                    <v-textarea
                        prepend-icon="mdi-message"
                        name="message"
                        label="Votre message"
                        rows="4"
                        counter
                        hint="Max. 1000 caractères"
                        :error-messages="form.errors.get('message')"
                        v-model="form.message"
                    ></v-textarea>
                    <v-row no-gutters justify="center" class="my-3">
                        <vue-recaptcha ref="recaptcha" :loadRecaptchaScript="true" @verify="onCaptchaVerified" @expired="onCaptchaExpired" sitekey="6Lf2kDsUAAAAAG_Ri3CprPGeRm_m3XpFi0QETCCv" class="text-center">
                        </vue-recaptcha>
                        
                    <!-- </div> -->
                    </v-row>
                    <v-row no-gutters justify="center" align="center">
                        <v-btn small type="submit" color="success" class="mr-2" :disabled="!formIsVerified" :loading="form.busy">Envoyer</v-btn>
                        <v-btn x-small color="info" @click="resetRecaptcha">Réactualiser captcha</v-btn>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
        <v-row no-gutters justify="center" class="my-5">
            <v-col cols="12" md="10">
                <v-row no-gutters justify="start">
                    <v-col cols="12" md="4" offset-md="0" class="pa-0">
                        <v-list dense>
                            <v-subheader class="text-center text-h5">Informations de contact</v-subheader>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon>mdi-phone</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title class="text-subtitle-2">079 124 64 71</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon class="mt-2">mdi-email</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title class="text-subtitle-2">
                                        <v-tooltip v-model="showTooltip" top :open-on-hover="false" :open-on-focus="false" :open-on-click="false">
                                            <template v-slot:activator="{ on, attrs }">
                                                <span v-bind="attrs" v-on="on" class="no-click2" @click="hideTooltip">
                                                    <a href="mailto:info@passionetcreations.ch">info@passionetcreations.ch</a>&nbsp;
                                                </span>
                                            </template>
                                            <span>Adresse e-mail copiée</span>
                                        </v-tooltip>
                                        <v-btn icon @click="copyEmailAddress"><v-icon small>mdi-content-copy</v-icon></v-btn>
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon>mdi-map-marker</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title class="text-subtitle-2" style="line-height: 1.5em">
                                        Passion & Créations<br />
                                        Les Ateliers de la Côte<br />
                                        Rte de Pallatex 5<br />
                                        1163 Etoy
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-col>

                    <v-col cols="12" md="4" class="pa-3" v-for="content in contents" :key="content.id">
                        <v-list dense>
                            <v-subheader class="text-center text-h5">{{ content.name }}</v-subheader>
                            <v-list-item>
                                <v-list-item-content>
                                    <div v-html="content.content"></div>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-main>
</template>

<script>
import Form from 'vform'
import VueRecaptcha from 'vue-recaptcha'
import { LMap, LTileLayer, LMarker, LCircleMarker } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'

export default {
    components: { VueRecaptcha, LMap, LTileLayer, LMarker, LCircleMarker },
    data() {
        return {
            form: new Form({
                name: '',
                email: '',
                message: ''
            }),
            markers: [],
            showTooltip: false,
            show: false,
            formIsVerified: false,
            sitekey: process.env.RECAPTCHA_SITE_KEY,
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            zoom: 15,
            center: [46.477716, 6.427522],
            // markerLatLng: [46.477716, 6.427522],
            circle: {
                center: [46.477716, 6.427522],
                radius: 10,
                color: 'red'
            }
        }
    },
    computed: {
        contents() {
            return this.$store.getters['contents/contents'].filter(content => content.section === 'contact' && content.is_published == true)
        }
    },
    methods: {
        hideTooltip() {
            this.showTooltip = false
        },
        onCaptchaVerified(response) {
            console.log('onVerify: ', response)
            this.formIsVerified = true
        },
        onCaptchaExpired() {
            console.log('onExpired')
            this.formIsVerified = false
            this.$refs.recaptcha.reset()
        },
        resetRecaptcha() {
            this.$refs.recaptcha.reset() // Direct call reset method
            this.formIsVerified = false
        },
        async sendContactForm() {
            try {
                console.log('sendContactForm')
                await this.form.post(`/api/v1/send-contact-form`)
                this.form.reset()
                this.$store.commit('snackbars/SET_SNACKBAR', { color: 'success', content: 'Message envoyé avec succès.', show: true, timeout: 5000 })
            } catch (error) {
                this.$store.commit('snackbars/SET_SNACKBAR', { color: 'error', content: "Une erreur est survenue et le message n'a pas pu être envoyé.", show: true, timeout: 5000 })
                console.log('error: ', error)
            }
        },
        copyEmailAddress() {
            try {
                this.showTooltip = true
                setTimeout(() => {
                    this.showTooltip = false
                }, 2000)
                navigator.clipboard.writeText('info@passionetcreations.ch')
            } catch (error) {
                console.log('error: ', error)
            }
        },
        setShow() {
            this.show = !this.show
            setTimeout(() => {
                this.show = false
            }, 3000)
        }
    }
}
</script>

<style scoped>
.no-click {
    pointer-events: none;
}
</style>
