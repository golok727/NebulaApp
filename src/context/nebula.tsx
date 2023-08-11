import React, { createContext, useContext } from 'react'
import { INebulaCore, NebulaCore } from '@/core/nebula'
import store from '@/app/store'

export interface INebulaCoreContext {
  core: INebulaCore
}

const initialState: INebulaCoreContext = {
  core: new NebulaCore(store),
}

const NebulaCoreContext = createContext<INebulaCoreContext>(initialState)

const NebulaCoreProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NebulaCoreContext.Provider value={initialState}>
      {children}
    </NebulaCoreContext.Provider>
  )
}

export default NebulaCoreProvider

export const useNebulaCore = () => {
  const context = useContext(NebulaCoreContext)
  if (!context)
    throw new Error(
      'Use Nebula Core Hook should be used within the Nebula Core Provider'
    )
  return context
}
