'use client';

import React, { useState } from 'react';
import { Modal } from '@/components//modal/modal';
import {CreateApplicationForm} from "@/app/admin/vendors/[id]/createApplicationForm";
import {Tables} from "../../../../../types/supabase";

interface ApplicationButtonModalProps {
    children: React.ReactNode;
    event: Tables<'Events'>;
    vendor: Tables<'Vendors'>;
}

export function ApplicationButtonModal({children, event, vendor}: ApplicationButtonModalProps) {
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
                <h2 className="text-xl font-bold mb-4">Event Application</h2>
                <CreateApplicationForm onSuccess={handleAddVendorSuccess} event={event} vendor={vendor}/>
            </Modal>
        </>
    );
}