export type TDeleteDeparturesPayload = {
  lineId: number;
  fromDate: string;
  toDate: string;
  fromTime: string;
  toTime: string;
  weekdays: boolean[];
};

export type TInputDeparture = {
  lineId: number;
  start: Date;
};

export type TDeparture = {
  id: number;
  lineId: number;
  start: Date;
};

export type TDepartureForTimetable = {
  destination: string;
  startTime: Date;
  via: string[];
};
