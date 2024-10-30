'use client';

import React, { useState } from 'react';
import { EventForm } from './eventForm';
import { Modal } from '@/components//modal/modal';
import {Button} from "@/components/util/button";

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
            <Button
                onClick={() => setIsModalOpen(true)}
            >
                Add Event
            </Button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Add New Event</h2>
                <EventForm onSuccess={handleAddEventSuccess} />
            </Modal>
        </>
    );
}