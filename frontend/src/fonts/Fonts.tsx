import React from 'react';
import { Global } from '@emotion/react';

function Fonts() {
  return (
    <Global
      styles={`
      @font-face {
        font-family: 'Cereal';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url('./fonts/AirbnbCereal_W_Bd.otf') format("opentype");
      }
      @font-face {
        font-family: 'Cereal';
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: url('./fonts/AirbnbCereal_W_Md.otf') format("opentype");
      }
      @font-face {
        font-family: 'Cereal';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('./fonts/AirbnbCereal_W_Bk.otf') format("opentype");
      }
      `}
    />
  );
}

export default Fonts;
