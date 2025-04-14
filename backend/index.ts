
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import mockDocuments from './mockData.json';

// Create the Elysia app
const app = new Elysia()
  .use(cors())
  .use(staticPlugin())
  .get('/', () => 'NuxeoDocs API is running!')

  // Dashboard stats endpoint
  .get('/api/dashboard/stats', () => {
    const totalDocuments = mockDocuments.length;
    const sharedDocuments = mockDocuments.filter((doc: any) => doc.metadata?.shared).length;
    const recentActivity = mockDocuments.filter(
      (doc: any) => new Date(doc.lastModified) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    const favorites = mockDocuments.filter((doc: any) => doc.favorite).length;

    return {
      totalDocuments,
      sharedDocuments,
      recentActivity,
      favorites,
      storageUsed: "2.7 GB",
      storageTotal: "10 GB",
      storageUsedBytes: 2.7 * 1024 * 1024 * 1024,
      storageTotalBytes: 10 * 1024 * 1024 * 1024,
    }
  })

  // Documents endpoints
  .get('/api/documents', ({ query }) => {
    const { collection } = query;
    
    let filteredDocs = [...mockDocuments];
    
    if (collection === "docs") {
      filteredDocs = filteredDocs.filter(doc => doc.type.includes("document"));
    } else if (collection === "recent") {
      filteredDocs = filteredDocs.filter(
        doc => new Date(doc.lastModified) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
    } else if (collection === "favorites") {
      filteredDocs = filteredDocs.filter(doc => doc.favorite);
    } else if (collection === "trash") {
      // In a real app, we'd have a "deleted" flag or separate trash data
      filteredDocs = [];
    }
    
    return filteredDocs;
  })

  .get('/api/documents/:id', ({ params }) => {
    const document = mockDocuments.find(doc => doc.id === params.id);
    
    if (!document) {
      return new Response('Document not found', { status: 404 });
    }
    
    return document;
  })

  .get('/api/documents/recent', () => {
    const recentDocs = [...mockDocuments]
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
      .slice(0, 5);
    
    return recentDocs;
  })

  // Search endpoint
  .get('/api/search', ({ query }) => {
    const { q, docType, sortBy } = query;
    
    if (!q) {
      return [];
    }
    
    let results = mockDocuments.filter(doc => 
      doc.title.toLowerCase().includes(q.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(q.toLowerCase())) ||
      (doc.content && doc.content.toLowerCase().includes(q.toLowerCase()))
    );
    
    // Filter by document type if specified
    if (docType && docType !== "all") {
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
    
    return results;
  })

  // Start the server
  .listen(3000);

console.log(`🦊 NuxeoDocs API is running at ${app.server?.hostname}:${app.server?.port}`);
