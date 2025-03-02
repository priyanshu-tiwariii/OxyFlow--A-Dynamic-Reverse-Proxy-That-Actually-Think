import { Request, Response, NextFunction } from "express";
import Dockerode from "dockerode";
import {
  uniqueNamesGenerator,
  animals,
  adjectives,
  names,
  starWars,
} from "unique-names-generator";

const Docker = new Dockerode();

// Generate a friendly container name
const generateFriendlyName = (): string => {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals, names, starWars],
    separator: "-",
    length: 3,
  });
};

// Properly typed request handler
export const createContainers = async (
  req: Request<{}, {}, { image: string; tag?: string; name?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { image, tag = "latest", name } = req.body;
    console.log("Creating container with image:", image);

    if (!image) {
      res.status(400).json({ error: "Image name is required" });
      return;
    }

    // List available Docker images
    const images = await Docker.listImages();

    // Check if the image exists in Docker
    const imageExists = images.some((img) =>
      img.RepoTags?.includes(`${image}:${tag}`)
    );

    if (!imageExists) {
      console.log(`Image ${image}:${tag} not found. Pulling the image...`);
      await Docker.pull(`${image}:${tag}`);
      console.log(`Image ${image}:${tag} pulled successfully.`);
    }

    // Generate or use provided container name
    const containerName = name ? name : generateFriendlyName();

    // Create the container
    const container = await Docker.createContainer({
      Image: `${image}:${tag}`,
      name: `${containerName}-${Date.now()}`,
      HostConfig: {
        NetworkMode: "app-network",
        AutoRemove: true
      },
      Tty: false,
      AttachStdout: true,
      AttachStderr: true,
    });

    // Start the container
    await container.start();
    const inspectData = await container.inspect();

    res.json({
      message: `Container is running at: ${inspectData.Name}.localhost`,
    });
  } catch (error) {
    console.error("Error creating container:", error);
    next(error); // Proper error handling with Express
  }
};