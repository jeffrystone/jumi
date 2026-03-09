import * as React from "react";
import { cn } from "@utils";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  objectFit?: "contain" | "cover" | "fill" | "none";
  rounded?: boolean;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      objectFit,
      rounded = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const objectFitClass =
      objectFit === "contain"
        ? "object-contain"
        : objectFit === "cover"
          ? "object-cover"
          : objectFit === "fill"
            ? "object-fill"
            : objectFit === "none"
              ? "object-none"
              : undefined;

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(rounded && "rounded-md", objectFitClass, className)}
        style={style}
        {...props}
      />
    );
  }
);
Image.displayName = "Image";

export { Image };
