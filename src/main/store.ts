import Store from "electron-store";

interface KitStore {
  recents: string[];
  verbosity: number;
  env: string;
  editor: string;
  dark: boolean;
  php: string;
}

const defaults: KitStore = {
  recents: [],
  verbosity: 1,
  env: "",
  editor: "echo 'No command specified'",
  dark: true,
  php: ""
};

const store = new Store<KitStore>({ defaults });

export { KitStore, store };
