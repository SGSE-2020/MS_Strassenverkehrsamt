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
  },

  refeshToken({ state, commit }) {
    try {
      console.log(auth.currentUser)
      auth.currentUser
        .getIdToken(true)
        .then(function(idToken) {
          console.log(idToken)
          console.log(auth.currentUser)
          // var user = state.user
          // user.stsTokenManager.accessToken = idToken;
          commit('SET_USER', auth.currentUser)
        })
        .catch(function(error) {
          console.log(error)
        })
      /*
        state.user.getIdToken(true).then((token) => {
          console.log(token)
        })
      */
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
