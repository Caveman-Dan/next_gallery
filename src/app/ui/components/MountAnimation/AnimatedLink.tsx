import { useMountAnimationContext, MountAnimationContextType } from "./MountAnimationContextProvider";

type AnimatedLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string; // href is required
  returnTo?: string | undefined; // optional so store path for later use like to return to current page
  returnIndex?: string | undefined;
  children: React.ReactNode;
};

const AnimatedLink = ({ children, href, returnTo, returnIndex, ...props }: AnimatedLinkProps) => {
  const state: MountAnimationContextType = useMountAnimationContext();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    state.closePage({ redirectPath: href, returnTo, returnIndex });
  };

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
};

export default AnimatedLink;
