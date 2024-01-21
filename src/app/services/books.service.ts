import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable } from 'rxjs';
import moment from 'moment';
export interface Book {
  name: string;
  _id: string;
  releaseDate: moment.Moment;
}

export interface BookChapter {
  chapterName: string;
  _id: string;
}

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private apiKey = '8V3cd8dh9XGOQCRbVN4x';
  private subtractYears = [1, 4, 6];
  constructor(private httpClient: HttpClient) {
  }

  getAllBooks(): Observable<{ docs: Book[]}> {
    return this.httpClient.get<{ docs: Book[]}>('https://the-one-api.dev/v2/book')
      .pipe(
        map((response) => {
          response.docs.forEach((book, index) => {
            // books don't contain a release date from API, so we mock one
            book.releaseDate = moment().subtract(this.subtractYears[index], 'years');
        })

          return response;
    }));
  }

  getBookDetails(bookId: string): Observable<{ docs: Book[]}> {
    return this.httpClient.get<{ docs: Book[]}>('https://the-one-api.dev/v2/book/' + bookId);
  }

  getBookChapters(bookId: string): Observable<{ docs: BookChapter[]}> {
    let headers =  new HttpHeaders();

    headers = headers.set('Authorization', 'Bearer ' + this.apiKey)

    return this.httpClient.get<{ docs: BookChapter[]}>('https://the-one-api.dev/v2/book/' + bookId + '/chapter', {headers});
  }
}
