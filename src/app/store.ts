import { configureStore } from '@reduxjs/toolkit'
import appReducer from '@/features/appSlice'
import editorSlice from '@/features/editorSlice'
import modalSlice from '@/features/modalSlice'
import cacheSlice from '@/features/cacheSlice'

const store = configureStore({
  reducer: {
    app: appReducer,
    editor: editorSlice,
    modal: modalSlice,
    cache: cacheSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type Store = typeof store
export default store
