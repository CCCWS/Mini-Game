import React, { useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";

const App = () => {
  const animationDuration: number = 3;
  const itemBase: number[] = useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8], []);

  //itemBase를 2배로 복사후 랜덤정렬
  const randomItem: number[] = useMemo(
    () => itemBase.concat(itemBase).sort(() => Math.random() - 0.5),
    [itemBase]
  );

  //randomItem 길이 만큼의 랜덤한 수의 숫자를 가진 배열 생성
  const randomIndex = Array.from({ length: randomItem.length }, () =>
    Math.floor(Math.random() * 1000000000)
  );

  const [itemArr, setItemArr] = useState<number[]>(randomItem);
  const [itemIndex, setItemIndex] = useState<number[]>(randomIndex);

  const [firstClick, setFirstClick] = useState<number[]>([]);
  const [secondClick, setSecondClick] = useState<number[]>([]);
  const [clearItem, setClearItem] = useState<number[]>([]);

  const [clickPossible, setClickPossible] = useState<boolean>(false);

  useEffect(() => {
    //처음 로딩이 끝난후 일정시간 클릭 불가 처리
    const delay: number =
      (animationDuration + (randomItem.length - 1) / 4) * 1000;

    const clickPossibleTimeOut = setTimeout(() => {
      setClickPossible(true);
    }, delay);

    return () => clearTimeout(clickPossibleTimeOut);
  }, [randomItem]);

  useEffect(() => {
    //두번째 클릭 이후에 실행
    let clickDelay: number = 1000;

    if (secondClick.length > 0) {
      if (firstClick[1] === secondClick[1]) {
        setClearItem((prev) => [...prev, secondClick[1]]);
        clickDelay = 0;
      }

      const clickInit = setTimeout(() => {
        setFirstClick([]);
        setSecondClick([]);
        setClickPossible(true);
      }, clickDelay);

      return () => clearTimeout(clickInit);
    }
  }, [firstClick, secondClick]);

  const onClickReset = () => {
    const resetItem: number[] = itemBase
      .concat(itemBase)
      .sort(() => Math.random() - 0.5);

    const resetIndex: number[] = Array.from({ length: randomItem.length }, () =>
      Math.floor(Math.random() * 1000000000)
    );

    setItemArr(resetItem);
    setItemIndex(resetIndex);
    firstClick.length > 0 && setFirstClick([]);
    clearItem.length > 0 && setClearItem([]);
    setClickPossible(false);
  };

  const onClickItem = (index: number, data: number) => {
    if (!clickPossible) {
      return;
    }

    if (clearItem.includes(data)) {
      return;
    }

    if (firstClick[0] === index && firstClick[1] === data) {
      console.log("중복클릭");
      return;
    }

    if (firstClick.length === 0) {
      console.log("처음클릭");
      setFirstClick([index, data]);
      return;
    }

    if (firstClick.length > 0) {
      console.log("두번째클릭");
      setSecondClick([index, data]);
      setClickPossible(false);
      return;
    }
  };

  return (
    <Body>
      <Div>
        <ResetBtn onClick={onClickReset}>RESET</ResetBtn>
        {itemArr.map((data, index) => (
          <Item key={itemIndex[index]} onClick={() => onClickItem(index, data)}>
            <ItemDiv
              $firstClick={firstClick[0] === index && firstClick[1] === data}
              $secondClick={secondClick[0] === index && secondClick[1] === data}
              $clearCheck={clearItem.includes(data)}
              animationduration={animationDuration}
              delay={index / 4}
            >
              <Front>?</Front>
              <Back>{data}</Back>
            </ItemDiv>
          </Item>
        ))}

        <ClearNotification $clearCheck={clearItem.length === itemBase.length}>
          CLEAR !!!
        </ClearNotification>
      </Div>
    </Body>
  );
};

const Body = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: gray;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Div = styled.div`
  width: 500px;
  height: 500px;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 10px;

  position: relative;
`;

const ResetBtn = styled.button`
  position: absolute;
  width: 50px;
  height: 50px;

  top: -30px;
  left: 50%;
  transform: translate(-50%, -50%);

  border: 2px solid transparent;
  border-radius: 10px;

  width: 100px;
  height: 40px;

  transition: 0.5s;

  &:hover {
    cursor: pointer;
    border: 2px solid red;
  }
`;

const Item = styled.div`
  perspective: 500px;
`;

const CardDiv = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 1px solid gray;
  transition: 0.5s;

  backface-visibility: hidden;
`;

const Front = styled(CardDiv)`
  transform: rotateY(0deg);
  background-color: #bdbdbd;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1.5rem;

  color: gray;
`;

const Back = styled(CardDiv)`
  transform: rotateY(-180deg);
  /* background-color: white; */

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1.5rem;

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const ItemDiv = styled.div<{
  $firstClick: boolean;
  $secondClick: boolean;
  $clearCheck: boolean;
  animationduration: number;
  delay: number;
}>`
  width: 100%;
  height: 100%;

  position: relative;
  transition: 0.8s;
  transform-style: preserve-3d;

  transform: ${(props) =>
    props.$firstClick || props.$secondClick
      ? "rotateY(180deg)"
      : "rotateY(0deg)"};
  transform: ${(props) => props.$clearCheck && "rotateY(180deg)"};

  ${Back} {
    background-color: ${(props) => (props.$clearCheck ? "#5cf05c" : "white")};
  }

  animation-name: rotate;
  animation-duration: ${(props) => `${props.animationduration}s`};
  animation-delay: ${(props) => `${props.delay}s`};

  @keyframes rotate {
    0% {
      transform: rotateY(0deg);
    }

    50% {
      transform: rotateY(180deg);
    }

    100% {
      transform: rotateY(0deg);
    }
  }

  &:hover {
    cursor: pointer;
  }
`;

const ClearNotification = styled.div<{ $clearCheck: boolean }>`
  position: absolute;
  width: 100%;
  height: 0%;
  background-color: #747474d5;
  color: white;

  opacity: 0;
  border-radius: 10px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1.5rem;

  ${(props) =>
    props.$clearCheck &&
    css`
      transition: opacity 0.5s;
      opacity: 1;
      height: 100%;
    `}
`;

export default App;
