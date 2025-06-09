export interface Issue {
  id: string;
  floor: string;
  equipment: string;
  description: string;
  firstReported: Date;
  reportedBy: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  expectedResolutionDate?: Date | null;
  dateResolved?: Date | null;
  notes: {
    timestamp: any;
    comment: string;
    updatedBy: string;
  }[];
}
