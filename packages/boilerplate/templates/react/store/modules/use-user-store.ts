import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface UserInfo {
  username: string
  avatar: string
}

interface State {
  token: string
  userInfo: UserInfo
}

interface Action {
  updateToken: (token: string) => void
  updateUserName: (username: string) => void
  updateUserInfo?: (userInfo: UserInfo) => void
}

export const useUserStore = create<State & Action>()(
  immer(set => ({
    token: '',
    userInfo: { username: 'react', avatar: '' },
    updateToken: token =>
      set((state) => {
        state.token = token
      }),
    updateUserName: username =>
      set((state) => {
        state.userInfo.username = username
      }),
  })),
)
