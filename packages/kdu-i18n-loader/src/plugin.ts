;(async () => {
  try {
    await import('kdu-i18n')
  } catch (e) {
    throw new Error(
      '@kdu-i18n/kdu-i18n-loader requires kdu-i18n to be present in the dependency tree.'
    )
  }
})()

import webpack from 'webpack'

declare class KduI18nKduPlugin {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(optoins: Record<string, any>)
  apply(compiler: webpack.Compiler): void
}

let Plugin: typeof KduI18nKduPlugin

console.warn(
  `[@kdu-i18n/kdu-i18n-loader] KduI18nKduPlugin is experimental! This plugin is used for Kdu I18n Devtools. Don't use this plugin to enhancement Component options of your application.`
)
// console.log('[@kdu-i18n/kdu-i18n-loader] webpack version:', webpack.version)

if (webpack.version && webpack.version[0] > '4') {
  // webpack5 and upper
  Plugin = require('./pluginWebpack5').default // eslint-disable-line @typescript-eslint/no-var-requires
} else {
  // webpack4 and lower
  Plugin = require('./pluginWebpack4').default // eslint-disable-line @typescript-eslint/no-var-requires
}

export default Plugin
