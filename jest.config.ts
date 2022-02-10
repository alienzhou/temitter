module.exports = {
    roots: [
        '<rootDir>'
    ],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
    moduleNameMapper: {
        "@/(.*)": "<rootDir>/src/$1",
    },
};