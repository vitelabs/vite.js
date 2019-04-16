import Client from '../src/client/index';
import WS_RPC from '../src/WS';

const myWSClient = new Client(new WS_RPC('ws://148.70.30.139:41423'));

console.log(myWSClient);

