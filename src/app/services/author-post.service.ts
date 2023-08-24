import { Repository } from 'typeorm';
import { Injectable } from '@angular/core';
import { DataSource } from 'typeorm';
import { BehaviorSubject, Observable } from 'rxjs';
import { Component, Input,OnInit } from '@angular/core'
import MyDataSource from '../../data-source';
import { Song } from '../entity/song';

@Injectable()
export class AuthorPostService {
  public dataSource: DataSource=MyDataSource;
  public database!: string;
  public songList: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);

  private isSongDataReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isCategoryReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isSongReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isAuthorReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isIdsSeqReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private songRepository= MyDataSource.getRepository(Song);

  constructor() {}
  /**
   * Initialize the author-post service
   * @returns
   */
  async initialize(): Promise<void> {
      console.log("ok");
    console.log(`@@@ this.dataSource.isInitialized: ${this.dataSource.isInitialized} @@@@`)
    if (this.dataSource.isInitialized) {
      this.songRepository = this.dataSource.getRepository(Song);
      console.log(`@@@ after create posts @@@@`);
      try {
    
        this.getAllSongs().then(() => {
          this.isSongReady.next(true);
        });
        
     
      } catch (err: any) {
        const msg = err.message ? err.message : err;
        return Promise.reject(`Error AuthorPostService initialize: ${msg}`);
      }

    } else {
      return Promise.reject(`Error: AuthorDataSource not initialized`)
    }
  }
  /**
   * Return AuthorData state
   * @returns
   */
   /*
  authorDataState() {
    return this.isAuthorDataReady.asObservable();
  }
  */
  /**
   * Return Category state
   * @returns
   */
  songState() {
    return this.isSongReady.asObservable();
  }
  /**
   * Return Author state
   * @returns
   */
 
  /**
   * Return Post state
   * @returns
   */

  /**
   * Return Ids Sequence state
   * @returns
   */

  /**
   * Fetch AuthorData
   * @returns
   */
   /*
  fetchAuthorData(): Observable<AuthorPostData[]> {
    return this.songDataList.asObservable();
  }
  */
  /**
   * Fetch Categories
   * @returns
   */
 
  /**
   * Fetch Authors
   * @returns
   */

  /**
   * Fetch Posts
   * @returns
   */
  fetchSongs(): Observable<Song[]> {
    return this.songList.asObservable();
  }
  /**
   * Fetch Ids Sequence
   * @returns
   */
  /**
   * Get all Ids Sequence
   * @returns
   */

  /**
   * Get, Create, Update an Author
   * @returns
   */
  async getSong(jsonAuthor: any): Promise<Song> {
    try {
      let author = await this.songRepository.findOneBy({id: jsonAuthor.id});
      if(!author) {
        if(jsonAuthor.artist && jsonAuthor.title) {
            // create a new author
        const photo = new Song();
        photo.title = jsonAuthor.title;
        photo.artist = jsonAuthor.artist;
        photo.composer = jsonAuthor.composer;
        photo.description = jsonAuthor.description;
        photo.image = jsonAuthor.image ;
        photo.filename = jsonAuthor.filename;
        photo.views = jsonAuthor.views;
        photo.isPublished = jsonAuthor.isPublished;

          await this.songRepository.save(photo);
          author = await this.songRepository.findOneBy({id: jsonAuthor.id});
          if(author) {
            return author;
          } else {
            return Promise.reject(`Error: failed to getAuthor for id ${jsonAuthor.id}`);
          }
        } else {
          // author not in the database
          author = new Song();
          author.id = -1;
          return author;
        }
      } else {
        if(Object.keys(jsonAuthor).length > 1) {
          // update and existing author
          const updAuthor = new Song();
          updAuthor.id = jsonAuthor.id;
          updAuthor.title = jsonAuthor.title;
          updAuthor.artist = jsonAuthor.artist;
          await this.songRepository.save(updAuthor);
          author = await this.songRepository.findOneBy({id: jsonAuthor.id});
          if(author) {
              console.log(`success song for id ${jsonAuthor.id}`);
            return author;
          } else {
            return Promise.reject(`Error: failed to getAuthor for id ${jsonAuthor.id}`);
          }
        } else {
          return author;
        }
      }
    } catch(err: any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`Error in getAuthor: ${err}`);
    }
  }
  /**
   * Delete an Song
   * @returns
   */
  async deleteSong(id: number): Promise<void>  {
    try {
      let author = await this.songRepository.findOneBy({id: id});
      if( author) {
        await this.songRepository.remove(author);
      }
    } catch(err: any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`Error in delete song: ${err}`);
    }
  }
  /**
   * Get all Authors
   * @returns
   */
  async getAllSongs(): Promise<void> {
    try {
      const authors: [Song] = await this.songRepository.query("select * from songs");
      this.songList.next(authors);
    } catch (err:any) {
      const msg = err.message ? err.message : err;
      return Promise.reject(`Error getAllAuthors: ${msg}`);
    }
  }
  /**
   * Get, Create, Update a Category
   * @returns
   */

  
  /**
   * Delete a Category
   * @returns
   */

  /**
   * Get all Categories
   * @returns
   */

  /**
   * Get, Create, Update a Post
   * @returns
   */


  /**
   * Delete a Post
   * @returns
   */

  /**
   * Get all Posts
   * @returns
   */

  /**
   * Create Post
   * @returns
   */
 
  /**
   * Get all AuthorData
   */
   /*
  async getAuthorData() {
    const query = `SELECT author.id AS authorId, author.name AS author, author.email AS email, author.birthday AS birthday,
    post.id AS postId, post.title AS title, post.text AS text, category.id AS categoryId, category.name AS category
    FROM author INNER JOIN post ON post.authorId = author.id
    INNER JOIN post_categories_category ON post_categories_category.postId = post.id
    INNER JOIN category ON category.id = post_categories_category.categoryId
    ORDER BY author,title,category ASC
    `;
    const mAuthorsData: SongData[] = await this.authorRepository.query(query);
    const authorsData: AuthorPostData[] = [];
    let prevEmail = mAuthorsData[0].email;
    let prevTitle = mAuthorsData[0].title;
    let mId = 1;
    let mAuthorData: AuthorPostData = {} as AuthorPostData;
    for (const authorData of mAuthorsData) {
      if (authorData.email === prevEmail && authorData.title === prevTitle) {
        if (!mAuthorData.email) {
          mAuthorData.id = mId;
          mAuthorData.authorId= authorData.authorId;
          mAuthorData.author= authorData.author;
          mAuthorData.email = authorData.email;
          mAuthorData.birthday = authorData.birthday;
          mAuthorData.postId= authorData.postId;
          mAuthorData.title = authorData.title;
          mAuthorData.text = authorData.text;
          mAuthorData.categories = [];
          mAuthorData.categoryIds = [];
          mAuthorData.categoryIds.push(authorData.categoryId)
          mAuthorData.categories.push(authorData.category);
        } else {
          mAuthorData.categoryIds.push(authorData.categoryId)
          mAuthorData.categories.push(authorData.category);
        }
      } else {
        authorsData.push(mAuthorData);
        prevEmail = authorData.email;
        prevTitle = authorData.title;
        mId += 1;
        mAuthorData = {} as AuthorPostData;
        mAuthorData.id = mId;
        mAuthorData.authorId= authorData.authorId;
        mAuthorData.author = authorData.author;
        mAuthorData.email = authorData.email;
        mAuthorData.birthday = authorData.birthday;
        mAuthorData.postId= authorData.postId;
        mAuthorData.title = authorData.title;
        mAuthorData.text = authorData.text;
        mAuthorData.categories = [];
        mAuthorData.categoryIds = [];
        mAuthorData.categoryIds.push(authorData.categoryId)
        mAuthorData.categories.push(authorData.category);
      }

    }
    authorsData.push(mAuthorData);

    this.authorDataList.next(authorsData);
  }
  */
  /**
   * Get Json Post from Post
   * @param post
   * @returns
   */


}
