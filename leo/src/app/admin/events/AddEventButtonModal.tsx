'use client';

import React, { useState } from 'react';
import { EventForm } from './eventForm';
import { Modal } from '@/components//modal/modal';

interface AddEventButtonModalProps {
    onEventAdded: () => void;
}

export function AddEventButtonModal({ onEventAdded }: AddEventButtonModalProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddEventSuccess = () => {
        setIsModalOpen(false);
        onEventAdded();
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Add Event
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Add New Event</h2>
                <EventForm onSuccess={handleAddEventSuccess} />
            </Modal>
        </>
    );
}