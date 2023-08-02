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
