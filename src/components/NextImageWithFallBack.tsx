import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface NextImageWithFallbackProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined;
  fallbackDimensions?: {
    width: number;
    height: number;
  };
}

const NextImageWithFallback: React.FC<NextImageWithFallbackProps> = ({
  src,
  alt,
  width = 500,
  height = 750,
  className,
  fallbackDimensions,
  ...props
}) => {
  const [error, setError] = useState<boolean>(false);

  const fallbackWidth = fallbackDimensions?.width || width;
  const fallbackHeight = fallbackDimensions?.height || height;

  const fallbackImageUrl = `https://placehold.co/${fallbackWidth}x${fallbackHeight}/1f2937/ffffff?text=No+Image`;

  return (
    <Image
      src={error || !src ? fallbackImageUrl : src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
      unoptimized={true}
      {...props}
    />
  );
};

export default NextImageWithFallback;
