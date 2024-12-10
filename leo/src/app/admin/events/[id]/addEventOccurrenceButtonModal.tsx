'use client';

import React, { useState } from 'react';
import { AddEventOccurrenceForm } from './addEventOccurrenceForm';
import { Modal } from '@/components//modal/modal';
import {Button} from "@/components/util/button";

interface AddEventOccurrenceButtonModalProps {
    eventId: number
}

export function AddEventOccurrenceButtonModal({eventId} : AddEventOccurrenceButtonModalProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddVendorSuccess = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button
                onClick={() => setIsModalOpen(true)}
            >
                Add Event Occurrence
            </Button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Add New Event Occurrence</h2>
                <AddEventOccurrenceForm onSuccess={handleAddVendorSuccess}  eventId={eventId}/>
            </Modal>
        </>
    );
}