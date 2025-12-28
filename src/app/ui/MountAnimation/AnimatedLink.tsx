import { useMountAnimationContext } from "./MountAnimation";

type AnimatedLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string; // href is required
  children: React.ReactNode;
};

const AnimatedLink = ({ children, href, ...props }: AnimatedLinkProps) => {
  const { closePage } = useMountAnimationContext();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closePage(href);
  };

  return (
    <a onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default AnimatedLink;
