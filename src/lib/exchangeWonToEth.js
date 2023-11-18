const exchangeWonToEth = (won) => {
    // 1 이더에 대한 환율 (KRW)
    const exchangeRate = 2519008.94;

    // 이더리움으로 환전된 금액 계산
    return (won / exchangeRate).toFixed(4);
};

export default exchangeWonToEth;
