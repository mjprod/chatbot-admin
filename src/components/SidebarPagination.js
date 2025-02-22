import "./SidebarPagination.css";
import { ReactComponent as IconDownChevron} from '../assets/iconChevronRight.svg';


const SidebarPagination = ({ totalPages, currentPage, setCurrentPage }) => {
  const handlePageChange = (page) => {
    console.log("Clicked Page:", page); // Debug log
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="pagination">
      <div className="pagination-numbers">
        {[...Array(totalPages)].map((_, index) => (
          <span
            key={index + 1}
            className={`pagination-number ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </span>
        ))}
      </div>
      <div className="pagination-controls">
        <button
          className="pagination-arrow"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
           <IconDownChevron className="pagination-icon-left" />
        </button>
        <button
          className="pagination-arrow"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <IconDownChevron className="pagination-icon-right" />
        </button>
      </div>
    </div>
  );
};

export default SidebarPagination;