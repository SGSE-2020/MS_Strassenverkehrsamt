import { auth } from '~/plugins/firebase.js'

export const strict = false

export const state = () => ({
  token: false
})

export const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  }
}

export const actions = {
  async logout({ commit }) {
    await auth.signOut()
    commit('SET_TOKEN', false)
    console.log('Logged out')
  },

  async login({ commit }, { email, password }) {
    try {
      await auth.signInWithEmailAndPassword(email, password)
      await auth.currentUser
        .getIdToken(false)
        .then(function(idToken) {
          console.log({ currentToken: idToken })
          commit('SET_TOKEN', true)
        })
        .catch(function(error) {
          console.log(error)
        })
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async refeshToken({ commit }) {
    try {
      commit('SET_TOKEN', false)
      await auth.currentUser
        .getIdToken(true)
        .then(function(idToken) {
          console.log({ currentToken: idToken })
          commit('SET_TOKEN', true)
        })
        .catch(function(error) {
          console.log(error)
        })
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
