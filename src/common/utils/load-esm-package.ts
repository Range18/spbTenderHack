const alreadyLoaded: Record<string, any> = {};

export const globallyLoadEsmPackage = async <T>(name: string): Promise<T> => {
  const stringForImport = `import("${name}")`;
  const imported = await eval(stringForImport);
  alreadyLoaded[name] = imported;

  return imported;
};

export const getGloballyLoadedEsmPackage = <T>(name: string): T => {
  const loaded = alreadyLoaded[name];
  if (!loaded) {
    throw new Error(`ESM Package ${name} not globally loaded.`);
  }

  return loaded;
};
