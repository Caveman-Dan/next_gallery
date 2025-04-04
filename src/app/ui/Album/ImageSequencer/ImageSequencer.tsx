import ImageRow from "../ImageRow/ImageRow";

import useWindowSize from "@/hooks/useWindowSize";

import { ImageDetails } from "@/definitions/definitions";
import type { WindowSizeData } from "@/hooks/useWindowSize";

const justifyRows = ({ images, settings, containerWidth }) => {
  const { approxRowHeight, spacing } = settings;

  const rows = [];
  let newRow = [];
  let accumulativeWidth = 0;

  images.forEach((image, index) => {
    const { width, height } = image.details;
    accumulativeWidth += (width / height) * approxRowHeight + spacing;
    newRow.push(image);

    if (accumulativeWidth - spacing >= containerWidth) {
      accumulativeWidth -= spacing;
      const newHeight = (approxRowHeight / accumulativeWidth) * containerWidth;
      rows.push({
        rowHeight: newHeight,
        spacing,
        images: newRow,
      });

      newRow = [];
      accumulativeWidth = 0;
    }

    if (index === images.length - 1) {
      rows.push({
        rowHeight: approxRowHeight,
        spacing,
        images: newRow,
      });
    }
  });

  return rows;
};

const determineSettings = (containerHeight: number | undefined, windowSize: WindowSizeData) => {
  const MIN_NUM_OF_ROWS = 2;
  const MIN_ROW_HEIGHT = 125;
  const SPACING = 6;
  let rowHeight;

  switch (true) {
    case windowSize.belowSm:
      rowHeight = 125;
      break;
    case windowSize.aboveSm && windowSize.belowXl:
      rowHeight = 200;
      break;
    default:
      rowHeight = 250;
  }

  // Adjust for extremely wide and short windows
  const approxRowHeight =
    (rowHeight + SPACING) * MIN_NUM_OF_ROWS > (containerHeight as number)
      ? ((containerHeight as number) - SPACING) / MIN_NUM_OF_ROWS
      : rowHeight;

  return {
    approxRowHeight: approxRowHeight < MIN_ROW_HEIGHT ? MIN_ROW_HEIGHT : approxRowHeight,
    spacing: SPACING,
  };
};

const ImageSequencer = ({
  images,
  albumPath,
  containerWidth,
  containerHeight,
}: {
  images: ImageDetails[];
  albumPath: string;
  containerWidth: number | undefined;
  containerHeight: number | undefined;
}) => {
  const windowSize = useWindowSize();
  const settings = determineSettings(containerHeight, windowSize);

  if (!images) return null;

  const rows = justifyRows({ images, settings, containerWidth });

  return (
    <>
      {rows.map((row, index) => (
        <ImageRow row={row} albumPath={albumPath} key={index} />
      ))}
    </>
  );
};

export default ImageSequencer;
