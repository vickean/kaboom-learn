import kaboom from 'kaboom';
import playerSprite from '../images/player_sprite.png';
import groundSprite from '../images/ground_tile.png';
import enemySprite from '../images/enemy_sprite.png';

console.log('Kaboom start');

const MOVE_SPEED = 200;
const JUMP_FORCE = 300;

kaboom({
  global: true,
  fullscreen: true,
  scale: 3,
  debug: true,
  clearColor: [0, 0, 0, 1],
  crisp: true,
});

loadSprite('player_sprite', playerSprite);
loadSprite('ground_sprite', groundSprite);
loadSprite('enemy_sprite', enemySprite);

scene('game', () => {
  const player = add([
    sprite('player_sprite'),
    scale(1),
    pos(20, 20),
    body(),
    origin('center'),
    'player',
  ]);

  wait(1, () => {
    keyDown('right', () => {
      player.move(MOVE_SPEED, 0);
    });

    keyDown('left', () => {
      player.move(-MOVE_SPEED, 0);
    });

    keyPress('space', () => {
      if (player.grounded()) {
        player.jump(JUMP_FORCE);
      }
    });
  });

  addLevel(['     ', '  @  ', '     ', 'xxxxx'], {
    width: 48,
    height: 48,
    x: [sprite('ground_sprite'), scale(1), solid(), 'ground'],
    '@': [sprite('enemy_sprite'), scale(1), 'dangerous'],
  });

  player.action(() => {
    camPos(player.pos);
  });

  overlaps('dangerous', 'player', (d, p) => {
    readd(p);
    every('ground', (g) => {
      g.solid = false;
    });
    p.jump(JUMP_FORCE);
    camShake(12);
    p.color = rgba(1, 0, 0, 0.5);
    wait(1, () => {
      destroy(p);
    });
  });

  player.on('destroy', () => {
    wait(1, () => {
      go('game');
    });
  });
});

start('game');
