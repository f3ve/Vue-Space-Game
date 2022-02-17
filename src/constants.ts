export const KEY_LEFT = 'ArrowLeft';
export const KEY_RIGHT = 'ArrowRight';
export const KEY_SPACE = 'Space';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const PLAYER_WIDTH = 20;
export const PLAYER_MAX_SPEED = 350;

export const LASER_MAX_SPEED = 400;
export const LASER_COOLDOWN = 0.5;

export const ENEMIES_PER_ROW = 10;
export const ENEMY_HORIZONTAL_PADDING = 80;
export const ENEMY_VERTICAL_PADDING = 70;
export const ENEMY_VERTICAL_SPACING = 80;
export const ENEMY_COOLDOWN = 5.0;

export const initialState = {
  lastTime(): any {
    return Date.now();
  },
  playerX: 0,
  playerY: 0,
  playerCooldown: 0,
  leftPressed: false,
  rightPressed: false,
  spacePressed: false,
  gameOver: false,
  won: false,
  lasers: [],
  enemies: [],
  enemyLasers: [],
  paused: true,
  score: 0,
  lasersFired: 0,
  start: true,
};
