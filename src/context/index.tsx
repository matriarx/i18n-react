import {createContext, useState} from 'react'

import {
  getSystemLocale,
  getCanonicalLocales,
  getSupportedCalendars,
  getSupportedTimeZones,
  getSupportedCollations,
  getSupportedNumberingSystems,
  getSupportedUnits,
  getSupportedCurrencies,
} from 'utils'

import {
  Calendar,
  HourCycle,
  Region,
  Case,
  Language,
  Script,
  Collation,
  TextDirection,
  NumberingSystem,
  Unit,
} from 'enums'

import type {ReactNode} from 'react'

const getLocalStorageItem = (id: string): string | object | null =>
  JSON.parse(localStorage.getItem(id) || 'null')

const setLocalStorageItem = (id: string, value: string | object): void =>
  localStorage.setItem(id, JSON.stringify(value))

export const getLocale = (): Intl.Locale => {
  const locale = getLocalStorageItem('locale')

  if (!locale || typeof locale !== 'string') {
    return getSystemLocale()
  }

  return new Intl.Locale(locale) as Intl.Locale
}

export const setLocale = (locale: Intl.Locale) =>
  setLocalStorageItem('locale', locale.baseName)

const translations = new Map<string, Map<string, string> | null>()

const lazyLoadTranslations = async (locale: Intl.Locale): Promise<void> => {
  const canonicalLocale = getCanonicalLocales(
    locale.minimize().baseName,
  )[0] as string

  if (!translations.has(canonicalLocale)) {
    return
  }

  const data = (await import(`static/locales/${canonicalLocale}`)).default

  translations.set(
    canonicalLocale,
    new Map<string, string>(Object.entries(data.translations)),
  )
}

export interface LocaleContext {
  canonicalLocales: (locale: string) => string[]
  calendars: () => Calendar[]
  supportedCalendars: () => Calendar[]
  hourCycles: () => Intl.LocaleHourCycleKey[]
  supportedTimeZones: () => string[]
  regions: () => Region[]
  cases: () => Case[]
  languages: () => Language[]
  scripts: () => Script[]
  collations: () => Collation[]
  supportedCollations: () => Collation[]
  caseFirsts: () => Intl.LocaleCollationCaseFirst[]
  textDirections: () => TextDirection[]
  numberingSystems: () => NumberingSystem[]
  supportedNumberingSystems: () => NumberingSystem[]
  units: () => Unit[]
  supportedUnits: () => Unit[]
  supportedCurrencies: () => string[]
  systemLocale: () => Intl.Locale
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
  locales: Map<string, Map<string, string>>
  default: string
  children: ReactNode
}

export const LocaleContextProvider = (props: LocaleContextProvider) => {
  const [locale, loadLocale] = useState<Intl.Locale>(getLocale())
  // const [translations, setTranslations] = useState<Map<string, string>()

  const set = (locale: Intl.Locale) => {
    setLocale(locale)
    loadLocale(locale)
  }

  const load = async (locale: Intl.Locale) => {
    await lazyLoadTranslations(locale)

    set(locale)
  }

  const value = {
    canonicalLocales: getCanonicalLocales,
    calendars: (): Calendar[] => Object.values(Calendar),
    supportedCalendars: getSupportedCalendars,
    hourCycles: (): Intl.LocaleHourCycleKey[] => Object.values(HourCycle),
    supportedTimeZones: getSupportedTimeZones,
    regions: (): Region[] => Object.values(Region),
    cases: (): Case[] => Object.values(Case),
    languages: (): Language[] => Object.values(Language),
    scripts: (): Script[] => Object.values(Script),
    collations: (): Collation[] => Object.values(Collation),
    supportedCollations: getSupportedCollations,
    caseFirsts: (): Intl.LocaleCollationCaseFirst[] => [
      Case.LOWER,
      Case.UPPER,
      'false',
    ],
    textDirections: (): TextDirection[] => Object.values(TextDirection),
    numberingSystems: (): NumberingSystem[] => Object.values(NumberingSystem),
    supportedNumberingSystems: getSupportedNumberingSystems,
    units: (): Unit[] => Object.values(Unit),
    supportedUnits: getSupportedUnits,
    supportedCurrencies: getSupportedCurrencies,
    systemLocale: getSystemLocale,
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
    setRegion: async (region: Region) =>
      load(new Intl.Locale(locale, {region})),
    language: locale.language as Language,
    setLanguage: async (language: Language) =>
      load(new Intl.Locale(locale, {language})),
    script: locale.script as Script,
    setScript: async (script: Script) =>
      load(new Intl.Locale(locale, {script})),
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
      translations.get(locale.minimize().baseName) as Map<string, string>,
    translate: (text: string) =>
      translations.get(locale.minimize().baseName)?.get(text) || text,
  }

  return (
    <LocaleContext.Provider value={value}>
      {props.children}
    </LocaleContext.Provider>
  )
}

export default {
  getLocale,
  setLocale,
  LocaleContext,
  LocaleContextProvider,
}
