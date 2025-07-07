# **OxyFlow – A Dynamic Reverse Proxy **


## Why I Built OxyFlow

While working on a microservices project using Docker, I encountered a common and frustrating challenge: managing a reverse proxy for multiple containerized services.

Here’s what kept going wrong:

* Every time I spun up a new container, I had to manually update my Nginx configuration.
* If a container's IP changed (which Docker often does), Nginx stopped routing correctly.
* Scaling services dynamically was nearly impossible Nginx couldn’t detect changes automatically.

So, I decided to build **OxyFlow** - a reverse proxy that is dynamic, self-aware, and built for the realities of modern, containerized applications.

---

## What Makes OxyFlow Different

OxyFlow is designed to eliminate manual configuration. It discovers and manages services on its own in real time.

### Key Features

* **Automatic Service Discovery**: No need to register services manually.
* **Redis Caching**: Container IPs are cached to improve performance and reduce lookup time.
* **No Manual Configuration**: New containers are detected and routed automatically.
* **Seamless Scaling**: When containers are added or removed, OxyFlow adapts without restarts.
* **Built for Docker**: Communicates with your Docker environment using Dockerode.
* **Efficient Proxying**: Uses HTTP-Proxy for fast, reliable request forwarding.

With OxyFlow, you can scale or modify your services on the fly — and your reverse proxy just keeps working.

---

## Tech Stack Overview

| Technology | Purpose                                        |
| ---------- | ---------------------------------------------- |
| Node.js    | Handles asynchronous, real-time operations     |
| Express.js | Simplifies API routing and server logic        |
| Redis      | Stores container IPs for quick access          |
| Dockerode  | Interfaces with Docker to detect containers    |
| HTTP-Proxy | Forwards HTTP requests to appropriate services |

---

## How to Set Up and Run OxyFlow

### 1. Clone the Repository

```bash
git clone https://github.com/priyanshu-tiwariii/OxyFlow--A-Dynamic-Reverse-Proxy-That-Actually-Think.git
cd oxyflow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start with Docker

```bash
docker-compose up --build
```

### 4. Run a Sample Service

Here’s an example of how to launch a service and let OxyFlow handle routing automatically:

```bash
docker run --rm --network app-network --name ptn nginx
```

No need to restart the proxy - OxyFlow detects the new container, caches its IP, and begins routing requests instantly.

---

## Who Is OxyFlow For?

* Developers working with containerized microservices
* Teams tired of maintaining static proxy configurations
* Projects that require dynamic scaling and real-time updates
* Anyone who wants a "set it and forget it" reverse proxy solution

---

## Get in Touch

If you have questions, feedback, or want to collaborate:

* **Email**: [priyanshu-tiwari@hotmail.com](mailto:priyanshu-tiwari@hotmail.com)
* **Twitter/X**: [@iampriyanshu29](https://x.com/iampriyanshu29)
* **LinkedIn**: [Priyanshu Tiwari](https://www.linkedin.com/in/priyanshu-tiwarii/)

---

## Final Note

**OxyFlow** is built for developers who value automation, reliability, and simplicity. It adapts to your services, so you don't have to adapt your workflow to the proxy.

Let your containers scale freely — OxyFlow will keep up.

