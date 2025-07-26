import {
  Tooltip as ToolTip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/tooltip';

type TooltipProps = {
  children: React.ReactNode;
  content: string;
  delayDuration?: number;
};

const Tooltip = ({ children, content, delayDuration = 500 }: TooltipProps) => {
  return (
    <ToolTip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </ToolTip>
  );
};

export default Tooltip;
