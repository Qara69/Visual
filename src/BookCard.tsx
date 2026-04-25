import React from 'react';

interface BookCardProps {
  title: string;
  authors: string[];
  coverBlob: Blob | null;
}

const BookCard: React.FC<BookCardProps> = ({ title, authors, coverBlob }) => {
  const coverUrl = coverBlob ? URL.createObjectURL(coverBlob) : null;

  return (
    <div className="book-card">
      {coverUrl ? (
        <img src={coverUrl} alt={title} className="book-cover" />
      ) : (
        <div className="book-cover placeholder">"Обложка"</div>
      )}
      <h3 className="book-title">{title}</h3>
      <p className="book-authors">{authors.join(', ')}</p>
    </div>
  );
};

export default BookCard;