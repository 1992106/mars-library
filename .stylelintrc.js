module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  rules: {
    'no-empty-source': null,
    'block-no-empty': true,
    'selector-pseudo-element-no-unknown': [true, {
      'ignorePseudoElements': [
        'v-deep'
      ]
    }]
  }
}
