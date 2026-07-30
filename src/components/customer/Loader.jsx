import { Loader2 } from "lucide-react";

export default function Loader({ size = 32, className = "" }) {
  return (
    <div
      className={`flex min-h-[50vh] items-center justify-center ${className}`}
    >
      <Loader2
        size={size}
        className="animate-spin text-accent"
        strokeWidth={1.5}
      />
    </div>
  );
}