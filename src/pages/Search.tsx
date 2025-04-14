
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, FileText, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Document } from "@/types";
import { searchDocuments } from "@/lib/api";

const Search = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [docType, setDocType] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", searchTerm, docType, sortBy],
    queryFn: () => searchDocuments(searchTerm, docType, sortBy),
    enabled: searchTerm.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query is triggered by state changes
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Search Documents</h1>
        <p className="text-muted-foreground">Find documents across your workspace</p>
      </div>

      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for documents, content, or metadata..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>

              {searchTerm && searchResults && (
                <p className="text-sm text-muted-foreground">
                  {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} found
                </p>
              )}
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="docType" className="block text-sm font-medium mb-1">
                    Document Type
                  </label>
                  <Select value={docType} onValueChange={setDocType}>
                    <SelectTrigger id="docType">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="doc">Word Document</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="spreadsheet">Spreadsheet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="sortBy" className="block text-sm font-medium mb-1">
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sortBy">
                      <SelectValue placeholder="Relevance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="date">Date (Newest First)</SelectItem>
                      <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Button type="button" variant="secondary" size="sm">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Advanced Filters
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {searchTerm && (
        <div className="space-y-2">
          {!isLoading && searchResults && searchResults.length > 0 ? (
            searchResults.map((doc: Document) => (
              <Card 
                key={doc.id} 
                className="hover:bg-gray-50 transition cursor-pointer"
                onClick={() => navigate(`/documents/${doc.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 mt-1 bg-blue-50 rounded">
                      <FileText className="h-5 w-5 text-primary-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{doc.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>Modified {new Date(doc.lastModified).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>By {doc.lastModifiedBy}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            searchTerm && !isLoading && (
              <div className="text-center p-6">
                <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find what you're looking for
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
