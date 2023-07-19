import { convertFileSrc } from '@tauri-apps/api/tauri'
import { join, dataDir } from '@tauri-apps/api/path'
import { useCallback, useEffect, useState } from 'react'

export const NEBULA_PROTOCOL_REGEX = /nebula:\/\/assets\/?(?<file>.+\.\w+)/g

const useNebulaProtocol = (
  src: string,
  debounce: boolean = false,
  delay: number = 300
) => {
  const [imageSrc, setImgSrc] = useState('')
  const convertToImageUrl = useCallback(async () => {
    console.log('Run')
    const isNebulaProtocol = NEBULA_PROTOCOL_REGEX.test(src)
    NEBULA_PROTOCOL_REGEX.lastIndex = 0
    if (isNebulaProtocol) {
      const match = [...src.matchAll(NEBULA_PROTOCOL_REGEX)]
      const fileName = match[0].groups ? match[0].groups['file'] ?? '' : ''
      const appDataDirPath = await dataDir()
      const filePath = await join(
        appDataDirPath,
        'RadhikaSoftwares',
        'Nebula',
        'assets',
        fileName
      )
      const url = convertFileSrc(filePath)
      setImgSrc(url)
    } else {
      setImgSrc(src)
    }
  }, [src])

  useEffect(() => {
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
  }, [convertToImageUrl, debounce, delay])

  return imageSrc
}

export default useNebulaProtocol
