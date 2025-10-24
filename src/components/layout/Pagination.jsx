import React from "react";
import styles from "./Pagination.module.css";

const Pagination = ({ currentPage = 1, totalPages, onPageChange }) => {
  return (
    <nav className={styles.pagination}>
      <button
        className={styles.arrowButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &larr;
      </button>

      <div className={styles.pageNumber}>{currentPage}</div>

      <button
        className={styles.arrowButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &rarr;
      </button>
    </nav>
  );
};

export default Pagination;
