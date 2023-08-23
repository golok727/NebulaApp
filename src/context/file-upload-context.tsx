import { useContext, createContext, useState } from 'react'

interface FileUploadState {
  toUpload: FileList | null
  setToUpload: React.Dispatch<React.SetStateAction<FileList | null>>
}
const FileUploadContext = createContext<FileUploadState>({} as FileUploadState)

export const FileUploadProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [toUpload, setToUpload] = useState<FileList | null>(null)

  return (
    <FileUploadContext.Provider value={{ toUpload, setToUpload }}>
      {children}
    </FileUploadContext.Provider>
  )
}

export const useFileUpload = () => {
  const context = useContext(FileUploadContext)
  if (!context)
    throw new Error(
      'useFileUpload should be used within the FileUploadProvider'
    )

  return context
}
