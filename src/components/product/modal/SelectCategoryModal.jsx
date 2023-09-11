import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "../../../css/SelectCategoryModal.css";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";

const style = {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    height: 450,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default function SelectCategoryModal({ category, setCategory }) {
    const [open, setOpen] = useState(false);
    const [isSecondOpen, setIsSecondOpen] = useState(false);
    const [isThirdOpen, setIsThirdOpen] = useState(false);

    const [mainList, setMainList] = useState([]);
    const [secondList, setSecondList] = useState({});
    const [thirdList, setThirdList] = useState({});

    const [pickedSecondList, setPickedSecondList] = useState([]);
    const [pickedThirdList, setPickedThirdList] = useState([]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setIsSecondOpen(false);
        setIsThirdOpen(false);
    };

    const getCategrories = async () => {
        const response = await axios.get("/api/public/categories", {
            headers: {
                "ngrok-skip-browser-warning": "1234",
            },
        });
        console.log("data:", response.data.data[0]);
        const categories = response.data.data[0].child;

        const secondListsTemp = {};
        const thirdListsTemp = {};

        // 1번째 카테고리 목록 저장
        const mainListTemp = categories.map((cat) => ({
            categoryId: cat.categoryId,
            name: cat.name,
        }));

        categories.forEach((cat) => {
            if (cat.child && cat.child.length > 0) {
                // 2번째 카테고리 목록 저장
                secondListsTemp[cat.name] = cat.child.map((child) => ({
                    categoryId: child.categoryId,
                    name: child.name,
                }));

                cat.child.forEach((subCat) => {
                    // 3번째 카테고리 목록 저장
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
        setSecondList(secondListsTemp);
        setThirdList(thirdListsTemp);
    };

    useEffect(() => {
        getCategrories();
    }, []);

    // 선택된 첫번째 카테고리의 맞는 두번째 카테고리 목록 저장 함수
    const ToggleSecondSidebar = (subject) => {
        setPickedSecondList(secondList[subject] || []);
        setIsSecondOpen(true);
    };

    // 선택된 두번째 카테고리의 맞는 세번째 카테고리 목록 저장 함수
    const ToggleThirdSidebar = (subject) => {
        setPickedThirdList(thirdList[subject] || []);
        setIsThirdOpen(true);
    };

    return (
        <div>
            <button onClick={handleOpen}>카테고리 선택</button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h4>카테고리</h4>
                    <div className="category-box">
                        <div>
                            <ul className="category-ul">
                                {mainList.map((subject) => (
                                    <li
                                        key={subject.categoryId}
                                        onClick={() => {
                                            ToggleSecondSidebar(subject.name);
                                            setCategory(subject);
                                        }}
                                    >
                                        <a className="sd-link">{subject.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div>
                                <ul className="category-ul">
                                    {pickedSecondList.map((subject) => (
                                        <li
                                            key={subject.categoryId}
                                            onClick={() => {
                                                ToggleThirdSidebar(subject.name);
                                                setCategory(subject);
                                            }}
                                        >
                                            <a className="sd-link">{subject.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div>
                            <div>
                                <ul className="category-ul">
                                    {pickedThirdList.map((item) => (
                                        <li key={item.categoryId} onClick={() => setCategory(item)}>
                                            <a className="sd-link">{item.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="selected-category-box">
                        <h5>선택한 카테고리 : {category.name}</h5>
                    </div>
                    <div className="btn-box">
                        <Button variant="contained" onClick={() => setOpen(false)}>
                            선택 완료
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
