import { CloseIcon } from '~/components/Icon/CloseIcon';

interface Props {
  closeSelect: () => void;
  children: React.ReactNode;
}

export function TitleClose({ closeSelect, children }: Props) {
  return (
    <div className="mb-4 flex justify-between">
      <div className="text-sm">{children}</div>
      <button onClick={closeSelect}>
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
