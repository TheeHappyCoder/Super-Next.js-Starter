"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFixedHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export default function CreateIssueButtons() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newIssue, setNewIssue] = useState({ floor: "", equipment: "", description: "", note: "" });
  const { user } = useAuth();

function getOrdinalSuffix(n: number): string {
  if (n >= 11 && n <= 13) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

 const handleAddNewIssue = async () => {
  if (newIssue.floor && newIssue.equipment && newIssue.description) {
    const newDoc = {
      floor: newIssue.floor,
      equipment: newIssue.equipment,
      description: newIssue.description,
      status: "Open",
      firstReported: Timestamp.now(),
      expectedResolutionDate: null,
      dateResolved: null,
      reportedBy: user?.email ?? "unknown", // <-- added field
      notes: newIssue.note
        ? [{ timestamp: Timestamp.now(), comment: newIssue.note, updatedBy: user?.email ?? "unknown" }]
        : [],
    };

    await addDoc(collection(db, "issues"), newDoc);
  } else {
    throw new Error("Missing required fields");
  }
};

const handleCreateIssue = async () => {
  setLoading(true);
  try {
    await handleAddNewIssue();
    toast.success("Issue created successfully!");
    setOpen(false);
  } catch (error) {
    toast.error("Failed to create issue. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-gradient-to-r from-[#42af38] via-[#44b036] to-[#41af39] text-white shadow-lg hover:shadow-xl transition hover:scale-105 cursor-pointer"
        >
          Create Issue
        </Button>
      </DialogTrigger>

      <DialogContent
        header={
          <DialogFixedHeader
            title="Create New Issue"
            description="Log a new equipment or sensor issue observed during your site visit. This entry will appear on the dashboard and can be tracked and updated later."
          />
        }
        className="animate-in fade-in zoom-in-95 shadow-xl max-w-2xl p-0"
      >
        <VisuallyHidden>
          <DialogTitle>Create New Issue</DialogTitle>
        </VisuallyHidden>

        {/* Scrollable Content */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto p-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Add New Issue</h3>
            <div className="space-y-2">
             <Select
                value={newIssue.floor}
                onValueChange={(value) => setNewIssue({ ...newIssue, floor: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ground Floor">Ground Floor</SelectItem>
                  {Array.from({ length: 11 }, (_, i) => {
                    const floorLabel = `${i + 1}${getOrdinalSuffix(i + 1)} Floor`
                    return (
                      <SelectItem key={floorLabel} value={floorLabel}>
                        {floorLabel}
                      </SelectItem>
                    )
                  })}
                  <SelectItem value="Roof">Roof</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="Equipment"
                value={newIssue.equipment}
                onChange={(e) => setNewIssue({ ...newIssue, equipment: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Description"
                value={newIssue.description}
                onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Initial note (optional)"
                value={newIssue.note}
                onChange={(e) => setNewIssue({ ...newIssue, note: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <DialogFooter className="sticky bottom-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4 flex justify-between">
          <Button
            variant="default"
            onClick={handleCreateIssue}
            disabled={loading}
            className="transition hover:scale-105 active:scale-95 cursor-pointer"
          >
            {loading ? "Processing..." : "Confirm & Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
