import React from "react";
import styled from "styled-components";
import { PyeRoundIcon } from "../Svg";
import Text from "../Text/Text";
import Skeleton from "../Skeleton/Skeleton";
import { Colors } from "../../theme";

export interface Props {
  color?: keyof Colors;
  pyePriceUsd?: number;
}

const PriceLink = styled.a`
  display: flex;
  align-items: center;
  svg {
    transition: transform 0.3s;
  }
  :hover {
    svg {
      transform: scale(1.2);
    }
  }
`;

const PyePrice: React.FC<Props> = ({ pyePriceUsd, color = "textSubtle" }) => {
  return pyePriceUsd ? (
    <PriceLink
      href="/swap?outputCurrency=0x853FCf1e9CAd2FAE2150621D583c98dc5f8748f3"
      target="_blank"
    >
      <PyeRoundIcon width="24px" mr="8px" />
      <Text color={color} bold>{`$${pyePriceUsd.toFixed(3)}`}</Text>
    </PriceLink>
  ) : (
    <Skeleton width={80} height={24} />
  );
};

export default React.memo(PyePrice);
