import React from 'react';
import Select from 'react-select';
import { languageOptions } from '../../utils/languageOptions';

interface LanguageDropdownProps {
  onSelectChange: any
}

export default function LanguagesDropdown({ onSelectChange }: LanguageDropdownProps) {
  return (
    <Select
      placeholder="Filter By Category"
      options={languageOptions}
      defaultValue={languageOptions[0]}
      onChange={(selectedOption) => onSelectChange(selectedOption)}
    />
  );
}
