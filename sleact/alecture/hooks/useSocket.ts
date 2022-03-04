import { io, Socket } from 'socket.io-client';
import {useCallback} from 'react';

const backUrl = process.env.NODE_ENV === 'production' ? 'https://sleact.nodebird.com' : 'http://localhost:3095';
const sockets: { [key: string]: Socket } = {};
const useSocket =  (workspace?: string): [Socket | undefined, () => void] =>{
  const disconnect = useCallback(() => {
    if (workspace && sockets[workspace]) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);
  if (!workspace) {
    return [undefined, disconnect];
  }
  if (!sockets[workspace]) {
    sockets[workspace] = io(`${backUrl}/ws-${workspace}`, {
      //웹소켓 연결 바로 시키기 http 요청 x
      transports: ['websocket'],
    });
    console.info('create socket', workspace, sockets[workspace]);
  }

  return [sockets[workspace], disconnect];
}

export default useSocket
