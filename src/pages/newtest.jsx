import React from 'react'

const Newtest = () => {
    const APP_CUSTOM_SCHEME = 'tops://(customer)/login';
    const APP_PACKAGE_NAME = 'com.lechi.insanjo';
    const APP_STORE_URL = 'https://insanjo.com/download';

    const getDeepLink = () => {
        if (/android/i.test(navigator.userAgent)) {
            return `intent://(customer)/login#Intent;scheme=tops;package=${APP_PACKAGE_NAME};end`;
        }
        return APP_CUSTOM_SCHEME;
    };
    return (
        <div>

            <a href={getDeepLink()}> go to app</a>
        </div>
    )
}

export default Newtest