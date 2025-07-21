import React, { useEffect, useRef } from "react";

import { Tabs, Tab } from "@mui/material";

export interface IFormatterPaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPageCount: number;
  onAddPage: () => void;
}

export default function FormatterPagination(
  props: IFormatterPaginationProps
): React.ReactElement<IFormatterPaginationProps> {
  return (
    <Tabs
      value={props.currentPage}
      variant="scrollable"
      scrollButtons="auto"
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          event.preventDefault();
          const nextPageIndex = (props.currentPage % props.totalPageCount) + 1;
          props.setCurrentPage(nextPageIndex);
        }
      }}
    >
      {Array.from({ length: props.totalPageCount }, (_, i) => (
        <Tab
          key={i + 1}
          value={i + 1}
          label={`Page ${i + 1}`}
          onClick={() => props.setCurrentPage(i + 1)}
        />
      ))}
      <Tab value={-1} label="+" onClick={props.onAddPage} />
    </Tabs>
  );
}
