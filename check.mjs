#!/usr/bin/env node
/**
 * Checks that every example app still installs its foundation, validates and
 * builds with the `pwf` command line — the same three commands its README
 * tells a reader to run.
 *
 * For each app folder here (every directory with a pwpack.json) it copies the
 * app to a fresh temporary directory, then runs, inside the copy:
 *
 *   pwf add <the foundation>
 *   pwf validate
 *   pwf build
 *
 * and fails unless each exits 0. The examples themselves are never written to.
 *
 * Which `pwf`: `--cli <path-to-bin.js>`, else the PWF_CLI environment
 * variable, else the published CLI: `@pwfabric/cli` installed in this folder's
 * node_modules if there is one, otherwise `@pwfabric/cli@rc` from npm,
 * installed into the temporary directory for this run. To check against an
 * engine clone, pass `--cli ../pwfabric/packages/cli/dist/bin.js` (after
 * `pnpm build` there).
 *
 * Which foundation: `--foundation <.pwpack or folder>`, else the
 * PWF_FOUNDATION environment variable, else the newest `.pwpack` in
 * `../foundation/dist/` (a clone next to this one, built with
 * `node scripts/export-tgz.mjs --canonical`).
 *
 * Node built-ins only (and npm, to fetch the published CLI).
 *
 *   node check.mjs [--cli <path>] [--foundation <path>] [--keep]
 */
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
/** The published CLI this check runs when no other is named. */
const CLI_PACKAGE = '@pwfabric/cli@rc'
function parseArgs(argv) {
  const opts = { cli: undefined, foundation: undefined, keep: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--keep') opts.keep = true
    else if (a === '--cli') opts.cli = argv[++i]
    else if (a.startsWith('--cli=')) opts.cli = a.slice('--cli='.length)
    else if (a === '--foundation') opts.foundation = argv[++i]
    else if (a.startsWith('--foundation=')) opts.foundation = a.slice('--foundation='.length)
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

function findFoundation(flag) {
  let candidate = flag ?? process.env.PWF_FOUNDATION
  if (!candidate) {
    const dist = join(HERE, '..', 'foundation', 'dist')
    const packs = existsSync(dist) ? readdirSync(dist).filter((f) => f.endsWith('.pwpack')).sort() : []
    if (packs.length) candidate = join(dist, packs[packs.length - 1])
  }
  const abs = candidate ? resolve(candidate) : ''
  if (!abs || !existsSync(abs)) {
    throw new Error(
      `no foundation pack${abs ? ` at ${abs}` : ''}.\n` +
        '  Download foundation-<version>.pwpack from the releases of pwfabric/foundation,\n' +
        '  or build it in a clone next to this repository (node scripts/export-tgz.mjs --canonical),\n' +
        '  and pass --foundation <path> or set PWF_FOUNDATION.'
    )
  }
  return abs
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
  const foundation = findFoundation(opts.foundation)
  const list = apps()
  if (list.length === 0) throw new Error(`no example apps found in ${HERE}`)

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
  console.log(`foundation: ${foundation}`)
  console.log(`work: ${work}\n`)

  let failed = 0
  for (const app of list) {
    const dir = join(work, app)
    copyApp(join(HERE, app), dir)
    let ok = true
    for (const args of [['add', foundation], ['validate'], ['build']]) {
      const { code, output } = pwf(cli, args, dir)
      const line = `pwf ${args.join(' ')}`
      if (code === 0) {
        console.log(`  ✓ ${app.padEnd(14)} ${line}`)
      } else {
        ok = false
        console.log(`  ✗ ${app.padEnd(14)} ${line} (exit ${code})`)
        console.log(output.trimEnd().split(/\r?\n/).map((l) => `      | ${l}`).join('\n'))
        break
      }
    }
    if (ok && !existsSync(join(dir, '.pwf', 'out', 'index.html'))) {
      ok = false
      console.log(`  ✗ ${app.padEnd(14)} pwf build exited 0 but wrote no .pwf/out/index.html`)
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
