import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Item from "./Item";
import cookieSrc from "../cookie.svg";
import useInterval from "../hooks/use-interval.hook";

const items = [
  { id: "cursor", name: "Cursor", cost: 10, value: 1 },
  { id: "grandma", name: "Grandma", cost: 100, value: 10 },
  { id: "farm", name: "Farm", cost: 1000, value: 80 },
];

// let valueOfItems = {
//   cursor: 1,
//   grandma: 10,
//   farm: 80,
// };

const calculateCookiesPerSecond = (purchasedItems) => {
  // { cursor: 3, grandma: 1, farm: 0 } -> 3 * 1 + 1 * 10 + 0 * 80
  let total = 0;
  Object.keys(purchasedItems).forEach(function (purchasedKey) {
    const purchasedValue = purchasedItems[purchasedKey];
    const item = items.find(function (item) {
      return purchasedKey === item.id;
    });
    total += purchasedValue * item.value;
  });
  // // Object.keys(purchasedItems).forEach(function(purchasedKey) {
  //  // const purchasedValue = purchasedItems[purchasedKey];

  //   //total += purchasedValue * valueOfItems[purchasedKey]
  // });
  // const value = items.value;
  return total;
};

const Game = () => {
  // TODO: Replace this with React state!
  const [numCookies, setNumCookies] = React.useState(10000);
  const [purchasedItems, setPurchasedItem] = React.useState({
    cursor: 0,
    grandma: 0,
    farm: 0,
  });

  const handleSpace = (event) => {
    if (event.code === "Space") {
      setNumCookies(numCookies + 1);
    }
  };

  React.useEffect(() => {
    document.title = `you have ${numCookies} cookies`;
  }, [numCookies]);

  React.useEffect(() => {
    window.addEventListener("keydown", handleSpace);
    return () => {
      window.removeEventListener("keydown", handleSpace);
    };
  });

  console.log(purchasedItems);
  const addCookies = () => {
    setNumCookies((cookies) => cookies + 1);
  };
  useInterval(() => {
    const numOfGeneratedCookies = calculateCookiesPerSecond(purchasedItems);
    setNumCookies(numCookies + numOfGeneratedCookies);
  }, 1000);

  return (
    <Wrapper>
      <GameArea>
        <Indicator>
          <Total>{numCookies} cookies</Total>
          <strong>{calculateCookiesPerSecond(purchasedItems)}</strong> cookies
          per second
        </Indicator>
        <Button onClick={addCookies}>
          <Cookie src={cookieSrc} />
        </Button>
      </GameArea>

      <ItemArea>
        <SectionTitle>Items:</SectionTitle>
        {items.map((item, index) => {
          return (
            <Item
              key={item.id}
              index={index}
              name={item.name}
              cost={item.cost}
              value={item.value}
              numOwned={purchasedItems[item.id]}
              handleClick={() => {
                console.log(item.cost);
                if (numCookies < item.cost) {
                  alert("Cannot afford item");
                  return;
                } else {
                  setNumCookies(numCookies - item.cost);
                  setPurchasedItem({
                    ...purchasedItems,
                    [item.id]: purchasedItems[item.id] + 1,
                  });
                }
              }}
            />
          );
        })}
      </ItemArea>
      <HomeLink to="/">Return home</HomeLink>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
`;
const GameArea = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
`;
const Button = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
`;

const Cookie = styled.img`
  width: 200px;
`;

const ItemArea = styled.div`
  height: 100%;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SectionTitle = styled.h3`
  text-align: center;
  font-size: 32px;
  color: yellow;
`;

const Indicator = styled.div`
  position: absolute;
  width: 250px;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
`;

const Total = styled.h3`
  font-size: 28px;
  color: lime;
`;

const HomeLink = styled(Link)`
  position: absolute;
  top: 15px;
  left: 15px;
  color: #666;
`;

export default Game;
