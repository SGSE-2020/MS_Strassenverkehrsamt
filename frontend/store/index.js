import { auth } from '~/plugins/firebase.js'

export const strict = false

export const state = () => ({
  loggedIn: false,
  token: 'none',
  roles: []
})

export const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_LOGGEDIN(state, status) {
    state.loggedIn = status
  },
  SET_ROLES(state, roles) {
    state.roles = roles
  }
}

export const actions = {
  async logout({ commit }) {
    await auth.signOut()
    commit('SET_TOKEN', 'none')
    commit('SET_LOGGEDIN', false)
    commit('SET_ROLES', [])
    console.log('Logged out')
  },

  async login({ commit }, { email, password }) {
    try {
      await auth.signInWithEmailAndPassword(email, password)
      await auth.currentUser
        .getIdToken(false)
        .then(function(idToken) {
          console.log({ currentToken: idToken })
          commit('SET_TOKEN', idToken)
          commit('SET_LOGGEDIN', true)
        })
        .catch(function(error) {
          console.log(error)
        })
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  setRoles({ commit }, { roles }) {
    commit('SET_ROLES', roles)
    console.log('Roles set to: ' + JSON.stringify(roles))
  },

  async refeshToken({ commit }) {
    try {
      commit('SET_LOGGEDIN', false)
      await auth.currentUser
        .getIdToken(true)
        .then(function(idToken) {
          console.log({ currentToken: idToken })
          commit('SET_TOKEN', idToken)
          commit('SET_LOGGEDIN', true)
        })
        .catch(function(error) {
          console.log(error)
        })
    } catch (error) {
      console.log(error)
    }
  }
}
