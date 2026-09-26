import * as migration_20260924_082305 from './20260924_082305';
import * as migration_20260924_100000 from './20260924_100000';
import * as migration_20260924_100500 from './20260924_100500';
import * as migration_20260926_102100_hero_slide_video_countdown from './20260926_102100_hero_slide_video_countdown';

export const migrations = [
  {
    up: migration_20260924_082305.up,
    down: migration_20260924_082305.down,
    name: '20260924_082305'
  },
  {
    up: migration_20260924_100000.up,
    down: migration_20260924_100000.down,
    name: '20260924_100000'
  },
  {
    up: migration_20260924_100500.up,
    down: migration_20260924_100500.down,
    name: '20260924_100500'
  },
  {
    up: migration_20260926_102100_hero_slide_video_countdown.up,
    down: migration_20260926_102100_hero_slide_video_countdown.down,
    name: '20260926_102100_hero_slide_video_countdown'
  },
];
