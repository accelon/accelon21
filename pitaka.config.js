import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

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
    input: "../pitaka/index.js",
    output: {
      sourcemap: !production,
      format: "iife",
      name: "app",
      file: "pitaka.js",
    },
    plugins: [
      resolve({ browser: true}),
      commonjs(),
      // !production && !chrome_extension && serve(),
      // !production && !chrome_extension && livereload("public"),
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  }
];
