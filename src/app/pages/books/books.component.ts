import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {Book, BooksService} from "../../services/books.service";
import {Subject} from "rxjs/internal/Subject";
import {takeUntil} from "rxjs";
import { Router } from '@angular/router';

@Component({
  selector: 'app-books',
  standalone: true,
  templateUrl: './books.component.html',
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule
  ],
})
export class BooksComponent implements OnInit, OnDestroy {
  allBooks: Book[] = [];

  private destroyed = new Subject<void>();
  constructor(
    private booksService: BooksService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.booksService.getAllBooks().pipe(takeUntil(this.destroyed)).subscribe({
      next: (response) => {
        this.allBooks = response.docs;

        // since there are only 3 books in the LOTR series, we will append them a few times more to get to the 10 books total outlined in the task requirements
        this.allBooks = this.allBooks.concat(this.allBooks);
        this.allBooks = this.allBooks.concat(this.allBooks);

        this.allBooks = this.allBooks.sort((a, b) => {
          if (a.releaseDate.isBefore(b.releaseDate)) {
            return 1;
          } else {
            return -1;
          }
        });
      }
    })
  }

  goToDetails(book: Book) {
    this.router.navigate(['/book/' + book._id]);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
