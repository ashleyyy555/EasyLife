import React, { createContext, useContext, useState } from "react";

interface ProfileContextType {
    selectedImage: string | null;
    setSelectedImage: (image: string | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <ProfileContext.Provider value={{ selectedImage, setSelectedImage }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
};
