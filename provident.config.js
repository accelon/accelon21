import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-only";

const production = !process.env.ROLLUP_WATCH;
const chrome_extension=process.env.CHROME_EXTENSION;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default [
  {
    input: "src/js/provident.js",
    output: {
      sourcemap: !production,
      format: "iife",
      name: "app",
      file: "public/provident.js"
    },
    plugins: [
      svelte({
        compilerOptions: {dev: !production && !chrome_extension},
      }),
      resolve({ browser: true, dedupe: ["svelte"]}),
      css({ output: "provident.css" }),
      commonjs(),
      !production && !chrome_extension && serve(),
      !production && !chrome_extension && livereload("public"),
      production && terser(),
    ],
    watch: {
      clearScreen: false,
      exclude: 'node_modules/**'
    },
  }
];
