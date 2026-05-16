import { createContext, useContext, useState, useMemo } from 'react'
import { getTheme } from '../styles/theme'

const ThemeContext = createContext({})

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => setIsDark((prev) => !prev)
  const colors = useMemo(() => getTheme(isDark), [isDark])

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
