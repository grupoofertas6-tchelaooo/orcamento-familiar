import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { AuthProvider } from './src/context/AuthContext'
import { DataProvider } from './src/context/DataContext'
import { SubscriptionProvider } from './src/context/SubscriptionContext'
import { ThemeProvider } from './src/context/ThemeContext'
import AppNavigator from './src/navigation/AppNavigator'

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <ThemeProvider>
          <SubscriptionProvider>
            <DataProvider>
              <StatusBar style="light" />
              <AppNavigator />
            </DataProvider>
          </SubscriptionProvider>
        </ThemeProvider>
      </AuthProvider>
    </NavigationContainer>
  )
}
