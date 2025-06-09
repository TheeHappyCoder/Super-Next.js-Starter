  'use client';

  import { useEffect, useState, useMemo } from 'react';
  import { onAuthStateChanged } from 'firebase/auth';
  import { collection, getDocs, query, DocumentData } from 'firebase/firestore';
  import { auth, db } from '@/lib/firebase';
  import { Issue } from '@/types/issue';
  import { Table } from '@/components/ui/table';
  import LoadingIndicator from '@/components/loading-indicator';
  import CreateIssueButton from '@/components/create-issue';
  import { columns } from '../columns';
  import SummaryCard from '@/components/dashboard/summary-card';
  import SelectFloor from '@/components/dashboard/select-floor';
  import SelectStatus from '@/components/dashboard/select-status';
  import SortByDate from '@/components/dashboard/date-sorter';
  import DateRangeFilter from '@/components/dashboard/date-picker';
  import { DateRange } from 'react-day-picker';
  import { Button } from '@/components/ui/button';
  import { InfoIcon } from 'lucide-react';
  import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
  } from "@/components/ui/sheet";

  export default function Home() {
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [isFetchLoading, setIsFetchLoading] = useState<boolean>(false);
    const [selectedFloor, setSelectedFloor] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);


    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsAuth(!!user);
        setCheckingAuth(false);
      });
      return () => unsubscribe();
    }, []);

    useEffect(() => {
      if (isAuth) {
        loadIssues();
      }
    }, [isAuth]);

     const loadIssues = async () => {
      try {
        setIsFetchLoading(true);
        const snapshot = await getDocs(query(collection(db, 'issues')));
        const fetched = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            floor: data.floor,
            equipment: data.equipment,
            description: data.description,
            firstReported: data.firstReported?.toDate(),
            reportedBy: data.reportedBy || "unknown",
            status: data.status,
            expectedResolutionDate: data.expectedResolutionDate?.toDate(),
            dateResolved: data.dateResolved?.toDate(),
            notes: data.notes || [],
          } as Issue;
        });
        setIssues(fetched);
      } finally {
        setIsFetchLoading(false);
      }
    };

    const filteredIssues = useMemo(() => {
      return issues
        .filter((issue) => {
          const floorMatch =
            selectedFloor === 'All' || issue.floor === selectedFloor;
          const statusMatch =
            selectedStatus === 'All' || issue.status === selectedStatus;

          const dateMatch =
            !dateRange?.from || !issue.firstReported
              ? true
              : issue.firstReported >= dateRange.from &&
                (!dateRange.to || issue.firstReported <= dateRange.to);

          return floorMatch && statusMatch && dateMatch;
        })
        .sort((a, b) => {
          const dateA = a.firstReported?.getTime() || 0;
          const dateB = b.firstReported?.getTime() || 0;
          return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
    }, [issues, selectedFloor, selectedStatus, sortOrder, dateRange]);

    const countByStatus = (status: string) =>
      issues.filter((issue) => issue.status === status).length;

    if (checkingAuth) {
      return <LoadingIndicator contained={false} />;
    }

    if (!isAuth) {
      return null;
    }

    return (
      <>
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard title="Total Issues" value={issues.length} />
          <SummaryCard title="Open" value={countByStatus('Open')} />
          <SummaryCard title="In Progress" value={countByStatus('In Progress')} />
          <SummaryCard title="Resolved" value={countByStatus('Resolved')} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <SelectFloor value={selectedFloor} onChange={setSelectedFloor} />
          <SelectStatus value={selectedStatus} onChange={setSelectedStatus} />
          <SortByDate value={sortOrder} onChange={setSortOrder} />
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <CreateIssueButton />
        </div>

        {/* Table */}
          <Table
            data={filteredIssues}
            className=''
            columns={columns}
            bordered="full"
            hideHeader
            loading={isFetchLoading}
            loadingIndicator={
              <LoadingIndicator
                size="small"
                contained
              />
            }
            onRowSelect={(issue) => {
              setSelectedIssue(issue);
            }}
              actionFooter={
              selectedIssue
                ? [
                    <Button
                    variant={'default'}
                    onClick={() => setSheetOpen(true)}
                    className="text-xs font-medium cursor-pointer"
                  >
                    <InfoIcon size={12} />
                    View Details
                  </Button>

                  ]
                : []
            }
            actionFooterClassName="bg-gradient-to-r from-[#42af38] via-[#44b036] to-[#41af39] shadow-lg py-4"
          />
      </main>
  <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
    <SheetContent side="right" className="max-w-md w-full p-6">
      <SheetHeader>
        <SheetTitle className="text-xl">Issue Details</SheetTitle>
        <SheetDescription className="text-sm text-muted-foreground">
          Detailed info about the selected issue.
        </SheetDescription>
      </SheetHeader>

      {selectedIssue && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
            <span className="text-muted-foreground font-medium">Floor</span>
            <span>{selectedIssue.floor}</span>

            <span className="text-muted-foreground font-medium">Equipment</span>
            <span>{selectedIssue.equipment}</span>

            <span className="text-muted-foreground font-medium">Description</span>
            <span>{selectedIssue.description}</span>

            <span className="text-muted-foreground font-medium">Status</span>
            <span>{selectedIssue.status}</span>

            <span className="text-muted-foreground font-medium">First Reported</span>
            <span>{selectedIssue.firstReported?.toLocaleDateString()}</span>

            <span className="text-muted-foreground font-medium">Reported By</span>
            <span>{selectedIssue.reportedBy || "Unknown"}</span>

          </div>

          {selectedIssue.notes?.length > 0 && (
            <div className="pt-4 border-t border-border space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {selectedIssue.notes.map((note, idx) => (
                  <li key={idx}>
                    <span className="block">{note.comment}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(note.timestamp?.seconds * 1000).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </SheetContent>
  </Sheet>
  </>
    );
  }
