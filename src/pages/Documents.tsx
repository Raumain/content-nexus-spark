
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FileText, Star, MoreHorizontal, Filter, Plus, Download, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Document } from "@/types";
import { fetchDocuments } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const DocumentsPage = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchParams] = useSearchParams();
  const collection = searchParams.get("collection") || "all";
  const navigate = useNavigate();
  const { toast } = useToast();

  // Updated useQuery with proper error handling for v5+
  const { data: documents = [], isLoading, isError } = useQuery({
    queryKey: ["documents", collection],
    queryFn: () => fetchDocuments(collection),
    meta: {
      onError: () => {
        toast({
          title: "Error loading documents",
          description: "Could not load the document collection",
          variant: "destructive",
        });
      }
    },
  });

  const getCollectionTitle = () => {
    switch (collection) {
      case "docs":
        return "Documentation";
      case "recent":
        return "Recent Documents";
      case "favorites":
        return "Favorite Documents";
      case "trash":
        return "Trash";
      default:
        return "All Documents";
    }
  };

  const columns: ColumnDef<Document>[] = [
    {
      accessorKey: "title",
      header: "Document",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded">
            <FileText className="h-4 w-4 text-primary-blue" />
          </div>
          <div>
            <div className="font-medium">{row.original.title}</div>
            <div className="text-sm text-muted-foreground">{row.original.type}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "lastModified",
      header: "Last Modified",
      cell: ({ row }) => new Date(row.original.lastModified).toLocaleDateString(),
    },
    {
      accessorKey: "lastModifiedBy",
      header: "Modified By",
      cell: ({ row }) => row.original.lastModifiedBy,
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => row.original.size,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const document = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Toggle favorite", document.id);
              }}
            >
              <Star
                className={`h-4 w-4 ${document.favorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
              />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: documents,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <h1 className="text-2xl font-bold mb-4">Error Loading Documents</h1>
        <p className="text-muted-foreground mb-6">There was a problem loading the document collection.</p>
        <Button onClick={() => navigate("/")} variant="outline">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{getCollectionTitle()}</h1>
          <p className="text-muted-foreground">
            {!isLoading ? documents.length : 0} document{documents.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" /> New Document
          </Button>
        </div>
      </div>

      <Card className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer"
                    onClick={() => navigate(`/documents/${row.original.id}`)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {isLoading ? "Loading documents..." : "No documents found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default DocumentsPage;
