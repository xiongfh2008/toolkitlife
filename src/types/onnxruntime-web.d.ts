/**
 * onnxruntime-web 1.21.0 ships types.d.ts but does not export it via the
 * package.json "exports" map, so bundler module resolution cannot find it.
 * Bridge to the underlying onnxruntime-common type definitions instead.
 */
declare module "onnxruntime-web" {
  export * from "onnxruntime-common";
}
