import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteDBConnection, CapacitorSQLitePlugin,SQLiteConnection, capSQLiteSet,
         capSQLiteChanges, capSQLiteValues, capEchoResult, capSQLiteResult 
        } from '@capacitor-community/sqlite';

@Injectable()

export class SQLiteService {
    sqlite: SQLiteConnection;
    isService: boolean = false;
    platform: string;
    sqlitePlugin: any;
    native: boolean = false;
    x: CapacitorSQLitePlugin;
    constructor() {
    }
    
    /**
     * Plugin Initialization
     */
 
    async initWebStore(): Promise<void> {
        this.ensureIsWebPlatform();
        this.ensureConnectionIsOpen();
        return this.sqlite.initWebStore();
    }
    async saveToStore(database: string): Promise<void> {
        this.ensureIsWebPlatform();
        this.ensureConnectionIsOpen();
        return this.sqlite.saveToStore(database);
    }

    private ensureConnectionIsOpen() {
        if ( this.sqlite == null ) {
            throw new Error(`no connection open`);
        }
    }

    private ensureIsNativePlatform() {
        if ( !this.native ) {
            throw new Error(`Not implemented for ${this.platform} platform`);
        }
    }

    private ensureIsWebPlatform() {
        if ( this.platform !== 'web' ) {
            throw new Error(`Not implemented for ${this.platform} platform`);
        }
    }
    initializePlugin(): Promise<boolean> {
        return new Promise (resolve => {
            this.platform = Capacitor.getPlatform();
            if(this.platform === 'ios' || this.platform === 'android') this.native = true;
            this.sqlitePlugin = CapacitorSQLite;
            this.sqlite = new SQLiteConnection(this.sqlitePlugin);
            this.isService = true;
            resolve(true);
        });
    }
    /**
     * Echo a value
     * @param value 
     */
    async echo(value: string): Promise<capEchoResult> {
        if(this.sqlite != null) {
            try {
                return await this.sqlite.echo(value);
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error("no connection open"));
        }
    }
    async isSecretStored(): Promise<capSQLiteResult> {
        if(!this.native) {
            return Promise.reject(new Error(`Not implemented for ${this.platform} platform`));
        }
        if(this.sqlite != null) {
            try {
                return Promise.resolve(await this.sqlite.isSecretStored());
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }
    async setEncryptionSecret(passphrase: string): Promise<void> {
        if(!this.native) {
            return Promise.reject(new Error(`Not implemented for ${this.platform} platform`));
        }
        if(this.sqlite != null) {
            try {
                return Promise.resolve(await this.sqlite.setEncryptionSecret(passphrase));
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }

    }

    async changeEncryptionSecret(passphrase: string, oldpassphrase: string): Promise<void> {
        if(!this.native) {
            return Promise.reject(new Error(`Not implemented for ${this.platform} platform`));
        }
        if(this.sqlite != null) {
            try {
                return Promise.resolve(await this.sqlite.changeEncryptionSecret(passphrase, oldpassphrase));
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }

    }

    /**
     * addUpgradeStatement
     * @param database 
     * @param fromVersion 
     * @param toVersion 
     * @param statement 
     * @param set 
     */
    async addUpgradeStatement(database:string, fromVersion: number,
                              toVersion: number, statement: string,
                              set?: capSQLiteSet[])
                                        : Promise<void> {
        if(this.sqlite != null) {
            try {
                await this.sqlite.addUpgradeStatement(database, fromVersion, [String(toVersion)]);
                return Promise.resolve();
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error(`no connection open for ${database}`));
        }                             
    }
    /**
     * Create a connection to a database
     * @param database 
     * @param encrypted 
     * @param mode 
     * @param version 
     */
    async createConnection(database:string, encrypted: boolean,
                           mode: string, version: number
                           ): Promise<SQLiteDBConnection> {
        if(this.sqlite != null) {
            try {
                const db: SQLiteDBConnection = await this.sqlite.createConnection(
                                database, encrypted, mode, version,false);
                if (db != null) {
                    return Promise.resolve(db);
                } else {
                    return Promise.reject(new Error(`no db returned is null`));
                }
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error(`no connection open for ${database}`));
        }
    }
    /**
     * Close a connection to a database
     * @param database 
     */
    async closeConnection(database:string): Promise<void> {
        if(this.sqlite != null) {
            try {
                await this.sqlite.closeConnection(database,false);
                return Promise.resolve();
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error(`no connection open for ${database}`));
        }
    }
    /**
     * Retrieve an existing connection to a database
     * @param database 
     */
    async retrieveConnection(database:string): 
            Promise<SQLiteDBConnection> {
        if(this.sqlite != null) {
            try {
                return Promise.resolve(await this.sqlite.retrieveConnection(database,false));
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error(`no connection open for ${database}`));
        }
    }
    /**
     * Retrieve all existing connections
     */
    async retrieveAllConnections(): 
                    Promise<Map<string, SQLiteDBConnection>> {
        if(this.sqlite != null) {
            try {
                const myConns =  await this.sqlite.retrieveAllConnections();
/*                let keys = [...myConns.keys()];
                keys.forEach( (value) => {
                    console.log("Connection: " + value);
                }); 
*/
                return Promise.resolve(myConns);
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }               
    }
    /**
     * Close all existing connections
     */
    async closeAllConnections(): Promise<void> {
        if(this.sqlite != null) {
            try {
                return Promise.resolve(await this.sqlite.closeAllConnections());
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }
    /**
     * Check if connection exists
     * @param database 
     */
     async isConnection(database: string): Promise<capSQLiteResult> {
        if(this.sqlite != null) {
            try {
                return Promise.resolve(await this.sqlite.isConnection(database,false));
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }
    /**
     * Check Connections Consistency
     * @returns 
     */
    async checkConnectionConsistency(): Promise<capSQLiteResult> {
        if(this.sqlite != null) {
            try {
                const res = await this.sqlite.checkConnectionsConsistency();
                return Promise.resolve(res);
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }
    /**
     * Check if database exists
     * @param database 
     */
    async isDatabase(database: string): Promise<capSQLiteResult> {
        if(this.sqlite != null) {
            try {
                return Promise.resolve(await this.sqlite.isDatabase(database));
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }
    /**
     * Get the list of databases
     */    
    async getDatabaseList() : Promise<capSQLiteValues> {
        if(this.sqlite != null) {
            try {
                return Promise.resolve(await this.sqlite.getDatabaseList());
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }
    /**
     * Add "SQLite" suffix to old database's names
     */    
    async addSQLiteSuffix(folderPath?: string): Promise<void>{
        if(!this.native) {
            return Promise.reject(new Error(`Not implemented for ${this.platform} platform`));
        }
        if(this.sqlite != null) {
            try {
                const path: string = folderPath ? folderPath : "default";
                return Promise.resolve(await this.sqlite.addSQLiteSuffix(path));
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }
    /**
     * Delete old databases
     */    
    async deleteOldDatabases(folderPath?: string): Promise<void>{
        if(!this.native) {
            return Promise.reject(new Error(`Not implemented for ${this.platform} platform`));
        }
        if(this.sqlite != null) {
            try {
                const path: string = folderPath ? folderPath : "default";
                return Promise.resolve(await this.sqlite.deleteOldDatabases(path));
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
    }

    /**
     * Import from a Json Object
     * @param jsonstring 
     */
    async importFromJson(jsonstring:string): Promise<capSQLiteChanges> {
        if(this.sqlite != null) {
            try {
                return Promise.resolve(await this.sqlite.importFromJson(jsonstring));
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
                    
    }

    /**
     * Is Json Object Valid
     * @param jsonstring Check the validity of a given Json Object
     */

    async isJsonValid(jsonstring:string): Promise<capSQLiteResult> {
        if(this.sqlite != null) {
            try {
                return Promise.resolve(await this.sqlite.isJsonValid(jsonstring));
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }

    }

    /**
     * Copy databases from public/assets/databases folder to application databases folder
     */
    async copyFromAssets(): Promise<void> { 
        if (this.sqlite != null) {
            try {
                return Promise.resolve(await this.sqlite.copyFromAssets());
            } catch (err) {
                return Promise.reject('error : ${err}');
            }
        } else {
            return Promise.reject(new Error(`no connection open`));
        }
      }


    /**
     * Get the Sqlite Plugin
     * @returns
     */
    getSqlitePlugin() {
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
    getSqliteConnection() {
      return this.sqlite;
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


    
}