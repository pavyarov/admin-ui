import React from 'react';
import Link from 'redux-first-router-link';
import { SOURCE_DATA_PAGE } from 'common/constants';

export const NotFoundPage = () => (
  <div>
    <h1>Page not found</h1>
    <Link to={{ type: SOURCE_DATA_PAGE }}>Back</Link>
  </div>
);
