import { allBackgrounds } from '@/assets'

export const getRandomNotebookImage = () => {
  return allBackgrounds[Math.floor(Math.random() * allBackgrounds.length)]
}
