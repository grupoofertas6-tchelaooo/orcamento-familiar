import { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'

const AuthContext = createContext({})

const SESSION_KEY = '@family_budget_session'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (auth) {
      const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          let foto = null
          try {
            if (db) {
              const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
              foto = snap.data()?.foto || null
            }
          } catch {}
          setUser({
            id: firebaseUser.uid,
            nome: firebaseUser.displayName || 'Usuário',
            email: firebaseUser.email,
            foto,
          })
        } else {
          loadLocalSession()
        }
        setLoading(false)
      })
      return unsub
    }
    loadLocalSession()
  }, [])

  const loadLocalSession = async () => {
    try {
      const session = await AsyncStorage.getItem(SESSION_KEY)
      if (session) setUser(JSON.parse(session))
    } catch {} finally {
      setLoading(false)
    }
  }

  const register = async (nome, email, senha) => {
    if (auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, senha)
      await fbUpdateProfile(cred.user, { displayName: nome })
      if (db) {
        await setDoc(doc(db, 'users', cred.user.uid), {
          nome, email, foto: null, plan: 'free', createdAt: new Date().toISOString(),
        })
      }
      setUser({ id: cred.user.uid, nome, email: cred.user.email, foto: null })
    } else {
      const raw = await AsyncStorage.getItem('@family_budget_users')
      const users = raw ? JSON.parse(raw) : []
      if (users.find((u) => u.email === email)) throw new Error('Este email já está cadastrado')
      const novo = { id: Date.now(), nome, email, senha, createdAt: new Date().toISOString() }
      users.push(novo)
      await AsyncStorage.setItem('@family_budget_users', JSON.stringify(users))
      await loginLocal(email, senha)
    }
  }

  const loginLocal = async (email, senha) => {
    const raw = await AsyncStorage.getItem('@family_budget_users')
    const users = raw ? JSON.parse(raw) : []
    const found = users.find((u) => u.email === email && u.senha === senha)
    if (!found) throw new Error('Email ou senha inválidos')
    const session = { id: found.id, nome: found.nome, email: found.email }
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
  }

  const login = async (email, senha) => {
    if (auth) {
      const cred = await signInWithEmailAndPassword(auth, email, senha)
      let foto = null
      try {
        if (db) {
          const snap = await getDoc(doc(db, 'users', cred.user.uid))
          foto = snap.data()?.foto || null
        }
      } catch {}
      setUser({
        id: cred.user.uid,
        nome: cred.user.displayName || 'Usuário',
        email: cred.user.email,
        foto,
      })
    } else {
      await loginLocal(email, senha)
    }
  }

  const logout = async () => {
    if (auth) {
      await signOut(auth)
    }
    await AsyncStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const updateProfile = async (nome, foto) => {
    const novoUser = { ...user, nome, foto: foto || user.foto }
    if (auth && user) {
      const currentUser = auth.currentUser
      if (currentUser) {
        await fbUpdateProfile(currentUser, { displayName: nome })
      }
      if (db) {
        await setDoc(doc(db, 'users', user.id), { nome, foto: foto || user.foto }, { merge: true })
      }
    } else {
      const raw = await AsyncStorage.getItem('@family_budget_users')
      const users = raw ? JSON.parse(raw) : []
      const idx = users.findIndex((u) => u.email === user.email)
      if (idx >= 0) {
        users[idx].nome = nome
        if (foto) users[idx].foto = foto
        await AsyncStorage.setItem('@family_budget_users', JSON.stringify(users))
      }
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(novoUser))
    }
    setUser(novoUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
