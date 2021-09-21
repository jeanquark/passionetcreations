import Vue from 'vue'

export const state = () => ({
	snackbar: {}
})

export const mutations = {
	SET_SNACKBAR (state, payload) {
		// state.snackbars.push(payload);
		console.log('[VUEX] SET_SNACKBAR')
		state.snackbar = payload
	}
}

export const actions = {
}

export const getters = {
	snackbar (state) {
		return state.snackbar
	}
}