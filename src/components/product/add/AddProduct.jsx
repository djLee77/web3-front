import { TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import style from "../../../css/AddProduct.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import SelectCategoryModal from "./modal/SelectCategoryModal";
import axios from "axios";
import Content from "./Content";
import cookie from "react-cookies";

const AddProduct = () => {
    const [imgURL1, setImgURL1] = useState("/imgs/defaultAddImg.png"); // 이미지1
    const [imgURL2, setImgURL2] = useState("/imgs/defaultAddImg.png"); // 이미지2
    const [imgURL3, setImgURL3] = useState("/imgs/defaultAddImg.png"); // 이미지3
    const [name, setName] = useState(""); // 상풍명
    const [category, setCategory] = useState({}); // 선택한 카테고리
    const [price, setPrice] = useState(0); // 가격
    const [stock, setStock] = useState(0); // 수량
    const [content, setContent] = useState(""); // 상품 상세 내용
    const [keywordList, setKeywordList] = useState([]); // 키워드 리스트
    const [keyword, setKeyword] = useState(""); // 키워드
    const [searchParams, setSearchParams] = useSearchParams(); // url 파라미터 값
    const [isModify, setIsModify] = useState(false); // 상품 수정인지 확인

    const id = cookie.load("id"); // 로그인한 ID

    const navigate = useNavigate();

    // 상품 정보 가져오는 함수
    const getProductInfo = async (id) => {
        try {
            const res = await axios.get(`/api/public/items/${id}`, {
                headers: {
                    "ngrok-skip-browser-warning": "1234",
                },
            });
            setImgURL1(res.data.data.image1);
            setImgURL2(res.data.data.image2);
            setImgURL3(res.data.data.image3);
            setName(res.data.data.name);
            setPrice(res.data.data.price);
            setStock(res.data.data.stock);
            setContent(res.data.data.content);
            setCategory({ ...category, categoryId: res.data.da.categoryId });

            console.log("상품 정보 : ", res);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const itemId = searchParams.get("id");
        // 만약 등록한 상품 수정이면 isModify True로 바꿔줌
        if (itemId) {
            getProductInfo(itemId);
            setIsModify(true);
            console.log("gd");
        }
    }, []);

    const keywordRef = useRef(null); // 키워드 인풋창 ref
    const imgRef1 = useRef(null); // 이미지 인풋창1 ref
    const imgRef2 = useRef(null); // 이미지 인풋창2 ref
    const imgRef3 = useRef(null); // 이미지 인풋창3 ref
    const contentImgRef = useRef(null); // 상세 설명 이미지 인풋창 ref

    // 이미지 업로드 버튼 함수
    const onClickImgBtn = (idx) => {
        console.log("클릭", idx);
        if (idx === 1) {
            imgRef1.current.click();
        } else if (idx === 2) {
            imgRef2.current.click();
        } else if (idx === 3) {
            imgRef3.current.click();
        } else {
            contentImgRef.current.click();
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
                const res = await axios.post("/api/users/uploads/images", formData, {
                    headers: {
                        Authorization: `Bearer ${cookie.load("accessToken")}`,
                        "ngrok-skip-browser-warning": "1234",
                    },
                });
                console.log(res);
                if (idx === 1) {
                    setImgURL1(res.data.data);
                } else if (idx === 2) {
                    setImgURL2(res.data.data);
                } else if (idx === 3) {
                    setImgURL3(res.data.data);
                } else {
                    // 내용에 이미지이면
                    const imageURL = `![](${res.data.data})`; // 이미지 URL 마크다운 형식으로 변경
                    setContent((prevContent) => prevContent + imageURL); // 기존 내용에다가 이미지 삽입
                }
            } catch (error) {
                console.log(error);
            }
        }
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
            setKeywordList([...keywordList, keyword]);
            setKeyword("");
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
    const onClickAddBtn = async () => {
        setKeywordList([...keywordList, name]); // 키워드에 제목도 넣어주기
        try {
            const res = await axios.post(
                `/api/sellers/items/${id}`,
                {
                    name: name,
                    categoryId: category.categoryId,
                    price: price,
                    stock: stock,
                    content: content,
                    image1: "이미지1",
                    image2: "이미지2",
                    image3: "이미지3",
                    keywords: keywordList,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookie.load("accessToken")}`,
                        "ngrok-skip-browser-warning": "1234",
                    },
                }
            );
            console.log(res);
            if (res.data.code == 201) {
                alert("상품 등록 완료!");
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }
    };

    // 상품 수정 버튼 함수
    const onClickModifyBtn = async () => {
        const itemId = searchParams.get("id");
        try {
            const res = await axios.patch(
                `/api/sellers/items/${itemId}`,
                {
                    sellerId: id,
                    name: name,
                    categoryId: category.categoryId,
                    price: price,
                    stock: stock,
                    content: content,
                    image1: "이미지1",
                    image2: "이미지2",
                    image3: "이미지3",
                    keywords: keywordList,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookie.load("accessToken")}`,
                        "ngrok-skip-browser-warning": "1234",
                    },
                }
            );
            console.log(res);
            if (res.data.code == 201) {
                alert("상품 수정 완료!");
                navigate("/seller/product");
            }
        } catch (error) {
            console.log(error);
        }
    };

    // 취소 버튼 함수
    const onClickCancleBtn = () => {
        if (window.confirm("정말로 취소하시겠습니까?")) {
            navigate("/seller/product");
        }
    };

    return (
        <div className={style.box}>
            <div className={style.headerBox}>
                {/* 이미지 선택 영역 */}
                <div className={style.imgBox}>
                    <input
                        type="file"
                        style={{ display: "none" }}
                        ref={imgRef1}
                        onChange={(e) => handleImageUpload(e, 1)}
                    />
                    <button className={style.imgBtn} type="button" onClick={() => onClickImgBtn(1)}>
                        <img src={imgURL1} width={300} height={300} alt="이미지1" />
                    </button>
                    <div className={style.imgBox2}>
                        <input
                            type="file"
                            style={{ display: "none" }}
                            ref={imgRef2}
                            onChange={(e) => handleImageUpload(e, 2)}
                        />
                        <button className={style.imgBtn} type="button" onClick={() => onClickImgBtn(2)}>
                            <img src={imgURL2} width={145} height={145} alt="이미지2" />
                        </button>
                        <input
                            type="file"
                            style={{ display: "none" }}
                            ref={imgRef3}
                            onChange={(e) => handleImageUpload(e, 3)}
                        />
                        <button className={style.imgBtn} type="button" onClick={() => onClickImgBtn(3)}>
                            <img src={imgURL3} width={145} height={145} alt="이미지3" />
                        </button>
                    </div>
                </div>

                <div className={style.inputBox}>
                    {/* 상품 제목 */}
                    <div className={style.input}>
                        <label htmlFor="title-id">상품 제목 : </label>
                        <TextField id="title-id" size="small" onChange={(e) => setName(e.target.value)} />
                    </div>

                    {/* 카테고리 */}
                    <div className={style.input}>
                        <label>카테고리 : </label>
                        <SelectCategoryModal category={category} setCategory={setCategory} />
                        <span>{category.name}</span>
                    </div>

                    {/* 상품 가격 */}
                    <div className={style.input}>
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
                    <div className={style.input}>
                        <label htmlFor="count_id">상품 수량 : </label>
                        <TextField
                            type="text"
                            sx={{ width: "80px" }}
                            inputProps={{ maxLength: 3 }}
                            id="count_id"
                            size="small"
                            onChange={(e) => {
                                setStock(e.target.value.replace(/[^0-9]/g, ""));
                            }}
                        />
                    </div>

                    {/* 상품 키워드 */}
                    <div className={style.keywordBox} onClick={handleKeyword}>
                        <label>상품 키워드 : </label>
                        <div className={style.keywordInputBox}>
                            {keywordList.map((keywordItem, index) => {
                                return (
                                    <div className={style.keywordItem} key={index}>
                                        <span className="text">{keywordItem}</span>
                                        <button className="keyword-del-btn" onClick={deleteKeyword}>
                                            X
                                        </button>
                                    </div>
                                );
                            })}
                            <input
                                ref={keywordRef}
                                className={style.keywordInput}
                                type="text"
                                tabIndex={2}
                                onChange={(e) => setKeyword(e.target.value)}
                                value={keyword}
                                onKeyPress={onKeyPress}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 상품 상세 설명 */}
            <Content
                content={content}
                setContent={setContent}
                inputRef={contentImgRef}
                handleImageUpload={handleImageUpload}
                handleImageBtnClick={onClickImgBtn}
            />

            {/* 버튼 영역 */}
            <div className={style.btnBox}>
                {isModify ? (
                    <button className={style.addBtn} onClick={onClickModifyBtn}>
                        상품 수정
                    </button>
                ) : (
                    <button className={style.addBtn} onClick={onClickAddBtn}>
                        상품 등록
                    </button>
                )}

                <button className={style.cancleBtn} onClick={onClickCancleBtn}>
                    취소
                </button>
            </div>
        </div>
    );
};

export default AddProduct;
