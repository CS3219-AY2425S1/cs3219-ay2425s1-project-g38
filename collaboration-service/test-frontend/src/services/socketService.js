// currently not in use, will be used in future once session service is up and running to update the language in real time

import { useEffect } from "react";

import io from 'socket.io-client';

export const socket = io('http://192.168.1.193:8010', { auth: { token: localStorage.getItem('jwtToken') } });
