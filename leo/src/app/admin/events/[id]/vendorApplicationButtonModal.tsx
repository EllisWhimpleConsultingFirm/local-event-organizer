'use client';

import React, { useState } from 'react';
import { Modal } from '@/components//modal/modal';
import {Tables} from "../../../../../types/supabase";
import {VendorApplication, VendorApplicationInterface} from "@/app/admin/events/[id]/vendorApplicationInterface";

interface ApplicationButtonModalProps {
    children: React.ReactNode;
    vendorApplication: VendorApplication
    event: Tables<"Events">
}

export function VendorApplicationButtonModal({children, vendorApplication, event}: ApplicationButtonModalProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddVendorSuccess = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
            >
                {children}
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Vendor Application</h2>
                <VendorApplicationInterface onSuccess={handleAddVendorSuccess} vendorApplication={vendorApplication} event={event}/>
            </Modal>
        </>
    );
}