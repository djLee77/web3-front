import React, { useState, useEffect } from "react";
import "../css/ToggleMenu.css";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";

const ToggleMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSecondOpen, setIsSecondOpen] = useState(false);
  const [isThirdOpen, setIsThirdOpen] = useState(false);

  const [mainList, setMainList] = useState([]);
  const [secondLists, setSecondLists] = useState({});
  const [thirdLists, setThirdLists] = useState({});

  const [pickedSecondList, setSecondList] = useState([]);
  const [pickedThirdList, setThirdList] = useState([]);

  useEffect(() => {
    // 예제에서는 직접 데이터를 사용하지만 실제 환경에서는 API 호출을 사용해야 합니다.
    const fetchData = async () => {
      const response = await fetch('http://localhost:4000/api/categories');
      const data = await response.json();
      const categories = data.data.categories[0].child;

      const mainListTemp = [];
      const secondListsTemp = {};
      const thirdListsTemp = {};

      categories.forEach(cat => {
        mainListTemp.push(cat.name);

        if (cat.child && cat.child.length > 0) {
          secondListsTemp[cat.name] = cat.child.map(child => child.name);

          cat.child.forEach(subCat => {
            if (subCat.child && subCat.child.length > 0) {
              thirdListsTemp[subCat.name] = subCat.child.map(child => child.name);
            }
          });
        }
      });

      setMainList(mainListTemp);
      setSecondLists(secondListsTemp);
      setThirdLists(thirdListsTemp);
    };

    fetchData();
    console.log()
  }, []);

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
      <div className="btn-primary" onClick={ToggleSidebar}>
        <DensityMediumIcon />
      </div>
      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        <div className="sd-header">
          <h4 className="mb-0">카테고리</h4>
        </div>
        <div className="sd-body">
          <ul>
            {mainList.map((subject, index) => (
              <li key={index} onClick={() => ToggleSecondSidebar(subject.name)}>
                <a className="sd-link">{subject.name}</a>
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
            {pickedSecondList.map((subject, index) => (
              <li key={index} onClick={() => ToggleThirdSidebar(subject.name)}>
                <a className="sd-link">{subject.name}</a>
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
            {pickedThirdList.map((item, index) => (
              <li key={index}>
                <a className="sd-link">{item.name}</a>
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
