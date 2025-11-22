export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  imageKey: string;
  isHidden?: boolean;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // Formatting Achievements
  {
    id: "json_slayer",
    name: "JSON Slayer",
    description: "Successfully formatted a JSON file without errors.",
    imageKey: "goth1",
  },
  {
    id: "syntax_demon",
    name: "Syntax Demon",
    description: "Fixed a malformed JSON file.",
    imageKey: "goth2",
  },
  {
    id: "format_novice",
    name: "Format Novice",
    description: "Formatted your first JSON file.",
    imageKey: "goth4",
  },
  {
    id: "format_adept",
    name: "Format Adept",
    description: "Formatted 10 JSON files.",
    imageKey: "goth6",
  },
  {
    id: "format_master",
    name: "Format Master",
    description: "Formatted 100 JSON files.",
    imageKey: "goth7",
  },
  // Customization Achievements
  {
    id: "indentation_cultist",
    name: "Indentation Cultist",
    description: "Changed the indentation settings.",
    imageKey: "goth3",
  },
  {
    id: "theme_changer",
    name: "Theme Changer",
    description: "Changed the JSON viewer theme.",
    imageKey: "goth8",
  },
  {
    id: "linguistic_nihilist",
    name: "Linguistic Nihilist",
    description: "Switched the application language.",
    imageKey: "goth10",
  },
  // Interaction Achievements
  {
    id: "clear_vessel",
    name: "Clear Vessel",
    description: "Used the 'Clear' button.",
    imageKey: "goth11",
  },
  {
    id: "data_courier",
    name: "Data Courier",
    description: "Imported an achievement file.",
    imageKey: "goth12",
  },
  {
    id: "data_exporter",
    name: "Data Exporter",
    description: "Exported an achievement file.",
    imageKey: "gpth5", // Typo in original file list: gpth5.jpg vs goth5.jpg
  },
  {
    id: "page_turner",
    name: "Page Turner",
    description: "Added a new page.",
    imageKey: "goth_page",
  },
  {
    id: "page_destroyer",
    name: "Page Destroyer",
    description: "Deleted a page.",
    imageKey: "goth_destroyer",
  },
];

export const ACHIEVEMENT_IMAGES: Record<string, string> = {
  goth1: "/goth-girls/goth1.jpg",
  goth2: "/goth-girls/goth2.jpeg",
  goth3: "/goth-girls/goth3.jpeg",
  goth4: "/goth-girls/goth4.jpg",
  goth6: "/goth-girls/goth6.jpg",
  goth7: "/goth-girls/goth7.jpg",
  goth8: "/goth-girls/goth8.jpg",
  goth10: "/goth-girls/goth10.jpg",
  goth11: "/goth-girls/goth11.jpg",
  goth12: "/goth-girls/goth12.jpg",
  gpth5: "/goth-girls/gpth5.jpg", // Corrected image key
  goth_page: "/goth-girls/goth1.jpg", // Placeholder
  goth_destroyer: "/goth-girls/goth2.jpeg", // Placeholder
};

// --- Generic Check Logic ---

// Enum for event types
export enum AchievementEvent {
  FORMAT_SUCCESS = "FORMAT_SUCCESS",
  FORMAT_FAILURE = "FORMAT_FAILURE",
  FIXED_SYNTAX = "FIXED_SYNTAX",
  CHANGE_INDENTATION = "CHANGE_INDENTATION",
  CHANGE_THEME = "CHANGE_THEME",
  CHANGE_LANGUAGE = "CHANGE_LANGUAGE",
  CLEAR_TEXT = "CLEAR_TEXT",
  IMPORT_ACHIEVEMENTS = "IMPORT_ACHIEVEMENTS",
  EXPORT_ACHIEVEMENTS = "EXPORT_ACHIEVEMENTS",
  ADD_PAGE = "ADD_PAGE",
  DELETE_PAGE = "DELETE_PAGE",
  INITIAL_LOAD = "INITIAL_LOAD",
}

// Context structure for checking achievements
export interface AchievementContext {
  previousText: string;
  currentText: string;
  successfulFormatsCount: number;
}

// Map achievement IDs to the event types they should check for
const ACHIEVEMENT_TRIGGERS: Record<string, AchievementEvent> = {
  json_slayer: AchievementEvent.FORMAT_SUCCESS,
  syntax_demon: AchievementEvent.FIXED_SYNTAX,
  indentation_cultist: AchievementEvent.CHANGE_INDENTATION,
  theme_changer: AchievementEvent.CHANGE_THEME,
  linguistic_nihilist: AchievementEvent.CHANGE_LANGUAGE,
  clear_vessel: AchievementEvent.CLEAR_TEXT,
  data_courier: AchievementEvent.IMPORT_ACHIEVEMENTS,
  data_exporter: AchievementEvent.EXPORT_ACHIEVEMENTS,
  page_turner: AchievementEvent.ADD_PAGE,
  page_destroyer: AchievementEvent.DELETE_PAGE,
  format_novice: AchievementEvent.FORMAT_SUCCESS,
  format_adept: AchievementEvent.FORMAT_SUCCESS,
  format_master: AchievementEvent.FORMAT_SUCCESS,
};


/**
 * Generic function to check for newly unlocked achievements based on an event.
 * @param event The type of action taken by the user.
 * @param unlockedAchievements Array of achievement IDs the user already has.
 * @param context Optional context containing relevant data like text history or counters.
 * @returns An array of newly unlocked AchievementDefinition objects.
 */
export function checkAchievements(
  event: AchievementEvent,
  unlockedAchievements: string[],
  context: Partial<AchievementContext>
): AchievementDefinition[] {
  const newlyUnlocked: AchievementDefinition[] = [];

  const candidates = ACHIEVEMENTS.filter(
    (a) =>
      a.id in ACHIEVEMENT_TRIGGERS &&
      ACHIEVEMENT_TRIGGERS[a.id] === event &&
      unlockedAchievements.indexOf(a.id) === -1
  );

  for (const achievement of candidates) {
    let unlocked = false;
    
    switch (achievement.id) {
      case "json_slayer":
        // Check if current text is valid JSON
        if (context.currentText && JSON.parse(context.currentText)) {
            unlocked = true;
        }
        break;

      case "syntax_demon":
        // Check if previous text was invalid, and current text is valid
        if (
          context.previousText &&
          context.currentText
        ) {
          try {
            JSON.parse(context.previousText); // Should throw if invalid
          } catch (e) {
            try {
              JSON.parse(context.currentText); // Should succeed if valid
              unlocked = true;
            } catch (e2) {
              // Not fixed yet
            }
          }
        }
        break;
      
      case "format_novice":
        if ((context.successfulFormatsCount ?? 0) >= 1) {
          unlocked = true;
        }
        break;

      case "format_adept":
        if ((context.successfulFormatsCount ?? 0) >= 10) {
          unlocked = true;
        }
        break;
      
      case "format_master":
        if ((context.successfulFormatsCount ?? 0) >= 100) {
          unlocked = true;
        }
        break;
      
      // All other single-trigger achievements are unlocked simply by reaching this case
      case "indentation_cultist":
      case "theme_changer":
      case "linguistic_nihilist":
      case "clear_vessel":
      case "data_courier":
      case "data_exporter":
      case "page_turner":
      case "page_destroyer":
        unlocked = true;
        break;

      default:
        break;
    }

    if (unlocked) {
      newlyUnlocked.push(achievement);
    }
  }

  return newlyUnlocked;
}