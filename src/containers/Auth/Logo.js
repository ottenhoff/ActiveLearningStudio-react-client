import React from 'react';
import { useSelector } from 'react-redux';

import logo from 'assets/images/sndt.png';

export default function Logo() {
  const logoState = useSelector((state) => state.organization.currentOrganization);
  return (
    logoState?.id === 1 ? (
      <img src={logo} className="auth-header-logo" alt="" />
    ) : <img src={global.config.resourceUrl + logoState?.image} className="auth-header-logo" alt="" />
  );
}
