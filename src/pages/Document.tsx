
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Star, 
  Clock, 
  User, 
  FileText, 
  Tag,
  Calendar,
  HardDrive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { fetchDocumentById } from "@/lib/api";

const DocumentView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: document, isLoading } = useQuery({
    queryKey: ["document", id],
    queryFn: () => fetchDocumentById(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!document) {
    return <div>Document not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{document.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{document.type}</span>
              <span>•</span>
              <span>{document.size}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={document.favorite ? "text-yellow-500" : ""}
          >
            <Star className={`h-5 w-5 ${document.favorite ? "fill-yellow-400" : ""}`} />
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <Tabs defaultValue="preview">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-none md:flex">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="pt-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="bg-white rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <div className="aspect-[16/9] bg-gray-100 rounded-md flex items-center justify-center mb-4">
                    {document.type.includes("image") ? (
                      <img 
                        src={document.previewUrl || "/placeholder.svg"} 
                        alt={document.title}
                        className="max-h-full max-w-full rounded-md" 
                      />
                    ) : (
                      <div className="text-center px-4">
                        <FileText className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Preview not available for this document type
                        </p>
                        <Button variant="outline" className="mt-4">
                          <Download className="h-4 w-4 mr-2" /> Download to view
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="prose max-w-none">
                    <h2 className="text-xl font-semibold mb-2">Document Content</h2>
                    <p>{document.description || "No description available for this document."}</p>
                    {document.content && (
                      <div className="mt-4">
                        {document.content}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="bg-white rounded-lg shadow-sm">
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-3">Document Properties</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-8 mt-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Created</p>
                        <p className="text-sm font-medium">{new Date(document.created).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 mt-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Modified</p>
                        <p className="text-sm font-medium">{new Date(document.lastModified).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 mt-1">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Modified By</p>
                        <p className="text-sm font-medium">{document.lastModifiedBy}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 mt-1">
                        <HardDrive className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Size</p>
                        <p className="text-sm font-medium">{document.size}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start">
                      <div className="w-8 mt-1">
                        <Tag className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tags</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {document.tags && document.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                          {(!document.tags || document.tags.length === 0) && (
                            <span className="text-sm">No tags</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="metadata" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {document.metadata && Object.entries(document.metadata).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                    <p className="text-sm text-muted-foreground">{value as string}</p>
                  </div>
                ))}
                {(!document.metadata || Object.keys(document.metadata).length === 0) && (
                  <p>No additional metadata available for this document.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {document.history && document.history.map((entry, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="p-2 bg-muted rounded-full">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{entry.action} by {entry.user}</p>
                      <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleString()}</p>
                      {entry.comment && <p className="text-sm mt-1">{entry.comment}</p>}
                    </div>
                  </div>
                ))}
                {(!document.history || document.history.length === 0) && (
                  <p>No history available for this document.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentView;
