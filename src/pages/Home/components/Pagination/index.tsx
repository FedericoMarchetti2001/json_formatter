import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, Tab } from "@mui/material";

export interface IFormatterPaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPageCount: number;
  onAddPage: () => void;
  onDeletePage: (page: number) => void;
}

export default function FormatterPagination(
  props: IFormatterPaginationProps
): React.ReactElement<IFormatterPaginationProps> {
  const { t } = useTranslation();
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
          label={`${t("Pagination.page")} ${i + 1}`}
          onClick={() => props.setCurrentPage(i + 1)}
          onKeyDown={(event) => {
            //if the user is focused on a tab and presses delete, remove that pageù
             console.log("Key down on tab:", event.key);
            if (
              (event.key === "Delete" || event.key === "Backspace") &&
              props.totalPageCount > 1
            ) {
              event.preventDefault();
              props.onDeletePage(i + 1);
            }
          }}
        />
      ))}
      <Tab value={-1} label="+" onClick={props.onAddPage} />
    </Tabs>
  );
}
