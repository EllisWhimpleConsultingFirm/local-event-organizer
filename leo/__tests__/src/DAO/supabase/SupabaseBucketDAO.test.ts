import { SupabaseEventsDAO } from '@/DAO/supabase/SupabaseEventsDAO';
import { createClient } from "@/utils/supabase/server";
import {SupabaseBucketDAO} from "@/DAO/supabase/SupabaseBucketDAO";

jest.mock("@/utils/supabase/server", () => ({
    createClient: jest.fn(),
}));

describe('SupabaseEventsDAO', () => {
    let bucketDAO: SupabaseBucketDAO;
    let mockSupabaseClient: any;

    beforeEach(() => {
        mockSupabaseClient = {
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockReturnThis(),
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

    describe('getEventPicture', () => {
        it('should return the public URL for an event picture', () => {
            const mockPublicUrl = 'http://example.com/event.png';
            mockSupabaseClient.storage.from().getPublicUrl.mockReturnValue({ data: { publicUrl: mockPublicUrl } });

            const result = bucketDAO.getPicture(1);

            expect(result).toEqual({ publicUrl: mockPublicUrl });
            expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('events-pictures');
            expect(mockSupabaseClient.storage.from().getPublicUrl).toHaveBeenCalledWith('1.png');
        });

        it('should throw an error if getPublicUrl fails', () => {
            mockSupabaseClient.storage.from().getPublicUrl.mockReturnValue({ data: null });

            expect(() => bucketDAO.getPicture(1)).toThrow('Failed to get public URL');
        });
    });


    describe('addEventPicture', () => {
        it('should add a picture for an event', async () => {
            const mockFile = new File([''], 'test.png', { type: 'image/png' });
            const mockPublicUrl = 'http://example.com/event.png';
            mockSupabaseClient.storage.from().upload.mockResolvedValue({ data: {}, error: null });
            mockSupabaseClient.storage.from().getPublicUrl.mockReturnValue({ data: { publicUrl: mockPublicUrl } });

            const result = await bucketDAO.addPicture(1, mockFile);

            expect(result).toEqual({ publicUrl: mockPublicUrl });
            expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('events-pictures');
            expect(mockSupabaseClient.storage.from().upload).toHaveBeenCalledWith('1.png', mockFile, expect.any(Object));
        });

        it('should throw an error if the upload fails', async () => {
            mockSupabaseClient.storage.from().upload.mockResolvedValue({ error: new Error('Upload failed') });

            await expect(bucketDAO.addPicture(1, new File([''], 'test.png'))).rejects.toThrow('Upload failed');
        });
    });

    describe('updateEventPicture', () => {
        let consoleErrorSpy: jest.SpyInstance;

        beforeEach(() => {
            consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        });

        afterEach(() => {
            consoleErrorSpy.mockRestore();
        });

        it('should update a picture for an event', async () => {
            const mockFile = new File([''], 'test.png', { type: 'image/png' });
            const mockPublicUrl = 'http://example.com/updated-event.png';
            mockSupabaseClient.storage.from().upload.mockResolvedValue({ data: {}, error: null });
            mockSupabaseClient.storage.from().getPublicUrl.mockReturnValue({ data: { publicUrl: mockPublicUrl } });

            const result = await bucketDAO.updatePicture(1, mockFile);

            expect(result).toEqual({ publicUrl: mockPublicUrl });
            expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('events-pictures');
            expect(mockSupabaseClient.storage.from().upload).toHaveBeenCalledWith('1.png', mockFile, expect.any(Object));
        });

        it('should throw an error if the update fails', async () => {
            mockSupabaseClient.storage.from().upload.mockResolvedValue({ error: new Error('Update failed') });

            await expect(bucketDAO.updatePicture(1, new File([''], 'test.png'))).rejects.toThrow('Update failed');
        });
    });

    describe('deleteEventPicture', () => {
        it('should delete a picture for an event', async () => {
            mockSupabaseClient.storage.from().remove.mockResolvedValue({ data: {}, error: null });

            await bucketDAO.deletePicture(1);

            expect(mockSupabaseClient.storage.from).toHaveBeenCalledWith('events-pictures');
            expect(mockSupabaseClient.storage.from().remove).toHaveBeenCalledWith(['1.png']);
        });

        it('should throw an error if the delete fails', async () => {
            mockSupabaseClient.storage.from().remove.mockResolvedValue({ error: new Error('Delete failed') });

            await expect(bucketDAO.deletePicture(1)).rejects.toThrow('Delete failed');
        });
    });
});