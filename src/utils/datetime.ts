import {Calendar, HourCycle} from 'enums/datetime'

export const getCalendars = (): Calendar[] => Object.values(Calendar)

export const getHourCycles = (): Intl.LocaleHourCycleKey[] =>
  Object.values(HourCycle)

export default {
  getCalendars,
  getHourCycles,
}
