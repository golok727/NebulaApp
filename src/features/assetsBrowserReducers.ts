import { PayloadAction } from '@reduxjs/toolkit'
import { AssetsBrowserState } from './assetsBrowserSlice'

const reducers = {
  open: (state: AssetsBrowserState) => {
    state.isOpen = true
  },
  close: (state: AssetsBrowserState) => {
    state.isOpen = false
  },
  addAsset: (state: AssetsBrowserState, action: PayloadAction<NebulaAsset>) => {
    state.currentAssets = [action.payload, ...state.currentAssets]
  },
  addAssets: (
    state: AssetsBrowserState,
    action: PayloadAction<NebulaAsset[]>
  ) => {
    state.currentAssets = [...action.payload, ...state.currentAssets]
  },
  setAssets: (
    state: AssetsBrowserState,
    action: PayloadAction<NebulaAsset[]>
  ) => {
    state.currentAssets = action.payload
  },
}

export default reducers
