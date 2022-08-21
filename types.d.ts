declare global {
  namespace Intl {
    const getCanonicalLocales: (locale: string) => string[]
    const supportedValuesOf: (type: 'calendar' | 'collation' | 'currency' | 'numberingSystem' | 'timeZone' | 'unit') => string[]
  }
}

export {}
