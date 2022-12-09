export type Node = "Entrance" | "Exit";
export type NodeInfo = EntranceNodeInfo | ExitNodeInfo;

type NodeBase = {
  alpr: {
    connected_timestamp: string;
    status: {
      candidate_key: string;
      license_numbers?: Array<string>;
    };
    command: string;
  };
  controller: {
    connected_timestamp: string;
    status: {
      mode: boolean;
      b_open: boolean;
      b_close: boolean;
      k_hover: boolean;
      k_button: boolean;
      p_has_car: boolean;
      p_barricade: boolean;
    };
    config: {
      hover_cms: number;
      car_cms: number;
    };
    command: string;
  };
};

type StateBase = {
  command: string;
  connected_timestamp: string;
};

type EntranceNodeInfo = {
  node: "Entrance";
  state: {
    status: EntranceStatus;
  } & StateBase;
} & NodeBase;

type EntranceState = "idle" | "detect" | "process" | "success" | "failed";

interface StateStatusBase<T> {
  prev_state: T;
  next_state: T;
  enter_timestamp: string;
  info?: object;
}

type EntranceStatus =
  | EntranceStateIdle
  | EntranceStateDetect
  | EntranceStateProcess
  | EntranceStateSuccess
  | EntranceStateFailed;

type EntranceStateIdle = {
  current_state: "idle";
} & StateStatusBase<EntranceState>;

type EntranceStateDetect = {
  current_state: "detect";
} & StateStatusBase<EntranceState>;

type EntranceStateProcess = {
  current_state: "process";
  info: {
    license_number: string;
  };
} & StateStatusBase<EntranceState>;

type EntranceStateSuccess = {
  current_state: "success";
  info: {
    tid: string;
    is_car_pass: boolean;
  };
} & StateStatusBase<EntranceState>;

type EntranceStateFailed = {
  current_state: "failed";
  info: {
    reason: string;
    tid?: string;
    call_staff: boolean;
  };
} & StateStatusBase<EntranceState>;

type ExitNodeInfo = {
  node: "Exit";
  state: {
    status: ExitStatus;
  } & StateBase;
} & NodeBase;

type ExitState = "idle" | "detect" | "get" | "success" | "payment" | "failed";

type ExitStatus =
  | ExitStateIdle
  | ExitStateDetect
  | ExitStateGet
  | ExitStateSuccess
  | ExitStatePayment
  | ExitStateFailed;

type ExitStateIdle = {
  current_state: "idle";
} & StateStatusBase<ExitState>;

type ExitStateDetect = {
  current_state: "detect";
  info: {
    checked_license_numbers: Array<string>;
  };
} & StateStatusBase<ExitState>;

type ExitStateGet = {
  current_state: "get";
  info: {
    tid: string;
    license_number: string;
  };
} & StateStatusBase<ExitState>;

type ExitStateSuccess = {
  current_state: "success";
  info: {
    tid: string;
    is_car_pass: boolean;
  };
} & StateStatusBase<ExitState>;

type ExitStatePayment = {
  current_state: "payment";
  info: {
    tid: string;
    call_staff: boolean;
  };
} & StateStatusBase<ExitState>;

type ExitStateFailed = {
  current_state: "failed";
  info: {
    reason: string;
    tid?: string;
    call_staff: boolean;
  };
} & StateStatusBase<ExitState>;

export type EditNodeForm = {
  hover_cms: number;
  car_cms: number;
};

export type SettingsInfo = {
  fee: number;
  promptpay: string;
};

export type SettingsForm = SettingsInfo;
