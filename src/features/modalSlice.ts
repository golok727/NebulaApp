import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IAppModal {
  id: string
  type: 'page/create' | 'page/context' | 'notebook/create'
  x: number
  y: number
  label?: string
  subtractHalfWidth?: boolean
}

export interface IPageCreationModal extends IAppModal {
  type: 'page/create'
  parentId: string | null
  insertAfterId: string | null
}

export interface IPageContextModal extends IAppModal {
  type: 'page/context'
  pageId: string
}

export interface INotebookCreationModal extends IAppModal {
  type: 'notebook/create'
}

type IModal = IPageContextModal | IPageCreationModal | INotebookCreationModal

interface IModalState {
  currentModal: IModal | null
}

const initialState: IModalState = {
  currentModal: null,
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (state: IModalState, action: PayloadAction<IModal>) => {
      state.currentModal = action.payload
    },
    unloadModal: (state: IModalState) => {
      state.currentModal = null
    },
  },
})

export default modalSlice.reducer
export const NebulaModal = modalSlice.actions
