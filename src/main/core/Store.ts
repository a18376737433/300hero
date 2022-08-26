import Store from 'electron-store'
import config from '../../../config'
import is_dev from 'electron-is-dev'
import { resolve } from 'path'
const optinos: Store.Options<Record<string, any>> = {
  defaults: {
    config
  }
}

const store = new Store(optinos)
export default store
