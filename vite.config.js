import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
// import ViteComponents, { AntDesignVueResolver } from 'vite-plugin-components'
import ViteHtml from 'vite-plugin-html'
import { viteMockServe } from 'vite-plugin-mock'
import path from 'path'
import setting from './src/config'

const config = {
  plugins: [
    vue(),
    vueJsx({}),
    // ViteComponents({
    //   globalComponentsDeclaration: true,
    //   customComponentResolvers: [AntDesignVueResolver()]
    // }),
    ViteHtml({
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
      '@/': path.resolve(__dirname, 'src'),
      '@/src': path.resolve(__dirname, 'src'),
      '@/views': path.resolve(__dirname, 'src/views'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
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
      'moment/dist/locale/eu'
    ],
    exclude: []
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        keep_infinity: true, // 防止 Infinity 被压缩成 1/0
        drop_console: true, // 生产环境去除 console
        drop_debugger: true // 生产环境去除 debugger
      }
    }
  }
}
// https://vitejs.dev/config/
export default ({ mode }) => {
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
          'ant-design-vue': 'ant-design-vue',
          '@ant-design/icons-vue': '@ant-design/icons-vue',
          'vxe-table': 'vxe-table',
          'vue-draggable-next': 'vue-draggable-next',
          'lodash-es': 'lodash-es',
          moment: 'moment'
        }
      },
      external: [
        'vue',
        'ant-design-vue',
        '@ant-design/icons-vue',
        'vxe-table',
        'vue-draggable-next',
        'lodash-es',
        'moment'
      ]
    }
  }

  if (mode === 'development') {
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
