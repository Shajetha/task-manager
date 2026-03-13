export default function Pagination({ pagination, onPageChange }) {
  const { currentPage, totalPages, hasPrevPage, hasNextPage } = pagination;
  if (totalPages <= 1) return null;

  const pages = [];
  const range = 2;
  for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range); i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button className="page-btn" onClick={() => onPageChange(currentPage - 1)} disabled={!hasPrevPage}>
        ← Prev
      </button>
      {pages[0] > 1 && (
        <>
          <button className="page-btn" onClick={() => onPageChange(1)}>1</button>
          {pages[0] > 2 && <span style={{ color: 'var(--text-3)', padding: '0 4px' }}>…</span>}
        </>
      )}
      {pages.map(p => (
        <button
          key={p}
          className={`page-btn ${p === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span style={{ color: 'var(--text-3)', padding: '0 4px' }}>…</span>}
          <button className="page-btn" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}
      <button className="page-btn" onClick={() => onPageChange(currentPage + 1)} disabled={!hasNextPage}>
        Next →
      </button>
    </div>
  );
}