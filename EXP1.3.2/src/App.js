import { useState } from "react";
import BookItem from "./components/BookItem";

function App() {
  const [books, setBooks] = useState([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" },
    { id: 3, title: "1984", author: "George Orwell" },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen" },
  ]);

  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const addBook = () => {
    if (!title || !author) return;

    setBooks([
      ...books,
      { id: Date.now(), title, author }
    ]);

    setTitle("");
    setAuthor("");
  };

  const removeBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const filteredBooks = books.filter(
    book =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-indigo-200 to-fuchsia-200 p-10">

      
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        📚 Library Management System
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search books by title or author..."
        className="w-full max-w-4xl mx-auto block p-4 rounded-xl shadow mb-8 outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Add Book */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md flex gap-4 mb-10">
        <input
          type="text"
          placeholder="Book Title"
          className="flex-1 p-3 border rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Author"
          className="flex-1 p-3 border rounded-lg"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <button
          onClick={addBook}
          className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Add Book
        </button>
      </div>

      {/* Book List */}
      <div className="max-w-4xl mx-auto space-y-6">
        {filteredBooks.map(book => (
          <BookItem
            key={book.id}
            book={book}
            onRemove={removeBook}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
