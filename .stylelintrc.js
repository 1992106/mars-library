module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  rules: {
    'no-empty-source': null,
    'selector-pseudo-element-no-unknown': [true, {
      'ignorePseudoElements': [
        'v-deep'
      ]
    }],
    'selector-pseudo-class-no-unknown': null,
    'declaration-empty-line-before': null,
    'at-rule-no-unknown': null
  }
}
