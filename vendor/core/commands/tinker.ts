import { Command } from "@/vendor/commands";
import * as repl from "repl";
import { join } from "path";
import LoadEnviroment from "@/core/lib/loadEnviroment";
import RedisConfig from "@/config/redis";
import EventDispatcher from "@/vendor/events";
import { io, Socket } from "socket.io-client";

const TinkerCommand: Command = {
  aliases: ["tinker"],
  description: "Interact with the application",
  async handler(args: any) {
    console.log("\n🔧 Overreact Tinker - Interactive Shell");
    console.log("Type 'help' for available commands\n");

    // Load environment
    const { HttpKernel, CommandKernel } = await LoadEnviroment();

    // Create REPL server
    const replServer = repl.start({
      prompt: "overreact> ",
      useGlobal: true,
    });

    // Add global context
    const context = replServer.context;

    // Load models
    try {
      const modelsPath = join(process.cwd(), "app/Models");
      const { readdirSync } = await import("fs");
      const modelFiles = readdirSync(modelsPath).filter((f) => f.endsWith(".ts"));

      for (const file of modelFiles) {
        const modelName = file.replace(".ts", "");
        const model = await import(`@/app/Models/${modelName}`);
        context[modelName] = model.default || model;
      }
    } catch (error) {
      // Models directory might not exist
    }

    // Load controllers
    try {
      const controllersPath = join(process.cwd(), "app/Http/Controllers");
      const { readdirSync } = await import("fs");
      const controllerFiles = readdirSync(controllersPath).filter((f) => f.endsWith(".ts"));

      for (const file of controllerFiles) {
        const controllerName = file.replace(".ts", "");
        const controller = await import(`@/app/Http/Controllers/${controllerName}`);
        context[controllerName] = controller.default || controller;
      }
    } catch (error) {
      // Controllers directory might not exist
    }

    // Load services
    try {
      const servicesPath = join(process.cwd(), "app/Services");
      const { readdirSync } = await import("fs");
      const serviceFiles = readdirSync(servicesPath).filter((f) => f.endsWith(".ts"));

      for (const file of serviceFiles) {
        const serviceName = file.replace(".ts", "");
        const service = await import(`@/app/Services/${serviceName}`);
        context[serviceName] = service.default || service;
      }
    } catch (error) {
      // Services directory might not exist
    }

    // Load events
    try {
      const eventsPath = join(process.cwd(), "app/Events");
      const { readdirSync } = await import("fs");
      const eventFiles = readdirSync(eventsPath).filter((f) => f.endsWith(".ts"));

      for (const file of eventFiles) {
        const eventName = file.replace(".ts", "");
        const eventModule = await import(`@/app/Events/${eventName}`);
        // Load all exports from the module
        Object.assign(context, eventModule);
      }
    } catch (error) {
      // Events directory might not exist
    }

    // Connection state
    let socket: Socket | null = null;
    let isConnected = false;
    let eventDispatcher: EventDispatcher | null = null;

    // Connect to Socket.IO server
    const connectSocket = () => {
      return new Promise<void>((resolve) => {
        try {
          socket = io("http://localhost:3000", {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
          });

          socket.on("connect", () => {
            isConnected = true;
            console.log(`✅ Connected to Socket.IO server\n`);
            resolve();
          });

          socket.on("disconnect", () => {
            isConnected = false;
            console.log(`\n❌ Disconnected from Socket.IO server`);
          });

          socket.on("connect_error", (error: any) => {
            console.error(`\n⚠️  Socket.IO connection error:`, error.message);
          });

          // Timeout after 5 seconds
          setTimeout(() => {
            if (!isConnected) {
              console.warn(`\n⚠️  Could not connect to Socket.IO server. Make sure the server is running.`);
              resolve();
            }
          }, 5000);
        } catch (error) {
          console.warn(`\n⚠️  Could not connect to Socket.IO server.`);
          resolve();
        }
      });
    };

    // Add utility functions
    context.help = () => {
      console.log(`
📚 Available Commands:
  help()              - Show this help message
  exit()              - Exit tinker
  clear()             - Clear screen
  emit(event)         - Emit an event
  
📦 Loaded Classes:
  Models              - All models from app/Models
  Controllers         - All controllers from app/Http/Controllers
  Services            - All services from app/Services
  Events              - All events from app/Events
  
💡 Examples:
  new User()          - Create a new model instance
  await User.all()    - Query all users
  new UserController() - Instantiate a controller
  emit(new TestBroadcastEvent("Hello!", "success")) - Emit an event
      `);
    };

    context.clear = () => {
      console.clear();
    };

    context.emit = (event: any) => {
      if (!isConnected || !eventDispatcher) {
        console.error("❌ Not connected to Socket.IO server");
        return;
      }
      eventDispatcher.dispatch(event);
      console.log(`✅ Event emitted: ${event.constructor.name}`);
    };

    // Connect and initialize
    await connectSocket();

    // Initialize EventDispatcher with Redis config
    const redisUrl = `redis://${RedisConfig.password ? `:${RedisConfig.password}@` : ""}${RedisConfig.host}:${RedisConfig.port}/${RedisConfig.db}`;
    eventDispatcher = new EventDispatcher(socket || { emit: () => {} }, redisUrl);

    // Show help on start
    context.help();

    // Handle exit
    replServer.on("exit", () => {
      if (socket) {
        socket.disconnect();
      }
      console.log("\n👋 Goodbye!\n");
      process.exit(0);
    });
  },
};

export default TinkerCommand;
