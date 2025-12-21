import React from "react";
import { useTranslation } from "react-i18next";
import { Tabs, Tab } from "@mui/material";
import {
  AchievementEvent,
  checkAchievements,
  ACHIEVEMENT_IMAGES,
} from "../../../../config/achievements";
import { toast } from "react-toastify";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export interface IFormatterPaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPageCount: number;
  onAddPage: () => void;
  onDeletePage: (page: number) => void;
  achievements: { unlocked: string[]; images: string[] };
  setAchievements: React.Dispatch<React.SetStateAction<{ unlocked: string[]; images: string[] }>>;
}

export default function FormatterPagination(
  props: IFormatterPaginationProps
): React.ReactElement<IFormatterPaginationProps> {
  const { t } = useTranslation();
  return (
    <Tabs
      className="pagination-tabs"
      value={props.currentPage}
      variant="scrollable"
      scrollButtons="auto"
      TabIndicatorProps={{ className: "pagination-scroll-indicator"}}
      TabScrollButtonProps={{ className: "pagination-scroll-button" }}
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
          className="pagination-tab"
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
              const newlyUnlocked = checkAchievements(
                AchievementEvent.DELETE_PAGE,
                props.achievements.unlocked,
                {}
              );
              if (newlyUnlocked.length > 0) {
                props.setAchievements((prev) => {
                  const newAchievements = newlyUnlocked.map((a) => a.id);
                  const newImages = newlyUnlocked.map((a) => ACHIEVEMENT_IMAGES[a.imageKey]);
                  return {
                    ...prev,
                    unlocked: [...prev.unlocked, ...newAchievements],
                    images: [...new Set([...prev.images, ...newImages])],
                  };
                });
                newlyUnlocked.forEach((a) => toast.warn(`Achievement unlocked: ${a.name}`, { icon: () =>  <EmojiEventsIcon /> }));
              }
              props.onDeletePage(i + 1);
            }
          }}
        />
      ))}
      <Tab
        value={-1}
        label="+"
        className="pagination-tab"
        onClick={() => {
          const newlyUnlocked = checkAchievements(
            AchievementEvent.ADD_PAGE,
            props.achievements.unlocked,
            {}
          );
          if (newlyUnlocked.length > 0) {
            props.setAchievements((prev) => {
              const newAchievements = newlyUnlocked.map((a) => a.id);
              const newImages = newlyUnlocked.map((a) => ACHIEVEMENT_IMAGES[a.imageKey]);
              return {
                ...prev,
                unlocked: [...prev.unlocked, ...newAchievements],
                images: [...new Set([...prev.images, ...newImages])],
              };
            });
            newlyUnlocked.forEach((a) => toast.warn(`Achievement unlocked: ${a.name}`, { icon: () =>  <EmojiEventsIcon /> }) );
          }
          props.onAddPage();
        }}
      />
    </Tabs>
  );
}
