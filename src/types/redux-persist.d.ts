// Storage Module
declare module "redux-persist/lib/storage" {
  interface WebStorage {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, item: string): Promise<void>;
    removeItem(key: string): Promise<void>;
  }

  const storage: WebStorage;
  export default storage;
}

declare module "redux-persist/es/storage" {
  interface WebStorage {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, item: string): Promise<void>;
    removeItem(key: string): Promise<void>;
  }

  const storage: WebStorage;
  export default storage;
}

// PersistStore Module
declare module "redux-persist/es/persistStore" {
  import { Store, Action } from "redux";

  interface Persistor {
    purge(): Promise<void>;
    flush(): Promise<void>;
    pause(): void;
    persist(): void;
  }

  interface PersistConfig<S> {
    key: string;
    storage: WebStorage;
    whitelist?: Array<keyof S>;
    blacklist?: Array<keyof S>;
    version?: number;
    migrate?: (state: S, version: number) => Promise<S>;
    stateReconciler?: (inboundState: S, originalState: S) => S;
  }

  function persistStore<S, A extends Action>(
    store: Store<S, A>,
    config?: PersistConfig<S>
  ): Persistor;

  export default persistStore;
}

// PersistReducer Module
declare module "redux-persist/es/persistReducer" {
  import { Reducer, Action } from "redux";

  interface PersistConfig<S> {
    key: string;
    storage: WebStorage;
    whitelist?: Array<keyof S>;
    blacklist?: Array<keyof S>;
    version?: number;
    migrate?: (state: S, version: number) => Promise<S>;
    stateReconciler?: (inboundState: S, originalState: S) => S;
  }

  function persistReducer<S, A extends Action>(
    config: PersistConfig<S>,
    baseReducer: Reducer<S, A>
  ): Reducer<S, A>;

  export default persistReducer;
}
