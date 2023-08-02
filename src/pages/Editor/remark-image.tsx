import { getNebulaProtocolUrl } from '@/utils/helper'
import React from 'react'

const RemarkImg: React.FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = (props) => {
  return (
    <img
      loading="lazy"
      style={{ maxWidth: '30em' }}
      {...props}
      alt=""
      src={getNebulaProtocolUrl(props.src || '')}
    />
  )
}

export default RemarkImg
