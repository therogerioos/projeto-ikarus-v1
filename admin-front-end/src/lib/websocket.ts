/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, IMessage } from '@stomp/stompjs';

let stompClient: Client | null = null;

export function connectWebSocket(orgId: number, onMessage: (msg: any) => void) {
  stompClient = new Client({
    brokerURL: `wss://localhost:8080/ws`, // ou wss:// se for HTTPS
    connectHeaders: {},
    debug: (str) => console.log(str),
    reconnectDelay: 5000, // tenta reconectar se cair
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = (frame) => {
    console.log('Conectado ao WebSocket!', frame);

    // Inscreve no tópico do admin da organização
    stompClient?.subscribe(`/topic/admin/${orgId}`, (message: IMessage) => {
      const body = JSON.parse(message.body);
      onMessage(body);
    });
  };

  stompClient.onStompError = (frame) => {
    console.error('Erro no STOMP:', frame);
  };

  stompClient.activate();
}

export function disconnectWebSocket() {
  stompClient?.deactivate();
  stompClient = null;
}
