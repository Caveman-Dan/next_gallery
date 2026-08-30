"use client"

import { revalidateGalleryCache } from "@/lib/serverActions"
import Button from "@/ui/components/Button/Button"
import { REVALIDATION_TAGS } from "@/lib/apiConfig"

const Temp = () => {

  const triggerRevalildate = async () => {
    const result = await revalidateGalleryCache([REVALIDATION_TAGS.galleryData, REVALIDATION_TAGS.albums]);
    console.log('RESULT', result);
  }

  return (
    <Button
      onClick={triggerRevalildate}
      style={{
        display: 'flex',
        justifyContent: 'center',
        height: '5rem',
        width: '15rem',
        margin: '15em auto'
      }}
    >REVALIDATE CACHE</Button>
  );
}

export default Temp;