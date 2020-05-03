import four from '../assets/layers/4.png';
import three from '../assets/layers/3.png';
import two from '../assets/layers/2.png';
import one from '../assets/layers/1.png';

import groundv2 from '../assets/groundv2.png';
import player from '../assets/player.png';
import toadsdev from '../assets/toadspritesdev.png';
import sushi from '../assets/sus.png';

export default (context) => {
  context.load.spritesheet('first', one, { frameWidth: 592, frameHeight: 272 });
  context.load.spritesheet('second', two, { frameWidth: 592, frameHeight: 272 });
  context.load.spritesheet('third', three, { frameWidth: 592, frameHeight: 272 });
  context.load.spritesheet('fourth', four, { frameWidth: 480, frameHeight: 272 });

  context.load.spritesheet('newground', groundv2, { frameWidth: 1024, frameHeight: 288 });
  context.load.spritesheet('player', player, { frameWidth: 198, frameHeight: 144 });
  context.load.spritesheet('toadsdev', toadsdev, { frameWidth: 142, frameHeight: 110 });
  context.load.spritesheet('sushi', sushi, { frameWidth: 351, frameHeight: 273 });
};
