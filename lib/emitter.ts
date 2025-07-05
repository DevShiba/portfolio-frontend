import mitt from "mitt";

type Events = {
  "shader:running": void;
  "loader:end": void;
};

export const emitter = mitt<Events>();
