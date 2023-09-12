import StarRatings from "react-star-ratings";

export default function StarRating({ rate, size, space }) {
    return (
        <StarRatings
            rating={rate} // 현재 별점 값
            starRatedColor="#FFB800" // 별점 색상 설정
            numberOfStars={5} // 별점의 총 개수 설정
            name="rating" // 이름 설정
            starDimension={size + "px"} // 별 크기
            starSpacing={space + "px"} // 별들의 간격
            //뚠뚠이 귀여운 별 svg
            svgIconPath="M5.35626 0.399536L3.89159 3.36925L0.614589 3.84701C0.0269265 3.93224 -0.208587 4.65673 0.21758 5.07168L2.58842 7.38195L2.02767 10.6455C1.92674 11.2354 2.54804 11.6773 3.06842 11.4014L6 9.86045L8.93159 11.4014C9.45196 11.675 10.0733 11.2354 9.97233 10.6455L9.41158 7.38195L11.7824 5.07168C12.2086 4.65673 11.9731 3.93224 11.3854 3.84701L8.10841 3.36925L6.64374 0.399536C6.38131 -0.129809 5.62094 -0.136538 5.35626 0.399536Z"
            svgIconViewBox="0 0 12 12"
        />
    );
}
