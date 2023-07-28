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
  reducers: {
    setImageCache: (
      state,
      action: PayloadAction<{ identifier: string; url: string }>
    ) => {
      state.images[action.payload.identifier] = action.payload.url
    },
  },
})

export default cacheSlice.reducer
export const NebulaCache = cacheSlice.actions
