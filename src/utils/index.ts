import {Calendar} from '../enums/datetime'
import {Collation} from '../enums/text'
import {NumberingSystem, Unit} from '../enums/number'

export const getLocalStorageLocale = (): Intl.Locale | null => {
  const locale = JSON.parse(localStorage.getItem('matriarx_locale') || 'null')

  return locale ? new Intl.Locale(locale) : null
}

export const setLocalStorageLocale = (locale: Intl.Locale): void =>
  localStorage.setItem('matriarx_locale', JSON.stringify(locale.baseName))

export const getLocalStorageTranslations = (): Map<
  string,
  Map<string, string> | string
> | null => {
  const translations = JSON.parse(
    localStorage.getItem('matriarx_translations') || 'null',
  )

  return translations
    ? new Map<string, Map<string, string> | string>(
        Object.entries(translations),
      )
    : null
}

export const setLocalStorageTranslations = (
  translations: Map<string, Map<string, string> | string>,
): void => localStorage.setItem('matriarx_locale', JSON.stringify(translations))

export const getSystemLocale = (): Intl.Locale =>
  new Intl.Locale(
    navigator.languages[0] || 'en-Latn-US',
  ).maximize() as Intl.Locale

export const getCanonicalLocales = (locale: string): string[] =>
  Intl.getCanonicalLocales(locale) as string[]

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
  getLocalStorageLocale,
  setLocalStorageLocale,
  getLocalStorageTranslations,
  setLocalStorageTranslations,
  getSystemLocale,
  getCanonicalLocales,
  getSupportedCalendars,
  getSupportedTimeZones,
  getSupportedCollations,
  getSupportedNumberingSystems,
  getSupportedUnits,
  getSupportedCurrencies,
}
