import {createContext, useState, useEffect} from 'react'

import {
  getLocalStorageLocale,
  setLocalStorageLocale,
  getLocalStorageTranslations,
  setLocalStorageTranslations,
  getSystemLocale,
} from '../utils'

import {
  Calendar,
  Region,
  Language,
  Script,
  Collation,
  NumberingSystem,
} from '../enums'

import type {ReactNode} from 'react'

export interface LocaleContext {
  locale: Intl.Locale
  setLocale: (locale: Intl.Locale) => Promise<void>
  minimize: () => Promise<void>
  maximize: () => Promise<void>
  baseName: string
  setBaseName: (baseName: string) => Promise<void>
  calendar: Calendar
  setCalendar: (calendar: Calendar) => Promise<void>
  hourCycle: Intl.LocaleHourCycleKey
  setHourCycle: (hourCycle: Intl.LocaleHourCycleKey) => Promise<void>
  region: Region
  setRegion: (region: Region) => Promise<void>
  language: Language
  setLanguage: (language: Language) => Promise<void>
  script: Script
  setScript: (script: Script) => Promise<void>
  collation: Collation
  setCollation: (collation: Collation) => Promise<void>
  caseFirst: Intl.LocaleCollationCaseFirst
  setCaseFirst: (caseFirst: Intl.LocaleCollationCaseFirst) => Promise<void>
  numberingSystem: NumberingSystem
  setNumberingSystem: (numberingSystem: NumberingSystem) => Promise<void>
  numeric: boolean
  setNumeric: (numeric: boolean) => Promise<void>
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
  locale: Intl.Locale | undefined
  translations: Map<string, Map<string, string> | string> | undefined
  children: ReactNode
}

export const LocaleContextProvider = (
  props: LocaleContextProvider,
): JSX.Element => {
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

    const uri = translations.get(baseName) as string
    const response = await fetch(uri)
    const data = await response.json()
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
    setLocale: (locale: Intl.Locale): Promise<void> => set(locale),
    minimize: (): Promise<void> => set(locale.minimize()),
    maximize: (): Promise<void> => set(locale.maximize()),
    baseName: locale.baseName,
    setBaseName: (baseName: string): Promise<void> =>
      set(new Intl.Locale(locale, {baseName})),
    calendar: locale.calendar as Calendar,
    setCalendar: (calendar: Calendar): Promise<void> =>
      set(new Intl.Locale(locale, {calendar})),
    hourCycle: locale.hourCycle as Intl.LocaleHourCycleKey,
    setHourCycle: (hourCycle: Intl.LocaleHourCycleKey): Promise<void> =>
      set(new Intl.Locale(locale, {hourCycle})),
    region: locale.region as Region,
    setRegion: async (region: Region): Promise<void> =>
      set(new Intl.Locale(locale, {region})),
    language: locale.language as Language,
    setLanguage: async (language: Language): Promise<void> =>
      set(new Intl.Locale(locale, {language})),
    script: locale.script as Script,
    setScript: async (script: Script): Promise<void> =>
      set(new Intl.Locale(locale, {script})),
    collation: locale.collation as Collation,
    setCollation: (collation: Collation): Promise<void> =>
      set(new Intl.Locale(locale, {collation})),
    caseFirst: locale.caseFirst as Intl.LocaleCollationCaseFirst,
    setCaseFirst: (caseFirst: Intl.LocaleCollationCaseFirst): Promise<void> =>
      set(new Intl.Locale(locale, {caseFirst})),
    numberingSystem: locale.numberingSystem as NumberingSystem,
    setNumberingSystem: (numberingSystem: NumberingSystem): Promise<void> =>
      set(new Intl.Locale(locale, {numberingSystem})),
    numeric: !!locale.numeric,
    setNumeric: (numeric: boolean): Promise<void> =>
      set(new Intl.Locale(locale, {numeric})),
    displayNames: (options: Intl.DisplayNamesOptions): Intl.DisplayNames =>
      new Intl.DisplayNames(locale.baseName, options),
    dateTimeFormat: (
      options: Intl.DateTimeFormatOptions,
    ): Intl.DateTimeFormat => new Intl.DateTimeFormat(locale.baseName, options),
    relativeTimeFormat: (
      options: Intl.RelativeTimeFormatOptions,
    ): Intl.RelativeTimeFormat =>
      new Intl.RelativeTimeFormat(locale.baseName, options),
    collator: (options: Intl.CollatorOptions): Intl.Collator =>
      new Intl.Collator(locale.baseName, options),
    listFormat: (options: Intl.ListFormatOptions): Intl.ListFormat =>
      new Intl.ListFormat(locale.baseName, options),
    pluralRules: (options: Intl.PluralRulesOptions): Intl.PluralRules =>
      new Intl.PluralRules(locale.baseName, options),
    segmenter: (options: Intl.SegmenterOptions): Intl.Segmenter =>
      new Intl.Segmenter(locale.baseName, options),
    numberFormat: (options: Intl.NumberFormatOptions): Intl.NumberFormat =>
      new Intl.NumberFormat(locale.baseName, options),
    translations: (): Map<string, string> =>
      translations.get(locale.maximize().baseName) as Map<string, string>,
    translate: (text: string): string => {
      const baseName = locale.maximize().baseName

      if (!translations || !translations.has(baseName)) {
        return text
      }

      return (translations.get(baseName) as Map<string, string>).get(
        text,
      ) as string
    },
  }

  return (
    <LocaleContext.Provider value={value}>
      {props.children}
    </LocaleContext.Provider>
  )
}

export default {
  LocaleContext,
  LocaleContextProvider,
}
