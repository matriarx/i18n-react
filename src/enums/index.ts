import datetime from './datetime'
import location from './location'
import text from './text'
import number from './number'

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
