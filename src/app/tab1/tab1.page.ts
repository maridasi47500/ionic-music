import { HttpClient,HttpEventType } from '@angular/common/http';
import { Component,Input,OnInit } from '@angular/core';
import * as CapacitorSQLPlugin from '@capacitor-community/sqlite';
import { Plugins } from '@capacitor/core';
import { Directory,Encoding,Filesystem } from '@capacitor/filesystem';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Subscription,Observable } from 'rxjs';
import { Song } from "../services/song";
const { CapacitorSQLite,Device } = Plugins;
import {SQLite, SQLiteObject} from '@awesome-cordova-plugins/sqlite/ngx';

import {SQLitePorter} from '@awesome-cordova-plugins/sqlite-porter/ngx';

import { catchError,map } from "rxjs/operators";

import { throwError } from "rxjs";
import { Platform } from '@ionic/angular';

import { ElementRef,ViewChild } from '@angular/core';
import { FormBuilder,FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastController } from '@ionic/angular';
import { DbService } from './../services/db.service';
@Component( {
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: [ 'tab1.page.scss' ]
} )
export class Tab1Page implements OnInit {
    
    httpClient: any;
    private storage: SQLiteObject;
    isDbReady: any;
    sqliteService: any;
    songsList: any;
    constructor(private platform: Platform,
    private sqlPorter: SQLitePorter, 
 private sqlite: SQLite,private fileOpener: FileOpener,private http: HttpClient,private db: DbService,
        public formBuilder: FormBuilder,
        private toast: ToastController,
        private router: Router ) {
        this.platform.ready().then( () => {
            this.sqlite
                .create( {
                    name: 'positonx_db.db',
                    location: 'default',
                } )
                .then( ( db: SQLiteObject ) => {
                    console.log(db,"MYDB");
                    this.storage = db;
                    this.getFakeData();
                } );
        } );
    }
    mainForm: FormGroup;
    Data: any[] = []

    @ViewChild( "fileUpload" ) fileUpload: ElementRef;
    @ViewChild( "imageUpload" ) imageUpload: ElementRef;
    progress: number;
    mydata: any = { "title": "","composer": "","description": "","artist": "","filename": "","image": "" };
    


    @Input()
    requiredFileType: string = "audio/*";
    requiredImage: string;
    requiredImageType: string = "image/*";
    imageFilename: any;
    imageContent: any;
    fileName = '';
    uploadProgress: number;
    uploadSub: Subscription;



