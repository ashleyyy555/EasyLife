import React, { createContext, useContext, useState } from 'react';

const ProfilePicContext = createContext([null, () => {}]);

export const ProfilePicContextProvider = ({ children }) => {
    const [ profilePicURL, setProfilePicURL ] = useState();
    const contextValue = [ profilePicURL, setProfilePicURL ]; // ✅ pass function, not result

    return (
        <ProfilePicContext.Provider value={contextValue}>
            {children}
        </ProfilePicContext.Provider>
    );
};

export const useProfilePicContext = () => {
    const context = useContext(ProfilePicContext);

    if (context === undefined) {
        throw new Error('useProfilePicContext must be used within a ProfilePicContextProvider');
    }

    return context;
};
