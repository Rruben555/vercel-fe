export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  // ANTIBUG: jika tidak ada data, tetap 1 halaman
  const safeTotal = Math.max(totalPages, 1);

  const pageNumbers = [];
  const maxButtons = 5;

  let start = Math.max(1, currentPage - 2);
  let end = Math.min(safeTotal, start + maxButtons - 1);

  if (end - start < maxButtons - 1) {
    start = Math.max(1, end - maxButtons + 1);
  }

  for (let i = start; i <= end; i++) pageNumbers.push(i);

  return (
    <div
      style={{
        marginTop: "30px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        justifyContent: "center",
      }}
    >
      <span style={{ fontSize: "16px", fontWeight: "bold" }}>
        Halaman {currentPage} dari {safeTotal}
      </span>

      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          style={{
            padding: "6px 12px",
            border: num === currentPage ? "2px solid black" : "1px solid #ccc",
            background: "white",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: num === currentPage ? "bold" : "normal",
          }}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === safeTotal}
        style={{
          padding: "6px 10px",
          border: "1px solid #ccc",
          background: "white",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        »
      </button>
    </div>
  );
}
