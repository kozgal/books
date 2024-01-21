import {Component, OnDestroy, OnInit} from '@angular/core';
import {Book, BookChapter, BooksService} from "../../services/books.service";
import {ActivatedRoute, Router} from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'book-details',
  standalone: true,
  templateUrl: './book-details.component.html',
  imports: [
    CommonModule,
  ]
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  bookDetails?: Book;
  bookChapters?: BookChapter[]; // chapters have same interface, just a name string and ID, so just using Book interface for this small project
  bookId = '';

  private destroyed = new Subject<void>();
  constructor(
    private booksService: BooksService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.bookId = this.activatedRoute.snapshot.params['bookId'];

    this.booksService.getBookDetails(this.bookId).pipe(takeUntil(this.destroyed)).subscribe({
      next: (response: { docs: Book[] }) => {
        this.bookDetails = response.docs[0];
      }
    });

    this.booksService.getBookChapters(this.bookId).pipe(takeUntil(this.destroyed)).subscribe({
      next: (response: { docs: BookChapter[] }) => {
        this.bookChapters = response.docs;
      }
    })
  }

  back() {
    this.router.navigate(['/books']);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
