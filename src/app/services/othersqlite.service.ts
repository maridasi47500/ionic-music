import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, /*SQLiteDBConnection,*/ SQLiteConnection, CapacitorSQLitePlugin } from '@capacitor-community/sqlite';

@Injectable()

export class SQLiteService {
    sqliteConnection: SQLiteConnection;
    isService = false;
    platform: string;
    sqlitePlugin: any;
    native = false;

    constructor(@Inject(CapacitorSQLitePlugin) private x: CapacitorSQLitePlugin, private y: typeof CapacitorSQLite) {

    }

    async initializeWebStore() {
      if(this.platform === 'web') {
        try {
          await this.x.initWebStore();
        } catch (err) {
          console.log(`Error: ${err}`);
          throw new Error(`Error: ${err}`)
        }
      }
    }
    /**
     * Get the Sqlite Plugin
     * @returns
     */
    getSqlitePlugin(): CapacitorSQLitePlugin {
      return this.sqlitePlugin;
    }
    /**
     * Get the Platform
     * @returns
     */
    getPlatform(): string {
      return this.platform;
    }
    /**
     * Get the Sqlite Connection
     * @returns
     */
    getSqliteConnection(): SQLiteConnection {
      return this.sqliteConnection;
    }
    /**
     * Get if the platform is native
     * @returns
     */
    getIsNative(): boolean {
      return this.native;
    }
    /**
     * Get if the service is initialized
     * @returns
     */
    getIsService(): boolean {
      return this.isService;
    }
    /**
     * Check Connection Consistency
     * @returns
     */
    async checkConnectionConsistency(): Promise<void> {
      try {
/*        await this.sqlitePlugin.checkConnectionsConsistency({
          dbNames: [], // i.e. "i expect no connections to be open"
        });
*/
        await this.sqliteConnection.checkConnectionsConsistency();
      } catch (err: any) {
        const msg = err.message ? err.message : err;
        return Promise.reject(`Error: ${msg}`);
      }
    }
  }
