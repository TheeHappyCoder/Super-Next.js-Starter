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

const statuses = ['All', 'Open', 'In Progress', 'Resolved'];

export default function SelectStatus({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
