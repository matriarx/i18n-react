import datetime from 'enums/datetime'
import location from 'enums/location'
import text from 'enums/text'
import number from 'enums/number'

export * from './datetime'
export * from './location'
export * from './text'
export * from './number'

export default {
  ...datetime,
  ...location,
  ...text,
  ...number,
}
