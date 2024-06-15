import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { decodeToken } from '../utils/ApiFunctions';
import Spinner from "../components/Spinner"

const PrivateRoute = () => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      const token = Cookies.get('auth');

      if (token) {
        try {
          const decodedToken = await decodeToken(token);

          if (decodedToken?.role === 'admin') {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, []);

  return isAuthorized === true ? <Outlet /> : <Spinner/>;
};

export default PrivateRoute;
