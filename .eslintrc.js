module.exports = {
    'parser': '@typescript-eslint/parser',
    'plugins': [
        '@typescript-eslint'
    ],
    'env': {
        'es2020': true,
        'browser': true,
        'commonjs': true,
        // 'es6': true,
        'node': true,
        'mocha': true
    },
    'parserOptions': {
        'ecmaFeatures': {'jsx': true},
        'sourceType': 'module'
    },
    'globals': {
        'window': true,
        'describe': true,
        'it': true,
        'beforeEach': true,
        'b_vite': true,
        '$vite_docs': true
    },
    'extends': [
        'eslint:recommended',
        'eslint-config-alloy/typescript'
    ],
    'rules': {
        'guard-for-in': 'off',
        'no-throw-literal': 'off',
        'prefer-promise-reject-errors': 'off',
        'eqeqeq': [ 'error', 'smart' ],
        'no-else-return': 'error',
        'no-labels': 'error',
        'no-return-assign': 'error',
        'no-multi-spaces': 'error',
        'no-param-reassign': 'warn',
        'indent': [ 'error', 4 ],
        'linebreak-style': [ 'error', 'unix' ],
        'quotes': [ 'error', 'single' ],
        'semi': [ 'error', 'always' ],
        'no-console': 'off',
        'no-useless-escape': 'off',
        'no-debugger': 'warn',
        'array-bracket-spacing': [ 'error', 'always', {
            'singleValue': false,
            'arraysInArrays': false
        } ],
        'brace-style': 'error',
        'comma-dangle': [ 'error', 'never' ],
        'comma-spacing': [ 'error', {
            'before': false,
            'after': true
        } ],
        'comma-style': [ 'error', 'last' ],
        'eol-last': [ 'error', 'always' ],
        'func-call-spacing': [ 'error', 'never' ],
        'function-paren-newline': [ 'error', 'never' ],
        'key-spacing': [ 'error', {
            'beforeColon': false,
            'afterColon': true,
            'mode': 'strict'
        } ],
        'keyword-spacing': [ 'error', {
            'before': true,
            'after': true
        } ],
        'lines-between-class-members': [ 'error', 'always', {'exceptAfterSingleLine': true} ],
        'max-depth': [ 'error', 4 ],
        'max-nested-callbacks': [ 'error', 5 ],
        'max-statements-per-line': [ 'error', {'max': 1} ],
        'newline-per-chained-call': [ 'error', { 'ignoreChainWithDepth': 3 } ],
        'no-lonely-if': 'error',
        'no-mixed-spaces-and-tabs': 'error',
        'no-multiple-empty-lines': 'error',
        'no-negated-condition': 'error',
        'no-tabs': 'error',
        'no-trailing-spaces': 'error',
        'no-unneeded-ternary': 'error',
        'no-whitespace-before-property': 'error',
        'nonblock-statement-body-position': [ 'error', 'beside' ],
        'object-curly-newline': [ 'error', {'multiline': true} ],
        'object-property-newline': [ 'error', {'allowAllPropertiesOnSameLine': true} ],
        'operator-linebreak': [ 'error', 'before' ],
        'padded-blocks': [ 'error', 'never' ],
        'padding-line-between-statements': [ 'error',
            { 'blankLine': 'always', 'prev': 'block', 'next': '*' },
            { 'blankLine': 'always', 'prev': 'directive', 'next': '*' }
        ],
        'semi-style': [ 'error', 'last' ],
        'space-before-blocks': 'error',
        'space-before-function-paren': [ 'error', {
            'anonymous': 'always',
            'named': 'never',
            'asyncArrow': 'always'
        } ],
        'space-in-parens': [ 'error', 'never' ],
        'space-infix-ops': 'error',
        'space-unary-ops': 'error',
        'spaced-comment': [ 'error', 'always' ],
        'switch-colon-spacing': 'error',
        'template-tag-spacing': 'error',
        'arrow-body-style': [ 'error', 'as-needed', {'requireReturnForObjectLiteral': true} ],
        'arrow-parens': [ 'error', 'as-needed' ],
        'arrow-spacing': 'error',
        'constructor-super': 'error',
        'generator-star-spacing': [ 'error', {
            'before': true,
            'after': false
        } ],
        'no-confusing-arrow': 'warn',
        'no-duplicate-imports': 'error',
        'no-useless-computed-key': 'warn',
        'no-var': 'error',
        'no-useless-rename': 'error',
        'prefer-const': 'warn',
        'prefer-template': 'error',
        'rest-spread-spacing': [ 'error', 'never' ],
        'yield-star-spacing': [ 'error', 'before' ],
        'template-curly-spacing': [ 'error', 'always' ],
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'error',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/consistent-type-definitions': 'off',
        'no-irregular-whitespace': [ 'error', {
            'skipStrings': true,
            'skipComments': true,
            'skipRegExps': true,
            'skipTemplates': true
        } ],
        '@typescript-eslint/prefer-for-of': 'warn',
        '@typescript-eslint/prefer-optional-chain': 'off'
        // "require-jsdoc": ["error", {
        //     "require": {
        //         "FunctionDeclaration": true,
        //         "MethodDefinition": true,
        //         "ClassDeclaration": true
        //     }
        // }]
        // "new-cap": ["error", { "capIsNew": true }]
    }
};
