import {useContext} from 'react'

import {LocaleContext} from 'context'

export const useLocale = () => useContext(LocaleContext)

export default {
  useLocale,
}
