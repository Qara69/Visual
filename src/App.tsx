import React, { useEffect, useState } from 'react';
import BookCard from './BookCard';

interface Book {
  id: number;
  title: string;
  isbn: string;
  pageCount: number;
  authors: string[];
}

interface BookWithCover extends Book {
  coverBlob: Blob | null;
}

const BOOKS_API = 'https://fakeapi.extendsclass.com/books';

const App: React.FC = () => {
  const [books, setBooks] = useState<BookWithCover[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(BOOKS_API);
        const data: Book[] = await res.json();

        const booksWithCovers = await Promise.all(
          data.map(async (book) => {
            let coverBlob: Blob | null = null;
            
            if (book.isbn) {
              try {
                const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;
                const imgRes = await fetch(coverUrl);
                
                if (imgRes.ok) {
                  coverBlob = await imgRes.blob();
                }
              } catch (err) {
                console.log('Нет обложки:', book.title);
              }
            }
            
            return { ...book, coverBlob };
          })
        );

        setBooks(booksWithCovers);
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div className="loading">Загрузка книг...</div>;

  return (
    <div className="app">
      <h1>Книги</h1>
      <div className="books-grid">
        {books.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            authors={book.authors}
            coverBlob={book.coverBlob}
          />
        ))}
      </div>
    </div>
  );
};

export default App;