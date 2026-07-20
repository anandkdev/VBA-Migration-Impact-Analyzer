import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  fullScreen?: boolean;
  className?: string;
  text?: string;
}

export function Loader({ fullScreen = false, className, text = 'Loading...' }: LoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full blur-xl bg-primary/30 animate-pulse" />
        
        {/* Inner spinner */}
        <div className="relative bg-background p-4 rounded-full shadow-lg border border-border/50">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
      
      {text && (
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm", className)}>
        {content}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center w-full h-full min-h-[200px]", className)}>
      {content}
    </div>
  );
}
