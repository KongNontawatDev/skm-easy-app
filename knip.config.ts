import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignore: ['dist/**', 'src/components/ui/**', 'src/routeTree.gen.ts'],
  ignoreDependencies: ["tailwindcss", "tw-animate-css"]
};

export default config;
