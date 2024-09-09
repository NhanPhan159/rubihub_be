import mongoose, {
  ClientSession,
  Collection,
  Connection,
  Model,
} from 'mongoose';
import { uuid } from 'uuidv4';

import configs from '../configs';

type ConnectionHooks = {
  onConnecting?: () => void;
  onConnected?: () => void;
  onOpen?: () => void;
  onDisconnecting?: () => void;
  onDisconnected?: () => void;
  onClose?: () => void;
  onReconnected?: () => void;
  onError?: (error: any) => void;
};

class DBContext {
  private connection: Connection;
  private session: Map<string, ClientSession> = new Map();
  private collections: Map<string, Collection> = new Map();

  constructor() {
    this.connection = mongoose.connection;
  }

  private async createConnection(hooks?: ConnectionHooks): Promise<Connection> {
    const connection = this.connection;
    connection.on('connecting', () => {
      if (hooks?.onConnecting) {
        hooks.onConnecting();
      }
    });

    connection.on('connected', () => {
      if (hooks?.onConnected) {
        hooks.onConnected();
      }
    });

    connection.on('open', () => {
      if (hooks?.onOpen) {
        hooks.onOpen();
      }
    });

    connection.on('disconnecting', () => {
      if (hooks?.onDisconnecting) {
        hooks.onDisconnecting();
      }
    });

    connection.on('disconnected', () => {
      if (hooks?.onDisconnected) {
        hooks.onDisconnected();
      }
    });

    connection.on('close', () => {
      if (hooks?.onClose) {
        hooks.onClose();
      }
    });

    connection.on('reconnected', () => {
      if (hooks?.onReconnected) {
        hooks.onReconnected();
      }
    });

    connection.on('error', (error) => {
      if (hooks?.onError) {
        hooks.onError(error);
      }
    });

    mongoose.connect(configs.STORAGE.CONNECTION_STRING, {
      ignoreUndefined: true,
      autoIndex: true,
    });

    return connection;
  }

  public async connect(hooks?: ConnectionHooks): Promise<void> {
    this.connection = await this.createConnection(hooks || {});
  }

  public model<T extends Document>(name: string): Model<T> {
    return this.connection.model<T>(name);
  }

  public async collectionExists(name: string): Promise<boolean> {
    if (this.collections.has(name)) {
      return true;
    }

    const db = this.connection.db;

    if (db) {
      const collections = await db.listCollections({ name }).toArray();

      if (collections.length > 0) {
        return true;
      }
    }

    return false;
  }

  public async startTransaction(): Promise<ClientSession> {
    const session = await this.connection.startSession({
      defaultTransactionOptions: {
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' },
        readPreference: 'primary',
      },
    });

    session.startTransaction();

    const id = uuid();

    this.session.set(id, session);

    return session;
  }
}

export default DBContext;
