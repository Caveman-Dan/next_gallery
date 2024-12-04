import styles from "./Ripple.module.scss";

const handleRipple = (event: React.MouseEvent<HTMLDivElement>) => {
  const element = event.currentTarget;
  element?.classList.add(styles.root);

  const circle = document.createElement("span");
  const diameter = Math.max(element.clientWidth, element.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - (element.offsetLeft + radius)}px`;
  circle.style.top = `${event.clientY - (element.offsetTop + radius)}px`;
  circle.classList.add(styles.ripple);
  circle.setAttribute("id", "ripple");

  const ripple = document.getElementsByClassName(styles.ripple)[0];

  if (ripple) {
    ripple.remove();
  }

  element.appendChild(circle);
};

export default handleRipple;
