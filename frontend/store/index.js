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
  },

  async login({ commit }, { email, password }) {
    try {
      await auth.createUserWithEmailAndPassword(email, password)
      const user = auth.currentUser
      await user.sendEmailVerification()
      commit('SET_USER', user.user)
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        try {
          const user = await auth.signInWithEmailAndPassword(email, password)
          commit('SET_USER', user.user)
        } catch (error) {
          throw new Error('An Error Ocurred: ', error)
        }
      } else {
        throw new Error('An Error Ocurred: ', error)
      }
    }
  }
}
