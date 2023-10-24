import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from "@mui/material";
import { Button } from "@mui/material";
import axios from "axios";
import cookie from "react-cookies";
import reissueAccToken from "../../lib/reissueAccToken";
import numberComma from "../../lib/numberComma";
import { useNavigate } from "react-router-dom";
import ChangeQuantityModal from "./modal/ChangeQuantityModal";

export default function CartList({ cartList, selectAll, setSelectAll, selectedItems, setSelectedItems, getCartList }) {
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const navigate = useNavigate();

    // 상품 전체 선택 함수
    const handleSelectAll = (event) => {
        const checked = event.target.checked;
        setSelectAll(checked);

        //  체크하면 선택한 상품 배열에 모든 값 넣기 해제하면 빈 배열로 상태 저장
        if (checked) {
            setSelectedItems(
                cartList.map((item) => ({
                    itemId: item.itemId,
                    cartId: item.cartId,
                    quantity: item.quantity,
                }))
            );
        } else {
            setSelectedItems([]);
        }
    };

    // 각 상품 선택 함수
    const handleSelectOne = (event, itemId, cartId, quantity) => {
        const checked = event.target.checked;

        if (checked) {
            setSelectedItems((prevSelected) => [...prevSelected, { itemId, cartId, quantity }]);
        } else {
            setSelectedItems((prevSelected) => prevSelected.filter((item) => item.cartId !== cartId));
        }
    };

    // 삭제 버튼 함수
    const handleDelBtn = async (cartId) => {
        let isSuccess = false;
        try {
            const res = await axios.delete(`${serverUrl}/api/users/carts/${cartId}`, {
                headers: {
                    Authorization: `Bearer ${cookie.load("accessToken")}`,
                },
            });
            console.log("삭제 : ", res);
            getCartList();
            isSuccess = true;
        } catch (error) {
            // 만약 401(인증) 에러가 나면
            if (error.response.status === 401) {
                await reissueAccToken(); // 토큰 재발급 함수 실행
                !isSuccess && handleDelBtn(); // 함수 다시 실행
            }
            console.log("에러:", error);
        }
    };

    // 상품 클릭시 상세페이지로 이동
    const onClickProduct = (id) => {
        navigate(`/product/detail/${id}`);
    };

    return (
        <div>
            {cartList.length === 0 ? (
                <div style={{ marginTop: "30px", marginBottom: "30px", fontSize: "24px" }}>
                    장바구니에 담긴 상품이 없습니다.
                </div>
            ) : (
                <TableContainer component={Paper} sx={{ marginTop: "18px", marginBottom: "30px" }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">
                                    <Checkbox checked={selectAll} onChange={handleSelectAll} defaultChecked={true} />
                                </TableCell>
                                <TableCell align="center">상품 사진</TableCell>
                                <TableCell align="center">상품명</TableCell>
                                <TableCell align="center">수량</TableCell>
                                <TableCell align="center">가격</TableCell>
                                <TableCell align="center">주문 관리</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cartList.map((item) => (
                                <TableRow key={item.cartId}>
                                    <TableCell align="center">
                                        <Checkbox
                                            defaultChecked={true}
                                            checked={selectedItems.some(
                                                (selectedItem) => selectedItem.cartId === item.cartId
                                            )}
                                            onChange={(e) =>
                                                handleSelectOne(e, item.itemId, item.cartId, item.quantity)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        onClick={() => onClickProduct(item.itemId)}
                                        sx={{ "&:hover": { cursor: "pointer" } }}
                                    >
                                        <img src={item.image1} alt={item.name} width={100} height={100} />
                                    </TableCell>
                                    <TableCell
                                        align="left"
                                        onClick={() => onClickProduct(item.itemId)}
                                        sx={{ fontSize: "16px", "&:hover": { cursor: "pointer" } }}
                                    >
                                        {item.name}
                                    </TableCell>
                                    <TableCell align="center">{item.quantity}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: "16px", fontWeight: "bold" }}>
                                        {numberComma(item.quantity * item.price)}원
                                    </TableCell>
                                    <TableCell align="center">
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <ChangeQuantityModal
                                                cartId={item.cartId}
                                                getCartList={getCartList}
                                                count={item.quantity}
                                                stock={item.stock}
                                            />
                                            <Button color="error" onClick={() => handleDelBtn(item.cartId)}>
                                                상품 삭제
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}
