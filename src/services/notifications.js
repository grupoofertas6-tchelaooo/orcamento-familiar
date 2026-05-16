import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export async function solicitarPermissao() {
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export async function agendarLembreteMensal() {
  const granted = await solicitarPermissao()
  if (!granted) return

  await Notifications.cancelAllScheduledNotificationsAsync()

  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 9, 0, 0)

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hora de atualizar!',
      body: 'Não esqueça de registrar suas receitas e despesas do mês.',
      sound: true,
    },
    trigger: {
      date: nextMonth,
      repeats: true,
      type: Notifications.SchedulableTriggerInputTypes.DATE,
    },
  })
}

export async function agendarLembreteSemanal() {
  const granted = await solicitarPermissao()
  if (!granted) return

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Resumo da semana',
      body: 'Veja como estão seus gastos essa semana!',
      sound: true,
    },
    trigger: {
      weekday: 2,
      hour: 10,
      minute: 0,
      repeats: true,
      type: Notifications.SchedulableTriggerInputTypes.WEEKDAY,
    },
  })
}
