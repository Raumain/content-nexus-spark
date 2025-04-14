
export interface Document {
  id: string;
  title: string;
  description?: string;
  content?: string;
  type: string;
  size: string;
  created: string;
  lastModified: string;
  lastModifiedBy: string;
  favorite: boolean;
  tags?: string[];
  previewUrl?: string;
  metadata?: Record<string, string | number | boolean>;
  history?: {
    date: string;
    user: string;
    action: string;
    comment?: string;
  }[];
}

export interface DashboardStats {
  totalDocuments: number;
  sharedDocuments: number;
  recentActivity: number;
  favorites: number;
  storageUsed: string;
  storageTotal: string;
  storageUsedBytes: number;
  storageTotalBytes: number;
}
