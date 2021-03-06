import { LendService } from './../lend/lend.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { BooksService } from './books.service';
import { Book } from './book.model';
import { SnackbarService } from '../shared/snackbar.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit, OnDestroy {
  books: Book[];
  subscription: Subscription;
  editedBook: {
    index: number;
    book: Book;
  };

  booksForm: FormGroup;

  constructor(private booksService: BooksService, private lendService: LendService, private snackbarService: SnackbarService) {}

  ngOnInit() {
    // fetch from DB and set books in service
    this.booksService.fetchBooks().then(data => this.booksService.setBooks(data)).catch(() =>
      this.snackbarService.showErrorFromApi());
    this.subscription = this.booksService.booksChanged.subscribe(
      (books: Book[]) => {
        this.books = books;
        console.log(this.books);
      }
    );

    this.booksForm = new FormGroup({
      book: new FormGroup({
        title: new FormControl(null, Validators.required),
        author: new FormControl(null, Validators.required)
      })
    });
  }

  onStartEdit(editedTitle: string, editedAuthor: string, index: number) {
    this.editedBook = {
      index,
      book: null
    };

    this.booksForm.setValue({
      book: {
        title: editedTitle,
        author: editedAuthor
      }
    });
  }

  onDelete(id: number) {
    this.booksService.deleteBook(id);
  }

  onSubmit() {
    if (this.editedBook) {
      this.editedBook.book = new Book(
        this.booksService.findBookByIndex(this.editedBook.index).id,
        this.booksForm.get('book.title').value,
        this.booksForm.get('book.author').value
      );
      this.booksService.editBook(this.editedBook.index, this.editedBook.book);
    } else {
      this.booksService.addBook(
        new Book(
          0,
          this.booksForm.get('book.title').value,
          this.booksForm.get('book.author').value
        )
      );

    }
    this.editedBook = null;
    this.booksForm.reset();
  }

  onPick(pickedBook: Book) {
    console.log(pickedBook);
    this.lendService.checkTitle(pickedBook.title) ?
      this.snackbarService.snackbar.open('Książka została już wypożyczona') :
      this.lendService.pickBook(pickedBook);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
