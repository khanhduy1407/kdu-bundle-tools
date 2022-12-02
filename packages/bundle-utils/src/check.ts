export type InstalledPackage = 'kdu-i18n' | 'petite-kdu-i18n'

// eslint-disable-next-line @typescript-eslint/ban-types
export function checkInstallPackage(
  pkg: string,
  debug: Function
): InstalledPackage {
  let installedKduI18n = false
  try {
    debug(`kdu-i18n load path: ${require.resolve('kdu-i18n')}`)
    installedKduI18n = true
  } catch (e) {
    debug(`cannot find 'kdu-i18n'`, e)
  }

  let installedPetiteKduI18n = false
  try {
    debug(`petite-kdu-i18n load path: ${require.resolve('petite-kdu-i18n')}`)
    installedPetiteKduI18n = true
  } catch (e) {
    debug(`cannot find 'petite-kdu-i18n'`, e)
  }

  if (installedKduI18n) {
    return 'kdu-i18n'
  }
  if (installedPetiteKduI18n) {
    return 'petite-kdu-i18n'
  }
  throw new Error(
    `${pkg} requires 'kdu-i18n' or 'petite-kdu-i18n' to be present in the dependency tree.`
  )
}
