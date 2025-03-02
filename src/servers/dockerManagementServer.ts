import Dockerode from 'dockerode';
import httpProxy from 'http-proxy';
import { Redis } from 'ioredis';
import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import http from 'http';

const Docker = new Dockerode({socketPath: "/var/run/docker.sock"});
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'redis', // Fallback to service name
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryStrategy: (times) => Math.min(times * 100, 3000), // Retry up to 3s
});

// Handle connection events
redisClient
  .on('connect', () => console.log('Redis connected'))
  .on('error', (err) => console.error('Redis error:', err))
  .on('reconnecting', () => console.log('Redis reconnecting...'));

const proxyServer = httpProxy.createProxy({});

// Docker event listener setup
Docker.getEvents((err, stream) => {
  if (err) {
    console.error('Error in Docker event stream:', err);
    return;
  }

  stream?.on('data', async (chunk: Buffer) => {
    try {
      const event = JSON.parse(chunk.toString());
      if (event.Type === 'container' && event.Action === 'start') {
        const container = Docker.getContainer(event.id);
        const containerInfo = await container.inspect();
        const containerName = containerInfo.Name.substring(1);
       
        const network = containerInfo.NetworkSettings.Networks['app-network'];
        const containerIpAddress = network?.IPAddress;

        const exposePorts = Object.keys(containerInfo.Config.ExposedPorts);
        let defaultPort = null;
        if (exposePorts.length > 0) {
          const validPorts = exposePorts
            .map(p => p.split('/'))
            .filter(([_, protocol]) => protocol === 'tcp')
            .map(([port]) => port);

        if (validPorts.length === 0) return;
         defaultPort = validPorts[0];
        }

        if (defaultPort) {
          await redisClient.set(
            containerName,
            JSON.stringify({
              containerId: event.id,
              containerIpAddress,
              defaultPort
            })
          );
          console.log(`Registered container: ${containerName}.localhost -> ${containerIpAddress}:${defaultPort}`);
        }
      }
    } catch (error) {
      console.error('Error handling Docker event:', error);
    }
  });
});

const dockerManagementRouter = express();

dockerManagementRouter.use(async (req: Request, res: Response) => {
  try {
    const hostName = req.hostname;
    console.log(`Received request for hostname: ${hostName}`);
    const subDomain = hostName.split('.')[0];
    console.log(`Received request for subdomain: ${subDomain}`);

    const containerInfo = await redisClient.get(subDomain);
    console.log('Container info:', containerInfo);
    if (!containerInfo) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    const { containerIpAddress, defaultPort } = JSON.parse(containerInfo);

    const target = `http://${containerIpAddress}:${defaultPort}`;
    console.log(`Proxying request to ${target}`);

    proxyServer.web(req, res, { target, changeOrigin: true }, (err) => {
      if (err) {
        console.error('Proxy error in callback:', err);
        if (!res.headersSent) {
          res.status(502).json({ error: 'Bad Gateway - Proxy failed' });
        }
      }
    });

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//http://172.17.0.4:80  
// 🔹 Global error handler for proxy failures


proxyServer.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  const serverRes = res as http.ServerResponse;
  serverRes.writeHead(502, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Bad Gateway - Proxy failed' }));
});

const reverseProxy = http.createServer(dockerManagementRouter);
console.log('Reverse Proxy Server created');

export const startReverseProxy = (port: number) => {
  reverseProxy.listen(port, () => {
    console.log(`Reverse Proxy Server running on port ${port}`);
  });
}


