import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Song } from "../entity/song";
import { MyAppDataSource } from "../db";
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Component, Input,OnInit } from '@angular/core'
import { Subscription } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {
	      HttpErrorResponse
} from "@angular/common/http";
 import { Plugins } from '@capacitor/core';
 import * as CapacitorSQLPlugin from '@capacitor-community/sqlite';
 const { CapacitorSQLite,Device } = Plugins;
import { OrmService } from '../services/orm.service';
import { SQLiteService } from '../services/sqlite.service';
import { AuthorPostService } from '../services/author-post.service';

import { map, catchError } from "rxjs/operators";

import { throwError } from "rxjs";

import {  ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
       _sqlite: any;
      @ViewChild("fileUpload") fileUpload: ElementRef;
      @ViewChild("imageUpload") imageUpload: ElementRef;
	  progress: number;
	  mydata:any={"title":"","composer":"","description":"","artist":"","filename":"","image":""};
  async ngAfterViewInit() {
     const info = this.sqliteService;
     if (info.getPlatform() === "ios" || info.getPlatform() === "android") {
       this._sqlite = CapacitorSQLite;
     } else {
       this._sqlite = CapacitorSQLPlugin.CapacitorSQLite;
     }

   }

   async testSQLitePlugin() {
       let result:any = await this._sqlite.open({database:"testsqlite"});
       var retOpenDB = result.result;
       if(retOpenDB) {
           // Create Tables if not exist
           let sqlcmd: string = `
           BEGIN TRANSACTION;
           CREATE TABLE IF NOT EXISTS users (
               id INTEGER PRIMARY KEY NOT NULL,
               email TEXT UNIQUE NOT NULL,
               name TEXT,
               age INTEGER
           );
           PRAGMA user_version = 1;
           COMMIT TRANSACTION;
           `;
           var retExe: any = await this._sqlite.execute({statements:sqlcmd});
           console.log('retExe ',retExe.changes);
           // Insert some Users
           sqlcmd = `
           BEGIN TRANSACTION;
           DELETE FROM users;
           INSERT INTO users (name,email,age) VALUES ("Whiteley","Whiteley.com",30);
           INSERT INTO users (name,email,age) VALUES ("Jones","Jones.com",44);
           COMMIT TRANSACTION;
           `;
           retExe = await this._sqlite.execute({statements:sqlcmd});
           console.log('retExe ',retExe.changes);
           // Select all Users
           sqlcmd = "SELECT * FROM users";
           var retSelect: any = await this._sqlite.query({statement:sqlcmd,values:[]});
           console.log('retSelect.values.length ',retSelect.values.length);
           const row1: any = retSelect.values[0];
           console.log("row1 users ",JSON.stringify(row1))
           const row2: any = retSelect.values[1];
           console.log("row2 users ",JSON.stringify(row2))

           // Insert a new User with SQL and Values

           sqlcmd = "INSERT INTO users (name,email,age) VALUES (?,?,?)";
           let values: Array<any>  = ["Simpson","Simpson@example.com",69];
           var retRun: any = await this._sqlite.run({statement:sqlcmd,values:values});
           console.log('retRun ',retRun.changes);

           // Select Users with age > 35
           sqlcmd = "SELECT name,email,age FROM users WHERE age > ?";
           retSelect = await this._sqlite.query({statement:sqlcmd,values:["35"]});
           console.log('retSelect ',retSelect.values.length);
           
       
       }
   }
      @Input()
          requiredFileType:string="audio/*";
          requiredImage:string;
          requiredImageType:string = "image/*";
	  imageFilename:any;
          imageContent:any;
	      fileName = '';
	          uploadProgress:number;
		      uploadSub: Subscription;

		          constructor(private sqliteService: SQLiteService, private authorPostService: AuthorPostService,private ormService: OrmService,private myDataSource:MyAppDataSource,private fileOpener:FileOpener, private http: HttpClient) {}

 ngOnInit(): void {

    this.initOrmService().then (async () => {
      if(!this.ormService.isOrmService) {
        throw new Error(`Error: TypeOrm Service didn't start`);
      }
    });

  }
    async initOrmService() {
    try {
      await this.ormService.initialize();
      console.log(`*** ORM service has been initialized ***`)
    } catch(err: any) {
      const msg = err.message ? err.message : err
      throw new Error(`Error: ${msg}`);
    }
  }
			      ajouterunechanson() {
				              const file:File = this.fileUpload.nativeElement.files[0];
					              var types = !((/audio\/mpeg|audio\/mp3|audio\/mp4|audio\/ogg|audio\/x+|wav/).test(file.type));

						            if(!!types){
								               alert('no audio file');
									                  return;
											        };
				              const image:File = this.imageUpload.nativeElement.files[0];
					              var imagetypes = !((/image\/png|image\/jpg|image\/gif|audio\/x+|wav/).test(image.type));

						            if(!!imagetypes){
								               alert('no image file');
									                  
											        };
					            
					              if (file) {
							                  this.fileName = file.name;
									  if(image){
										  this.imageFilename=image.name;
								          
									  }
									  this.previewFile(file, this.fileName,image,this.imageFilename);


																										            

		      this.progress = 1;
		          const formData = new FormData();
			      formData.append("file", file);

			          this.http
				        .post("your-url-here", formData, {
						        reportProgress: true,
							        observe: "events"
								      })
								            .pipe(
										            map((event: any) => {
												              if (event.type == HttpEventType.UploadProgress) {
														                  this.progress = Math.round((100 / event.total) * event.loaded);
																            } else if (event.type == HttpEventType.Response) {
																		                this.progress = 0;
																				          }
																					          }),
																						          catchError((err: any) => {
																								            this.progress = 0;
																									              alert(err.message);
																										                return throwError(err.message);
																												        })
																													      )
																													            .toPromise();
																																				              }
																														      }
																														      setMyValue(event:any){
																															      this.mydata[event.target.dataset.attrname]=event.target.value;
																														      }


																																						    cancelUpload() {
																																							        this.uploadSub.unsubscribe();
																																								    this.reset();
																																								      }

																																								        reset() {
																																										    this.uploadProgress = 0;

																																											  }

																																									previewFile(myfile:any,myfilename:any,myimagefile:any,myimagefilename:any) {

																																										  var readerimage  = new FileReader();

																																										    readerimage.onload = (e) => {
																																											    if (reader.result){
																																												    this.imageContent=reader.result as string;
																																												    const makeSecretDirImg = async () => {
																																													      await Filesystem.mkdir({
																																														          path: 'secrets/',
																																															      directory: Directory.Documents,
																																															        });
																																												    };
                                                                                                                                                                                                                                                                                                                                                                    try{
                                                                                                                                                                                                                                                                                                                                                                        makeSecretDirImg();
                                                                                                                                                                                                                                                                                                                                                                    }catch(e){console.log(e);
                                                                                                                                                                                                                                                                                                                                                                    }
																																												    
																																												    const writeSecretFileImg = async () => {
																																													      await Filesystem.writeFile({
		          path: 'secrets/'+this.imageFilename,
			        data: this.imageContent,
				      directory: Directory.Documents,
				            encoding: Encoding.UTF8,
					        });
																																												    }
																																												    writeSecretFileImg();
																																										            }
																																										    }

																																										  readerimage.readAsDataURL(myimagefile);
																																										  var reader  = new FileReader();

																																										    reader.onload = (e) => {
																																											        console.log(reader.result); //this is an ArrayBuffer
																																											    if (reader.result){
																																											    var result=reader.result as string;
																																											    alert(result);
																																											    var title=myfilename;
																																											    if(result){
																																												    const makeSecretDir = async () => {
																																													      await Filesystem.mkdir({
																																														          path: 'secrets/',
																																															      directory: Directory.Documents,
																																															        });
																																												    };
																																												    makeSecretDir();
																																												    const writeSecretFile = async () => {
																																													      await Filesystem.writeFile({
		          path: 'secrets/'+title,
			        data: result,
				      directory: Directory.Documents,
				            encoding: Encoding.UTF8,
					        });
																																												    }
																																												    writeSecretFile();

                                                                                                                                                                                                                                                                                                                                                                    const x= async () =>{
																																												    const photo = new Song()
																																												    photo.title = this.mydata["title"]
																																												    photo.artist = this.mydata["artist"]
																																												    photo.composer = this.mydata["composer"]
																																												    photo.description = this.mydata["description"]
																																												    photo.image = this.imageFilename;
																																												    photo.filename = title
																																												    photo.views = 1
																																												    photo.isPublished = true

                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                   
                                                                                                                                                                                                                                                                                                                                                                                                         try {
                                                                                                                                                                                                                                                                                                                                                                                                             console.log("await 1");
                                                                                                                                                                                                                                                                                                                                                                                                       await this.authorPostService.getSong(photo);
                                                                                                                                                                                                                                                                                                                                                                                                       console.log("awaitn02");
                                                                                                                                                                                                                                                                                                                                                                                                       if (this.sqliteService.getPlatform() === 'web') {
                                                                                                                                                                                                                                                                                                                                                                                                         // save the databases from memory to store
                                                                                                                                                                                                                                                                                                                                                                                                           console.log("await no3");
                                                                                                                                                                                                                                                                                                                                                                                                         await this.sqliteService.getSqliteConnection().saveToStore(this.authorPostService.database);
                                                                                                                                                                                                                                                                                                                                                                                                       }
                                                                                                                                                                                                                                                                                                                                                                                                     } catch (err: any) {
                                                                                                                                                                                                                                                                                                                                                                                                       const msg = err.message ? err.message : err;
                                                                                                                                                                                                                                                                                                                                                                                                       console.log(`onSubmit Post: ${err}`);
                                                                                                                                                                                                                                                                                                                                                                                                       
                                                                                                                                                                                                                                                                                                                                                                                                     }																																												    console.log("Song has been saved. Song id is", photo.id)
                                                                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                                                                    x();
																																											    }
																																											    }
																																												 }


																																												  reader.readAsDataURL(myfile);



																																								   }
																																												
          fun() {
	      this.fileOpener
	            .open('./filer.pdf', 'application/pdf')
		          .then(() => console.log('File is opened'))
			        .catch(e => console.log('Error opening file', e));
				  }
}
