"use client";

import ArchiveImageExtractor from "@/components/ArchiveImageExtractor";

export default function ExcelImgPage() {
  return (
    <ArchiveImageExtractor
      slug="excel-img"
      mediaFolder="xl/media"
      accept=".xlsx,.xlsm"
      dropIcon="📊"
    />
  );
}
