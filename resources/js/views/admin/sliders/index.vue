<template>
    <v-main>
        <v-breadcrumbs large :items="items"></v-breadcrumbs>
        <v-row no-gutters class="mx-6">
            <v-col cols="12">
                <v-data-table :headers="headers" :items="sliders" :items-per-page="5" :hide-default-header="true" class="elevation-1">
                    <template v-slot:header="{ props }">
                        <thead>
                            <tr>
                                <th class="text-left" v-for="(head, index) in props.headers" :key="index">
                                    {{ head.text }}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                    </template>

                    <template v-slot:[`item`]="{ item }">
                        <tr style="" v-if="headers && headers.length">
                            <td>
                                {{ item.id }}
                            </td>
                            <td>
                                {{ item.name }}
                            </td>
                            <td>
                                {{ item.section }}
                            </td>
                            <td>
                                {{ item.created_at | moment('DD MMM YYYY') }}
                            </td>
                            <td>
                                {{ item.updated_at | moment('from') }}
                            </td>
                            <td style="white-space: nowrap">
                                <v-btn small color="info" :to="`/admin/sliders/${item.id}/edit`">Editer</v-btn>
                                <v-btn small color="error">Supprimer</v-btn>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-main>
</template>

<script>
export default {
    name: 'AdminSlidersIndex',
    async created() {
        try {
            if (this.$store.getters['sliders/sliders'].length < 1) {
                this.$store.dispatch('sliders/fetchSliders')
            }
        } catch (error) {
            console.log('error: ', error)
        }
    },
    mounted() {},
    data() {
        return {
            items: [
                {
                    text: 'Carousels',
                    disabled: true,
                    href: '/admin/sliders'
                }
            ],
            headers: [
                {
                    text: 'ID',
                    align: 'start',
                    sortable: false,
                    value: 'id'
                },
                {
                    text: 'Nom',
                    value: 'name'
                },
                {
                    text: 'Section',
                    value: 'section'
                },
                { text: 'Créé le', value: 'created_at' },
                { text: 'Dernière modification', value: 'updated_at' }
            ]
        }
    },
    computed: {
        sliders() {
            return this.$store.getters['sliders/sliders']
        }
    },
    methods: {}
}
</script>

<style scoped></style>
