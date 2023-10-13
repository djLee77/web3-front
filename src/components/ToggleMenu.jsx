import React, { useState, useEffect } from "react";
import "../css/ToggleMenu.css";
import axios from "axios";
import { Menu } from "@mui/icons-material";
import { Link } from "react-router-dom";

const ToggleMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSecondOpen, setIsSecondOpen] = useState(false);
  const [isThirdOpen, setIsThirdOpen] = useState(false);

  const [mainList, setMainList] = useState([]);
  const [secondLists, setSecondLists] = useState({});
  const [thirdLists, setThirdLists] = useState({});

  const [pickedSecondList, setPickedSecondList] = useState([]);
  const [pickedThirdList, setPickedThirdList] = useState([]);

  const getCategories = async () => {
    const response = await axios.get("/api/public/categories",{
    });
    const categories = response.data.data[0].child;

    // 1번째 카테고리 목록 저장
    const mainListTemp = categories.map((cat) => ({
      categoryId: cat.categoryId,
      name: cat.name,
    }));

    const secondListsTemp = {};
    const thirdListsTemp = {};

    categories.forEach((cat) => {
      if (cat.child && cat.child.length > 0) {
        secondListsTemp[cat.name] = cat.child.map((child) => ({
          categoryId: child.categoryId,
          name: child.name,
        }));

        cat.child.forEach((subCat) => {
          if (subCat.child && subCat.child.length > 0) {
            thirdListsTemp[subCat.name] = subCat.child.map((child) => ({
              categoryId: child.categoryId,
              name: child.name,
            }));
          }
        });
      }
    });

    setMainList(mainListTemp);
    setSecondLists(secondListsTemp);
    setThirdLists(thirdListsTemp);
  };

  useEffect(() => {
    getCategories();
  }, []);

  const ToggleSidebar = () => {
    setIsOpen(true);
  };

  const ToggleSecondSidebar = (subject) => {
    setPickedSecondList(secondLists[subject] || []);
    setIsSecondOpen(true);
  };

  const ToggleThirdSidebar = (subject) => {
    setPickedThirdList(thirdLists[subject] || []);
    setIsThirdOpen(true);
  };

  return (
    <div style={{ float: "left" }}>
      <div
        className="btnCategory"
        style={{ cursor: "pointer", display: "flex", height: "25px" }}
        onMouseOver={ToggleSidebar}
        onMouseLeave={() => {
          setIsOpen(false);
          setIsSecondOpen(false);
          setIsThirdOpen(false);
        }}
      >
        <div>
          <Menu />
        </div>
        <div style={{ paddingTop: "18px" }}>
          <p>카테고리</p>
        </div>
      </div>
      <div
        onMouseLeave={() => {
          setIsOpen(false);
          setIsSecondOpen(false);
          setIsThirdOpen(false);
        }}
      >
        <div className={`sidebar ${isOpen ? "active" : ""}`} onMouseOver={()=>{setIsOpen(true)}}>
          <div className="sd-body">
            <ul>
              {mainList.map((subject, index) => (
                <li
                  key={index}
                  onMouseOver={() => ToggleSecondSidebar(subject.name)}
                  onMouseLeave={() => setIsSecondOpen(false)}
                >
                  <a className="sd-link">{subject.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={`second-sidebar ${isSecondOpen ? "active" : ""}`}
          onMouseOver={() => setIsSecondOpen(true)}
          onMouseLeave={() => {
            setIsSecondOpen(false);
          }}
        >
          <div className="sd-header"></div>
          <div className="sd-body">
            <ul>
              {pickedSecondList.map((subject, index) => (
                <li
                  key={index}
                  onMouseOver={() => ToggleThirdSidebar(subject.name)}
                  onMouseLeave={() => {
                    setIsThirdOpen(false);
                  }}
                >
                  <Link to={`/category/${subject.categoryId}`}>
                    <a className="sd-link">{subject.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={`third-sidebar ${isThirdOpen ? "active" : ""}`}
          onMouseOver={() => {
            setIsThirdOpen(true);
            setIsSecondOpen(true);
          }}
          onMouseLeave={() => {
            setIsThirdOpen(false);
          }}
        >
          <div className="sd-body">
            <ul>
              {pickedThirdList.map((item, index) => (
                <li key={index}>
                  <Link to={`/category/${item.categoryId}`}>
                    <a className="sd-link">{item.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToggleMenu;
