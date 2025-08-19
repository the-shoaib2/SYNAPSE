interface SynapseSignetProps {
  size?: number; // One prop for both width & height
  className?: string;
  title?: string; // Optional tooltip / accessibility
}

export default function SynapseSignet({
  size = 32,
  className = "",
  title = "Synapse signet",
}: SynapseSignetProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 31 31"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={title}
    >
      {title && <title>{title}</title>}
      <path
        d="M3.5 0h24a3.5 3.5 0 0 1 0 7h-24a3.5 3.5 0 0 1 0-7M24 21.5a2.5 2.5 0 0 0-2.5-2.5h-18a3.5 3.5 0 0 1 0-7H25a6 6 0 0 1 6 6v7a6 6 0 0 1-6 6H3.5a3.5 3.5 0 0 1 0-7h18a2.5 2.5 0 0 0 2.5-2.5"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
