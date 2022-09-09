import React, { useState, useEffect } from 'react';
import NavbarTemplate from './NavbarTemplate'
import { URL_USER_SVC } from '../../configs';
import { STATUS_CODE_OK } from '../../constants';
import axios from 'axios';

const generalPage = [['Login', '/login'], ['Register', '/register']];
const dashboardPage = [['Account Settings', '/accountsettings'], ['Dashboard', '/dashboard'], ['Choose Level', '/chooselevel']];

function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // TODO: use localstorage for auth instead of copying from layout
    useEffect(() => {
        (async () => {
            await axios
                .get(`${URL_USER_SVC}/verify`, { withCredentials: true })
                .then((response) => {
                    if (response.status === STATUS_CODE_OK) {
                        setIsAuthenticated(true);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setIsAuthenticated(false);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        })();
    }, []);

    if (isLoading) {
        return <></>;
    }

    return (
        <div>
            {
                !isAuthenticated ? <NavbarTemplate pages={generalPage}/> : <NavbarTemplate pages={dashboardPage}/> 
            }
        </div> 
    );
}

export default Navbar;