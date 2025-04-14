
import { DashboardStats, Document } from "@/types";
import mockDocuments from "./mockData.json";

// Fetch dashboard statistics
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalDocuments: mockDocuments.length,
        sharedDocuments: mockDocuments.filter(doc => doc.metadata?.shared).length,
        recentActivity: mockDocuments.filter(
          doc => new Date(doc.lastModified) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length,
        favorites: mockDocuments.filter(doc => doc.favorite).length,
        storageUsed: "2.7 GB",
        storageTotal: "10 GB",
        storageUsedBytes: 2.7 * 1024 * 1024 * 1024,
        storageTotalBytes: 10 * 1024 * 1024 * 1024,
      });
    }, 500);
  });
};

// Fetch all documents or filtered by collection
export const fetchDocuments = async (collection?: string): Promise<Document[]> => {
  // In a real app, this would be an API call with filters
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredDocs = [...mockDocuments];
      
      if (collection === "docs") {
        filteredDocs = filteredDocs.filter(doc => doc.type?.includes("document") || doc.type?.includes("Document"));
      } else if (collection === "recent") {
        filteredDocs = filteredDocs.filter(
          doc => new Date(doc.lastModified) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
      } else if (collection === "favorites") {
        filteredDocs = filteredDocs.filter(doc => doc.favorite === true);
      } else if (collection === "trash") {
        // For the trash collection, we'll return an empty array for now
        filteredDocs = [];
      }
      
      resolve(filteredDocs || []);
    }, 500);
  });
};

// Fetch recent documents
export const fetchRecentDocuments = async (): Promise<Document[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const recentDocs = [...mockDocuments]
        .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
        .slice(0, 5);
      resolve(recentDocs);
    }, 500);
  });
};

// Fetch document by ID
export const fetchDocumentById = async (id: string): Promise<Document | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const document = mockDocuments.find(doc => doc.id === id);
      resolve(document);
    }, 500);
  });
};

// Search documents
export const searchDocuments = async (
  query: string,
  docType: string = "all",
  sortBy: string = "relevance"
): Promise<Document[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query) {
        resolve([]);
        return;
      }
      
      let results = mockDocuments.filter(doc => 
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(query.toLowerCase())) ||
        (doc.content && doc.content.toLowerCase().includes(query.toLowerCase()))
      );
      
      // Filter by document type if specified
      if (docType !== "all") {
        results = results.filter(doc => doc.type.toLowerCase().includes(docType.toLowerCase()));
      }
      
      // Sort results
      if (sortBy === "date") {
        results.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
      } else if (sortBy === "date-asc") {
        results.sort((a, b) => new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime());
      } else if (sortBy === "name") {
        results.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === "name-desc") {
        results.sort((a, b) => b.title.localeCompare(a.title));
      }
      
      resolve(results);
    }, 500);
  });
};
