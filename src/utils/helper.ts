import { allBackgrounds } from '@/assets'

export const getRandomNotebookImage = () => {
  return allBackgrounds[Math.floor(Math.random() * allBackgrounds.length)]
}

export const getNebulaProtocolUrl = (url: string) => {
  const NEBULA_PROTOCOL_REGEX = /nb:\/\/assets\/?(?<file>.+\.\w+)/
  const isNebulaImage = NEBULA_PROTOCOL_REGEX.test(url)
  if (isNebulaImage) {
    // https://nb.localhost/assets/shriradha.png
    return url.replace(/nb:\//, 'https://nb.localhost')
  } else {
    return url
  }
}

export const dateFormatter = (date: string) => {
  let dateFormatter = new Intl.DateTimeFormat('en', {
    dateStyle: 'long',
  })

  return dateFormatter.format(new Date(date))
}
export const supportedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
  'image/svg+xml',
  'image/vnd.microsoft.icon',
  'image/tiff',
  'image/jp2',
  'image/jxr',
]

export const generateRandomString = (length: number): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export const convertToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.readAsDataURL(file)
  })
}
