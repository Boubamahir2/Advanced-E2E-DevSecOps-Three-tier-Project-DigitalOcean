import React from "react";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Wrapper from "../assets/wrappers/PageBtnContainer";
import { useSelector, useDispatch } from "react-redux";
import { pageChange } from "../features/allJobs/allJobsSlice";

const PageBtnContainer = () => {
  const { page, numOfPages } = useSelector((store) => store.allJobs);
  const dispatch = useDispatch();
  //we adding to index 1 because we want to start from page index 1 since array starts from 0
  const pages = Array.from({ length: numOfPages }, (_, i) => i + 1);

  const nextPage = () => {
    let newPage = page + 1;
    if (newPage > numOfPages) {
      newPage = 1;
    }
    dispatch(pageChange(newPage));
  };
  const prevPage = () => {
    let oldPage = page - 1;
    if (oldPage < 1) {
      oldPage = numOfPages;
    }
    dispatch(pageChange(oldPage));
  };
  return (
    <Wrapper>
      <button type="button" className="prev-btn" onClick={prevPage}>
        <HiChevronDoubleLeft />
        prev
      </button>
      <div className="btn-container">
        {pages.map((pageNum) => {
          return (
            <button
              type="button"
              key={pageNum}
              className={pageNum === page ? "pageBtn active" : "pageBtn"}
              onClick={() => dispatch(pageChange(pageNum))}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
      <button type="button" className="next-btn" onClick={nextPage}>
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};

export default PageBtnContainer;
