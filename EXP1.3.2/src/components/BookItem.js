function BookItem({ book, onRemove }) {
  return (
    <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {book.title}
        </h3>
        <p className="text-gray-500">
          by {book.author}
        </p>
      </div>

      <button
        onClick={() => onRemove(book.id)}
        className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Remove
      </button>
    </div>
  );
}

export default BookItem;
