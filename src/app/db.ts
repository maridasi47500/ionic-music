import "reflect-metadata"
import { DataSource } from "typeorm"
import { Song } from "./entity/song"
import {Component, OnInit } from '@angular/core';

import {NgModule} from "@angular/core";

 import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
@NgModule({
})
export class MyAppDataSource implements OnInit {
    
	constructor(){}
        pSqliteConsistent = CapacitorSQLite.checkConnectionsConsistency({
    dbNames: [], // i.e. "i expect no connections to be open"
}).catch((e) => {
    // the plugin throws an error when closing connections. we can ignore
    // that since it is expected behaviour
    console.log(e);
    return {};
});


// create the TypeORM connection
// For more information see https://typeorm.io/data-source#creating-a-new-datasource
        x:any;
        datasource:any;
        async AppDataSource() {
           const sqliteConnection = new SQLiteConnection(CapacitorSQLite);

// copy preloaded dbs (optional, not TypeORM related):
// the preloaded dbs must have the `YOUR_DB_NAME.db` format (i.e. including 
// the `.db` suffix, NOT including the internal `SQLITE` suffix from the plugin)
await sqliteConnection.copyFromAssets(); 

this.datasource = new DataSource({
    type: 'capacitor',
    driver: sqliteConnection, // pass the connection wrapper here
    database: 'YOUR_DB_NAME', // database name without the `.db` suffix
     entities: [Song],
});
  await this.datasource.initialize();
this.datasource.setOptions({
   entities: [Song],
   synchronize: true,
   dropSchema: true,
})
  return this.datasource;
        }

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
async ngOnInit(){
    this.AppDataSource();




}
  async save(song:any) {


    let photo = new Song(); 
        photo.title = song.title;
        photo.artist = song.artist;
        photo.composer = song.composer;
        photo.description = song.description;
        photo.image = song.image;
        photo.filename = song.filename
        photo.views = song.views;
        photo.isPublished = song.isPublished;
    await photo.save();
    console.log("song id is" + photo.id);
  
  }

	
	
};
