const eslintConfig = [
  {
    ignores: ['src/payload-types.ts', 'src/payload-generated-schema.ts'],
  },
  {
    rules: {
      'no-unused-vars': 'warn',
    },
  },
]

export default eslintConfig