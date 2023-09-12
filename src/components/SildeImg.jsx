import { React, useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const imageData = [
  {
    label: "Image 1",
    alt: "image1",
    url: "http://ad-img.gmarket.com/ADS/Contents_/2023_09_07_02_05_04/262c377d27f54a55.JPG",
  },

  {
    label: "Image 2",
    alt: "image2",
    url: "http://ad-img.gmarket.com/ADS/Contents_/2023_09_01_11_50_36/5a842f0c05d64aee.JPG",
  },

  {
    label: "Image 3",
    alt: "image3",
    url: "http://ad-img.gmarket.com/ADS/Contents_/2023_08_31_04_42_34/0e0214728df44c20.JPG",
  },

  {
    label: "Image 4",
    alt: "image4",
    url: "http://ad-img.gmarket.com/ADS/Contents_/2023_08_30_06_06_56/508b44ca04f34f97.JPG",
  },

  {
    label: "Image 5",
    alt: "image5",
    url: "http://ad-img.gmarket.com/ADS/Contents_/2023_08_31_05_52_41/0e9cd9c914fe44f6.JPG",
  },
];

const renderSlides = imageData.map((image) => (
  <div key={image.alt}>
    <img src={image.url} alt={image.alt}  />
  </div>
));

const SlideImg = () => {
  const [currentIndex, setCurrentIndex] = useState();
  function handleChange(index) {
    setCurrentIndex(index);
  }

  return (
    <div className="flex justify-center items-center py-5 px-3" style={{width: '800px', height: 'auto'}}>
      <Carousel
        showArrows={true}
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        selectedItem={imageData[currentIndex]}
        onChange={handleChange}
        className="w-[400px] lg:hidden"
      >
        {renderSlides}
      </Carousel>
    </div>
  );
};

export default SlideImg;
