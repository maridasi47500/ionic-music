import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Song } from "../entity/song";
import { AppDataSource } from "../db";
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

      @Input()
          requiredFileType:string;

	      fileName = '';
	          uploadProgress:number;
		      uploadSub: Subscription;

		          constructor(private fileOpener:FileOpener, private http: HttpClient) {}


			      onFileSelected(event:any) {
				              const file:File = event.target.files[0];
					              var types = !((/audio\/mpeg|audio\/mp3|audio\/mp4|audio\/ogg|audio\/x+|wav/).test(file.type));

						            if(!!types){
								               alert('no audio file');
									                  return;
											        };
					            
					              if (file) {
							                  this.fileName = file.name;
									  this.previewFile(file, this.fileName);


																										            

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


																																						    cancelUpload() {
																																							        this.uploadSub.unsubscribe();
																																								    this.reset();
																																								      }

																																								        reset() {
																																										    this.uploadProgress = 0;

																																											  }

																																									previewFile(myfile:any,myfilename:any) {

																																										  var reader  = new FileReader();

																																										    reader.onloadend = function () {
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
																																												    photo.title = "Me and Bears"
																																												    photo.artist = ""
																																												    photo.composer = ""
																																												    photo.description = ""
																																												    photo.image = title
																																												    photo.filename = title
																																												    photo.views = 1
																																												    photo.isPublished = true

																																												    await AppDataSource.manager.save(photo)
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
