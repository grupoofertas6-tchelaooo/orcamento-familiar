import { initializeApp, getApps, getApp } from 'firebase/app'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firebaseConfig from './firebaseConfig'

let app
let auth
let db

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  })
  db = getFirestore(app)
} catch (e) {
  console.warn('Firebase não configurado. O app usará armazenamento local.')
}

export { auth, db }
