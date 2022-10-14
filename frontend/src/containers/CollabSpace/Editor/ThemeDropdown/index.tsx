import React from 'react';
import Select, { ActionMeta } from 'react-select';
import monacoThemes from 'monaco-themes/themes/themelist.json';
import { customStyles } from '../../utils/customStyles';

function ThemeDropdown(handleThemeChange: any, theme: any) {
  return (
    <Select
      placeholder="Select Theme"
      // options={languageOptions}
      options={Object.entries(monacoThemes).map(([themeId, themeName]) => ({
        label: themeName,
        value: themeId,
        key: themeId,
      }))}
      value={theme}
      styles={customStyles}
      onChange={handleThemeChange}
    />
  );
}

export default ThemeDropdown;
