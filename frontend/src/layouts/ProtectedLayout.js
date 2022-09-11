import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { URL_USER_SVC } from '../configs';
import { STATUS_CODE_OK } from '../constants';

const ProtectedLayout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // TODO: properly abstract authentication into its own hook
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

    return !isAuthenticated ? <Navigate to="/login" replace /> : <Outlet />;
};

export default ProtectedLayout;
