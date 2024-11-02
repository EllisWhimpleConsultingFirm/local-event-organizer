export interface BucketDAO {
    getFile(fileId: string): { publicUrl: string };
    addFile(file: File): Promise<{ publicUrl: string }>;
    updateFile(fileId: string, file: File): Promise<{ publicUrl: string }>;
    deleteFile(fileId: string): Promise<void>;
}