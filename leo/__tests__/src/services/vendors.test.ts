import { VendorService } from '@/services/vendors';
import { VendorDAO } from "@/DAO/interface/VendorDAO";
import { BucketDAO } from "@/DAO/interface/BucketDAO";
import { EventVendorDAO } from "@/DAO/interface/EventVendorDAO";
import { Tables, TablesInsert, TablesUpdate } from "../../../types/database.types";

describe('VendorService', () => {
    let vendorService: VendorService;
    let mockVendorDAO: jest.Mocked<VendorDAO>;
    let mockBucketDAO: jest.Mocked<BucketDAO>;
    let mockEventVendorDAO: jest.Mocked<EventVendorDAO>;

    beforeEach(() => {
        mockVendorDAO = {
            getVendorById: jest.fn(),
            getVendors: jest.fn(),
            getUserVendors: jest.fn(),
            addVendor: jest.fn(),
            updateVendor: jest.fn(),
            deleteVendor: jest.fn(),
        };

        mockBucketDAO = {
            addFile: jest.fn(),
            deleteFile: jest.fn(),
            getFile: jest.fn(),
            updateFile: jest.fn(),
        };

        mockEventVendorDAO = {
            getEventVendors: jest.fn(),
            getEventsByVendorId: jest.fn(),
            getVendorsByEventId: jest.fn(),
            addEventVendor: jest.fn(),
            updateEventVendor: jest.fn(),
            deleteEventVendor: jest.fn(),
        };

        vendorService = new VendorService(mockVendorDAO, mockBucketDAO, mockEventVendorDAO);
    });

    describe('getVendor', () => {
        it('returns vendor by id', async () => {
            const mockVendor = { id: 1, name: 'Test Vendor' };
            mockVendorDAO.getVendorById.mockResolvedValue(mockVendor);
            const result = await vendorService.getVendor(1);
            expect(result).toEqual(mockVendor);
        });

        it('throws error for non-existent vendor', async () => {
            mockVendorDAO.getVendorById.mockResolvedValue(null);
            await expect(vendorService.getVendor(1)).rejects.toThrow('Vendor with id 1 not found');
        });
    });

    describe('addVendor', () => {
        const newVendor: TablesInsert<'Vendors'> = {
            name: 'New Vendor',
            description: 'Description',
            admin_id: '1'
        };

        it('adds vendor with picture', async () => {
            const picture = new File([''], 'test.jpg');
            mockBucketDAO.addFile.mockResolvedValue({ publicUrl: 'test-url' });
            mockVendorDAO.addVendor.mockImplementation(data => Promise.resolve({ ...data, id: 1 }));

            const result = await vendorService.addVendor(newVendor, picture);

            expect(result.photo_url).toBe('test-url');
            expect(mockBucketDAO.addFile).toHaveBeenCalledWith(picture);
            expect(mockVendorDAO.addVendor).toHaveBeenCalledWith(expect.objectContaining({
                ...newVendor,
                photo_url: 'test-url'
            }));
        });

        it('adds vendor without picture', async () => {
            mockVendorDAO.addVendor.mockImplementation(data => Promise.resolve({ ...data, id: 1 }));
            await vendorService.addVendor(newVendor);
            expect(mockBucketDAO.addFile).not.toHaveBeenCalled();
        });
    });

    describe('updateVendor', () => {
        const updateData: TablesUpdate<'Vendors'> = { name: 'Updated Vendor' };

        it('updates vendor with new picture', async () => {
            const oldVendor = { id: 1, photo_url: 'old-url' };
            const picture = new File([''], 'new.jpg');
            mockVendorDAO.getVendorById.mockResolvedValue(oldVendor);
            mockBucketDAO.addFile.mockResolvedValue({ publicUrl: 'new-url' });

            await vendorService.updateVendor(1, updateData, picture);

            expect(mockBucketDAO.deleteFile).toHaveBeenCalled();
            expect(mockBucketDAO.addFile).toHaveBeenCalledWith(picture);
            expect(mockVendorDAO.updateVendor).toHaveBeenCalledWith(1, {
                ...updateData,
                photo_url: 'new-url'
            });
        });

        it('updates vendor without picture change', async () => {
            await vendorService.updateVendor(1, updateData);
            expect(mockBucketDAO.deleteFile).not.toHaveBeenCalled();
            expect(mockBucketDAO.addFile).not.toHaveBeenCalled();
        });
    });

    describe('deleteVendor', () => {
        it('deletes vendor and photo', async () => {
            const vendor = { id: 1, photo_url: 'test-url' };
            mockVendorDAO.getVendorById.mockResolvedValue(vendor);

            await vendorService.deleteVendor(1);

            expect(mockVendorDAO.deleteVendor).toHaveBeenCalledWith(1);
            expect(mockBucketDAO.deleteFile).toHaveBeenCalled();
        });

        it('deletes vendor without photo', async () => {
            const vendor = { id: 1, photo_url: null };
            mockVendorDAO.getVendorById.mockResolvedValue(vendor);

            await vendorService.deleteVendor(1);

            expect(mockVendorDAO.deleteVendor).toHaveBeenCalledWith(1);
            expect(mockBucketDAO.deleteFile).not.toHaveBeenCalled();
        });
    });

    describe('Event Management', () => {
        it('gets vendor events', async () => {
            const mockEvents = [{ id: 1, name: 'Event 1' }];
            mockEventVendorDAO.getEventsByVendorId.mockResolvedValue(mockEvents);

            const result = await vendorService.getVendorEvents(1);
            expect(result).toEqual(mockEvents);
        });

        it('adds vendor to event', async () => {
            const mockAssignment = { vendor_id: 1, event_id: 1, booth_number: 101 };
            mockEventVendorDAO.addEventVendor.mockResolvedValue(mockAssignment);

            const result = await vendorService.addVendorToEvent(1, 1, 101);
            expect(result).toEqual(mockAssignment);
        });

        it('removes vendor from event', async () => {
            await vendorService.removeVendorFromEvent(1, 1);
            expect(mockEventVendorDAO.deleteEventVendor).toHaveBeenCalledWith(1, 1);
        });
    });
});