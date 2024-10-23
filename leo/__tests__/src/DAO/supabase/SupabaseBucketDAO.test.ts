import { SupabaseBucketDAO } from "@/DAO/supabase/SupabaseBucketDAO";
import { createClient } from "@/utils/supabase/server";

jest.mock("@/utils/supabase/server", () => ({
    createClient: jest.fn(),
}));

// Mock crypto.randomUUID
const mockUUID = "mock-uuid";
global.crypto.randomUUID = jest.fn().mockReturnValue(mockUUID);

describe('SupabaseBucketDAO', () => {
    let bucketDAO: SupabaseBucketDAO;
    let mockSupabaseClient: any;

    beforeEach(() => {
        mockSupabaseClient = {
            storage: {
                from: jest.fn().mockReturnValue({
                    getPublicUrl: jest.fn(),
                    upload: jest.fn(),
                    remove: jest.fn(),
                }),
            },
        };

        (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);

        bucketDAO = new SupabaseBucketDAO();
    });

    describe('getFile', () => {
        it('should return the public URL for a file', () => {
            const mockPublicUrl = 'http://example.com/event.png';
            mockSupabaseClient.storage.from().getPublicUrl.mockReturnValue({
                data: { publicUrl: mockPublicUrl }
            });

            const result = bucketDAO.getFile('test.png');

            expect(result).toEqual({ publicUrl: mockPublicUrl });
            expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('events-pictures');
            expect(mockSupabaseClient.storage.from().getPublicUrl).toHaveBeenCalledWith('test.png');
        });

        it('should throw an error if getPublicUrl fails', () => {
            mockSupabaseClient.storage.from().getPublicUrl.mockReturnValue({ data: null });

            expect(() => bucketDAO.getFile('test.png')).toThrow('Failed to get public URL');
        });
    });

    describe('addFile', () => {
        it('should add a file with a UUID name', async () => {
            const mockFile = new File([''], 'test.png', { type: 'image/png' });
            const mockPublicUrl = 'http://example.com/event.png';

            mockSupabaseClient.storage.from().upload.mockResolvedValue({ data: {}, error: null });
            mockSupabaseClient.storage.from().getPublicUrl.mockReturnValue({
                data: { publicUrl: mockPublicUrl }
            });

            const result = await bucketDAO.addFile(mockFile);

            expect(result).toEqual({ publicUrl: mockPublicUrl });
            expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('events-pictures');
            expect(mockSupabaseClient.storage.from().upload).toHaveBeenCalledWith(
                `${mockUUID}.png`,
                mockFile,
                {
                    cacheControl: '3600',
                    upsert: false
                }
            );
            expect(mockSupabaseClient.storage.from().getPublicUrl).toHaveBeenCalledWith(`${mockUUID}.png`);
        });

        it('should throw an error if the upload fails', async () => {
            const mockError = new Error('Upload failed');
            mockSupabaseClient.storage.from().upload.mockResolvedValue({ error: mockError });

            await expect(bucketDAO.addFile(new File([''], 'test.png'))).rejects.toThrow(mockError);
        });
    });

    describe('updateFile', () => {
        it('should update a file with the given filename', async () => {
            const mockFile = new File([''], 'test.png', { type: 'image/png' });
            const mockPublicUrl = 'http://example.com/updated-event.png';
            const fileName = 'existing-file.png';

            mockSupabaseClient.storage.from().upload.mockResolvedValue({ data: {}, error: null });
            mockSupabaseClient.storage.from().getPublicUrl.mockReturnValue({
                data: { publicUrl: mockPublicUrl }
            });

            const result = await bucketDAO.updateFile(fileName, mockFile);

            expect(result).toEqual({ publicUrl: mockPublicUrl });
            expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('events-pictures');
            expect(mockSupabaseClient.storage.from().upload).toHaveBeenCalledWith(
                fileName,
                mockFile,
                {
                    cacheControl: '3600',
                    upsert: true
                }
            );
            expect(mockSupabaseClient.storage.from().getPublicUrl).toHaveBeenCalledWith(fileName);
        });

        it('should throw an error if the update fails', async () => {
            const mockError = new Error('Update failed');
            mockSupabaseClient.storage.from().upload.mockResolvedValue({ error: mockError });

            await expect(bucketDAO.updateFile('test.png', new File([''], 'test.png')))
                .rejects.toThrow(mockError);
        });
    });

    describe('deleteFile', () => {
        it('should delete a file with the given file ID', async () => {
            const fileId = 'test.png';
            mockSupabaseClient.storage.from().remove.mockResolvedValue({ data: {}, error: null });

            await bucketDAO.deleteFile(fileId);

            expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('events-pictures');
            expect(mockSupabaseClient.storage.from().remove).toHaveBeenCalledWith([fileId]);
        });

        it('should throw an error if the delete fails', async () => {
            const mockError = new Error('Delete failed');
            mockSupabaseClient.storage.from().remove.mockResolvedValue({ error: mockError });

            await expect(bucketDAO.deleteFile('test.png')).rejects.toThrow(mockError);
        });
    });
});