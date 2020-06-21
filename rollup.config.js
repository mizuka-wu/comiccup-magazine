import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
export default [
  {
    input: 'src/psd-script.jsx',
    output: {
      file: 'dist/psd-script.jsx',
      format: 'cjs'
    },
    plugins: [resolve(), babel({})]
  }
]
