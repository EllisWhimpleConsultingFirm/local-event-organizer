'use client';

import React, { useState } from 'react';
import { AddEventForm } from './addEventForm';
import { Modal } from '@/components//modal/modal';
import {Button} from "@/components/util/button";

export function AddEventButtonModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddEventSuccess = () => {
        setIsModalOpen(false);
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
                <AddEventForm onSuccess={handleAddEventSuccess} />
            </Modal>
        </>
    );
}