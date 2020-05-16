import four from '../assets/layers/4.png';
import three from '../assets/layers/3.png';
import two from '../assets/layers/2.png';
import one from '../assets/layers/1.png';

import groundv2 from '../assets/groundv2.png';
import player from '../assets/player.png';
import toadsdev from '../assets/toadspritesdev.png';
import sushi from '../assets/sus.png';
import kanako from '../assets/kanako.png';

import uifs from '../assets/uifs.png';

import playerDead from '../assets/death.png';

import playerJump from '../assets/audio/player-jump.mp3';
import playerAttack from '../assets/audio/player-attack.mp3';
import obstaclePreaction from '../assets/audio/obstacle-preaction.mp3';
import obstacleAction from '../assets/audio/obstacle-action.mp3';
import bonus from '../assets/audio/bonus.mp3';
import gOver from '../assets/audio/gover.mp3';
import positive from '../assets/audio/positive.mp3';
import negative from '../assets/audio/negative.mp3';
import notSecret from '../assets/audio/notsecret.mp3';

export default (ctx) => {
  ctx.load.spritesheet('first', one, { frameWidth: 592, frameHeight: 272 });
  ctx.load.spritesheet('second', two, { frameWidth: 592, frameHeight: 272 });
  ctx.load.spritesheet('third', three, { frameWidth: 592, frameHeight: 272 });
  ctx.load.spritesheet('fourth', four, { frameWidth: 480, frameHeight: 272 });
  ctx.load.spritesheet('newground', groundv2, { frameWidth: 1024, frameHeight: 288 });
  ctx.load.spritesheet('player', player, { frameWidth: 198, frameHeight: 144 });
  ctx.load.spritesheet('dead', playerDead, { frameWidth: 198, frameHeight: 144 });
  ctx.load.spritesheet('toadsdev', toadsdev, { frameWidth: 142, frameHeight: 110 });
  ctx.load.spritesheet('sushi', sushi, { frameWidth: 351, frameHeight: 273 });
  ctx.load.spritesheet('kanako', kanako, { frameWidth: 100, frameHeight: 200 });

  ctx.load.audio('player-jump', playerJump);
  ctx.load.audio('player-attack', playerAttack);
  ctx.load.audio('obstacle-preaction', obstaclePreaction);
  ctx.load.audio('obstacle-action', obstacleAction);
  ctx.load.audio('bonus', bonus);
  ctx.load.audio('g-over', gOver);
  ctx.load.audio('positive', positive);
  ctx.load.audio('negative', negative);
  ctx.load.audio('not-secret', notSecret);

  ctx.load.image('uifs', uifs);
};
