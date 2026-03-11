export default async function LoadEnviroment() {
  // Dynamic import to support hot reloading in dev mode
  // Adding timestamp to bust the import cache
  const timestamp = Date.now();
  
  // Load controllers dynamically
  const controllerFiles = await (await import('fs/promises')).readdir('app/Http/Controllers');
  const controllers: Record<string, any> = {};
  for (const file of controllerFiles.filter(f => f.endsWith('.ts'))) {
    const name = file.replace('.ts', '');
    const module = await import(`${process.cwd()}/app/Http/Controllers/${file}?t=${timestamp}`);
    controllers[name] = new module.default();
  }

  // Load middleware dynamically
  const middlewareFiles = await (await import('fs/promises')).readdir('app/Http/Middleware');
  const routeMiddleware: Record<string, any> = {};
  for (const file of middlewareFiles.filter(f => f.endsWith('.ts'))) {
    const name = file.replace('.ts', '').replace('Middleware', '');
    const module = await import(`${process.cwd()}/app/Http/Middleware/${file}?t=${timestamp}`);
    routeMiddleware[name] = new module.default();
  }

  // Load kernel structure (for middleware arrays and groups)
  const HttpKernelModule = await import(`@/app/Http/Kernel?t=${timestamp}`);
  const CommandKernelModule = await import(`@/app/Console/Kernel?t=${timestamp}`);
  
  const HttpKernel = {
    ...HttpKernelModule.default,
    controllers,
    routeMiddleware,
  };
  
  return {
    HttpKernel,
    CommandKernel: CommandKernelModule.default,
  };
}
