import { InputHTMLAttributes } from "react";
import styled from "styled-components";
import Text from "../Text/Text";

interface SliderLabelProps {
  progress: string;
}

interface StyledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isMax: boolean;
}

interface DisabledProp {
  disabled?: boolean;
}

const getCursorStyle = ({ disabled = false }: DisabledProp) => {
  return disabled ? "not-allowed" : "cursor";
};

export const SliderLabelContainer = styled.div`
  bottom: 0;
  position: absolute;
  left: 14px;
  width: calc(100% - 30px);
`;

export const SliderLabel = styled(Text)<SliderLabelProps>`
  bottom: 0;
  font-size: 12px;
  left: ${({ progress }) => progress};
  position: absolute;
  text-align: center;
  min-width: 24px; // Slider thumb size
`;

export const BunnySlider = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledInput = styled.input<StyledInputProps>`
  cursor: ${getCursorStyle};
  height: 32px;
  position: relative;
  
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 100%;
    border: none;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.primary};

    &:hover,
    &:focus {
      background-color: ${({ theme }) => theme.colors.primaryDark};
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-moz-range-thumb {
    height: 20px;
    width: 20px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 100%;
    border: none;
    color: ${({ theme }) => theme.colors.primary};

    &:hover,
    &:focus {
      background-color: ${({ theme }) => theme.colors.primaryDark};
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-ms-thumb {
    height: 20px;
    width: 20px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 100%;
    color: ${({ theme }) => theme.colors.primary};

    &:hover,
    &:focus {
      background-color: ${({ theme }) => theme.colors.primaryDark};
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.06),
        0px 24px 32px rgba(0, 0, 0, 0.04);
    }
  }

  &::-webkit-slider-runnable-track {
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.primary},
      ${({ theme }) => theme.colors.primary} ${({ value }) => value}%,
      ${({ theme }) => theme.colors.cardBack}60 ${({ value }) => value}%,
      ${({ theme }) => theme.colors.cardBack}60
    );
    height: 2px;
  }

  &::-moz-range-track {
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.primary},
      ${({ theme }) => theme.colors.primary} ${({ value }) => value}%,
      ${({ theme }) => theme.colors.cardBack}60 ${({ value }) => value}%,
      ${({ theme }) => theme.colors.cardBack}60
    );
    height: 2px;
  }

  &::-ms-track {
    width: 100%;
    border-color: transparent;
    color: transparent;

    background: transparent;
    height: 2px;
  }
  &::-ms-fill-lower {
    background: ${({ theme }) => theme.colors.textSubtle};
  }
  &::-ms-fill-upper {
    background: ${({ theme }) => theme.colors.primary};
  }

`;
