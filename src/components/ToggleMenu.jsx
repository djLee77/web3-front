import React, { useState } from "react";
import "../css/ToggleMenu.css";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";

const ToggleMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSecondOpen, setIsSecondOpen] = useState(false);
  const [secondList, setSecondList] = useState([]);
  const [isThirdOpen, setIsThirdOpen] = useState(false);
  const [thirdList, setThirdList] = useState([]);

  // 첫 번째 리스트
  const mainList = [
    "패션의류/잡화", "뷰티", "출산/유아동", "식품", "주방용품",
    "생활용품", "홈인테리어", "가전디지털", "스포츠레저", "자동차용품", "헬스/건강"
  ];

  // 첫 번째 리스트의 항목에 따른 두 번째 리스트
  const secondLists = {
    "패션의류/잡화": ["남성의류", "여성의류", "공용", "유아동"],
    "뷰티": ["스킨케어", "클린/비건뷰티", "클렌징/필링", "메이크업", "향수", "헤어", "바디"],
    "출산/유아동": ["유아동패션", "기저귀", "물티슈", "분유/어린이식품", "카시트", "유모차", "수유용품"],
    "식품": ["유기농", "과일", "견과", "채소", "쌀/잡곡", "축산/계란", "수산물/건어물", "생수/음료"],
    "주방용품": ["주방가전", "냄비/프라이팬", "주방조리도구", "그릇/홈세트", "수저/커트러리", "컵/텀블러/와인용품"],
  };

  const thirdLists = {
    "남성의류": ["의류", "속옷/잠옷", "신발", "가방/잡화"],
    "여성의류": ["의류", "속옷/잠옷", "신발", "가방/잡화"],
    "공용": ["티셔츠", "맨트맨/후드티", "셔츠", "바지", "트레이닝복", "후드집업/집업류", "니트류/조끼", "아우터", "테마의류"],
    "유아동": ["베이비", "여아", "남아"],
  }

  const ToggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const ToggleSecondSidebar = (subject) => {
    setSecondList(secondLists[subject] || []);
    setIsSecondOpen(true);
  };

  const ToggleThirdSidebar = (subject) => {
    setThirdList(thirdLists[subject] || []);
    setIsThirdOpen(true);
  };

  return (
    <div style={{ float: "left" }}>
      <div className="btn btn-primary" onClick={ToggleSidebar}>
        <DensityMediumIcon />
      </div>
      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        <div className="sd-header">
          <h4 className="mb-0">카테고리</h4>
        </div>
        <div className="sd-body">
          <ul>
            {mainList.map((subject, index) => (
              <li key={index} onClick={() => ToggleSecondSidebar(subject)}>
                <a className="sd-link">{subject}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={ToggleSidebar}
      ></div>

      <div className={`second-sidebar ${isSecondOpen ? "active" : ""}`}>
        <div className="sd-header"></div>
        <div className="sd-body">
          <ul>
            {secondList.map((subject, index) => (
              <li key={index} onClick={() => ToggleThirdSidebar(subject)}>
                <a className="sd-link">{subject}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className={`sidebar-overlay ${isSecondOpen ? "active" : ""}`}
        onClick={() => {
          ToggleSidebar();
          setIsSecondOpen(false);
        }}
      ></div>

      <div className={`third-sidebar ${isThirdOpen ? "active" : ""}`}>
        <div className="sd-header"></div>
        <div className="sd-body">
          <ul>
            {thirdList.map((item, index) => (
              <li key={index}>
                <a className="sd-link">{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className={`sidebar-overlay ${isThirdOpen ? "active" : ""}`}
        onClick={() => {
          ToggleSidebar();
          setIsSecondOpen(false);
          setIsThirdOpen(false);
        }}
      ></div>
    </div>
  );
};

export default ToggleMenu;
