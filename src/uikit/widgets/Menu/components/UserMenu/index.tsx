import React, { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import {Wallet} from "react-iconly";
import styled from "styled-components";
import { Box, Flex } from "../../../../components/Box";
import { ChevronDownIcon } from "../../../../components/Svg";
import { UserMenuProps, variants } from "./types";
import { UserMenuItem } from "./styles";
import {Button} from "../../../../components/Button";
import {Text} from "../../../../components/Text";
import {useMatchBreakpoints} from "../../../../hooks";

export const StyledUserMenu = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.tertiary};
  border-radius: 16px;
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: inline-flex;
  height: 32px;
  padding-left: 40px;
  padding-right: 8px;
  position: relative;

  &:hover {
    opacity: 0.65;
  }
`;

export const LabelText = styled.div`
  color: ${({ theme }) => theme.colors.text};
  display: none;
  font-weight: 600;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
    margin-left: 8px;
    margin-right: 4px;
  }
`;

const Menu = styled.div<{ isOpen: boolean }>`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  pointer-events: auto;
  width: calc(100% - 40px);
  visibility: visible;
  z-index: 1001;
  box-shadow: ${({ theme }) => theme.shadows.level1};
  overflow: hidden;
  margin-top: 12px;

  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: 200px;
    margin: 0;
  }

  ${({ isOpen }) =>
          !isOpen &&
          `
    pointer-events: none;
    visibility: hidden;
  `}

  ${UserMenuItem}:first-child {
    border-radius: 12px 12px 0 0;
  }

  ${UserMenuItem}:last-child {
    border-radius: 0 0 12px 12px;
  }
`;

const UserMenu: React.FC<UserMenuProps> = ({
  account,
  text,
  avatarSrc,
  variant = variants.DEFAULT,
  children,
  ...props
}) => {
  const { isDesktop } = useMatchBreakpoints()
  const [isOpen, setIsOpen] = useState(false);
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null);
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null);
  const accountEllipsis = account ? `${account.substring(0, 2)}...${account.substring(account.length - 4)}` : null;
  const { styles, attributes } = usePopper(targetRef, tooltipRef, {
    strategy: "fixed",
    placement: "bottom-end",
    modifiers: [{ name: "offset", options: { offset: [0, 0] } }],
  });

  useEffect(() => {
    const showDropdownMenu = () => {
      setIsOpen(true);
    };

    const hideDropdownMenu = (evt: MouseEvent | TouchEvent) => {
      const target = evt.target as Node;
      if (target && !tooltipRef?.contains(target)) {
        setIsOpen(false);
        evt.stopPropagation();
      }
    };

    targetRef?.addEventListener("mouseenter", showDropdownMenu);
    targetRef?.addEventListener("mouseleave", hideDropdownMenu);

    return () => {
      targetRef?.removeEventListener("mouseenter", showDropdownMenu);
      targetRef?.removeEventListener("mouseleave", hideDropdownMenu);
    };
  }, [targetRef, tooltipRef, setIsOpen]);

  return (
    <Flex alignItems={isDesktop ? 'center' : 'stretch'} height="100%" flexDirection={isDesktop ? 'row' : 'column'} ref={setTargetRef} {...props}>
      <Button
        scale={isDesktop ? 'sm' : "md"}
        variant='primary'
        onClick={() => {
          setIsOpen((s) => !s);
        }}

        startIcon={<Wallet set="bulk" primaryColor="#fff"/>}
      >

        <Text color='white' fontSize='13px' ml='10px' mr='16px' bold title={text || account}>{text || accountEllipsis}</Text>
        <ChevronDownIcon color="white" width="24px" />
      </Button>
      <Menu style={styles.popper} ref={setTooltipRef} {...attributes.popper} isOpen={isOpen}>
        <Box onClick={() => setIsOpen(false)}>{children}</Box>
      </Menu>
    </Flex>
  );
};

export default UserMenu;
