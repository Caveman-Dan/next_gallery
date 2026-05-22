import { useMountAnimationContext } from "./MountAnimationContextProvider";

type AnimatedLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string; // href is required
  children: React.ReactNode;
};

const AnimatedLink = ({ children, href, ...props }: AnimatedLinkProps) => {
  const { closePage } = useMountAnimationContext();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    closePage(href);
  };

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
};

export default AnimatedLink;
