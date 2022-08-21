import {Region} from 'enums/location'

export const getRegions = (): Region[] => Object.values(Region)

export default {
  getRegions,
}
