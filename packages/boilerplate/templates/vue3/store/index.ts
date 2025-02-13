import type { InjectionKey } from 'vue'
import type { ActionContext, Store } from 'vuex'
import { useStore as baseUseStore, createStore } from 'vuex'

interface RootStateTypes {
  count: number
}

const defaultState = {
  count: 0,
}

export const store = createStore({
  state() {
    return defaultState
  },
  mutations: {
    increment(state: typeof defaultState) {
      state.count++
    },
  },
  actions: {
    increment(context: ActionContext<RootStateTypes, RootStateTypes>) {
      context.commit('increment')
    },
  },
  getters: {
    count(state: typeof defaultState) {
      return state.count
    },
  },
  modules: {},
})

export const key: InjectionKey<Store<RootStateTypes>> = Symbol('vue3-store')

export function useStore<T>() {
  return baseUseStore<T>(key)
}
