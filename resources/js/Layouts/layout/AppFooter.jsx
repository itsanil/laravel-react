import React, { useContext } from 'react';

const AppFooter = () => {
    return (
        <div className="layout-footer">
            <span>Made
                 {/* with <span className="text-red-500">&#10084;&#65039;</span> https://corient.tech/  */}
                  by</span>
            <span className="font-medium ml-2">It Corient</span>
        </div>
    );
};

export default AppFooter;
