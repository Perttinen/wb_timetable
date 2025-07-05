export const iLineReturnableTestObject = {
  id: expect.any(Number),
  startDock: {
    id: expect.any(Number),
    name: expect.any(String),
  },
  endDock: {
    id: expect.any(Number),
    name: expect.any(String),
  },
  stopDocks: [
    {
      id: expect.any(Number),
      name: expect.any(String),
      delayFromStart: expect.any(Number),
    },
    {
      id: expect.any(Number),
      name: expect.any(String),
      delayFromStart: expect.any(Number),
    },
  ],
};

export const iDockTestObject = {
  id: expect.any(Number),
  name: expect.any(String),
};
