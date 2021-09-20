export interface GameState {
  lastTime: number;
  playerX: number;
  playerY: number;
  leftPressed: boolean;
  rightPressed: boolean;
  spacePressed: boolean;
  playerCooldown: number;
  lasers: { x: number; y: number; $el: HTMLElement; isDead: boolean }[];
}
