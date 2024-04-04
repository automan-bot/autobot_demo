import path from "path";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { builtinModules } from "module";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import alias from "@rollup/plugin-alias";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import { minify } from "rollup-plugin-esbuild";
import { defineConfig } from "rollup";
import pkg from "../package.json";
import { camelCase } from "lodash-es";
import copy from "rollup-plugin-copy";
const libraryName = "app";
//这里的依赖会被打包进生产包内
let whiteListedModules = ["axios", "websocket"];
export default (env = "production") => {
  return defineConfig({
    input: path.join(__dirname, "..", "src", "index.ts"),
    output: {
      file: pkg.main,
      name: camelCase(libraryName),
      format: "umd",
      sourcemap: process.env.NODE_ENV != "production",
    },
    plugins: [
      //环境变量替换
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify(env),
      }),
      //编译过程中copy资源
      copy({
        targets: [
          // { src: 'src/bin/**/*', dest: 'dist/bin' },
        ],
      }),
      // 提供路径和读取别名
      nodeResolve({
        preferBuiltins: true,
        browser: false,
        extensions: [".mjs", ".ts", ".js", ".json", ".node"],
      }),
      commonjs({
        sourceMap: false,
      }),
      //支持json
      json(),
      //支持ts
      typescript(),
      //别名
      alias({
        entries: [{ find: "@", replacement: path.join(__dirname, "../src") }],
      }),
      process.env.NODE_ENV == "production" ? minify() : null,
    ],
    external: [
      ...builtinModules,
      ...Object.keys(pkg.dependencies || {}).filter(
        (d) => !whiteListedModules.includes(d)
      ),
    ],
  });
};
