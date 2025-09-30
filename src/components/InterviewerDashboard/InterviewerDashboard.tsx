import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { ScrollArea } from "../../components/ui/scroll-area";
import React from "react";
import type { CandidateEntry } from "../../types/interview";
import { useLocalCandidates } from "../../utils/candidateStorage";

// Local types
export type Candidate = {
  id: string;
  name: string;
  email: string;
  finalScore: number; // out of 100
  status: "Complete" | "In Progress";
};



export function InterviewerDashboard() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const pageSize = 6;

  type SortKey = "name" | "email" | "finalScore";
  const [sortKey, setSortKey] = React.useState<SortKey>("finalScore");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");

  const [selected, setSelected] = React.useState<CandidateEntry | null>(null);
  const [open, setOpen] = React.useState(false);

  // --- REPLACE initialCandidates ---
  const { candidates } = useLocalCandidates();

  const openDetails = (c: CandidateEntry) => {
    setSelected(c);
    setOpen(true);
  };

  const filteredCandidates = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = candidates.filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );

    const dir = sortDir === "asc" ? 1 : -1;
    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === "finalScore") return (a.finalScore - b.finalScore) * dir;
      const av = a[sortKey].toString().toLowerCase();
      const bv = b[sortKey].toString().toLowerCase();
      return av < bv ? -1 * dir : av > bv ? 1 * dir : 0;
    });

    return sorted;
  }, [candidates, search, sortKey, sortDir]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCandidates.length / pageSize)
  );
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filteredCandidates.slice(start, start + pageSize);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "finalScore" ? "desc" : "asc");
    }
    setPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Candidates</h3>
          <p className="text-sm text-muted-foreground">
            Monitor and review completed interviews
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Candidates by Name or Email"
            value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">
                  <button
                    className="inline-flex items-center gap-2 hover:underline"
                    onClick={() => toggleSort("name")}
                  >
                    Candidate Name
                    <ArrowUpDown
                      className={`h-3.5 w-3.5 ${sortKey === "name" ? "text-foreground" : "text-muted-foreground"}`}
                    />
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">
                  <button
                    className="inline-flex items-center gap-2 hover:underline"
                    onClick={() => toggleSort("email")}
                  >
                    Email
                    <ArrowUpDown
                      className={`h-3.5 w-3.5 ${sortKey === "email" ? "text-foreground" : "text-muted-foreground"}`}
                    />
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">
                  <button
                    className="inline-flex items-center gap-2 hover:underline"
                    onClick={() => toggleSort("finalScore")}
                  >
                    Final Score
                    <ArrowUpDown
                      className={`h-3.5 w-3.5 ${sortKey === "finalScore" ? "text-foreground" : "text-muted-foreground"}`}
                    />
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No candidates found
                  </td>
                </tr>
              ) : (
                pageItems.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-4 py-3">
                      <button
                        className="text-foreground hover:underline"
                        onClick={() => openDetails(c)}
                      >
                        {c.name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.email}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="bg-primary/10 text-primary">
                        {c.finalScore}/100
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {c.status === "Complete" ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          Complete
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                          In Progress
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t text-sm">
          <p className="text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Detailed Candidate Review Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-5xl p-0 overflow-hidden">
          {selected && (
            <div className="flex flex-col h-[85vh]">
              <DialogHeader className="border-b bg-card/80 backdrop-blur-sm px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl font-bold tracking-tight">
                      {selected.name}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                      {selected.email}
                    </DialogDescription>
                  </div>
                  <Badge className="text-base mr-4 px-3 py-1 bg-primary text-primary-foreground">
                    {selected.finalScore}/100
                  </Badge>
                </div>
              </DialogHeader>

              <div className="px-6 pt-4">
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="history">Interview History</TabsTrigger>
                    <TabsTrigger value="summary">AI Summary</TabsTrigger>
                  </TabsList>

                  {/* Profile */}
                  <TabsContent value="profile" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border-0">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Candidate Profile
                          </CardTitle>
                          <CardDescription>Basic information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Name
                            </span>
                            <span className="font-medium">{selected.name}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Email
                            </span>
                            <span className="font-medium">
                              {selected.email}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Phone
                            </span>
                            <span className="font-medium">
                              {selected.phone}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Resume
                            </span>
                            <span className="font-medium">
                              {selected.resumeFileName}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-0">
                        <CardHeader>
                          <CardTitle className="text-base">Status</CardTitle>
                          <CardDescription>
                            Interview completion
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Overall Status
                            </span>
                            {selected.status === "Complete" ? (
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                Complete
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                                In Progress
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Final Score
                            </span>
                            <Badge className="bg-primary/10 text-primary">
                              {selected.finalScore}/100
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Interview History */}
                  <TabsContent value="history" className="mt-4">
                    <Card className="border-0 h-[58vh] md:h-[50vh] flex flex-col overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-base">
                          Question & Answer Review
                        </CardTitle>
                        <CardDescription>
                          Each item includes question, your answer, and AI
                          feedback
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full pr-4">
                          <div className="space-y-4">
                            {selected.history.map((item, idx) => (
                              <div
                                key={idx}
                                className="rounded-xl border p-4 bg-muted/20"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">{`Q${idx + 1} - ${item.difficulty}`}</span>
                                  <Badge className="bg-primary/10 text-primary">
                                    ⋆⋆⋆⋆ {item.aiScore}/
                                    {item.difficulty === "Easy"
                                      ? 10
                                      : item.difficulty === "Medium"
                                        ? 15
                                        : 25}
                                  </Badge>
                                </div>
                                <p className="text-sm mb-2">
                                  <span className="text-muted-foreground">
                                    Question:{" "}
                                  </span>
                                  {item.question}
                                </p>
                                <div className="text-sm">
                                  <span className="text-muted-foreground">
                                    Answer:{" "}
                                  </span>
                                  {item.answer}
                                </div>
                                <div className="mt-3 p-3 rounded-lg bg-card border">
                                  <p className="text-sm text-muted-foreground mb-1">
                                    AI Justification
                                  </p>
                                  <p className="text-sm">
                                    {item.aiJustification}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* AI Summary */}
                  <TabsContent value="summary" className="mt-4">
                    <Card className="border-0">
                      <CardHeader>
                        <CardTitle className="text-base">
                          Final AI Summary
                        </CardTitle>
                        <CardDescription>
                          Concise recommendation based on performance
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-xl border bg-primary/5 p-4 text-sm leading-relaxed">
                          {selected.summary}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
