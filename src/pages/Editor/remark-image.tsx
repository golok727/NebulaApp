import React, { useCallback, useEffect, useState } from 'react'
import { join, downloadDir } from '@tauri-apps/api/path'
import { convertFileSrc } from '@tauri-apps/api/tauri'
const NEBULA_PROTOCOL_REGEX = /nebula:\/\/assets\/?(?<file>.+\.\w+)/g

const RemarkImg: React.FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = (props) => {
  const [imageSrc, setImgSrc] = useState('')
  // Convert to tauri asset url
  const convertToImageUrl = useCallback(async () => {
    const src = props.src || ''
    const isNebulaProtocol = NEBULA_PROTOCOL_REGEX.test(src)
    NEBULA_PROTOCOL_REGEX.lastIndex = 0
    if (isNebulaProtocol) {
      const match = [...src.matchAll(NEBULA_PROTOCOL_REGEX)]
      const fileName = match[0].groups ? match[0].groups['file'] ?? '' : ''
      const downloadDirPath = await downloadDir()
      const filePath = await join(downloadDirPath, fileName)
      const url = convertFileSrc(filePath)
      setImgSrc(url)
    } else {
      setImgSrc(src)
    }
  }, [props.src])

  useEffect(() => {
    convertToImageUrl()
  }, [convertToImageUrl])
  return <img alt={'image'} src={imageSrc} />
}

export default RemarkImg
