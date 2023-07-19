import { createSlice } from '@reduxjs/toolkit'
import reducers from './editorReducers'
export interface AppEditorState {
  currentDoc: string
}

const initialState: AppEditorState = {
  currentDoc: `# Radhey Shyam
**Shrimati Radhika Rani**
![image](nebula://assets/shriradha.png)
`,
}

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers,
})

export default editorSlice.reducer
export const { setCurrentDoc } = editorSlice.actions
