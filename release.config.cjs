module.exports = {
  branches: process.argv.includes('--dry-run')
    ? [
        { name: 'main' },
        // Allow dry-run analysis on develop; marked prerelease to avoid confusion if ever enabled
        { name: 'develop', channel: 'dev', prerelease: 'dev' }
      ]
    : [
        { name: 'main' }
      ],
  plugins: [
    'semantic-release-unsquash',
    [
      '@semantic-release/npm',
      {
        pkgRoot: './dist/tech-carbon-estimator',
        tarballDir: './dist/tech-carbon-estimator'
      }
    ],
    '@semantic-release/github'
  ]
};