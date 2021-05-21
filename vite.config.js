import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import styleImport from 'vite-plugin-style-import'

const pathResolve = (pathUrl) => path.join(__dirname, pathUrl)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx({}),
    styleImport({
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => `ant-design-vue/es/${name}/style/index`
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@src': pathResolve('src'),
      '@components': pathResolve('src/components'),
      '@views': pathResolve('src/views'),
      '@layout': pathResolve('src/layout'),
      '@config': pathResolve('src/config'),
      '@utils': pathResolve('src/utils'),
      '@store': pathResolve('src/store')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {},
        javascriptEnabled: true
      },
      scss: {
        additionalData: '@import "./src/styles/global.scss";'
      }
    }
  },
  server: {
    port: 8888
  },
  optimizeDeps: {
    include: [
      '@ant-design/icons-vue',
      'ant-design-vue/es/locale/zh_CN',
      'ant-design-vue/es/locale/en_US',
      'lodash',
      'dayjs'
    ],
    exclude: []
  },
  build: {
    lib: {
      entry: '',
      name: 'mars',
      formats: ['es', 'cjs', 'iife', 'umd'],
      fileName: 'mars-library'
    },
    terserOptions: {
      compress: {
        keep_infinity: true,
        drop_console: true
      }
    }
  }
})
