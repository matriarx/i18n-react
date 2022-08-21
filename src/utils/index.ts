import browser from 'utils/browser'
import intl from 'utils/intl'
import datetime from 'utils/datetime'
import location from 'utils/location'
import text from 'utils/text'

export * from './browser'
export * from './intl'
export * from './datetime'
export * from './location'
export * from './text'

export default {
  ...browser,
  ...intl,
  ...datetime,
  ...location,
  ...text,
}
