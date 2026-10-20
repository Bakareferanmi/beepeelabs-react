import { getAuth } from 'firebase/auth'
import { firebaseApp } from '../firebase.js'

export const auth = getAuth(firebaseApp)
