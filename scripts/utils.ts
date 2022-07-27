import path from 'path'
import fs from 'fs/promises'
import semver from 'semver'
import prompts from 'prompts'
import execa from 'execa'
import { loadConfig, Changelog } from '@kazupon/lerna-changelog'

export type PackageJson = {
  name: string
  version: string
  private?: boolean
  workspaces?: string[]
}

export type Mode = 'single' | 'batch'
export type Logger = (...args: any[]) => void // eslint-disable-line @typescript-eslint/no-explicit-any
export type Incrementer = (i: any) => string // eslint-disable-line @typescript-eslint/no-explicit-any

const VersionIncrements = [
  'patch',
  'minor',
  'major',
  'prepatch',
  'preminor',
  'premajor',
  'prerelease'
] as const

export const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })

export async function getRootPath() {
  const { stdout: rootPath } = await run(
    'git',
    ['rev-parse', '--show-toplevel'],
    { stdio: 'pipe' }
  )
  return rootPath
}

export async function getRelativePath() {
  const { stdout: relativePath } = await run(
    'git',
    ['rev-parse', '--show-prefix'],
    {
      stdio: 'pipe'
    }
  )
  return relativePath
}

export async function readPackageJson(path: string) {
  const data = await fs.readFile(path, 'utf8')
  const json = JSON.parse(data)
  if (isPackageJson(json)) {
    return json
  } else {
    throw new Error(`Invalid package: ${path}`)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPackageJson(pkg: any): pkg is PackageJson {
  return pkg && typeof pkg === 'object' && pkg.name
}

export async function getRepoName() {
  const rootPath = await getRootPath()
  return path.parse(rootPath).name
}

export function getIncrementer(
  currentVersion: string,
  release = 'beta'
): Incrementer {
  return i => semver.inc(currentVersion, i, release)
}

export function getTags(
  pkgName: string,
  currentVersion: string,
  targetVersion = ''
) {
  const tag =
    pkgName === 'kdu-i18n' ? `v${targetVersion}` : `${pkgName}@${targetVersion}`
  const fromTag =
    pkgName === 'kdu-i18n'
      ? `v${currentVersion}`
      : `${pkgName}@${currentVersion}`
  return { tag, fromTag }
}

export async function getTargetVersion(
  currentVersion: string,
  inc: Incrementer
) {
  const { release } = await prompts({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: VersionIncrements.map(i => `${i} (${inc(i)})`)
      .concat(['custom'])
      .map(i => ({ value: i, title: i }))
  })

  if (release === 'custom') {
    const res = await prompts({
      type: 'text',
      name: 'version',
      message: 'Input custom version',
      initial: currentVersion
    })
    return res.version as string
  } else {
    return release.match(/\((.*)\)/)[1] as string
  }
}