    ngOnInit(): void {
        this.db.dbState().subscribe( ( res ) => {
            if ( res ) {
                this.db.fetchSongs().subscribe( item => {
                    this.Data = item
                } )
            }
        } );
        this.mainForm = this.formBuilder.group( {
            artist: [ '' ],
            song: [ '' ]
        } )


    }
    storeData() {
        this.db.addSong(
            this.mainForm.value.artist,
            this.mainForm.value.song
        ).then( ( res ) => {
            this.mainForm.reset();
        } )
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
                            composer: res.rows.item( i ).composer,
                            description: res.rows.item( i ).description,
                            filename: res.rows.item( i ).filename,
                            image: res.rows.item( i ).image,
                            title: res.rows.item( i ).title,

                            views: res.rows.item( i ).views,
                            isPublished: res.rows.item( i ).isPublished,
                        } );
                    }
                }
                this.songsList.next( items );
            } );
    }
    // Add
    addSong( title: any,artist: any,composer: any,description: any,image: any,filename: any,views: any,isPublished: any ) {
        let data = [ title,artist,composer,description,filename,image,views,isPublished ];
        return this.storage
            .executeSql(
                'INSERT INTO songtable (title,artist,composer,description,filename,image,views,isPublished) VALUES (?, ?,?,?,?,?,?,?)',
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
                            composer: res.rows.item( 0 ).composer,
                            description: res.rows.item( 0 ).description,
                            filename: res.rows.item( 0 ).filename,
                            image: res.rows.item( 0 ).image,
                            title: res.rows.item( 0 ).title,

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
                `UPDATE songtable SET title = ?,artist = ?,composer = ?,description = ?,filename = ?,image = ?,views = ?,isPublished = ? WHERE id = ${ id }`,
                data
            )
            .then( ( data ) => {
                this.getSongs();
            } );
    }
    deleteSong( id: any ) {
        this.db.deleteSong( id ).then( async ( res ) => {
            let toast = await this.toast.create( {
                message: 'Song deleted',
                duration: 2500
            } );
            toast.present();
        } )
    }
    async initOrmService() {
        try {

            console.log( `*** ORM service has been initialized ***` )
        } catch ( err: any ) {
            const msg = err.message ? err.message : err
            throw new Error( `Error: ${ msg }` );
        }
    }
    ajouterunechanson() {
        const file: File = this.fileUpload.nativeElement.files[ 0 ];
        var types = !( ( /audio\/mpeg|audio\/mp3|audio\/mp4|audio\/ogg|audio\/x+|wav/ ).test( file.type ) );

        if ( !!types ) {
            console.log( 'no audio file' );
            return;
        };
        const image: File = this.imageUpload.nativeElement.files[ 0 ];
        var imagetypes = !( ( /image\/png|image\/jpg|image\/gif|audio\/x+|wav/ ).test( image.type ) );

        if ( !!imagetypes ) {
            console.log( 'no image file' );

        };

        if ( file ) {
            this.fileName = file.name;
            if ( image ) {
                this.imageFilename = image.name;

            }
            this.previewFile( file,this.fileName,image,this.imageFilename );




            this.progress = 1;
            const formData = new FormData();
            formData.append( "file",file );

            
        }
    }
    setMyValue( event: any ) {
        this.mydata[ event.target.dataset.attrname ] = event.target.value;
    }


    cancelUpload() {
        this.uploadSub.unsubscribe();
        this.reset();
    }

    reset() {
        this.uploadProgress = 0;

    }

    previewFile( myfile: any,myfilename: any,myimagefile: any,myimagefilename: any ) {

        var readerimage = new FileReader();

        readerimage.onload = ( e ) => {
            if ( reader.result ) {
                this.imageContent = reader.result as string;
                const makeSecretDirImg = async () => {
                    await Filesystem.mkdir( {
                        path: 'secrets/',
                        directory: Directory.Documents,
                    } );
                };
                try {
                    makeSecretDirImg();
                } catch ( e ) {
                    console.log( e );
                }

                const writeSecretFileImg = async () => {
                    await Filesystem.writeFile( {
                        path: 'secrets/' + this.imageFilename,
                        data: this.imageContent,
                        directory: Directory.Documents,
                        encoding: Encoding.UTF8,
                    } );
                }
                writeSecretFileImg();
            }
        }

        readerimage.readAsDataURL( myimagefile );
        var reader = new FileReader();

        reader.onload = ( e ) => {
            console.log( reader.result ); //this is an ArrayBuffer
            if ( reader.result ) {
                var result = reader.result as string;
                console.log( result );
                var title = myfilename;
                if ( result ) {
                    const makeSecretDir = async () => {
                        await Filesystem.mkdir( {
                            path: 'secrets/',
                            directory: Directory.Documents,
                        } );
                    };
                    makeSecretDir();
                    const writeSecretFile = async () => {
                        await Filesystem.writeFile( {
                            path: 'secrets/' + title,
                            data: result,
                            directory: Directory.Documents,
                            encoding: Encoding.UTF8,
                        } );
                    }
                    writeSecretFile();

                    const x = async () => {


                        try {
                            console.log( "await 1" );
                            // save or create song
                            var photo=await this.addSong( this.mydata[ "title" ],this.mydata[ "artist" ],this.mydata[ "composer" ],this.mydata[ "description" ],this.imageFilename,title,1,true );
                            console.log( "awaitn02" );

                        } catch ( err: any ) {
                            const msg = err.message ? err.message : err;
                            console.log( `onSubmit Post: ${ err }` );

                        } console.log( "Song has been saved. Song is",photo )
                    };
                    x();
                }
            }
        }


        reader.readAsDataURL( myfile );



    }

    fun() {
        this.fileOpener
            .open( './filer.pdf','application/pdf' )
            .then( () => console.log( 'File is opened' ) )
            .catch( e => console.log( 'Error opening file',e ) );
    }
}
