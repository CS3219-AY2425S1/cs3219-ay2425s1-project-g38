import io from 'socket.io-client';

export const socket = io('http://localhost:8010', { auth: { token: localStorage.getItem('jwtToken') } });

