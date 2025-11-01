import { siteContent } from '@/config/siteContent';

interface LogoMarkProps {
  size?: number;
}

export function LogoMark({ size = 56 }: LogoMarkProps) {
  return (
    <img
      src={siteContent.branding.logoUrl}
      alt={siteContent.branding.title}
      style={{ width: size, height: size }}
      className="select-none"
      draggable={false}
    />
  );
}
