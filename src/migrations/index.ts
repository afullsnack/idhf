import * as migration_20260924_061524 from './20260924_061524';

export const migrations = [
  {
    up: migration_20260924_061524.up,
    down: migration_20260924_061524.down,
    name: '20260924_061524'
  },
];
