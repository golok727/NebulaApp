import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface AppCacheState {
  images: Record<string, string>
}

const initialState: AppCacheState = {
  images: {},
}

const cacheSlice = createSlice({
  name: 'appCache',
  initialState,
  reducers: {},
})

export default cacheSlice.reducer
export const NebulaCache = cacheSlice.actions
