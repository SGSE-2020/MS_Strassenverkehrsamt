import { auth } from '~/plugins/firebase.js'

export const strict = false

export const state = () => ({
  user: null
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  }
}

export const actions = {
  async logout({ commit }) {
    await auth.signOut()
    commit('SET_USER', null)
    console.log('logout null')
  },

  async login({ commit }, { email, password }) {
    try {
      const user = await auth.signInWithEmailAndPassword(email, password)
      commit('SET_USER', user.user)
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
