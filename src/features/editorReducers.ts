import { PayloadAction } from '@reduxjs/toolkit'
import { AppEditorState } from './editorSlice'

const reducers = {
  setCurrentDoc: (state: AppEditorState, action: PayloadAction<string>) => {
    state.currentDoc = action.payload
  },
}

export default reducers
