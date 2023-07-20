import React, { useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";

interface clickItem {}

const App = () => {
  const [bingoItem, setBingoItem] = useState<number[]>([]);

  const [firstClick, setFirstClick] = useState<number[]>([]);
  const [secondClick, setSecondClick] = useState<number[]>([]);

  const [clickPossible, setClickPossible] = useState<boolean>(false);
  const [clearItem, setClearItem] = useState<number[]>([]);

  const [test, setTest] = useState<boolean>(false);

  const itemBase: number[] = useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8], []);
  const animationDuration: number = 1;

  useEffect(() => {
    if (bingoItem.length === 0) {
      const newItemBase = itemBase.concat(itemBase);
      newItemBase.sort(() => Math.random() - 0.5);
      setBingoItem(newItemBase);
    }
  }, [itemBase, bingoItem, setBingoItem]);

  const onTestHandler = () => {
    const delay: number = (animationDuration + itemBase.length - 1 / 2) * 1000;
    setTimeout(() => {
      setClickPossible(true);
    }, 7500);
  };

  useEffect(() => {
    const delay: number = (animationDuration + itemBase.length - 1 / 2) * 1000;
    setTimeout(() => {
      setClickPossible(true);
      console.log(delay);
    }, 7500);
  }, [itemBase]);

  const onClickItem = (index: number, data: number) => {
    if (!clickPossible) {
      return;
    }

    if (firstClick.length === 0) {
      console.log("처음클릭");
      setFirstClick([index, data]);
      return;
    }

    if (firstClick[0] === index && firstClick[1] === data) {
      console.log("중복클릭");
      return;
    }

    if (firstClick.length > 0) {
      console.log("두번째클릭");
      setSecondClick([index, data]);
      setClickPossible(false);
      return;
    }
  };

  //두번째 클릭 이후에 실행
  useEffect(() => {
    if (secondClick.length > 0) {
      if (firstClick[1] === secondClick[1]) {
        setClearItem((prev) => [...prev, secondClick[1]]);
      }

      setTimeout(() => {
        setFirstClick([]);
        setSecondClick([]);
        setClickPossible(true);
      }, 1000);
    }
  }, [firstClick, secondClick]);

  return (
    <Body>
      <Div>
        <RefreshBtn onClick={onTestHandler}>TEST</RefreshBtn>
        {bingoItem &&
          bingoItem.map((data, index) => (
            <Item key={index} onClick={() => onClickItem(index, data)}>
              <ItemDiv
                firstclick={
                  firstClick[0] === index && firstClick[1] === data
                    ? true
                    : false
                }
                secondclick={
                  secondClick[0] === index && secondClick[1] === data
                    ? true
                    : false
                }
                clearcheck={clearItem.includes(data)}
                animationduration={animationDuration}
                delay={index / 2}
              >
                <Front>{index / 2}</Front>
                <Back>{data}</Back>
              </ItemDiv>
            </Item>
          ))}
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

const RefreshBtn = styled.button`
  position: absolute;
  width: 50px;
  height: 50px;

  top: -50px;
  left: 50%;
  transform: translate(-50%, -50%);
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
`;

const Back = styled(CardDiv)`
  transform: rotateY(-180deg);
  background-color: white;

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
  firstclick: boolean;
  secondclick: boolean;
  clearcheck: boolean;
  animationduration: number;
  delay: number;
}>`
  width: 100%;
  height: 100%;

  position: relative;
  transition: 0.8s;
  transform-style: preserve-3d;

  transform: ${(props) =>
    props.firstclick || props.secondclick
      ? "rotateY(180deg)"
      : "rotateY(0deg)"};
  transform: ${(props) => props.clearcheck && "rotateY(180deg)"};

  animation-duration: ${(props) => `${props.animationduration}s`};
  animation-name: slidein;
  animation-delay: ${(props) => `${props.delay / 2}s`};

  @keyframes slidein {
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

  ${Back} {
    background-color: ${(props) => props.clearcheck && "#5cf05c"};
  }

  ${CardDiv} {
    box-shadow: ${(props) =>
      (props.firstclick || props.secondclick) && "0px 0px 10px 1px red"};
  }

  &:hover {
    cursor: pointer;
  }
`;

export default App;
