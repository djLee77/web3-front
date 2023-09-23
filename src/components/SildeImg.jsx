import { React, useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const imageData = [
  {
    label: "Image 1",
    alt: "image1",
    width: "1920px",
    url: "https://image6.coupangcdn.com/image/ccm/banner/892b9ee93d953c16b837e94ad2e4650f.jpg",
  },

  {
    label: "Image 2",
    alt: "image2",
    url: "https://image8.coupangcdn.com/image/ccm/banner/cacd7af728e615e804c9bd7e2db72767.jpg",
  },

  {
    label: "Image 3",
    alt: "image3",
    url: "https://image6.coupangcdn.com/image/ccm/banner/892b9ee93d953c16b837e94ad2e4650f.jpg",
  },

  {
    label: "Image 4",
    alt: "image4",
    url: "https://static.coupangcdn.com/fa/cmg_paperboy/image/1694675440749/Untitled-3.jpg",
  },

  {
    label: "Image 5",
    alt: "image5",
    url: "https://image8.coupangcdn.com/image/ccm/banner/211039ebb87c367467616b7b412a8f11.jpg",
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
    <div className="slide-banner" style={{ width : "100%"}}>
      <Carousel
        showArrows={true}
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        selectedItem={imageData[currentIndex]}
        onChange={handleChange}
      >
        {renderSlides}
      </Carousel>
    </div>
  );
};

export default SlideImg;
