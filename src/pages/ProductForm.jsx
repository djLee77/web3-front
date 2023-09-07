import { MenuItem, Select } from "@mui/material";
import { useRef, useState } from "react";
import "../css/ProductForm.module.css";

const ProductForm = () => {
    const [name, setName] = useState(""); // 상풍명
    const [category, setCategory] = useState(""); // 카테고리
    const [price, setPrice] = useState(0); // 가격
    const [remaining, setRemaining] = useState(0); // 수량
    const [content, setContent] = useState(""); // 상품 상세 내용
    const [keywordList, setKeywordList] = useState([]); // 태그 리스트
    const [keywrod, setKeywrod] = useState(""); // 태그

    const tagRef = useRef(null);

    // 카테고리 설정하는 함수
    const handleCateory = (event) => {
        setCategory(event.target.value);
    };

    // 키워드 박스 눌렀을 때 키워드 입력할 수 있도록 하는 함수
    const handleKeyword = () => {
        if (tagRef.current) {
            tagRef.current.focus();
        }
    };

    // 키워드 입력 함수
    const onKeyPress = (e) => {
        // 키워드가 입력되어있고 엔터키를 누르면 addTagItem 실행
        if (e.target && e.target.value.length !== 0 && e.key === "Enter") {
            addKeyword();
        }
    };

    // 키워드 생성 함수
    const addKeyword = () => {
        if (keywordList.length >= 5) {
            alert("태그는 최대 5개까지 생성 가능합니다.");
        } else {
            setKeywordList([...keywordList, keywrod]);
            setKeywrod("");
        }
    };

    // 키워드 삭제 함수
    const deleteKeyword = (e) => {
        if (e.currentTarget.parentElement) {
            const deleteTagItem =
                e.currentTarget.parentElement.firstChild?.textContent;
            if (deleteTagItem) {
                const filteredTagList = keywordList.filter(
                    (tagItem) => tagItem !== deleteTagItem
                );
                setKeywordList(filteredTagList);
            }
        }
    };

    const handleAddBtn = () => {
        console.log(name, category, price, remaining, content, keywordList);
    };

    return (
        <div>
            <h4>상품 등록 페이지</h4>
            <div>
                <div>
                    <label for="title_id">상품 제목 : </label>
                    <input
                        type="text"
                        id="title_id"
                        name="title"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>카테고리 : </label>
                    <Select
                        id="demo-simple-select"
                        value={category}
                        onChange={handleCateory}
                    >
                        <MenuItem value={10}>None</MenuItem>
                        <MenuItem value={20}>남성 상의</MenuItem>
                        <MenuItem value={30}>남성 하의</MenuItem>
                    </Select>
                </div>
                <div>
                    <label for="price_id">상품 가격 : </label>
                    <input
                        type="number"
                        id="price_id"
                        name="price"
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <div>
                    <label for="count_id">상품 수량 : </label>
                    <input
                        type="number"
                        id="count_id"
                        name="remaining"
                        onChange={(e) => setRemaining(e.target.value)}
                    />
                </div>
                <div>
                    <label for="content_id">상품 설명 : </label>
                    <input
                        type="text"
                        id="content_id"
                        name="content"
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className="box" onClick={handleKeyword}>
                    <div className="keyword-box">
                        {keywordList.map((tagItem, index) => {
                            return (
                                <div className="keyword-item" key={index}>
                                    <span className="text">{tagItem}</span>
                                    <button
                                        className="keyword-del-btn"
                                        onClick={deleteKeyword}
                                    >
                                        X
                                    </button>
                                </div>
                            );
                        })}
                        <input
                            ref={tagRef}
                            className="keyword-input"
                            type="text"
                            tabIndex={2}
                            onChange={(e) => setKeywrod(e.target.value)}
                            value={keywrod}
                            onKeyPress={onKeyPress}
                        />
                    </div>
                </div>
            </div>
            <div>
                <button onClick={handleAddBtn}>상품 등록</button>
            </div>
        </div>
    );
};

export default ProductForm;
