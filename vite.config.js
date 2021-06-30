import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import styleImport from 'vite-plugin-style-import'
import html from 'vite-plugin-html'
import { viteMockServe } from 'vite-plugin-mock'
import path from 'path'
import setting from './src/config'

const config = {
  plugins: [
    vue(),
    vueJsx({}),
    styleImport({
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: name => `ant-design-vue/es/${name}/style/index`
        }
      ]
    }),
    html({
      minify: true,
      inject: {
        injectData: {
          title: setting.title
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@/src': path.resolve(__dirname, 'src'),
      '@/views': path.resolve(__dirname, 'src/views'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/store': path.resolve(__dirname, 'src/store'),
      '@/utils': path.resolve(__dirname, 'src/utils')
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
  optimizeDeps: {
    include: [
      'ant-design-vue/es/locale/zh_CN',
      'moment/dist/locale/zh-cn',
      'ant-design-vue/es/locale/en_US',
      'moment/dist/locale/eu',
      'axios/dist/axios'
    ],
    exclude: []
  },
  build: {
    terserOptions: {
      compress: {
        keep_infinity: true,
        drop_console: true
      }
    }
  }
}
// https://vitejs.dev/config/
export default ({ command, mode }) => {
  const { plugins = [], build = {} } = config

  if (mode === 'lib') {
    build.lib = {
      entry: path.resolve(__dirname, 'src/entry.js'),
      name: 'MarsLibrary',
      formats: ['es', 'cjs', 'umd']
    }
    build.rollupOptions = {
      output: {
        exports: 'named',
        globals: {
          vue: 'vue',
          lodash: 'lodash',
          moment: 'moment',
          '@ant-design/icons-vue': '@ant-design/icons-vue'
        }
      },
      external: [
        'vue',
        'vue-router',
        'vuex',
        'ant-design-vue',
        '@ant-design/icons-vue',
        'vxe-table',
        'axios',
        'lodash',
        'moment',
        'nprogress'
      ]
    }
  }

  if (command === 'serve') {
    config.server = {
      port: 8888,
      open: true
    }
    config.plugins = [
      ...plugins,
      viteMockServe({
        mockPath: 'src/mock',
        supportTs: false
      })
    ]
  }

  if (mode === 'production') {
    config.plugins = [
      ...plugins,
      legacy({
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      })
    ]
  }

  return config
}
