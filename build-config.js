export default {
  build: {
    shell: '/bin/bash',
  },

  copy: [
    'README.md',
    'LICENSE',
    'companion/manifest.json',
    'companion/HELP.md',
  ],
}
