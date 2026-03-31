import { getItem, setItem } from "@services/storage";
import { STORAGE_KEYS } from "@utils/constants";
import { AppTheme, darkTheme, lightTheme, ThemeMode } from "@utils/theme";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { Appearance } from "react-native";

interface ThemeState {
  mode: ThemeMode;
  colors: AppTheme;
}

type ThemeAction =
  | { type: "TOGGLE_THEME" }
  | { type: "SET_THEME"; payload: ThemeMode };

interface ThemeContextValue extends ThemeState {
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const getColorsForMode = (mode: ThemeMode): AppTheme =>
  mode === "light" ? lightTheme : darkTheme;

const getSystemTheme = (): ThemeMode => {
  return Appearance.getColorScheme() === "light" ? "light" : "dark";
};

const initialMode = getSystemTheme();

const initialState: ThemeState = {
  mode: initialMode,
  colors: getColorsForMode(initialMode),
};

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case "TOGGLE_THEME": {
      const nextMode = state.mode === "dark" ? "light" : "dark";
      return {
        mode: nextMode,
        colors: getColorsForMode(nextMode),
      };
    }
    case "SET_THEME":
      return {
        mode: action.payload,
        colors: getColorsForMode(action.payload),
      };
    default:
      return state;
  }
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  const hydratedRef = useRef(false);

  useEffect(() => {
    const hydrateTheme = async () => {
      const savedMode = await getItem<ThemeMode>(STORAGE_KEYS.THEME_MODE);
      const nextMode =
        savedMode === "light" || savedMode === "dark"
          ? savedMode
          : getSystemTheme();

      dispatch({ type: "SET_THEME", payload: nextMode });
      hydratedRef.current = true;
    };

    void hydrateTheme();
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) {
      return;
    }

    void setItem(STORAGE_KEYS.THEME_MODE, state.mode);
  }, [state.mode]);

  const toggleTheme = () => {
    dispatch({ type: "TOGGLE_THEME" });
  };

  const setTheme = (mode: ThemeMode) => {
    dispatch({ type: "SET_THEME", payload: mode });
  };

  return (
    <ThemeContext.Provider value={{ ...state, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
