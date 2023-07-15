import { createSlice } from '@reduxjs/toolkit'
import reducers from './appReducers'
export interface AppState {
  darkMode: boolean
  fontSize: number
  sidebar: {
    showSidebar: boolean
    sidebarWidth: number
  }
}

const initialState: AppState = {
  darkMode: true,
  fontSize: 16,
  sidebar: {
    showSidebar: true,
    sidebarWidth: 200,
  },
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers,
})

export const { toggleSidebar, hideSidebar, showSidebar, setSidebarWidth } =
  appSlice.actions
export default appSlice.reducer
