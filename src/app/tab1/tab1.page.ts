import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Song } from "../entity/song";
import { MyAppDataSource } from "../db";
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Component, Input } from '@angular/core'
import { Subscription } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {
	      HttpErrorResponse
} from "@angular/common/http";

import { map, catchError } from "rxjs/operators";

import { throwError } from "rxjs";



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
	  progress: number;
	  mydata:any={"title":"","composer":"","description":"","artist":"","filename":"","image":""};

      @Input()
          requiredFileType:string;
          requiredImageType:string;
	  imageFilename;
          imageContent;
	      fileName = '';
	          uploadProgress:number;
		      uploadSub: Subscription;

		          constructor(private myDataSource:MyAppDataSource,private fileOpener:FileOpener, private http: HttpClient) {}


			      ajouterunechanson() {
				              const file:File = document.getElementById("fileUpload").files[0];
					              var types = !((/audio\/mpeg|audio\/mp3|audio\/mp4|audio\/ogg|audio\/x+|wav/).test(file.type));

						            if(!!types){
								               alert('no audio file');
									                  return;
											        };
				              const image:File = document.getElementById("imageUpload").files[0];
					              var imagetypes = !((/image\/png|image\/gif|audio\/x+|wav/).test(image.type));

						            if(!!imagetypes){
								               alert('no image file');
									                  return;
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
																																												    makeSecretDirImg();
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

																																										  reader.readAsDataURL(myimagefile);
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


																																												    const photo = new Song()
																																												    photo.title = this.mydata["title"]
																																												    photo.artist = this.mydata["artist"]
																																												    photo.composer = this.mydata["composer"]
																																												    photo.description = this.mydata["description"]
																																												    photo.image = this.imageFilename;
																																												    photo.filename = title
																																												    photo.views = 1
																																												    photo.isPublished = true

																																												    await this.myDataSource.AppDataSource.manager.save(photo)
																																												    console.log("Song has been saved. Song id is", photo.id)

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
