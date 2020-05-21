import Phaser from 'phaser';
import config from './gameConfig';

const game = new Phaser.Game(config);

const registerSW = () => 'serviceWorker' in navigator && navigator.serviceWorker.register('./service-worker.js');

window.addEventListener('load', () => registerSW());
