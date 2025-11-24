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

export type TLineToAdd = {
  startDockId: number;
  stops: { dockId: number; delayFromStart: number }[];
  endDockId: number;
};

export type TLineReturnable = {
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
export type TLine = {
  id: number;
  startDockId: number;
  endDockId: number;
};
export type TFormattedLine = {
  lineId: number;
  endDock: string;
  delay: number;
  via: string[];
};
