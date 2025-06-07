// // AuthRoute.js
// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';

// const AuthRoute = ({ component: Component, ...rest }) => {
//   const isAuthenticated = () => {
//     // Check if the token is present and valid
//     const token = localStorage.getItem('token');
//     return !!token; // You might want to add more sophisticated token validation
//   };

//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         isAuthenticated() ? (
//           <Component {...props} />
//         ) : (
//           <Redirect to="/login" />
//         )
//       }
//     />
//   );
// };

// export default AuthRoute;
import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login-page" replace />;
};

export default AuthRoute;

