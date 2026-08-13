import type { ReactNode } from "react";
import { content as howToCompressVideo } from "./how-to-compress-video";
import { content as howToBuildAResume } from "./how-to-build-a-resume";
import { content as howToConvertPdfToWord } from "./how-to-convert-pdf-to-word";
import { content as howToConvertTextToSpeech } from "./how-to-convert-text-to-speech";
import { content as howToConvertVideoToGif } from "./how-to-convert-video-to-gif";
import { content as howToCreateDigitalSignature } from "./how-to-create-digital-signature";
import { content as howToExtractTextFromImages } from "./how-to-extract-text-from-images";
import { content as howToMakeMemes } from "./how-to-make-memes";
import { content as howToRecordYourScreen } from "./how-to-record-your-screen";
import { content as howToUpscaleImages } from "./how-to-upscale-images";

export type LocaleKey = "en" | "zh" | "ja" | "ko";

export interface FAQ {
  question: string;
  answer: string;
}

export interface BlogContent {
  en: ReactNode;
  zh: ReactNode;
  ja: ReactNode;
  ko: ReactNode;
  faqs: Record<LocaleKey, FAQ[]>;
}

export const blogContent: Record<string, BlogContent> = {
  "how-to-compress-video": howToCompressVideo,
  "how-to-build-a-resume": howToBuildAResume,
  "how-to-convert-pdf-to-word": howToConvertPdfToWord,
  "how-to-convert-text-to-speech": howToConvertTextToSpeech,
  "how-to-convert-video-to-gif": howToConvertVideoToGif,
  "how-to-create-digital-signature": howToCreateDigitalSignature,
  "how-to-extract-text-from-images": howToExtractTextFromImages,
  "how-to-make-memes": howToMakeMemes,
  "how-to-record-your-screen": howToRecordYourScreen,
  "how-to-upscale-images": howToUpscaleImages,
};
