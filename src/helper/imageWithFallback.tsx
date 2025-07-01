import React, { useState } from 'react';
import Image, { ImageProps, StaticImageData } from 'next/image';

type SrcType = string | StaticImageData;

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
    src: SrcType;
    fallbackSrc: SrcType;
}

const ImageWithFallback = ({
    src,
    fallbackSrc,
    alt,
    ...rest
}: ImageWithFallbackProps) => {
    const [imgSrc, setImgSrc] = useState<SrcType>(src);

    return (
        <Image
            {...rest}
            src={imgSrc}
            alt={alt}
            onError={() => setImgSrc(fallbackSrc)}
        />
    );
};

export default ImageWithFallback;
