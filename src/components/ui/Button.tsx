import { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cva, VariantProps } from 'class-variance-authority';
import { getClassNames } from '@/lib/utils';

const buttonVariants = cva(
  'active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-white hover:bg-slate-800',
        ghost: 'bg-transparent hover:text-slate-900 hover:bg-slate-200',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-2',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = ({
  className,
  children,
  variant,
  size,
  disabled,
  isLoading,
  ...props
}: ButtonProps) => {
  const classNames = getClassNames(
    buttonVariants({ variant, size, className })
  );
  // console.log(classNames, 'classNames');
  // console.log(buttonVariants({ variant, size, className }));
  return (
    <button className={classNames} disabled={isLoading} {...props}>
      {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : children}
    </button>
  );
};

export default Button;
