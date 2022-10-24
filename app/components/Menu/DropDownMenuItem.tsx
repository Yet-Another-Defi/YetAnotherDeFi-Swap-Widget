import { Link, useLocation } from '@remix-run/react';

interface Props {
  linkUrl: string;
  content: React.ReactNode;
}

export function DropDownMenuItem({ linkUrl, content }: Props) {
  const location = useLocation();

  if (location.pathname === linkUrl) {
    return <div className="flex px-3 py-1 text-black">{content}</div>;
  }

  return (
    <Link
      to={linkUrl}
      className="flex cursor-pointer items-center rounded-full px-3 py-1 hover:bg-[#E7F8FF] hover:text-lightBlue"
    >
      {content}
    </Link>
  );
}
