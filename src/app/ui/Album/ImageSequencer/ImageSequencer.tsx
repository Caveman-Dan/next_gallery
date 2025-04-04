import ImageRow from "../ImageRow/ImageRow";

import { ImageDetails } from "@/definitions/definitions";

const settings = {
  approxRowHeight: 400,
  spacing: 6,
};

const justifyRows = ({ images, settings, containerWidth }) => {
  const { approxRowHeight, spacing } = settings;

  const rows = [];
  let newRow = [];
  let accumulativeWidth = 0;
  let space = 0;

  images.forEach((image, index) => {
    const { width, height } = image.details;
    accumulativeWidth += (width / height) * approxRowHeight;
    space += spacing;
    newRow.push(image);

    if (accumulativeWidth >= containerWidth - (space - spacing)) {
      const newHeight = (approxRowHeight / accumulativeWidth) * (containerWidth - (space - spacing));
      rows.push({
        rowHeight: newHeight,
        spacing,
        images: newRow,
      });

      newRow = [];
      accumulativeWidth = 0;
      space = 0;
    }

    if (index === images.length - 1 && newRow.length) {
      rows.push({
        rowHeight: approxRowHeight,
        spacing,
        images: newRow,
      });
    }
  });

  return rows;
};

const ImageSequencer = ({
  images,
  albumPath,
  containerWidth,
}: {
  images: ImageDetails[];
  albumPath: string;
  containerWidth: number | undefined;
}) => {
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
