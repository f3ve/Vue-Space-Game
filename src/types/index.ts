import { UnwrapRef, Ref } from 'vue';

export interface GameState {
  lastTime: number;
  playerX: number;
  playerY: number;
  leftPressed: boolean;
  rightPressed: boolean;
  spacePressed: boolean;
  playerCooldown: number;
  lasers: { x: number; y: number; $el: HTMLElement; isDead: boolean }[];
  enemies: { x: number; y: number; $el: HTMLElement }[];
}

export interface Laser {
  x: number;
  y: number;
  $el: HTMLElement;
  isDead: boolean;
}

export type Game = UnwrapRef<GameState>;
export type ElOrNull = HTMLElement | null;
export type DOMRef = Ref<ElOrNull>;
