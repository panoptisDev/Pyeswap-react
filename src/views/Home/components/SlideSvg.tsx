import React from 'react'
import { Svg, SvgProps } from 'uikit'

export const SlideSvgLight: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 1660 339" {...props}>
      <path
        d="M804 167.023C520.5 167.023 267.5 290.522 0 304.5V339H1660V0.5C1358.83 0.5 1104 167.023 804 167.023Z"
        fill="url(#img1)"
      />
      <defs>
      <pattern id="img1" patternUnits="userSpaceOnUse" width="100" height="100">
        <image href="./pye_old.png" x="0" y="0" width="100" height="100" />
      </pattern>
        {/* <linearGradient id="paint0_linear_light" x1="830" y1="84" x2="830" y2="339" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="1" />
          <stop offset="0.566389" stopColor="white" stopOpacity="1" />
          <stop offset="1" stopColor="#F6F4F0" />
        </linearGradient> */}
      </defs>
    </Svg>
  )
}

export const SlideSvgDark: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 1660 339" {...props}>
      <path
        d="M804 166.523C520.5 166.523 267.5 290.022 0 304V338.5H1660V0C1358.83 0 1104 166.523 804 166.523Z"
        fill="#0C101C"
      />
    </Svg>
  )
}
