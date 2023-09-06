import { MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "../../css/AddProduct.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SelectCategoryModal from "./modal/SelectCategoryModal";

const AddProduct = () => {
    const [imgURL1, setImgURL1] = useState("/imgs/defaultAddImg.png"); // 이미지1
    const [imgURL2, setImgURL2] = useState("/imgs/defaultAddImg.png"); // 이미지2
    const [imgURL3, setImgURL3] = useState("/imgs/defaultAddImg.png"); // 이미지3
    const [name, setName] = useState(""); // 상풍명
    const [category, setCategory] = useState({}); // 카테고리
    const [price, setPrice] = useState(0); // 가격
    const [remaining, setRemaining] = useState(0); // 수량
    const [content, setContent] = useState(""); // 상품 상세 내용
    const [keywordList, setKeywordList] = useState([]); // 태그 리스트
    const [keywrod, setKeywrod] = useState(""); // 태그

    const keywordRef = useRef(null); // 키워드 인풋창 ref
    const imgRef1 = useRef(null); // 이미지 인풋창1 ref
    const imgRef2 = useRef(null); // 이미지 인풋창2 ref
    const imgRef3 = useRef(null); // 이미지 인풋창3 ref

    const navigate = useNavigate();

    // 이미지 업로드 버튼 함수(input imgRef를 클릭해줌)
    const handleImageBtnClick = (idx) => {
        console.log("클릭", idx);
        if (idx === 1) {
            imgRef1.current.click();
        } else if (idx === 2) {
            imgRef2.current.click();
        } else {
            imgRef3.current.click();
        }
    };

    // 이미지 업로드 함수
    const handleImageUpload = async (event, idx) => {
        const file = event.target.files?.[0];
        console.log("업로드", idx);
        if (file) {
            const formData = new FormData();
            formData.append("file", file); // 폼 데이터에 저장
            console.log("imgFile : ", file);
            try {
                // const response = await axios.post('/server/api/uploads/images', formData, {
                //     headers: {
                //         Authorization: `Bearer ${cookie.get('accessToken')}`,
                //     },
                // })
                if (idx === 1) {
                    setImgURL1(1);
                } else if (idx === 2) {
                    setImgURL2(2);
                } else if (idx === 3) {
                    setImgURL3(3);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    // 카테고리 설정하는 함수
    const handleCateory = (event) => {
        setCategory(event.target.value);
    };

    // 키워드 박스 눌렀을 때 키워드 입력할 수 있도록 하는 함수
    const handleKeyword = () => {
        if (keywordRef.current) {
            keywordRef.current.focus();
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
            const deleteTagItem = e.currentTarget.parentElement.firstChild?.textContent;
            if (deleteTagItem) {
                const filteredTagList = keywordList.filter((tagItem) => tagItem !== deleteTagItem);
                setKeywordList(filteredTagList);
            }
        }
    };
    // 상품 등록 버튼 함수
    const handleAddBtn = () => {
        console.log(name, category.categoryId, price, remaining, content, keywordList, imgURL1, imgURL2, imgURL3);
    };

    // 취소 버튼 함수
    const handleCancleBtn = () => {
        if (window.confirm("정말로 취소하시겠습니까?")) {
            navigate("/");
        }
    };

    return (
        <div className="box">
            {/* 이미지 선택 영역 */}
            <div className="img-box1">
                <input
                    type="file"
                    style={{ display: "none" }}
                    ref={imgRef1}
                    onChange={(e) => handleImageUpload(e, 1)}
                />
                <button className="img-btn" type="button" onClick={() => handleImageBtnClick(1)}>
                    <img src={imgURL1} width={300} height={300} alt="이미지1" />
                </button>
                <div className="img-box2">
                    <input
                        type="file"
                        style={{ display: "none" }}
                        ref={imgRef2}
                        onChange={(e) => handleImageUpload(e, 2)}
                    />
                    <button className="img-btn" type="button" onClick={() => handleImageBtnClick(2)}>
                        <img src={imgURL2} width={145} height={145} alt="이미지2" />
                    </button>
                    <input
                        type="file"
                        style={{ display: "none" }}
                        ref={imgRef3}
                        onChange={(e) => handleImageUpload(e, 3)}
                    />
                    <button className="img-btn" type="button" onClick={() => handleImageBtnClick(3)}>
                        <img src={imgURL3} width={145} height={145} alt="이미지3" />
                    </button>
                </div>
            </div>

            <div className="input-box">
                {/* 상품 제목 */}
                <div className="input">
                    <label htmlFor="title-id">상품 제목 : </label>
                    <TextField id="title-id" size="small" onChange={(e) => setName(e.target.value)} />
                </div>

                {/* 카테고리 */}
                <div className="input">
                    <label>카테고리 : </label>
                    <SelectCategoryModal category={category} setCategory={setCategory} />
                    <span>{category.name}</span>
                </div>

                {/* 상품 가격 */}
                <div className="input">
                    <label htmlFor="price_id">상품 가격 : </label>
                    <TextField
                        id="price_id"
                        size="small"
                        type="number"
                        inputProps={{ step: "0.1", lang: "en-US" }}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                {/* 상품 수량 */}
                <div className="input">
                    <label htmlFor="count_id">상품 수량 : </label>
                    <TextField
                        type="text"
                        sx={{ width: "80px" }}
                        inputProps={{ maxLength: 3 }}
                        id="count_id"
                        size="small"
                        onChange={(e) => {
                            setRemaining(e.target.value.replace(/[^0-9]/g, ""));
                        }}
                    />
                </div>

                {/* 상품 설명 */}
                <div className="input">
                    <label htmlFor="content_id">상품 설명 : </label>
                    <TextField id="content_id" size="small" onChange={(e) => setContent(e.target.value)} />
                </div>

                {/* 상품 키워드 */}
                <div className="keyword-box" onClick={handleKeyword}>
                    <label>상품 키워드 : </label>
                    <div className="keyword-input-box">
                        {keywordList.map((tagItem, index) => {
                            return (
                                <div className="keyword-item" key={index}>
                                    <span className="text">{tagItem}</span>
                                    <button className="keyword-del-btn" onClick={deleteKeyword}>
                                        X
                                    </button>
                                </div>
                            );
                        })}
                        <input
                            ref={keywordRef}
                            className="keyword-input"
                            type="text"
                            tabIndex={2}
                            onChange={(e) => setKeywrod(e.target.value)}
                            value={keywrod}
                            onKeyPress={onKeyPress}
                        />
                    </div>
                </div>

                {/* 버튼 영역 */}
                <div className="btn-box">
                    <button className="add-btn" onClick={handleAddBtn}>
                        상품 등록
                    </button>
                    <button className="cancle-btn" onClick={handleCancleBtn}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
