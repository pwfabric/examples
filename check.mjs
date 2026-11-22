#!/usr/bin/env node
/**
 * Checks that every example app still installs its packs, validates and
 * builds with the `pwf` command line — the commands its README tells a reader
 * to run.
 *
 * For each app folder here (every directory with a pwpack.json) it copies the
 * app to a fresh temporary directory, then runs, inside the copy:
 *
 *   pwf add <each pack the app requires>
 *   pwf validate
 *   pwf build
 *
 * and fails unless each exits 0. The examples themselves are never written to.
 *
 * Which `pwf`: `--cli <path-to-bin.js>`, else the PWF_CLI environment
 * variable, else the published CLI: `@pwfabric/cli` installed in this folder's
 * node_modules if there is one, otherwise `@pwfabric/cli@^3.5.0` from npm,
 * installed into the temporary directory for this run. To check against an
 * engine clone, pass `--cli ../pwfabric/packages/cli/dist/bin.js` (after
 * `pnpm build` there).
 *
 * Which packs: `--packs <folder>`, else the PWF_PACKS environment variable,
 * else `../packs/dist/` (a clone of pwfabric/packs next to this one, after
 * `pnpm build` there). The folder holds `<pack>-<version>.pwpack` files, as
 * the packs releases name them; for each pack an app requires, the newest
 * file of that pack within the app's range is added, so apps on two majors of
 * a pack are checked from one folder.
 *
 * Node built-ins only (and npm, to fetch the published CLI).
 *
 *   node check.mjs [--cli <path>] [--packs <folder>] [--keep]
 */
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
/** The published CLI this check runs when no other is named. */
const CLI_PACKAGE = '@pwfabric/cli@^3.5.0'
function parseArgs(argv) {
  const opts = { cli: undefined, packs: undefined, keep: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--keep') opts.keep = true
    else if (a === '--cli') opts.cli = argv[++i]
    else if (a.startsWith('--cli=')) opts.cli = a.slice('--cli='.length)
    else if (a === '--packs') opts.packs = argv[++i]
    else if (a.startsWith('--packs=')) opts.packs = a.slice('--packs='.length)
    else throw new Error(`unknown argument: ${a}`)
  }
  return opts
}

function findCli(flag, work) {
  const named = flag ?? process.env.PWF_CLI
  if (named) {
    const abs = resolve(named)
    if (!existsSync(abs)) throw new Error(`no pwf CLI at ${abs} (from ${flag ? '--cli' : 'PWF_CLI'}).`)
    return abs
  }
  return installedCli(HERE) ?? installedCli(npmInstall(join(work, '.cli'))) ?? fail()

  function fail() {
    throw new Error(
      `could not install ${CLI_PACKAGE} from npm.\n` +
        '  Pass --cli <path to pwf bin.js> or set PWF_CLI to use a CLI you already have.'
    )
  }
}

/** The `pwf` bin of `@pwfabric/cli` in `<root>/node_modules`, if installed there. */
function installedCli(root) {
  const pkg = join(root, 'node_modules', '@pwfabric', 'cli', 'package.json')
  if (!existsSync(pkg)) return undefined
  const { bin } = JSON.parse(readFileSync(pkg, 'utf8'))
  const rel = typeof bin === 'string' ? bin : bin?.pwf
  return rel ? join(dirname(pkg), rel) : undefined
}

/** Install the published CLI into `dir`; returns `dir`. */
function npmInstall(dir) {
  mkdirSync(dir, { recursive: true })
  console.log(`installing ${CLI_PACKAGE} from npm …`)
  // npm is a .cmd on Windows, which only runs through a shell; the arguments are fixed.
  const r = spawnSync(`npm install --no-save --no-audit --no-fund --prefix "${dir}" ${CLI_PACKAGE}`, {
    encoding: 'utf8',
    shell: true,
    windowsHide: true,
  })
  if (r.status !== 0) console.error(`${r.stdout ?? ''}${r.stderr ?? ''}`.trimEnd())
  return dir
}

function findPacks(flag) {
  const dir = resolve(flag ?? process.env.PWF_PACKS ?? join(HERE, '..', 'packs', 'dist'))
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.pwpack')) : []
  if (files.length === 0) {
    throw new Error(
      `no .pwpack files in ${dir}.\n` +
        '  Download them from the releases of pwfabric/packs, or build them in a clone\n' +
        '  next to this repository (pnpm build), and pass --packs <folder> or set PWF_PACKS.'
    )
  }
  return { dir, files }
}

/**
 * The newest `<name>-<version>.pwpack` of the pack `id` within the app's
 * `range` (`@pwpack/foundation`, `^2.0.0` → foundation-2.0.0.pwpack).
 */
