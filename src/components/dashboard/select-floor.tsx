'use client';

import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const floors = [
  'All',
  'Ground',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  'Roof',
];

export default function SelectFloor({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Select floor" />
      </SelectTrigger>
      <SelectContent>
        {floors.map((floor) => (
          <SelectItem key={floor} value={floor}>
            {floor === 'All' ? 'All Floors' : `Floor ${floor}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
