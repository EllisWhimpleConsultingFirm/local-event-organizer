'use client';

import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { FormState, updateVendor } from '@/actions/vendor';
import { Tables } from "../../../../../types/supabase";
import { Upload } from 'lucide-react';
import {DeleteVendorForm} from "@/app/admin/vendors/[id]/deleteVendorForm";

interface UpdateVendorFormProps {
    vendor: Tables<'Vendors'>;
}

function UpdateButton() {
    const { pending } = useFormStatus();

    return (
        <button
            disabled={pending}
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg
                     hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            {pending ? 'Updating...' : 'Update Vendor'}
        </button>
    );
}

export function UpdateVendorForm({ vendor }: UpdateVendorFormProps) {
    const [state, action] = useFormState<FormState, FormData>(updateVendor, {} as FormState);

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800">Update Vendor Details</h2>
            </div>

            <div className="p-6">
                <form action={action} className="space-y-6">
                    <input type="hidden" name="id" value={vendor.id} />
                    <input type="hidden" name="admin_id" value={vendor.admin_id ?? ''} />

                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Vendor Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            defaultValue={vendor.name ?? "Name Not Found"}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
                                     focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="Enter vendor name"
                        />
                        {state?.errors?.name && (
                            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                                {state.errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            defaultValue={vendor.description ?? "Description Not Found"}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
                                     focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors
                                     resize-none"
                            placeholder="Enter vendor description"
                        />
                        {state?.errors?.description && (
                            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                                {state.errors.description}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="picture" className="block text-sm font-medium text-gray-700">
                            New Picture (optional)
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                id="picture"
                                name="picture"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700
                                         file:mr-4 file:py-2 file:px-4 file:border-0
                                         file:text-sm file:font-medium file:text-white
                                         file:bg-blue-600 file:rounded-lg
                                         hover:file:bg-blue-700"
                            />
                            <Upload className="w-5 h-5 text-gray-500" />
                        </div>
                        {state?.errors?.picture && (
                            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                                {state.errors.picture}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                        <UpdateButton />
                        {state?.message && (
                            <p className="text-sm text-green-600 bg-green-50 p-4 rounded-lg">
                                {state.message}
                            </p>
                        )}
                    </div>
                </form>
            </div>
            <div className="pl-6 pr-6 pb-6">
                <DeleteVendorForm vendor={vendor} />
            </div>
        </div>
    );
}