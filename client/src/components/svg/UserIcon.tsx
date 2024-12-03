import { cn } from '~/utils';

type UserIconProps = {
  className?: string;
};

export default function UserIcon({ className = '' }: UserIconProps) {
  return (
      <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn('icon-md h-4 w-4', className)}
          height="1em"
          width="1em"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
  );
}
