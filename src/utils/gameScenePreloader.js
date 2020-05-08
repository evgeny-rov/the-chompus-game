import four from '../assets/layers/4.png';
import three from '../assets/layers/3.png';
import two from '../assets/layers/2.png';
import one from '../assets/layers/1.png';

import groundv2 from '../assets/groundv2.png';
import player from '../assets/player.png';
import toadsdev from '../assets/toadspritesdev.png';
import sushi from '../assets/sus.png';

import uifs from '../assets/uifs.png';
import uimenu from '../assets/uimenu.png';

import jumpSound from '../assets/testjump.wav';
import stompSound from '../assets/stomp.wav';
import toadJumpSound from '../assets/toadjumps.wav';
import toadQuackSound from '../assets/frogquack.mp3';
import getBonusSound from '../assets/exit.wav';

export default (ctx) => {
  ctx.load.spritesheet('first', one, { frameWidth: 592, frameHeight: 272 });
  ctx.load.spritesheet('second', two, { frameWidth: 592, frameHeight: 272 });
  ctx.load.spritesheet('third', three, { frameWidth: 592, frameHeight: 272 });
  ctx.load.spritesheet('fourth', four, { frameWidth: 480, frameHeight: 272 });

  ctx.load.spritesheet('newground', groundv2, { frameWidth: 1024, frameHeight: 288 });
  ctx.load.spritesheet('player', player, { frameWidth: 198, frameHeight: 144 });
  ctx.load.spritesheet('toadsdev', toadsdev, { frameWidth: 142, frameHeight: 110 });
  ctx.load.spritesheet('sushi', sushi, { frameWidth: 351, frameHeight: 273 });

  ctx.load.audio('jumpSound', jumpSound);
  ctx.load.audio('stompSound', stompSound);
  ctx.load.audio('toadJumpSound', toadJumpSound);
  ctx.load.audio('toadQuackSound', toadQuackSound);
  ctx.load.audio('getBonusSound', getBonusSound);

  ctx.load.image('uifs', uifs);
  ctx.load.image('uimenu', uimenu);
};
