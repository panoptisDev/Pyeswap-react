import React from "react";
import styled, { keyframes } from "styled-components";
import { SpinnerProps } from "./types";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const SpinnerImg = styled.svg<{ size: number | undefined }>`
  animation: 2s ${rotate} linear infinite;
  height: ${({ size }) => `${size || '16'}px`};
  width: ${({ size }) => `${size || '16'}px`};
`

const Container = styled.div`
  position: relative;
`;


const Spinner: React.FC<SpinnerProps> = ({ size = 128, color = "" }) => {
  return (
    <Container>
      <SpinnerImg size={size} viewBox="0 0 94 94" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M92 47C92 22.1472 71.8528 2 47 2C22.1472 2 2 22.1472 2 47C2 71.8528 22.1472 92 47 92" stroke={color || "#EC649C"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </SpinnerImg>
    </Container>
  );
};

export default Spinner;
