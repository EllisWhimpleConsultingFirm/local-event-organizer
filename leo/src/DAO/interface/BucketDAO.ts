export interface BucketDAO {
    getPicture(eventId: number): { publicUrl: string };
    addPicture(eventId: number, file: File): Promise<{ publicUrl: string }>;
    updatePicture(eventId: number, file: File): Promise<{ publicUrl: string }>;
    deletePicture(eventId: number): Promise<void>;
}