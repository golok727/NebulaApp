import { configureStore } from '@reduxjs/toolkit'
import appReducer from '@/features/appSlice'
import editorSlice from '@/features/editorSlice'
import modalSlice from '@/features/modalSlice'

const store = configureStore({
  reducer: {
    app: appReducer,
    editor: editorSlice,
    modal: modalSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
