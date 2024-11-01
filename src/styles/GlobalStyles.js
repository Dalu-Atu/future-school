import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

.custom-shape-divider-top-1715354906 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
}

.custom-shape-divider-top-1715354906 svg {
  position: relative;
  display: block;
  width: 30rem;
  height: 170px;
  transform: rotateY(180deg);

}

.custom-shapd-divider-top-1715354906 .shape-fill {
  fill: #44A08D;
  /* #093637; */
}

/** For mobile devices **/

:root {
  --ifm-background-color: #18191a;
    --ifm-background-surface-color: #242526;
    --ifm-hover-overlay: hsla(0,0%,100%,0.05);

 &, &.light-mode{


-color-brand-50: #eef2ff;
  --color-white: #fff;
    --color-gray-100:  #f9fafb;
   --color-gray-200: #E9E9E9;
   --color-gray-300: #D9D9D9;
   --color-gray-400:  #9ca3af;
   --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;



   --color-red-100:  #fee2e2;
  --color-red-200:  #fecaca;
   --color-red-300:  #fca5a5;

   --color-red-400:  #f87171;
   --color-red-500:  #ef4444;
   --color-emerlad-300:#6ee7b7;
   --color-emerlad-400:#34d399;
   --color-emerlad-500:#10b981;
   --color-purple-800:#6b21a8;
   --color-purple-400:#c084fc;
   --color-purple-300:#d8b4fe;

   --color-chart-300: #a5b4fc;
   --color-chart-200: #c7d2fe;
   --color-chart-100: #e0e7ff;
   --color-sky-600:#0284c7;
--color-sky-700:#0369a1;
   --color-sky-800:#075985;
   --color-blue-900:#1e3a8a;

  //  .navlist:hover{
  //   background-color: var(--color-sky-800);
  //   color: var(--color-white);
  //  }


  --backdrop-color: rgba(
      0,
      0,
      0,
      0.5
    );

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);

  --border-radius-tiny: 3px;
  --border-radius-sm: 5px;
  --border-radius-md: 7px;
  --border-radius-lg: 9px; 
  }

  /* For dark mode */
  
  &.dark-mode{

  
  --image-grayscale: 0;
  --image-opacity: 100%;
  --color-white: #242526;
  --color-gray-200: #18191a;

  --ifm-background-color: #18191a;
    --ifm-background-surface-color: #242526;

    
 
/* #2f3133
#3b3d40
#474a4d
#525659  */

--color-gray-0: #18212f;
--color-gray-50: #111827;
--color-gray-100: #2f3133;

--color-gray-300: #3b3d40;
--color-gray-400: #3b3d40;
--color-gray-500: #9ca3af;
--color-gray-600: #d1d5db;
--color-gray-700: #e5e7eb;
--color-gray-800: #f3f4f6;
--color-gray-900: #f9fafb;

--color-blue-100: #075985;
--color-blue-700: #e0f2fe;
--color-green-100: #166534;
--color-green-700: #dcfce7;
--color-yellow-100: #854d0e;
--color-yellow-700: #fef9c3;
--color-silver-100: #374151;
--color-silver-700: #f3f4f6;
--color-indigo-100: #3730a3;
--color-indigo-700: #e0e7ff;

--color-red-100: #fee2e2;
--color-red-700: #b91c1c;
--color-red-800: #991b1b;

--backdrop-color: rgba(0, 0, 0, 0.3);

--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
--shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.3);
--shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.4);

--image-grayscale: 10%;
--image-opacity: 90%;
}
.react-sweet-progress-line-inner{
  min-height: 4px;
}
}

*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
    font-family: 'Roboto', sans-serif;
 

 

  /* Creating animations for dark mode */
  transition: background-color 0.3s, border 0.3s;
}
.react-calendar{
 border-style: none;
 line-height: normal;

}
.react-calendar__month-view {
    position: relative;
    top: -2rem;
}
.react-calendar__month-view__days {
    line-height: 0.6;
}
html {
  font-size: 62.5%;
  transition: color 0.3s, background-color 0.3s;


}

body {

  color: var(--color-gray-600);
  transition: color 0.3s, background-color 0.3s;
  min-height: 100vh;
  line-height: 1.5;
  font-size: 1.6rem;
  background-color: var(--color-gray-200);
  
  
  /* overflow: hidden; */

  

 
}


input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
}

*:disabled {
  cursor: not-allowed;
}

select:disabled,
input:disabled {
  background-color: var(--color-grey-200);
  color: var(--color-grey-500);
}

input:focus,
button:focus,
textarea:focus,
select:focus {
  outline: 2px solid var(--color-brand-600);
  outline-offset: -1px;
}

/* Parent selector, finally 😃 */
button:has(svg) {
  line-height: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
  hyphens: auto;
}

img {
  max-width: 100%;

  /* For dark mode */
  filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
}



/*
FOR DARK MODE

--color-grey-0: #18212f;
--color-grey-50: #111827;
--color-grey-100: #1f2937;
--color-grey-200: #374151;
--color-grey-300: #4b5563;
--color-grey-400: #6b7280;
--color-grey-500: #9ca3af;
--color-grey-600: #d1d5db;
--color-grey-700: #e5e7eb;
--color-grey-800: #f3f4f6;
--color-grey-900: #f9fafb;

--color-blue-100: #075985;
--color-blue-700: #e0f2fe;
--color-green-100: #166534;
--color-green-700: #dcfce7;
--color-yellow-100: #854d0e;
--color-yellow-700: #fef9c3;
--color-silver-100: #374151;
--color-silver-700: #f3f4f6;
--color-indigo-100: #3730a3;
--color-indigo-700: #e0e7ff;

--color-red-100: #fee2e2;
--color-red-700: #b91c1c;
--color-red-800: #991b1b;

--backdrop-color: rgba(0, 0, 0, 0.3);

--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
--shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.3);
--shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.4);

--image-grayscale: 10%;
--image-opacity: 90%;
*/
`;
export default GlobalStyles;
