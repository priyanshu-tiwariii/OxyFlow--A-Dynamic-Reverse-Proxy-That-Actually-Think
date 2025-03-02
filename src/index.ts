import express from 'express';
import { startApiManagementServer } from './servers/apiManagementServer.js';
import { startReverseProxy } from './servers/dockerManagementServer.js';

const app = express();
startApiManagementServer(8080);
startReverseProxy(80);