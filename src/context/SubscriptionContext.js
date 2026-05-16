import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from './AuthContext'
import { PREMIUM_FEATURES } from '../utils/premiumFeatures'

const SubscriptionContext = createContext({})

const DEV_PREMIUM_KEY = '@family_budget_dev_premium'

export function SubscriptionProvider({ children }) {
  const { user } = useAuth()
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)
  const [devMode, setDevMode] = useState(false)

  useEffect(() => {
    init()
  }, [user])

  const init = async () => {
    setLoading(true)
    try {
      const devVal = await AsyncStorage.getItem(DEV_PREMIUM_KEY)
      if (devVal === 'true') {
        setDevMode(true)
        setIsPremium(true)
        setLoading(false)
        return
      }

      if (!user) {
        setIsPremium(false)
        setLoading(false)
        return
      }

      const fbPremium = await checkFirestorePremium()
      setIsPremium(fbPremium)
    } catch {
      setIsPremium(false)
    } finally {
      setLoading(false)
    }
  }

  const checkFirestorePremium = async () => {
    if (!user || !db) return false
    try {
      const ref = doc(db, 'users', user.id)
      const snap = await getDoc(ref)
      return snap.data()?.plan === 'premium'
    } catch {
      return false
    }
  }

  const syncPremiumToFirestore = async (premium) => {
    if (!user || !db) return
    try {
      await setDoc(doc(db, 'users', user.id), {
        plan: premium ? 'premium' : 'free',
        updatedAt: new Date().toISOString(),
      }, { merge: true })
    } catch {}
  }

  const purchase = async () => {
    Alert.alert(
      'Em Breve',
      'O sistema de pagamentos será ativado quando o app for publicado. Use o Modo Desenvolvedor para testar os recursos Pro.'
    )
    return false
  }

  const restore = async () => {
    const fbPremium = await checkFirestorePremium()
    setIsPremium(fbPremium)
    Alert.alert(
      fbPremium ? 'Restaurado!' : 'Nenhum plano encontrado',
      fbPremium ? 'Seu plano Pro foi restaurado.' : 'Você não possui assinaturas ativas.'
    )
    return fbPremium
  }

  const toggleDevPremium = useCallback(async () => {
    const newVal = !devMode
    setDevMode(newVal)
    setIsPremium(newVal)
    await AsyncStorage.setItem(DEV_PREMIUM_KEY, newVal ? 'true' : 'false')
    if (newVal && user && db) {
      await syncPremiumToFirestore(true)
    }
  }, [devMode, user])

  const canAccess = useCallback((feature) => {
    return isPremium || !Object.values(PREMIUM_FEATURES).includes(feature)
  }, [isPremium])

  return (
    <SubscriptionContext.Provider value={{
      isPremium, loading, devMode,
      purchase, restore,
      canAccess, toggleDevPremium,
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => useContext(SubscriptionContext)
