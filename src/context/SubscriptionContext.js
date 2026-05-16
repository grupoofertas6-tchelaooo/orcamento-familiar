import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useAuth } from './AuthContext'
import { PREMIUM_FEATURES } from '../utils/premiumFeatures'
import { PRODUCT_IDS } from '../config/iap'
import {
  initConnection,
  endConnection,
  fetchProducts,
  requestSubscription,
  getAvailablePurchases,
  finishTransaction,
} from 'react-native-iap'

const SubscriptionContext = createContext({})

const DEV_PREMIUM_KEY = '@family_budget_dev_premium'

export function SubscriptionProvider({ children }) {
  const { user } = useAuth()
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)
  const [devMode, setDevMode] = useState(false)
  const [products, setProducts] = useState([])

  useEffect(() => {
    init()
    return () => { endConnection() }
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

      await initConnection()
      const subs = await fetchProducts({
        products: [PRODUCT_IDS.PREMIUM_MONTHLY, PRODUCT_IDS.PREMIUM_YEARLY],
      })
      setProducts(subs)
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

  const purchase = async (productId = PRODUCT_IDS.PREMIUM_MONTHLY) => {
    try {
      const purchaseResult = await requestSubscription({
        sku: productId,
        subscriptionOffers: [{ sku: productId, offerToken: '' }],
      })

      if (purchaseResult) {
        const receipt = purchaseResult.transactionReceipt
        if (receipt) {
          setIsPremium(true)
          await syncPremiumToFirestore(true)
          await finishTransaction({ purchase: purchaseResult, isConsumable: false })
          Alert.alert('Premium Ativado!', 'Aproveite todos os recursos Pro.')
          return true
        }
      }
      return false
    } catch (err) {
      if (err.code !== 'E_USER_CANCELLED') {
        Alert.alert('Erro', 'Não foi possível processar o pagamento.')
      }
      return false
    }
  }

  const restore = async () => {
    try {
      const purchases = await getAvailablePurchases()
      const hasPremium = purchases.length > 0

      if (hasPremium) {
        setIsPremium(true)
        await syncPremiumToFirestore(true)
        Alert.alert('Restaurado!', 'Seu plano Pro foi restaurado.')
      } else {
        const fbPremium = await checkFirestorePremium()
        setIsPremium(fbPremium)
        Alert.alert(
          fbPremium ? 'Restaurado!' : 'Nenhum plano encontrado',
          fbPremium ? 'Seu plano Pro foi restaurado.' : 'Você não possui assinaturas ativas.'
        )
      }
      return hasPremium
    } catch {
      Alert.alert('Erro', 'Não foi possível restaurar compras.')
      return false
    }
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
      isPremium, loading, devMode, products,
      purchase, restore,
      canAccess, toggleDevPremium,
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => useContext(SubscriptionContext)
