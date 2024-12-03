import { cn } from '~/utils';

type LockIconProps = {
  className?: string;
};

export default function LockIcon({ className = '' }: LockIconProps) {
  return (
      <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("lucide lucide-lock", className)}
          height="1em"
          width="1em"
      >
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
  );
}
