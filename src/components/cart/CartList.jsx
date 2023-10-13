import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
import { Button } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import cookie from "react-cookies";
import reissueAccToken from "../../lib/reissueAccToken";

export default function CartList({
  cartList,
  selectAll,
  setSelectAll,
  selectedItems,
  setSelectedItems,
  getCartList,
}) {
  const instance = axios.create({
    baseURL: "https://port-0-mall-deploy-jvvy2blm8p9dcp.sel5.cloudtype.app/",
  });

  // 상품 전체 선택 함수
  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);

    //  체크하면 선택한 상품 배열에 모든 값 넣기 해제하면 빈 배열로 상태 저장
    if (checked) {
      setSelectedItems(
        cartList.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
        }))
      );
    } else {
      setSelectedItems([]);
    }
  };

  // 각 상품 선택 함수
  const handleSelectOne = (event, itemId, quantity) => {
    const checked = event.target.checked;

    if (checked) {
      setSelectedItems((prevSelected) => [
        ...prevSelected,
        { itemId, quantity },
      ]);
    } else {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((item) => item.itemId !== itemId)
      );
    }
  };

  // 삭제 버튼 함수
  const handleDelBtn = async (id) => {
    let isSuccess = false;
    try {
      const res = await axios.delete(`/api/users/carts/${id}`, {
        headers: {
          Authorization: `Bearer ${cookie.load("accessToken")}`,
          "ngrok-skip-browser-warning": "1234",
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

  // 상품 수량 변경 함수
  const handleCountChange = async (id, e) => {
    let isSuccess = false;
    try {
      const res = await instance.patch(
        `/api/users/carts/${id}`,
        {
          quantity: e.target.value,
        },
        {
          headers: {
            Authorization: `Bearer ${cookie.load("accessToken")}`,
            withCredentials: true,
          },
        }
      );

      console.log("수량 변경 : ", res);
      getCartList();
      isSuccess = true;
    } catch (error) {
      // 만약 401(인증) 에러가 나면
      if (error.response.status === 401) {
        await reissueAccToken(); // 토큰 재발급 함수 실행
        !isSuccess && handleCountChange(); // isSuccess가 false면은 장바구니 목록 함수 실행
      }
      console.log("에러:", error);
    }
  };

  return (
    <div>
      {cartList.length === 0 ? (
        <div
          style={{ marginTop: "30px", marginBottom: "30px", fontSize: "24px" }}
        >
          장바구니에 담긴 상품이 없습니다.
        </div>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ marginTop: "18px", marginBottom: "30px" }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                    defaultChecked={true}
                  />
                </TableCell>
                <TableCell align="center">상품 사진</TableCell>
                <TableCell align="center">상품명</TableCell>
                <TableCell align="center">수량</TableCell>
                <TableCell align="center">가격</TableCell>
                <TableCell align="center">삭제</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartList.map((item) => (
                <TableRow key={item.cartId}>
                  <TableCell align="center">
                    <Checkbox
                      defaultChecked={true}
                      checked={selectedItems.some(
                        (selectedItem) => selectedItem.itemId === item.itemId
                      )}
                      onChange={(e) =>
                        handleSelectOne(e, item.itemId, item.quantity)
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <img
                      src={item.image1}
                      alt={item.name}
                      width={100}
                      height={100}
                    />
                  </TableCell>
                  <TableCell align="left" sx={{ fontSize: "16px" }}>
                    {item.name}
                  </TableCell>
                  <TableCell align="center">
                    <Select
                      defaultValue={item.quantity}
                      onChange={(e) => handleCountChange(item.cartId, e)}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={6}>6</MenuItem>
                      <MenuItem value={7}>7</MenuItem>
                      <MenuItem value={8}>8</MenuItem>
                      <MenuItem value={9}>9</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontSize: "16px", fontWeight: "bold" }}
                  >
                    {(item.quantity * item.price)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    원
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      color="error"
                      onClick={() => handleDelBtn(item.cartId)}
                    >
                      x
                    </Button>
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
