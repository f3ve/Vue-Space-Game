import * as C from '@/constants';
import { GameState } from '@/types';

export function initializeKeyboardControls(gameState: GameState): void {
  window.addEventListener('keydown', (e) => coordinateKeyDown(e, gameState));
  window.addEventListener('keyup', (e) => coordinateKeyUp(e, gameState));
}

function coordinateKeyDown(e: KeyboardEvent, gameState: GameState): void {
  if (e.code === C.KEY_LEFT) {
    gameState.leftPressed = true;
    return;
  }

  if (e.code === C.KEY_RIGHT) {
    gameState.rightPressed = true;
  }

  if (e.code === C.KEY_SPACE) {
    gameState.spacePressed = true;
  }
}

function coordinateKeyUp(e: KeyboardEvent, gameState: GameState): void {
  if (e.code === C.KEY_LEFT) {
    gameState.leftPressed = false;
    return;
  }

  if (e.code === C.KEY_RIGHT) {
    gameState.rightPressed = false;
  }

  if (e.code === C.KEY_SPACE) {
    gameState.spacePressed = false;
  }
}
