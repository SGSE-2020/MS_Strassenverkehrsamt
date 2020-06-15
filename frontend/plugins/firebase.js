import firebase from 'firebase'
import 'firebase/auth'

const config = {
  apiKey: 'AIzaSyBvTg0_QrhEvQ9UeZPH8--E2JZ55KA_u_c',
  authDomain: 'smart-city-ss2020.firebaseapp.com',
  databaseURL: 'https://smart-city-ss2020.firebaseio.com',
  projectId: 'smart-city-ss2020',
  storageBucket: 'smart-city-ss2020.appspot.com',
  messagingSenderId: '957240233717'
}

firebase.initializeApp(config)

export const auth = firebase.auth()
export default firebase
