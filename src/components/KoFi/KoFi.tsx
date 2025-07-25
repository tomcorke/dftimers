import React from 'react';

const kofiIcon = new URL(
  '../../images/kofi_symbol.png?as=webp&width=32&height=26',
  import.meta.url,
).href;

import './KoFi.css';

const KoFi = () => {
  return (
    <div className="kofiContainer">
      <a
        className="link"
        href="https://ko-fi.com/tomcorke"
        /* eslint-disable-next-line react/jsx-no-target-blank */
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          width="32"
          height="26"
          src={kofiIcon}
          alt="Buy Me a Coffee at ko-fi.com"
        />
        <span>Buy me a coffee</span>
      </a>
    </div>
  );
};

export default KoFi;
