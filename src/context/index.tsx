import {createContext, useState, useEffect} from 'react'

import {getSystemLocale} from 'utils'

import {
  Calendar,
  Region,
  Language,
  Script,
  Collation,
  NumberingSystem,
} from 'enums'

import type {ReactNode} from 'react'

export const getLocalStorageLocale = (): Intl.Locale | null => {
  const locale = JSON.parse(localStorage.getItem('matriarx_locale') || 'null')

  return locale ? new Intl.Locale(locale) : null
}

export const setLocalStorageLocale = (locale: Intl.Locale) =>
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
) => localStorage.setItem('matriarx_locale', JSON.stringify(translations))

export interface LocaleContext {
  locale: Intl.Locale
  setLocale: (locale: Intl.Locale) => void
  minimize: () => void
  maximize: () => void
  baseName: string
  setBaseName: (baseName: string) => void
  calendar: Calendar
  setCalendar: (calendar: Calendar) => void
  hourCycle: Intl.LocaleHourCycleKey
  setHourCycle: (hourCycle: Intl.LocaleHourCycleKey) => void
  region: Region
  setRegion: (region: Region) => void
  language: Language
  setLanguage: (language: Language) => void
  script: Script
  setScript: (script: Script) => void
  collation: Collation
  setCollation: (collation: Collation) => void
  caseFirst: Intl.LocaleCollationCaseFirst
  setCaseFirst: (caseFirst: Intl.LocaleCollationCaseFirst) => void
  numberingSystem: NumberingSystem
  setNumberingSystem: (numberingSystem: NumberingSystem) => void
  numeric: boolean
  setNumeric: (numeric: boolean) => void
  displayNames: (options: Intl.DisplayNamesOptions) => Intl.DisplayNames
  dateTimeFormat: (options: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat
  relativeTimeFormat: (
    options: Intl.RelativeTimeFormatOptions,
  ) => Intl.RelativeTimeFormat
  collator: (options: Intl.CollatorOptions) => Intl.Collator
  listFormat: (options: Intl.ListFormatOptions) => Intl.ListFormat
  pluralRules: (options: Intl.PluralRulesOptions) => Intl.PluralRules
  segmenter: (options: Intl.SegmenterOptions) => Intl.Segmenter
  numberFormat: (options: Intl.NumberFormatOptions) => Intl.NumberFormat
  translations: () => Map<string, string>
  translate: (text: string) => string
}

export const LocaleContext = createContext<LocaleContext>({} as LocaleContext)

export interface LocaleContextProvider {
  locale?: Intl.Locale | undefined
  translations?: Map<string, Map<string, string> | string> | undefined
  children: ReactNode
}

export const LocaleContextProvider = (props: LocaleContextProvider) => {
  const [locale, setLocale] = useState<Intl.Locale>(
    getLocalStorageLocale() || props.locale || getSystemLocale(),
  )
  const [translations, setTranslations] = useState<
    Map<string, Map<string, string> | string>
  >(getLocalStorageTranslations() || props.translations || new Map())

  const set = async (locale: Intl.Locale): Promise<void> => {
    await load(locale)

    setLocalStorageLocale(locale)
    setLocale(locale)
  }

  const load = async (locale: Intl.Locale): Promise<void> => {
    const baseName = locale.maximize().baseName

    if (typeof translations.get(baseName) !== 'string') {
      return
    }

    const data = (await import(translations.get(baseName) as string)).default
    const map = new Map(translations).set(
      baseName,
      new Map<string, string>(Object.entries(data)),
    )

    setLocalStorageTranslations(map)
    setTranslations(map)
  }

  useEffect(() => {
    load(locale)
  }, [])

  const value = {
    locale,
    setLocale: (locale: Intl.Locale) => set(locale),
    minimize: () => set(locale.minimize()),
    maximize: () => set(locale.maximize()),
    baseName: locale.baseName as string,
    setBaseName: (baseName: string) => set(new Intl.Locale(locale, {baseName})),
    calendar: locale.calendar as Calendar,
    setCalendar: (calendar: Calendar) =>
      set(new Intl.Locale(locale, {calendar})),
    hourCycle: locale.hourCycle as Intl.LocaleHourCycleKey,
    setHourCycle: (hourCycle: Intl.LocaleHourCycleKey) =>
      set(new Intl.Locale(locale, {hourCycle})),
    region: locale.region as Region,
    setRegion: async (region: Region) => set(new Intl.Locale(locale, {region})),
    language: locale.language as Language,
    setLanguage: async (language: Language) =>
      set(new Intl.Locale(locale, {language})),
    script: locale.script as Script,
    setScript: async (script: Script) => set(new Intl.Locale(locale, {script})),
    collation: locale.collation as Collation,
    setCollation: (collation: Collation) =>
      set(new Intl.Locale(locale, {collation})),
    caseFirst: locale.caseFirst as Intl.LocaleCollationCaseFirst,
    setCaseFirst: (caseFirst: Intl.LocaleCollationCaseFirst) =>
      set(new Intl.Locale(locale, {caseFirst})),
    numberingSystem: locale.numberingSystem as NumberingSystem,
    setNumberingSystem: (numberingSystem: NumberingSystem) =>
      set(new Intl.Locale(locale, {numberingSystem})),
    numeric: !!locale.numeric as boolean,
    setNumeric: (numeric: boolean) => set(new Intl.Locale(locale, {numeric})),
    displayNames: (options: Intl.DisplayNamesOptions) =>
      new Intl.DisplayNames(locale.baseName, options),
    dateTimeFormat: (options: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(locale.baseName, options),
    relativeTimeFormat: (options: Intl.RelativeTimeFormatOptions) =>
      new Intl.RelativeTimeFormat(locale.baseName, options),
    collator: (options: Intl.CollatorOptions) =>
      new Intl.Collator(locale.baseName, options),
    listFormat: (options: Intl.ListFormatOptions) =>
      new Intl.ListFormat(locale.baseName, options),
    pluralRules: (options: Intl.PluralRulesOptions) =>
      new Intl.PluralRules(locale.baseName, options),
    segmenter: (options: Intl.SegmenterOptions) =>
      new Intl.Segmenter(locale.baseName, options),
    numberFormat: (options: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale.baseName, options),
    translations: () =>
      translations.get(locale.maximize().baseName) as Map<string, string>,
    translate: (text: string) =>
      translations
        ? (
            translations.get(locale.maximize().baseName) as Map<string, string>
          ).get(text) || text
        : text,
  }

  return (
    <LocaleContext.Provider value={value}>
      {props.children}
    </LocaleContext.Provider>
  )
}

export default {
  getLocalStorageLocale,
  setLocalStorageLocale,
  getLocalStorageTranslations,
  setLocalStorageTranslations,
  LocaleContext,
  LocaleContextProvider,
}
