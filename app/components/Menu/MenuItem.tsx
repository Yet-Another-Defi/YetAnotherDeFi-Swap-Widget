import { useMemo, useRef, useState } from 'react';
import { NavLink, useLocation, useParams } from '@remix-run/react';
import styled from 'styled-components';

import { useClickOutside } from '~/hooks';
import { ArrowIcon } from '~/components/Icon/ArrowIcon';
import { DropDownMenu } from './DropDownMenu';
import { useUiSettings } from '~/UiProvider';

interface Page {
  label: string;
  url: string;
  subpages?: Page[];
}

interface Props {
  page: Page;
  onClick?: () => void;
}

const StyledNavLink = styled(NavLink)<{ $isActive: boolean; $isMainPageInDarkTheme: boolean }>`
  position: relative;
  overflow: hidden;

  &:after {
    content: '';
    position: absolute;
    z-index: -1;
    right: 0;
    width: ${({ $isActive }) => ($isActive ? '100%' : '0')};
    bottom: -5px;
    background: ${(props) =>
      props.$isMainPageInDarkTheme ? props.theme.colors.white : props.theme.colors.black};
    height: 2px;
    transition: width 0.3s ease-out;
  }

  &:hover:after,
  &:focus:after,
  &:active:after {
    left: 0;
    right: auto;
    width: 100%;
  }
`;

export function MenuItem({ page, onClick }: Props): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const location = useLocation();

  const { from, to } = useParams();

  const { isLightTheme } = useUiSettings();

  const isMainPageInDarkTheme = !!from && !!to && !isLightTheme;

  const hasSubMenu = !!page.subpages?.length;
  const subpages = page.subpages;

  const click = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((isOpen) => !isOpen);
  };

  const close = () => {
    setOpen(false);
  };

  const dropDownLinks = useMemo(
    () =>
      subpages?.map((sub) => ({
        linkUrl: `${page.url}${sub.url}`,
        content: (
          <div className="shrink-0 whitespace-nowrap text-sm uppercase leading-tight">
            {sub.label}
          </div>
        ),
      })),
    [subpages, page]
  );

  useClickOutside(ref, close);

  return (
    <div className="relative mt-6 ml-7 first:ml-0 md:mt-0" ref={ref}>
      <StyledNavLink
        to={page.url}
        onClick={hasSubMenu ? click : onClick}
        style={{ pointerEvents: hasSubMenu || location.pathname !== page.url ? 'auto' : 'none' }}
        className="font-sans text-xs font-semibold tracking-wider"
        $isActive={location.pathname === page.url}
        $isMainPageInDarkTheme={isMainPageInDarkTheme}
      >
        {page.label}
        {hasSubMenu && <ArrowIcon className="ml-2 h-2 w-2" />}
      </StyledNavLink>
      {open && dropDownLinks && <DropDownMenu list={dropDownLinks} />}
    </div>
  );
}
