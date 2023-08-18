import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IAppModal {
  id: string
  type:
    | 'page/create'
    | 'page/context'
    | 'notebook/create'
    | 'context/confirm'
    | 'page/rename'
    | 'asset/preview'
  x: number
  y: number
  label?: string
  subtractHalfWidth?: boolean
  fullScreen?: boolean
}
interface ConfirmationProps {
  type:
    | 'removePage'
    | 'removeNotebook'
    | 'removePagePermanent'
    | 'removeAllPagesPermanent'
}
interface IRemovePageConfirmation extends ConfirmationProps {
  type: 'removePage'
  pageId: string
}
interface IRemovePagePermanentConfirmation extends ConfirmationProps {
  type: 'removePagePermanent'
  pageId: string
}

interface IRemoveAllPagesPermanent extends ConfirmationProps {
  type: 'removeAllPagesPermanent'
}
interface IRemoveNotebookConfirmation extends ConfirmationProps {
  type: 'removeNotebook'
}

type IConfirmationModalProps =
  | IRemovePageConfirmation
  | IRemoveNotebookConfirmation
  | IRemovePagePermanentConfirmation
  | IRemoveAllPagesPermanent

export interface IConfirmationModal extends IAppModal {
  type: 'context/confirm'
  information: string
  for: string
  dangerLevel: number
  props: IConfirmationModalProps
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

export interface IPageRenameModal extends IAppModal {
  type: 'page/rename'
  pageId: string
}

export interface IImagePreviewModal extends IAppModal {
  type: 'asset/preview'
  url: string
  name?: string
}
type IModal =
  | IPageContextModal
  | IPageCreationModal
  | INotebookCreationModal
  | IConfirmationModal
  | IPageRenameModal
  | IImagePreviewModal

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
