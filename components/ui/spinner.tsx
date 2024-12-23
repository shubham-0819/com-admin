import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={cn("animate-spin", className)}
      {...props}
    >
      <path
        d="M12 3C16.9706 3 21 7.02944 21 12"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
} 