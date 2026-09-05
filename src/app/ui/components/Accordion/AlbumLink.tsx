"use client";

import Link from "next/link";
import { capitalise } from "@/lib/helpers";
import DirectionalArrow from "@/ui/components/DirectionalArrow/DirectionalArrow";
import styles from "./Accordion.module.scss";
import type { EntryDetails } from "./types";
import { useAnimatedComponent } from "@/ui/components/AnimatedComponent/AnimatedComponent";
import { useAccordionState } from "./AccordionContext";

interface AlbumLinkProps {
  name: string;
  href: string;
  isSelected: boolean;
  isRootItem: boolean;
  entryDetails: EntryDetails;
  onOpen: (details: EntryDetails) => void;
  onSelect: (options?: { skipHistory?: boolean }) => void;
}

const AlbumLink = ({ name, href, isSelected, isRootItem, entryDetails, onOpen, onSelect }: AlbumLinkProps) => {
  const { isViewingImage } = useAccordionState();
  const { push } = useAnimatedComponent();

  const isCurrentAlbum = isSelected && !isViewingImage;

  const handleClick = (event) => {
    event.preventDefault();
    if (isCurrentAlbum) return;
    onOpen(entryDetails);
    onSelect({ skipHistory: true });
    push(href);
  };

  return (
    <Link
      className={`${styles.link}${isSelected ? ` ${styles.selectedAlbum}` : ""}${isRootItem ? " baseItem" : ""}`}
      onClick={handleClick}
      href={href}
    >
      {capitalise(name)}
      <DirectionalArrow direction="right" height="28px" colour={"var(--highlight-colour-alternate4)"} />
    </Link>
  );
};

export default AlbumLink;
