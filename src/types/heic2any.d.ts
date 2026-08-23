declare module "heic2any" {
  interface Heic2AnyOptions {
    blob: Blob;
    toType?: "image/jpeg" | "image/png";
    quality?: number;
    multiple?: boolean;
  }
  export default function heic2any(
    input: Blob | Heic2AnyOptions
  ): Promise<Blob | Blob[]>;
}
