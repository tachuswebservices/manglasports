
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
import { cn } from "@/lib/utils"

const AspectRatio = ({
  ratio = 16 / 9,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> & {
  className?: string
}) => (
  <AspectRatioPrimitive.Root
    ratio={ratio}
    className={cn(className)}
    {...props}
  />
)

export { AspectRatio }
