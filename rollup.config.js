import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import copy from 'rollup-plugin-copy';
import json from 'rollup-plugin-json';
import del from 'rollup-plugin-delete';
import multiInput from 'rollup-plugin-multi-input';
import autoprefixer from 'autoprefixer';


const packageJson = require("./package.json");

const config = {
  input: [
    "src/**/*.ts"
  ], 
  output: [
    {
      dir: 'build',
      format: "cjs",
      sourcemap: true
    },
    /*
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true
    }
    */
  ],
  plugins: [
    del({
      targets: 'build/*'
    }),
    multiInput({ relative: 'src/'}),
    peerDepsExternal(),
    resolve({ browser: true }),
    commonjs(),
    json(),
    typescript({
      useTsconfigDeclarationDir: true
    }),
    postcss({
      modules: true,
      plugins: [
        autoprefixer(),
      ]
    }),
    copy({
      targets: [
        { src: 'src/scss/*', dest: 'build/scss' },
      ]
    })
  ]
};

export default config;
