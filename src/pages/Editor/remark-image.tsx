import useNebulaProtocol from '@/hooks/use-nebula-protocol'
import React from 'react'

const RemarkImg: React.FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = (props) => {
  const imageSrc = useNebulaProtocol(props.src || '', false, 300)

  return (
    <img
      loading="lazy"
      style={{ maxWidth: '30em' }}
      {...props}
      alt=""
      src={imageSrc}
    />
  )
}

export default RemarkImg
