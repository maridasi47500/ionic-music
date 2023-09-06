import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Song } from './song';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,Observable } from 'rxjs';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import {SQLite,SQLiteObject} from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable( {
    providedIn: 'root',
} )
export class DbService {
    private storage: SQLiteObject;
    songsList: any = new BehaviorSubject( [] );
    sqlite: any= SQLite;
    private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject( false );
    constructor(
        private platform: Platform,
        
        private httpClient: HttpClient,
        private sqlPorter: SQLitePorter
    ) {
        this.platform.ready().then( () => {
            this.sqlite
                .create( {
                    name: 'positronx_db.db',
                    location: 'default',
                } )
                .then( ( db: SQLiteObject ) => {
                    this.storage = db;
                    this.getFakeData();
                } );
        } );
    }
    dbState() {
        return this.isDbReady.asObservable();
    }
    fetchSongs(): Observable<Song[]> {
        return this.songsList.asObservable();
    }
    // Render fake data
    getFakeData() {
        this.httpClient
            .get( 'assets/dump.sql',{ responseType: 'text' } )
            .subscribe( ( data ) => {
                this.sqlPorter
                    .importSqlToDb( this.storage,data )
                    .then( ( _ ) => {
                        this.getSongs();
                        this.isDbReady.next( true );
                    } )
                    .catch( ( error ) => console.error( error ) );
            } );
    }
    // Get list
    getSongs() {
        return this.storage
            .executeSql( 'SELECT * FROM songtable',[] )
            .then( ( res ) => {
                let items: Song[] = [];
                if ( res.rows.length > 0 ) {
                    for ( var i = 0;i < res.rows.length;i++ ) {
                        items.push( {
                    id: res.rows.item( i ).id,
                    artist: res.rows.item( i ).artist,
                    title: res.rows.item( i ).title,
                    composer: res.rows.item( i ).composer,
                    description: res.rows.item( i ).description,
                    filename: res.rows.item( i ).filename,
                    image: res.rows.item( i ).image,
                    views: res.rows.item( i ).views,
                    isPublished: res.rows.item( i ).isPublished,
                        } );
                    }
                }
                this.songsList.next( items );
            } );
    }
    // Add
    addSong( artist: any,title: any ) {
        let data = [ artist,title ];
        return this.storage
            .executeSql(
                'INSERT INTO songtable (artist,title,composer,description,filename,image,views,isPublished) VALUES (?, ?,?,?,?,?,?,?)',
                data
            )
            .then( ( res ) => {
                this.getSongs();
            } );
    }
    // Get single object
    getSong( id: any ): Promise<Song> {
        return this.storage
            .executeSql( 'SELECT * FROM songtable WHERE id = ?',[ id ] )
            .then( ( res ) => {
                return {
                    id: res.rows.item( 0 ).id,
                    artist: res.rows.item( 0 ).artist,
                    title: res.rows.item( 0 ).title,
                    composer: res.rows.item( 0 ).composer,
                    description: res.rows.item( 0 ).description,
                    filename: res.rows.item( 0 ).filename,
                    image: res.rows.item( 0 ).image,
                    views: res.rows.item( 0 ).views,
                    isPublished: res.rows.item( 0 ).isPublished,
                };
            } );
    }
    // Update
    updateSong( id: any,song: Song ) {
        let data = [ song.title,song.artist,song.composer,song.description,song.filename,song.image,song.views,song.isPublished ];
        return this.storage
            .executeSql(
                `UPDATE songtable SET title = ?, artist = ?,composer = ?,description= ?,filename= ?,image = ?,views = ?,isPublished = ? WHERE id = ${ id }`,
                data
            )
            .then( ( data ) => {
                this.getSongs();
            } );
    }
    // Delete
    deleteSong( id: any ) {
        return this.storage
            .executeSql( 'DELETE FROM songtable WHERE id = ?',[ id ] )
            .then( ( _ ) => {
                this.getSongs();
            } );
    }
}