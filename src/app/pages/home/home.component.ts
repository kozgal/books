import {Component, OnDestroy, OnInit} from '@angular/core';
import {Book, BooksService} from "../../services/books.service";
import {CommonModule} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class HomeComponent implements OnInit, OnDestroy {
  searchText = new FormControl('');
  allBooks: Book[] = [];
  firstThreeBooks: Book[] = [];
  filteredBooks: Book[] = [];

  private destroyed = new Subject<void>();
  constructor(
    private booksService: BooksService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.booksService.getAllBooks().pipe(takeUntil(this.destroyed)).subscribe({
      next: (response) => {
        this.allBooks = response.docs.slice(0, 3);

        this.firstThreeBooks = this.allBooks.sort((a, b) => {
          if (a.releaseDate.isBefore(b.releaseDate)) {
            return 1;
          } else {
            return -1;
          }
        });

        this.filteredBooks = this.firstThreeBooks;

        // grab search query param if it exists
        const searchString = this.activatedRoute.snapshot.queryParamMap.get('search');
        if (searchString) {
          this.searchText.setValue(searchString);
          this.search(true);
        }
      }
    })
  }

  search(skipUrlUpdate?: boolean) {
    this.filteredBooks = this.firstThreeBooks.filter((b) => {
      return b.name.toLowerCase().indexOf(this.searchText.getRawValue()?.toLowerCase() || '') !== -1;
    });

    if (!skipUrlUpdate) {
      // update query params to include searched text
      this.updateSearchQueryParams();
    }
  }

  clearSearch() {
    this.searchText.setValue('');
    this.search();
  }

  private updateSearchQueryParams() {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { search: this.searchText.getRawValue() },
        queryParamsHandling: 'merge'
      }
    );
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
