'use client'

import React from 'react';
import {Loader} from "lucide-react";
import Error from "next/error";
import {CustomError} from "@/components/util/Error";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    width?: string;
    noX?: boolean;
    isLoading?: boolean;
    error?: string | null;
}

export const Modal: React.FC<ModalProps> = ({
                                                isOpen,
                                                onClose,
                                                title,
                                                children,
                                                footer,
                                                width = 'max-w-md',
                                                noX = false,
                                                isLoading,
                                                error
                                            }) => {
    if (!isOpen) return null;

    if (isLoading) {
        return <Loader/>
    }

    if (error) {
        return <CustomError message={error}/>
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-argray bg-opacity-50">
            <div className={`bg-white p-4 rounded-md w-full ${width}`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold mx-4">{title}</h2>
                    {!noX &&
                        <button onClick={onClose} className="text-argray bg-white text-xl">
                            &times;
                        </button>
                    }
                </div>
                <div className="mb-4">
                    {children}
                </div>
                {footer && <div className="flex justify-between m-4 pt-2">{footer}</div>}
            </div>
        </div>
    );
};