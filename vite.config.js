import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import styleImport from 'vite-plugin-style-import'
import html from 'vite-plugin-html'
import { viteMockServe } from 'vite-plugin-mock'
import setting from './src/config'

// https://vitejs.dev/config/
export default ({ mode }) => {
  let build = {}
  if (mode === 'lib') {
    build = {
      lib: {
        entry: path.resolve(__dirname, 'src/entry.js'),
        name: 'MarsLibrary',
        formats: ['es', 'cjs', 'umd']
      },
      rollupOptions: {
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
          'xe-utils',
          'lodash',
          'moment',
          'nprogress'
        ]
      }
    }
  }
  return {
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
      }),
      viteMockServe({
        mockPath: 'src/mock',
        supportTs: false
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
        '@src': path.resolve(__dirname, 'src'),
        '@views': path.resolve(__dirname, 'src/views'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@store': path.resolve(__dirname, 'src/store')
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
      port: 8888,
      open: true
    },
    optimizeDeps: {
      include: [
        'ant-design-vue/es/locale/zh_CN',
        'moment/dist/locale/zh-cn',
        'ant-design-vue/es/locale/en_US',
        'moment/dist/locale/eu'
      ],
      exclude: []
    },
    build: {
      ...build,
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: true
        }
      }
    }
  }
}