function packFile(packs, id, range = '*') {
  const name = id.replace(/^@pwpack\//, '')
  const versionOf = (f) => f.slice(name.length + 1, -'.pwpack'.length)
  const parts = (f) => versionOf(f).split('.').map(Number)
  const mine = packs.files
    .filter((f) => f.startsWith(`${name}-`) && /^\d+\.\d+\.\d+$/.test(versionOf(f)))
    .filter((f) => inRange(parts(f), range))
  if (mine.length === 0) throw new Error(`no ${name}-<version>.pwpack in ${range} in ${packs.dir}`)
  mine.sort((a, b) => parts(a).reduce((d, x, i) => d || x - parts(b)[i], 0))
  return join(packs.dir, mine[mine.length - 1])
}

/** Whether `[major, minor, patch]` is in a caret range (`^2.0.0`); any other range admits every version. */
function inRange(version, range) {
  const caret = /^\^(\d+)\.(\d+)\.(\d+)$/.exec(range.trim())
  if (!caret) return true
  const low = caret.slice(1).map(Number)
  const atLeast = version.reduce((d, x, i) => d || x - low[i], 0) >= 0
  return atLeast && (low[0] > 0 ? version[0] === low[0] : version[0] === 0 && version[1] === low[1])
}

/** Every example app: a directory here with a pwpack.json. */
function apps() {
  return readdirSync(HERE)
    .filter((name) => !name.startsWith('.') && !name.startsWith('_'))
    .filter((name) => statSync(join(HERE, name)).isDirectory() && existsSync(join(HERE, name, 'pwpack.json')))
    .sort()
}

/** Copy an app, leaving out what a working copy may have produced. */
function copyApp(src, dest) {
  cpSync(src, dest, {
    recursive: true,
    filter: (path) => {
      const rel = path.slice(src.length).replace(/\\/g, '/')
      return !/^\/(\.pwf|node_modules)(\/|$)/.test(rel) && !rel.endsWith('.pwpack')
    },
  })
}

function pwf(cli, args, cwd) {
  const r = spawnSync(process.execPath, [cli, ...args], { cwd, encoding: 'utf8', windowsHide: true })
  return { code: r.status ?? -1, output: `${r.stdout ?? ''}${r.stderr ?? ''}${r.error ? String(r.error) : ''}` }
}

function main() {
  const opts = parseArgs(process.argv.slice(2))
  const packs = findPacks(opts.packs)
  const list = apps()
  if (list.length === 0) throw new Error(`no example apps found in ${HERE}`)
  const width = Math.max(...list.map((a) => a.length))

  const work = mkdtempSync(join(tmpdir(), 'pwf-examples-'))
  let cli
  try {
    cli = findCli(opts.cli, work)
  } catch (e) {
    rmSync(work, { recursive: true, force: true, maxRetries: 3 })
    throw e
  }
  const v = pwf(cli, ['--version'], work)
  const first = v.output.trim().split(/\r?\n/)[0] ?? ''
  // A CLI older than --version prints its usage instead.
  const version = v.code === 0 && /^(pwf )?v?\d+\.\d+\.\d+/.test(first) ? first : ''
  console.log(`pwf: ${cli}${version ? ` (${version})` : ''}`)
  console.log(`packs: ${packs.dir}`)
  console.log(`work: ${work}\n`)

  let failed = 0
  for (const app of list) {
    const dir = join(work, app)
    copyApp(join(HERE, app), dir)
    let ok = true
    const requires = JSON.parse(readFileSync(join(dir, 'pwpack.json'), 'utf8')).requires ?? []
    const steps = [...requires.map((r) => ['add', packFile(packs, r.id, r.range)]), ['validate'], ['build']]
    for (const args of steps) {
      const { code, output } = pwf(cli, args, dir)
      const line = `pwf ${args.map((a) => (a.endsWith('.pwpack') ? a.split(/[\\/]/).pop() : a)).join(' ')}`
      if (code === 0) {
        console.log(`  ✓ ${app.padEnd(width)} ${line}`)
      } else {
        ok = false
        console.log(`  ✗ ${app.padEnd(width)} ${line} (exit ${code})`)
        console.log(output.trimEnd().split(/\r?\n/).map((l) => `      | ${l}`).join('\n'))
        break
      }
    }
    if (ok && !existsSync(join(dir, '.pwf', 'out', 'index.html'))) {
      ok = false
      console.log(`  ✗ ${app.padEnd(width)} pwf build exited 0 but wrote no .pwf/out/index.html`)
    }
    if (!ok) failed++
  }

  if (opts.keep) console.log(`\nkept: ${work}`)
  else rmSync(work, { recursive: true, force: true, maxRetries: 3 })

  console.log(`\n${list.length - failed}/${list.length} examples add, validate and build`)
  return failed === 0 ? 0 : 1
}

try {
  process.exitCode = main()
} catch (e) {
  console.error(`examples/check: ${e.message}`)
  process.exitCode = 1
}
