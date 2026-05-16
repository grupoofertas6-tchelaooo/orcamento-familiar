import { ActivityIndicator, View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../context/AuthContext'
import { colors } from '../styles/theme'

import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import TermsScreen from '../screens/TermsScreen'
import PrivacyScreen from '../screens/PrivacyScreen'
import DashboardScreen from '../screens/DashboardScreen'
import CategoriesScreen from '../screens/CategoriesScreen'
import MembersScreen from '../screens/MembersScreen'
import GoalsScreen from '../screens/GoalsScreen'
import ReportsScreen from '../screens/ReportsScreen'
import AddTransactionScreen from '../screens/AddTransactionScreen'
import AddGoalScreen from '../screens/AddGoalScreen'
import AddCategoryScreen from '../screens/AddCategoryScreen'
import AddMemberScreen from '../screens/AddMemberScreen'
import SettingsScreen from '../screens/SettingsScreen'
import ProScreen from '../screens/ProScreen'
import FamilyShareScreen from '../screens/FamilyShareScreen'
import ProfileEditScreen from '../screens/ProfileEditScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()
const HomeStack = createNativeStackNavigator()

function TabNavigator() {
  const tabs = [
    { name: 'Dashboard', component: DashboardScreen, icon: 'home', label: 'Início' },
    { name: 'Categories', component: CategoriesScreen, icon: 'grid', label: 'Categorias' },
    { name: 'Members', component: MembersScreen, icon: 'people', label: 'Família' },
    { name: 'Goals', component: GoalsScreen, icon: 'flag', label: 'Metas' },
    { name: 'Settings', component: SettingsScreen, icon: 'settings', label: 'Conta' },
  ]

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 4,
          height: 56,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  )
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="MainTabs" component={TabNavigator} />
      <HomeStack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{ presentation: 'modal' }}
      />
      <HomeStack.Screen name="Terms" component={TermsScreen} />
      <HomeStack.Screen name="Privacy" component={PrivacyScreen} />
      <HomeStack.Screen name="AddGoal" component={AddGoalScreen} options={{ presentation: 'modal' }} />
      <HomeStack.Screen name="AddCategory" component={AddCategoryScreen} options={{ presentation: 'modal' }} />
      <HomeStack.Screen name="AddMember" component={AddMemberScreen} options={{ presentation: 'modal' }} />
      <HomeStack.Screen name="Pro" component={ProScreen} options={{ presentation: 'modal' }} />
      <HomeStack.Screen name="FamilyShare" component={FamilyShareScreen} options={{ presentation: 'modal' }} />
      <HomeStack.Screen name="ProfileEdit" component={ProfileEditScreen} options={{ presentation: 'modal' }} />
    </HomeStack.Navigator>
  )
}

export default function AppNavigator() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Home" component={HomeStackNavigator} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Terms" component={TermsScreen} />
          <Stack.Screen name="Privacy" component={PrivacyScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}
