'use client';

import React, { useState } from 'react';
import { AddVendorForm } from './addVendorForm';
import { Modal } from '@/components//modal/modal';
import {Button} from "@/components/util/button";

export function AddVendorButtonModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddVendorSuccess = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button
                onClick={() => setIsModalOpen(true)}
            >
                Add Vendor
            </Button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Add New Vendor</h2>
                <AddVendorForm onSuccess={handleAddVendorSuccess} />
            </Modal>
        </>
    );
}