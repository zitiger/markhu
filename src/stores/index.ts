import {createPinia} from 'pinia'

const pinia = createPinia()

export default pinia

export * from './modules/editor'
export * from './modules/structure'
export * from './modules/system'
export * from './modules/dialog'
