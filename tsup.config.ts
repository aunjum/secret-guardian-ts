import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/postinstall.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  clean: true,
  outDir: "dist",
  target: "node18",
  shims: false,
  outExtension({ format }) {
    return {
      js: format === "cjs" ? ".cjs" : ".js",
    };
  },
  banner: {
    js: "#!/usr/bin/env node",
  },
});
