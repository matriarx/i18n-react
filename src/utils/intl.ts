import {Calendar} from 'enums/datetime'
import {Collation} from 'enums/text'
import {NumberingSystem, Unit} from 'enums/number'

export const getCanonicalLocales = (locale: string): string[] =>
  Intl.getCanonicalLocales(locale) as string[]

export const getSystemLocale = (): Intl.Locale =>
  new Intl.Locale(
    getCanonicalLocales(navigator.languages[0] || 'en-Latn-US')[0] ||
      'en-Latn-US',
  ).maximize() as Intl.Locale

export const getSupportedCalendars = (): Calendar[] =>
  Intl.supportedValuesOf('calendar') as Calendar[]

export const getSupportedTimeZones = (): string[] =>
  Intl.supportedValuesOf('timeZone')

export const getSupportedCollations = (): Collation[] =>
  Intl.supportedValuesOf('collation') as Collation[]

export const getSupportedNumberingSystems = (): NumberingSystem[] =>
  Intl.supportedValuesOf('numberingSystem') as NumberingSystem[]

export const getSupportedUnits = (): Unit[] =>
  Intl.supportedValuesOf('unit') as Unit[]

export const getSupportedCurrencies = (): string[] =>
  Intl.supportedValuesOf('currency')

export default {
  getSystemLocale,
  getCanonicalLocales,
  getSupportedCalendars,
  getSupportedTimeZones,
  getSupportedCollations,
  getSupportedNumberingSystems,
  getSupportedUnits,
  getSupportedCurrencies,
}
