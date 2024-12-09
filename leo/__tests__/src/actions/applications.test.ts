import { addEventApplication, updateEventApplication, deleteEventApplication, getEventApplications, getVendorEventApplications, getEventsApplications, addEventOccurrenceApplication, updateEventOccurrenceApplication, deleteEventOccurrenceApplication, getEventOccurrenceApplications, getVendorEventOccurrenceApplications, getEventOccurrencesApplications, getVendorPendingEvents, getEventPendingVendors, getEventOccurrencePendingVendors, ApplicationFormState } from '@/actions/applications';
import { EventService } from '@/services/events';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { SupabaseDAOFactory } from "@/DAO/supabase/SupabaseDAOFactory";

jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));
jest.mock('next/navigation', () => ({ redirect: jest.fn() }));
jest.mock('@/services/events');
jest.mock('@/DAO/supabase/SupabaseDAOFactory');

describe('Application Actions', () => {
    let mockEventService: jest.Mocked<EventService>;
    let mockDAOFactory: any;
    let mockEventAppDAO: any;
    let mockEventOccurrenceAppDAO: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockEventAppDAO = {
            addEventApplication: jest.fn(),
            updateEventApplication: jest.fn(),
            deleteEventApplication: jest.fn(),
            getEventApplications: jest.fn(),
            getVendorEventApplications: jest.fn(),
            getEventsApplications: jest.fn(),
            getPendingVendorEventApplications: jest.fn(),
            getPendingEventsApplications: jest.fn()
        };

        mockEventOccurrenceAppDAO = {
            addEventApplication: jest.fn(),
            updateEventApplication: jest.fn(),
            deleteEventApplication: jest.fn(),
            getEventApplications: jest.fn(),
            getVendorEventApplications: jest.fn(),
            getEventsApplications: jest.fn(),
            getPendingVendorEventOccurrencesApplications: jest.fn(),
            getPendingEventsApplications: jest.fn()
        };

        mockDAOFactory = {
            getEventApplicationDAO: jest.fn().mockReturnValue(mockEventAppDAO),
            getEventOccurrenceApplicationDAO: jest.fn().mockReturnValue(mockEventOccurrenceAppDAO),
            getEventsDAO: jest.fn(),
            getBucketDAO: jest.fn(),
            getEventOccurrencesDAO: jest.fn(),
            getEventVendorDAO: jest.fn(),
            getEventOccurrenceVendorDAO: jest.fn()
        };

        mockEventService = {
            addVendorToEvent: jest.fn(),
            removeVendorFromEvent: jest.fn(),
            addVendorToEventOccurrence: jest.fn(),
            removeVendorFromEventOccurrence: jest.fn()
        } as any;

        (SupabaseDAOFactory as jest.MockedClass<typeof SupabaseDAOFactory>)
            .mockImplementation(() => mockDAOFactory);
        (EventService as jest.MockedClass<typeof EventService>)
            .mockImplementation(() => mockEventService);
    });

    describe('Event Application Operations', () => {
        describe('addEventApplication', () => {
            it('returns validation errors', async () => {
                const formData = new FormData();
                const result = await addEventApplication({}, formData);
                expect(result.errors).toBeDefined();
            });
        });

        describe('updateEventApplication', () => {
            it('updates regular application with acceptance', async () => {
                const formData = new FormData();
                formData.append('event_id', '1');
                formData.append('vendor_id', '1');
                formData.append('message', 'Updated');
                formData.append('status', 'ACCEPTED');

                const result = await updateEventApplication({} as ApplicationFormState, formData);

                expect(result.message).toBe('Application updated successfully!');
                expect(mockEventService.addVendorToEvent).toHaveBeenCalled();
            });

            it('updates occurrence application with rejection', async () => {
                const formData = new FormData();
                formData.append('event_occurrence_id', '1');
                formData.append('event_id', '1');
                formData.append('vendor_id', '1');
                formData.append('message', 'Updated');
                formData.append('status', 'REJECTED');

                const result = await updateEventApplication({} as ApplicationFormState, formData);

                expect(result.message).toBe('Application updated successfully!');
                expect(mockEventService.removeVendorFromEventOccurrence).toHaveBeenCalled();
            });
        });

        describe('deleteEventApplication', () => {
            it('deletes application and redirects', async () => {
                const formData = new FormData();
                formData.append('vendor_id', '1');
                formData.append('event_id', '1');

                await deleteEventApplication({}, formData);

                expect(mockEventAppDAO.deleteEventApplication).toHaveBeenCalled();
                expect(redirect).toHaveBeenCalledWith('/applications');
            });

            it('handles invalid IDs', async () => {
                const formData = new FormData();
                await expect(deleteEventApplication({}, formData))
                    .rejects.toThrow('Invalid vendor ID or event ID');
            });
        });
    });

    describe('Event Occurrence Application Operations', () => {
        describe('deleteEventOccurrenceApplication', () => {
            it('deletes occurrence application', async () => {
                const formData = new FormData();
                formData.append('vendor_id', '1');
                formData.append('event_occurrence_id', '1');

                await deleteEventOccurrenceApplication({}, formData);

                expect(mockEventOccurrenceAppDAO.deleteEventApplication).toHaveBeenCalled();
                expect(redirect).toHaveBeenCalledWith('/occurrence-applications');
            });
        });
    });

    describe('Query Operations', () => {
        const mockApp = { id: 1, vendor_id: 1, event_id: 1 };

        it('gets all applications', async () => {
            mockEventAppDAO.getEventApplications.mockResolvedValue([mockApp]);
            const result = await getEventApplications();
            expect(result).toEqual([mockApp]);
        });

        it('gets vendor applications', async () => {
            mockEventAppDAO.getVendorEventApplications.mockResolvedValue([mockApp]);
            const result = await getVendorEventApplications(1);
            expect(result).toEqual([mockApp]);
        });

        it('gets pending vendor events', async () => {
            const mockEventApps = [{ event: { id: 1 }, application: {} }];
            const mockOccurrenceApps = [{ event: { id: 2 }, eventOccurrence: {}, application: {} }];

            mockEventAppDAO.getPendingVendorEventApplications.mockResolvedValue(mockEventApps);
            mockEventOccurrenceAppDAO.getPendingVendorEventOccurrencesApplications
                .mockResolvedValue(mockOccurrenceApps);

            const result = await getVendorPendingEvents(1);

            expect(result).toEqual({
                eventApplications: mockEventApps,
                eventOccurrenceApplications: mockOccurrenceApps
            });
        });

        it('gets event pending vendors', async () => {
            const mockPendingVendors = [{ vendor: { id: 1 }, application: {} }];
            mockEventAppDAO.getPendingEventsApplications.mockResolvedValue(mockPendingVendors);
            const result = await getEventPendingVendors(1);
            expect(result).toEqual(mockPendingVendors);
        });
    });
});