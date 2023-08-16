import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { DataSource } from 'typeorm';
import { Song } from './app/entity/song';

// when using Capacitor, you might want to close existing connections, 
// otherwise new connections will fail when using dev-live-reload
// see https://github.com/capacitor-community/sqlite/issues/106
const pSqliteConsistent = CapacitorSQLite.checkConnectionsConsistency({
    dbNames: [], // i.e. "i expect no connections to be open"
}).catch((e) => {
    // the plugin throws an error when closing connections. we can ignore
    // that since it is expected behaviour
    console.log(e);
    return {};
});

// create a SQLite Connection Wrapper
const sqliteConnection = new SQLiteConnection(CapacitorSQLite);

// copy preloaded dbs (optional, not TypeORM related):
// the preloaded dbs must have the `YOUR_DB_NAME.db` format (i.e. including 
// the `.db` suffix, NOT including the internal `SQLITE` suffix from the plugin)
await sqliteConnection.copyFromAssets();

// create the TypeORM connection
// For more information see https://typeorm.io/data-source#creating-a-new-datasource
export default new DataSource({
    type: 'capacitor',
    driver: sqliteConnection, // pass the connection wrapper here
    database: 'YOUR_DB_NAME.db',
    entities:[Song] // database name without the `.db` suffix
});


    
