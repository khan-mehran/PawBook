import React from 'react';

interface AvatarRingProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  active?: boolean;
  viewed?: boolean;
  onClick?: () => void;
  className?: string;
}

const AvatarRing: React.FC<AvatarRingProps> = ({
  src,
  alt,
  size = 'md',
  active = false,
  viewed = false,
  onClick,
  className = '',
}) => {
  const sizeMap = {
    sm: { outer: 'w-12 h-12', inner: 'w-10 h-10', pad: 'p-[2px]' },
    md: { outer: 'w-16 h-16', inner: 'w-14 h-14', pad: 'p-[2px]' },
    lg: { outer: 'w-20 h-20', inner: 'w-[72px] h-[72px]', pad: 'p-[3px]' },
    xl: { outer: 'w-28 h-28', inner: 'w-24 h-24', pad: 'p-[3px]' },
  };

  const { outer, inner, pad } = sizeMap[size];

  return (
    <div
      className={`${outer} rounded-full flex items-center justify-center flex-shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div
        className={`
          ${outer} ${pad} rounded-full flex items-center justify-center
          ${active ? 'story-ring-active' : viewed ? 'story-ring-viewed' : 'bg-gradient-to-tr from-orange-500 via-violet-500 to-teal-400'}
        `}
      >
        <div className={`${inner} rounded-full border-2 border-[var(--pb-ring-border)] overflow-hidden`}>
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=FF6B35&color=fff`;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AvatarRing;
