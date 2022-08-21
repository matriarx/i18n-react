import {NumberingSystem, Unit} from 'enums/number'

export const getNumberingSystems = (): NumberingSystem[] =>
  Object.values(NumberingSystem)

export const getUnits = (): Unit[] => Object.values(Unit)

export default {
  getNumberingSystems,
  getUnits,
}
