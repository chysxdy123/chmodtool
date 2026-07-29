type AdSlotProps = {
  name: string;
  className?: string;
};

export function AdSlot({ name, className = '' }: AdSlotProps) {
  return <div className={className} data-ad-slot={name} aria-hidden="true" />;
}
