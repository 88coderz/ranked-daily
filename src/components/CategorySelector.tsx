import React from 'react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';

const categories = [
  { name: 'Politics', value: 'politics' },
  { name: 'Tech', value: 'tech' },
  { name: 'Local', value: 'local' },
  { name: 'National', value: 'national' },
  { name: 'Global', value: 'global' },
];

interface Props {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function CategorySelector({ selected, onChange }: Props) {
  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <ButtonGroup>
      {categories.map((cat) => (
        <ToggleButton
          key={cat.value}
          id={`cat-toggle-${cat.value}`}
          type="checkbox"
          variant={selected.includes(cat.value) ? 'primary' : 'outline-primary'}
          checked={selected.includes(cat.value)}
          value={cat.value}
          onChange={() => handleToggle(cat.value)}
        >
          {cat.name}
        </ToggleButton>
      ))}
    </ButtonGroup>
  );
}
