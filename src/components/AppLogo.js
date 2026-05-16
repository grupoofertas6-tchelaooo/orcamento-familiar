import { View, StyleSheet } from 'react-native'
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg'

export default function AppLogo({ size = 80 }) {
  return (
    <View style={[styles.box, { width: size, height: size, borderRadius: size * 0.3 }]}>
      <Svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        <Defs>
          <LinearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFF" stopOpacity={1} />
            <Stop offset="100%" stopColor="#FFF" stopOpacity={0.8} />
          </LinearGradient>
        </Defs>
        <Path
          d="M21 6H3C1.9 6 1 6.9 1 8V18C1 19.1 1.9 20 3 20H21C22.1 20 23 19.1 23 18V8C23 6.9 22.1 6 21 6ZM21 18H3V8H21V18Z"
          fill="url(#g)"
        />
        <Path
          d="M15 13C15 14.66 13.66 16 12 16C10.34 16 9 14.66 9 13C9 11.34 10.34 10 12 10C13.66 10 15 11.34 15 13Z"
          fill="url(#g)"
        />
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90D9',
    shadowColor: '#4A90D9',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
})
