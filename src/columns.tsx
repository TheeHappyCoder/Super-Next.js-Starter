'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Issue } from '@/types/issue';
import { format, formatDistanceToNow } from 'date-fns';

export const columns: ColumnDef<Issue>[] = [
  {
    accessorKey: 'floor',
    header: () => 'Floor',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'equipment',
    header: () => 'Equipment',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'description',
    header: () => 'Description',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'status',
    header: () => 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const colorMap: Record<string, string> = {
        Open: 'bg-red-100 text-red-800',
        'In Progress': 'bg-yellow-100 text-yellow-800',
        Resolved: 'bg-green-100 text-green-800',
      };
      return (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${colorMap[status] || ''}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'firstReported',
    header: () => 'First Reported',
    cell: ({ row }) => {
      const date = row.original.firstReported;
      return date ? format(date, 'PPP') : '-';
    },
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    cell: ({ row }) => {
      const date = row.original.firstReported;
      return date ? formatDistanceToNow(date, { addSuffix: true }) : '-';
    },
  },
];
