import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline';
}

export function Badge({ children, variant = 'default', className = '', ...props }: BadgeProps) {
  const variantClasses = {
    default: 'bg-purple-600 text-white',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

