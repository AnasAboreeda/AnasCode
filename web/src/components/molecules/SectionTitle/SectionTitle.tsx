import { cn } from '@/lib/utils';

interface SectionTitleProps {
  // New simplified API
  title?: string;
  description?: string;
  // Legacy API for backward compatibility
  sectionShortTitle?: string;
  sectionLongTitle?: string;
  sectionDescription?: string;
  className?: string;
}

export default function SectionTitle({
  title,
  description,
  sectionShortTitle,
  sectionLongTitle,
  sectionDescription,
  className,
}: SectionTitleProps) {
  // Support both old and new prop names
  const displayTitle = title || sectionLongTitle || '';
  const displayDescription = description || sectionDescription;
  const displaySubtitle = sectionShortTitle;

  return (
    <div className={cn('mb-12 text-center', className)}>
      {displaySubtitle && (
        <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-2">
          {displaySubtitle}
        </p>
      )}
      <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {displayTitle}
      </h2>
      {displayDescription && (
        <p className="mt-4 text-balance text-lg text-muted-foreground">
          {displayDescription}
        </p>
      )}
    </div>
  );
}
