import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: './tsconfig.jest.json'
        }],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@ui$': '<rootDir>/ui/index.ts',
        '^@utils$': '<rootDir>/utils/index.ts',
        '^styles$': '<rootDir>/ui/styles/index.scss',
        '\\.(css|scss)$': 'identity-obj-proxy',
        '^@utils(.*)$': '<rootDir>/src/utils$1',
        '^@ui(.*)$': '<rootDir>/ui$1',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
