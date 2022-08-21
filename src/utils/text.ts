import {Case, Language, Script, Collation, TextDirection} from 'enums/text'

export const getCases = (): Case[] => Object.values(Case)

export const getLanguages = (): Language[] => Object.values(Language)

export const getScripts = (): Script[] => Object.values(Script)

export const getCollations = (): Collation[] => Object.values(Collation)

export const getCaseFirsts = (): Intl.LocaleCollationCaseFirst[] => [
  Case.LOWER,
  Case.UPPER,
  'false',
]

export const getTextDirections = (): TextDirection[] =>
  Object.values(TextDirection)

export default {
  getCases,
  getLanguages,
  getScripts,
  getCollations,
  getCaseFirsts,
  getTextDirections,
}
