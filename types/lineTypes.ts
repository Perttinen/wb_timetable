export type TLineRaw = {
  id: number;
  startDock?: {
    name: string;
    id: number;
  };
  endDock?: {
    name: string;
    id: number;
  };
  docks?: {
    name: string;
    id: number;
    lineDock: {
      delayFromStart: number;
    };
  }[];
};

export type TLineRequest = {
  startDockId: number;
  stops: { dockId: number; delayFromStart: number }[];
  endDockId: number;
};

export type TLineResponse = {
  id: number;
  startDock: {
    name: string;
    id: number;
  };
  endDock: {
    name: string;
    id: number;
  };
  stopDocks: {
    name: string;
    id: number;
    delayFromStart: number;
  }[];
};

export type TUpdateLineRequest = {
  id: string;
  body: TLineRequest;
};
