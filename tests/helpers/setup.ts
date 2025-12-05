import initializeTestDb from "./initializeTestDb";

export const setupDb = async () => {
  const inits = await initializeTestDb();
  return {
    docks: inits?.docksDb ?? [],
    lineIds: inits?.lineIdsDb ?? [],
  };
};
