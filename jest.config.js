module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/unit/.*(test|spec)).tsx?$',
  testEnvironment: 'node'
}
