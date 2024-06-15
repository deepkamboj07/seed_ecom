import React from "react";
import { Pagination as AntPagination } from "antd";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination flex mb-[70px]">
      <AntPagination
      className="my-custom-table"
        current={currentPage}
        total={totalPages * 8}
        pageSize={8} 
        onChange={(page) => onPageChange(page)}
        showSizeChanger={false}
      />
    </div>
  );
};

export default Pagination;
