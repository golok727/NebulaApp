import { convertFileSrc } from '@tauri-apps/api/tauri'
import { join, dataDir } from '@tauri-apps/api/path'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { NebulaCache } from '@/features/cacheSlice'

export const NEBULA_PROTOCOL_REGEX = /nebula:\/\/assets\/?(?<file>.+\.\w+)/

const useNebulaProtocol = (
  src: string,
  debounce: boolean = false,
  delay: number = 300
) => {
  const isNebulaImage = NEBULA_PROTOCOL_REGEX.test(src)
  const cachedImage = useSelector((state: RootState) => state.cache.images[src])
  const [imageSrc, setImgSrc] = useState(() =>
    isNebulaImage ? cachedImage ?? '' : src
  )

  const convertToImageUrl = useCallback(async () => {
    if (isNebulaImage) {
      const match = NEBULA_PROTOCOL_REGEX.exec(src)
      if (!match) return
      const fileName = match.groups ? match.groups['file'] ?? '' : ''
      const appDataDirPath = await dataDir()
      try {
        const filePath = await join(
          appDataDirPath,
          'RadhikaSoftwares',
          'Nebula',
          'assets',
          fileName
        )
        const url = convertFileSrc(filePath)
        setImgSrc(url)
      } catch (error) {
        console.log('Not found')
      }
    } else {
      setImgSrc(src)
    }
  }, [src, setImgSrc, isNebulaImage])

  useEffect(() => {
    if (cachedImage !== undefined || !isNebulaImage) return
    let timeout: NodeJS.Timeout

    const debounceConvert = () => {
      if (debounce) {
        clearTimeout(timeout)
        timeout = setTimeout(() => convertToImageUrl(), delay)
      } else {
        convertToImageUrl()
      }
    }
    debounceConvert()

    return () => {
      clearTimeout(timeout)
    }
  }, [convertToImageUrl, debounce, delay, cachedImage, isNebulaImage])

  return imageSrc
}

export default useNebulaProtocol
