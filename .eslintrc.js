module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    "globals": {
        "window": true,
        "describe": true,
        "it": true,
        "beforeEach": true,
        "b_vite":true,
        "$vite_docs":true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "no-console": "off",
        "no-useless-escape": "off",
        "no-control-regex": "off"
    }
};