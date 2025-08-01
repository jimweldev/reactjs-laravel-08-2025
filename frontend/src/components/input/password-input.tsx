import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

const PasswordInput = ({ ...props }) => {
  const [isTypePassword, setIsTypePassword] = useState(true);

  return (
    <div className="relative">
      <Input
        className="pr-8"
        type={isTypePassword ? 'password' : 'text'}
        {...props}
      />
      <button onClick={() => setIsTypePassword(!isTypePassword)}>
        {isTypePassword ? (
          <FaEye
            className={cn(
              'text-primary absolute top-1/2 -translate-y-1/2',
              props.inputSize === 'sm' && 'right-3 text-xs',
              props.inputSize === 'lg' && 'right-2.5',
              (props.inputSize === 'default' ||
                props.inputSize === undefined) &&
                'right-2.5 text-sm',
            )}
          />
        ) : (
          <FaEyeSlash
            className={cn(
              'text-primary absolute top-1/2 -translate-y-1/2',
              props.inputSize === 'sm' && 'right-3 text-xs',
              props.inputSize === 'lg' && 'right-2.5',
              (props.inputSize === 'default' ||
                props.inputSize === undefined) &&
                'right-2.5 text-sm',
            )}
          />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
