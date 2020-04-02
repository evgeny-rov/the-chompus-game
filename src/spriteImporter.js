import four from './assets/layers/4.png';
import three from './assets/layers/3.png';
import two from './assets/layers/2.png';
import one from './assets/layers/1.png';

import player from './assets/player-stand.png';
import groundv2 from './assets/groundv2.png';
import toadsprite from './assets/sprite.png';
import kanako from './assets/kanako.png';
import chomp from './assets/chompusd.png';

import toadsdev from './assets/toadspritesdev.png';
import chompusdev from './assets/chompusdev.png';

export default (context) => {
    context.load.spritesheet('first', one, { frameWidth: 592, frameHeight: 272 });
    context.load.spritesheet('second', two, { frameWidth: 592, frameHeight: 272 });
    context.load.spritesheet('third', three, { frameWidth: 592, frameHeight: 272 });
    context.load.spritesheet('fourth', four, { frameWidth: 480, frameHeight: 272 });

    context.load.spritesheet('player', player, { frameWidth: 88, frameHeight: 103 });
    context.load.spritesheet('newground', groundv2, { frameWidth: 1024, frameHeight: 709 });
    context.load.spritesheet('spritedev', toadsprite, { frameWidth: 132, frameHeight: 132 });
    context.load.spritesheet('kanako', kanako, { frameWidth: 32, frameHeight: 64 });
    context.load.spritesheet('chompus', chomp, { frameWidth: 69, frameHeight: 94 });
    context.load.spritesheet('chompusdev', chompusdev, { frameWidth: 126, frameHeight: 96 });
    context.load.spritesheet('toadsdev', toadsdev, { frameWidth: 142, frameHeight: 110 });
}