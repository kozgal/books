import {Routes} from '@angular/router';

import {HomeComponent} from './pages/home/home.component';
import {BooksComponent} from './pages/books/books.component';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';
import {BookDetailsComponent} from "./pages/book-details/book-details.component";

export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'books', component: BooksComponent},
  {path: 'book/:bookId', component: BookDetailsComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];
