import React, { createContext, useContext, useState } from 'react';

const ActiveReportContext = createContext([null, () => {}]);

export const ActiveReportContextProvider = ({ children }) => {
    const [ activeReportId, setActiveReport ] = useState();
    const contextValue = [ activeReportId, setActiveReport ];


    return (
        <ActiveReportContext.Provider value = {contextValue}>
            {children}
        </ActiveReportContext.Provider>
    );
};

export const useActiveReportContext = () => {
    const context = useContext(ActiveReportContext);

    if (context === undefined) {
        throw new Error('useActiveReportContext must be used within the context');
    }
    return context;
};