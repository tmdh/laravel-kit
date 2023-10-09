type ConnectionOpenProjectResponse =
  | {
      success: true;
      output: string;
      basename: string;
    }
  | { success: false };

type ConnectionFactoryOptions = {
  type: "LocalFolder";
  dir: string;
};

export { ConnectionOpenProjectResponse, ConnectionFactoryOptions };
