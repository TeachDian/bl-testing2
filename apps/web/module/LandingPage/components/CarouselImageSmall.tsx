"use client";
import React, { useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { T_Photo } from "@repo/contract";

interface ImageObject {
  id: number;
  alt: string;
  imageKey: string;
}

interface ImageSliderProps {
  images: ImageObject[];
  className?: string;
  width?: number;
  height?: number;
}

interface IEventsProps {
  imageItems: T_Photo[];
  title?: string;
  author?: string;
  date?: string | string[] | Date | Date[];
  description?: string;
  className?: string;
  // onImageClick: (image: IImage) => void;
}

const CarouselImage = ({ imageItems, title, className }: IEventsProps) => {
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.slickNext();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
  };

  return (
    <div className={className}>
        <div className="w-full h-full mx-auto rounded-md">
    <Slider {...settings} ref={sliderRef}>
      {imageItems.map((item, index)=>(
        <div key={index} className="flex justify-center items-center h-[350px]">
        <Image
          src={"/assets/" + item.key}
          alt={item.thumbKey || "This is an image"}
          width={470}
          height={150}
          className="rounded-md object-cover h-full w-full"
        />
      </div>
      ))}
    </Slider>
    </div>
    </div>

  );
};

export default CarouselImage;
