import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where,
} from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from './AuthContext'

const DataContext = createContext({})

const KEYS = {
  transacoes: '@family_budget_transacoes',
  categorias: '@family_budget_categorias',
  metas: '@family_budget_metas',
  membros: '@family_budget_membros',
}

function useFirebase() {
  const { user } = useAuth()
  return { enabled: !!(db && user), userId: user?.id }
}

export function DataProvider({ children }) {
  const fb = useFirebase()
  const [transacoes, setTransacoes] = useState([])
  const [categorias, setCategorias] = useState([])
  const [metas, setMetas] = useState([])
  const [membros, setMembros] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loadAll()
  }, [fb.enabled, fb.userId])

  const loadAll = async () => {
    try {
      if (fb.enabled) {
        await loadFromFirebase()
      } else {
        await loadFromLocal()
      }
    } catch (e) {
      console.warn('DataContext load error:', e)
      await loadFromLocal()
    } finally {
      setLoaded(true)
    }
  }

  const loadFromFirebase = async () => {
    const collections = ['transacoes', 'categorias', 'metas', 'membros']
    const results = await Promise.all(
      collections.map(async (col) => {
        const q = query(collection(db, `users/${fb.userId}/${col}`))
        const snap = await getDocs(q)
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      })
    )
    setTransacoes(results[0])
    setCategorias(results[1])
    setMetas(results[2])
    setMembros(results[3])
  }

  const loadFromLocal = async () => {
    const [t, c, m, mb] = await Promise.all(
      ['transacoes', 'categorias', 'metas', 'membros'].map((k) =>
        AsyncStorage.getItem(KEYS[k]).then((v) => (v ? JSON.parse(v) : []))
      )
    )
    setTransacoes(t)
    setCategorias(c)
    setMetas(m)
    setMembros(mb)
  }

  const addTransacao = useCallback(async (data) => {
    const item = { ...data, valor: Number(data.valor), createdAt: new Date().toISOString() }
    if (fb.enabled) {
      const ref = await addDoc(collection(db, `users/${fb.userId}/transacoes`), item)
      setTransacoes((prev) => [{ ...item, id: ref.id }, ...prev])
      return { ...item, id: ref.id }
    }
    const id = Date.now()
    const next = [{ ...item, id }, ...transacoes]
    setTransacoes(next)
    await AsyncStorage.setItem(KEYS.transacoes, JSON.stringify(next))
    return { ...item, id }
  }, [fb.enabled, fb.userId, transacoes])

  const updateTransacao = useCallback(async (id, data) => {
    if (fb.enabled) {
      await updateDoc(doc(db, `users/${fb.userId}/transacoes`, String(id)), data)
    }
    setTransacoes((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...data } : t))
      if (!fb.enabled) AsyncStorage.setItem(KEYS.transacoes, JSON.stringify(next))
      return next
    })
  }, [fb.enabled, fb.userId])

  const deleteTransacao = useCallback(async (id) => {
    if (fb.enabled) {
      await deleteDoc(doc(db, `users/${fb.userId}/transacoes`, String(id)))
    }
    setTransacoes((prev) => {
      const next = prev.filter((t) => t.id !== id)
      if (!fb.enabled) AsyncStorage.setItem(KEYS.transacoes, JSON.stringify(next))
      return next
    })
  }, [fb.enabled, fb.userId])

  const addCategoria = useCallback(async (data) => {
    const item = { ...data, createdAt: new Date().toISOString() }
    if (fb.enabled) {
      const ref = await addDoc(collection(db, `users/${fb.userId}/categorias`), item)
      setCategorias((prev) => [...prev, { ...item, id: ref.id }])
      return { ...item, id: ref.id }
    }
    const id = Date.now()
    const next = [...categorias, { ...item, id }]
    setCategorias(next)
    await AsyncStorage.setItem(KEYS.categorias, JSON.stringify(next))
    return { ...item, id }
  }, [fb.enabled, fb.userId, categorias])

  const updateCategoria = useCallback(async (id, data) => {
    if (fb.enabled) await updateDoc(doc(db, `users/${fb.userId}/categorias`, String(id)), data)
    setCategorias((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...data } : c))
      if (!fb.enabled) AsyncStorage.setItem(KEYS.categorias, JSON.stringify(next))
      return next
    })
  }, [fb.enabled, fb.userId])

  const deleteCategoria = useCallback(async (id) => {
    if (fb.enabled) await deleteDoc(doc(db, `users/${fb.userId}/categorias`, String(id)))
    setCategorias((prev) => {
      const next = prev.filter((c) => c.id !== id)
      if (!fb.enabled) AsyncStorage.setItem(KEYS.categorias, JSON.stringify(next))
      return next
    })
  }, [fb.enabled, fb.userId])

  const addMeta = useCallback(async (data) => {
    const item = { ...data, valorObjetivo: Number(data.valorObjetivo), valorAtual: Number(data.valorAtual || 0), createdAt: new Date().toISOString() }
    if (fb.enabled) {
      const ref = await addDoc(collection(db, `users/${fb.userId}/metas`), item)
      setMetas((prev) => [...prev, { ...item, id: ref.id }])
      return { ...item, id: ref.id }
    }
    const id = Date.now()
    const next = [...metas, { ...item, id }]
    setMetas(next)
    await AsyncStorage.setItem(KEYS.metas, JSON.stringify(next))
    return { ...item, id }
  }, [fb.enabled, fb.userId, metas])

  const updateMeta = useCallback(async (id, data) => {
    if (fb.enabled) await updateDoc(doc(db, `users/${fb.userId}/metas`, String(id)), data)
    setMetas((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, ...data } : m))
      if (!fb.enabled) AsyncStorage.setItem(KEYS.metas, JSON.stringify(next))
      return next
    })
  }, [fb.enabled, fb.userId])

  const deleteMeta = useCallback(async (id) => {
    if (fb.enabled) await deleteDoc(doc(db, `users/${fb.userId}/metas`, String(id)))
    setMetas((prev) => {
      const next = prev.filter((m) => m.id !== id)
      if (!fb.enabled) AsyncStorage.setItem(KEYS.metas, JSON.stringify(next))
      return next
    })
  }, [fb.enabled, fb.userId])

  const addMembro = useCallback(async (data) => {
    const item = { ...data, createdAt: new Date().toISOString() }
    if (fb.enabled) {
      const ref = await addDoc(collection(db, `users/${fb.userId}/membros`), item)
      setMembros((prev) => [...prev, { ...item, id: ref.id }])
      return { ...item, id: ref.id }
    }
    const id = Date.now()
    const next = [...membros, { ...item, id }]
    setMembros(next)
    await AsyncStorage.setItem(KEYS.membros, JSON.stringify(next))
    return { ...item, id }
  }, [fb.enabled, fb.userId, membros])

  const updateMembro = useCallback(async (id, data) => {
    if (fb.enabled) await updateDoc(doc(db, `users/${fb.userId}/membros`, String(id)), data)
    setMembros((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, ...data } : m))
      if (!fb.enabled) AsyncStorage.setItem(KEYS.membros, JSON.stringify(next))
      return next
    })
  }, [fb.enabled, fb.userId])

  const deleteMembro = useCallback(async (id) => {
    if (fb.enabled) await deleteDoc(doc(db, `users/${fb.userId}/membros`, String(id)))
    setMembros((prev) => {
      const next = prev.filter((m) => m.id !== id)
      if (!fb.enabled) AsyncStorage.setItem(KEYS.membros, JSON.stringify(next))
      return next
    })
  }, [fb.enabled, fb.userId])

  const depositarMeta = useCallback(async (metaId, valor) => {
    const v = Number(valor)
    if (fb.enabled) {
      const ref = doc(db, `users/${fb.userId}/metas`, String(metaId))
      const meta = metas.find((m) => m.id === metaId)
      await updateDoc(ref, { valorAtual: (meta?.valorAtual || 0) + v })
    }
    setMetas((prev) => {
      const next = prev.map((m) => (m.id === metaId ? { ...m, valorAtual: m.valorAtual + v } : m))
      if (!fb.enabled) AsyncStorage.setItem(KEYS.metas, JSON.stringify(next))
      return next
    })
  }, [fb.enabled, fb.userId, metas])

  const getSaldo = useCallback(() => {
    const receitas = transacoes.filter((t) => t.tipo === 'receita').reduce((a, t) => a + Number(t.valor), 0)
    const despesas = transacoes.filter((t) => t.tipo === 'despesa').reduce((a, t) => a + Number(t.valor), 0)
    return { receitas, despesas, saldo: receitas - despesas }
  }, [transacoes])

  return (
    <DataContext.Provider
      value={{
        transacoes, categorias, metas, membros, loaded,
        addTransacao, updateTransacao, deleteTransacao,
        addCategoria, updateCategoria, deleteCategoria,
        addMeta, updateMeta, deleteMeta,
        addMembro, updateMembro, deleteMembro,
        depositarMeta, getSaldo,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
