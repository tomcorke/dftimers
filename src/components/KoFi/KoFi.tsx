import React from "react";

const kofiIcon = new URL(
  "../../images/Ko-fi_Icon_RGBforDarkBg_sm.png?as=webp",
  import.meta.url
).href;

import "./KoFi.css";

const KoFi = () => {
  return (
    <div className={"kofiContainer"}>
      <a
        className={"link"}
        href="https://ko-fi.com/tomcorke"
        /* eslint-disable-next-line react/jsx-no-target-blank */
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          height="36"
          style={{ border: "0px", height: "36px" }}
          src={kofiIcon}
          alt="Buy Me a Coffee at ko-fi.com"
        />
        <span>Buy me a coffee</span>
      </a>
    </div>
  );
};

export default KoFi;
