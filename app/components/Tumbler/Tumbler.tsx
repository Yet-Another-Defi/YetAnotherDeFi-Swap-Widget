import React from 'react';
import styled from 'styled-components';
import clsx from 'clsx';

const StyledSpan = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  transition: 0.4s;
  &:before {
    content: '';
    position: absolute;
    height: 20px;
    width: 20px;
    top: 1px;
    bottom: 1px;
    left: 1px;
    transition: 0.4s;
  }
`;

const StyledInput = styled.input`
  width: 0;
  height: 0;
  opacity: 0;
  &:checked + span:before {
    transform: translateX(16px);
  }
`;

interface Props {
  modes: {
    value: string;
    title: string;
  }[];
  onChange: (value: string) => void;
  checked: boolean;
}

export function Tumbler({ modes, checked, onChange }: Props) {
  const [firstMode, secondMode] = modes;

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.currentTarget.checked ? secondMode.value : firstMode.value);
  };

  return (
    <div className="text-sm font-medium flex items-center">
      <span className="mr-2.5">{firstMode.title}</span>
      <label className="relative inline-block w-10 h-6 box-border">
        <StyledInput
          type="checkbox"
          className="w-0 h-0 opacity-0"
          onChange={inputHandler}
          checked={checked}
        />
        <StyledSpan
          className={clsx(
            'rounded-xl before:rounded-[50%] border border-gray bg-white before:bg-black',
            'dark:border-graySecondary dark:bg-black dark:before:bg-white'
          )}
        />
      </label>
      <span className="ml-2.5">{secondMode.title}</span>
    </div>
  );
}
