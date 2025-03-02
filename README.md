# **🌊 OxyFlow – A Dynamic Reverse Proxy That Actually Think !!**  

## **💀 The Problem – Why I Built OxyFlow**  

A few months ago, I was working on a **Dockerized microservices project**. Everything was running smoothly—until it wasn’t.  

Here’s what happened:  

I had multiple services running inside **Docker containers**. Some were for user authentication, some for data processing, and some for handling payments. To make everything accessible, I needed a **reverse proxy** to route requests to the correct service.  

I started with **Nginx**—because that’s what everyone does, right? But soon, I ran into **frustrating issues**:  

- **Every time a new container spun up, I had to manually update Nginx’s config.**  
- **When a container’s IP changed, the proxy failed, causing downtime.**  
- **Scaling services dynamically? Forget it. Nginx had no idea when a new instance was added.**  

So, I thought, **“There has to be a better way!”**  

I tried **Traefik**, but it felt overkill for my use case. **Caddy** was easy to set up, but it didn’t give me enough flexibility. **Everything required some level of manual intervention, and that was the problem.**  

That’s when I built **OxyFlow**—a reverse proxy that is truly **dynamic, self-aware, and designed for modern, containerized applications.**  

---

## **🚀 How OxyFlow Fixes This Mess**  

Instead of relying on static configurations, OxyFlow **automatically discovers** and manages services in real time.  

Here’s how it works:  

✅ **Auto-Discovery** – No need to manually register services. OxyFlow finds them on its own.  
✅ **IP Caching with Redis** – Once a service is discovered, its IP is cached in **Redis**, so we don’t have to search for it every time. **Faster requests, less overhead.**  
✅ **No Manual Configs** – Start a new service? OxyFlow automatically updates.  
✅ **Instant Scaling** – If a new container is added or removed, OxyFlow adapts immediately.  
✅ **Built for Docker** – Uses **Dockerode** to communicate with the Docker environment and fetch running container details.  
✅ **Efficient Proxying** – Uses **HTTP-Proxy** to forward traffic seamlessly.  

With **OxyFlow**, I can now **spin up, scale, and kill containers** without worrying about updating a proxy. Everything just works—like magic.  

---

## **🛠️ Tech Stack & Why I Chose It**  

| **Technology** | **Why It’s Used?** |  
|--------------|-----------------|  
| **Node.js** | Fast and non-blocking, perfect for handling real-time requests. |  
| **Express.js** | Simplifies routing and API handling. |  
| **Redis** | Caches container IPs so we don’t waste time searching. |  
| **Dockerode** | Talks to the Docker environment, detects new/removed services. |  
| **HTTP-Proxy** | Forwards requests efficiently to the correct service. |  

---

## **🔧 How to Set Up & Run OxyFlow**  

### **Step 1: Clone the Repository**  
```sh
git clone https://github.com/impriyanshu29/oxyflow.git
cd OxyFlow
```

### **Step 2: Intall all dependencies*   
```ini
npm install
```

### **Step 3: Run It with Docker**  
```sh
docker-compose up --build
```

### **Step 4: Example – Register a New Service**  
Let’s say we have a containerized service. Normally, you’d have to update a proxy config, right?  

Not with OxyFlow! Just register the service like this:  
```sh
docker run  --rm --network app-network --name  ptn nginx
```
💨 **Done! OxyFlow caches it, routes traffic automatically, and you don’t have to restart anything!**  

---

## **📞 Need Help? Let’s Connect!**  

📧 **Email:** iampriyanshu2901@hotmail.com  
🐦 **X:** [@iampriyanshu29](https://x.com/iampriyanshu29)  
💼 **LinkedIn:** [Priyanshu Tiwari](https://www.linkedin.com/in/priyanshu-tiwarii/)  

---

### **🔹 OxyFlow – The Proxy That Just Works.**  
Built for developers who **hate downtime and love automation.** 🚀  

---
