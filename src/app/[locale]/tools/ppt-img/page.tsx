"use client";

import ArchiveImageExtractor from "@/components/ArchiveImageExtractor";

export default function PptImgPage() {
  return (
    <ArchiveImageExtractor
      slug="ppt-img"
      mediaFolder="ppt/media"
      accept=".pptx,.pptm"
      dropIcon="📽️"
    />
  );
}
