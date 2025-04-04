import React, { createContext, useContext } from "react";
import { useColorScheme } from "react-native";
import { LightTheme, DarkTheme } from "../theme/theme"; // Import themes

const ThemeContext = createContext({
    theme: LightTheme, // Default theme
    isDarkMode: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === "dark";

    return (
        <ThemeContext.Provider value={{ theme: isDarkMode ? DarkTheme : LightTheme, isDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
