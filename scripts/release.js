const args = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const semver = require('semver')
const pkgName = require('../package.json').name
const currentVersion = require('../package.json').version
const { prompt } = require('enquirer')
const execa = require('execa')

const prerelease = semver.prerelease(currentVersion) || []
const preId = args.preid || prerelease[0] || 'alpha'
const isDryRun = args.dry
// const skipTests = args.skipTests
const skipBuild = args.skipBuild

const versionIncrements = [
  'patch',
  'minor',
  'major',
  'prepatch',
  'preminor',
  'premajor',
  'prerelease',
]

const inc = (i) => semver.inc(currentVersion, i, preId)
// const bin = name => path.resolve(__dirname, '../node_modules/.bin/' + name)
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })
const dryRun = (bin, args, opts = {}) =>
  console.log(chalk.blue(`[dryrun] ${bin} ${args.join(' ')}`), opts)
const runIfNotDry = isDryRun ? dryRun : run
const step = (msg) => console.log(chalk.cyan(msg))

async function main() {
  let targetVersion = args._[0]

  if (!targetVersion) {
    // no explicit version, offer suggestions
    const { release } = await prompt({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: versionIncrements
        .map((i) => `${i} (${inc(i)})`)
        .concat(['custom']),
    })

    if (release === 'custom') {
      targetVersion = (
        await prompt({
          type: 'input',
          name: 'version',
          message: 'Input custom version',
          initial: currentVersion,
        })
      ).version
    } else {
      targetVersion = release.match(/\((.*)\)/)[1]
    }
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`)
  }

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  })

  if (!yes) {
    return
  }

  // TODO: Run tests once we create them
  // run tests before release
  // step('\nRunning tests...')
  // if (!skipTests && !isDryRun) {
  //   await run(bin('jest'), ['--clearCache'])
  //   await run('yarn', ['test'])
  // } else {
  //   console.log(`(skipped)`)
  // }

  // update package version
  step('\nUpdating version...')
  updateVersions(targetVersion)

  // build package
  step('\nBuilding package...')
  if (!skipBuild && !isDryRun) {
    await run('yarn', ['build:lib'], {
      env: {
        VUE_AZURE_MAPS_VERSION: targetVersion,
      },
    })
  } else {
    console.log(`(skipped)`)
  }

  // generate changelog
  await run('yarn', ['changelog'])

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
  if (stdout) {
    step('\nCommitting changes...')
    await runIfNotDry('git', ['add', '-A'])
    await runIfNotDry('git', ['commit', '-m', `build: 📦 v${targetVersion}`])
  } else {
    console.log('No changes to commit.')
  }

  // publish package
  step('\nPublishing package...')
  await publishPackage(
    path.resolve(__dirname, '..'),
    targetVersion,
    runIfNotDry
  )

  // push to GitHub
  step('\nPushing to GitHub...')
  await runIfNotDry('git', ['tag', `v${targetVersion}`])
  await runIfNotDry('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
  await runIfNotDry('git', ['push'])

  if (isDryRun) {
    console.log(`\nDry run finished - run git diff to see package changes.`)
  }

  console.log()
}

function updateVersions(version) {
  // 1. update root package.json
  updatePackage(path.resolve(__dirname, '..'), version)
}

function updatePackage(pkgRoot, version) {
  const pkgPath = path.resolve(pkgRoot, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.version = version
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

async function publishPackage(pkgRoot, version, runIfNotDry) {
  const pkgPath = path.resolve(pkgRoot, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  if (pkg.private) {
    return
  }

  // Use inferred release channel
  const prereleaseComponents = semver.prerelease(version) || []
  const inferredReleaseChannel = prereleaseComponents[0]
  const releaseTag = inferredReleaseChannel || null
  const releaseMessage = `chore(release): 🔖 v${version}`

  step(`Publishing ${pkgName}...`)
  try {
    await runIfNotDry(
      'yarn',
      [
        'publish',
        '--new-version',
        version,
        ...(releaseTag ? ['--tag', releaseTag] : []),
        '--message',
        releaseMessage,
        '--access',
        'public',
      ],
      {
        cwd: pkgRoot,
        stdio: 'pipe',
      }
    )
    console.log(chalk.green(`Successfully published ${pkgName}@${version}`))
  } catch (e) {
    if (e.stderr.match(/previously published/)) {
      console.log(chalk.red(`Skipping already published: ${pkgName}`))
    } else {
      throw e
    }
  }
}

main().catch((err) => {
  console.error(err)
})
