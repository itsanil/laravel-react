import React, { useState, useEffect } from 'react';
import {Link} from "@inertiajs/react";
import { Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import {useForm, usePage } from '@inertiajs/react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';

export default function Index() {
    const { exams } = usePage().props;
    const [globalFilter, setGlobalFilter] = useState(''); // State for storing search input
    const { get, delete: destroy, errors, processing, recentlySuccessful } = useForm({
    });


    const actionBodyTemplate = (rowData) => {
        return (
            <div>
                <Link href={route('exams.edit', { exam: rowData.id })}>
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-button-sm" aria-label="Edit" />
                </Link>
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger p-button-sm ml-2"
                    aria-label="Delete"
                    onClick={() => handleDelete(rowData.id)}
                />
            </div>
        );
    };


    const handleDelete = (id) => {
        confirmDialog({
            message: 'Are you sure you want to delete this exam?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => destroy(route('exams.destroy', { exam: id })),
            reject: () => console.log('Deletion rejected'),
        });
    };

    return (
        <Layout>
            <Head title="User List" />
            {/* <h1>User List</h1>
            > */}
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                    <header className="p-3">
                            <div className="p-grid p-nogutter">
                                <div className="p-col">
                                    <h2 className="text-lg font-medium">Exam List</h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Manage exams, edit or delete them.
                                    </p>
                                </div>
                            </div>
                        </header>
                        <div className="flex justify-content-between align-items-center mb-4">
                            {/* Search Input */}
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText
                                    type="search"
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    placeholder="Search exams"
                                />
                            </span>

                            {/* Create Role Button */}
                            <Link href={route('exams.create')} className="p-button p-button-primary">
                                <i className="pi pi-plus mr-2"></i>
                                Create Exams
                            </Link>
                        </div>
                        {/* DataTable to show roles */}
                        <DataTable
                            value={exams}
                            globalFilter={globalFilter} // Apply global search filter
                            paginator rows={10}
                            responsiveLayout="scroll"
                            emptyMessage="No exams found."
                        >
                            <Column field="id" header="ID" sortable />
                            <Column field="title" header="Title" sortable />
                            <Column field="marks" header="Marks" sortable />
                            <Column field="total_time_for_exam" header="Total Time" sortable />
                            <Column header="Actions" body={actionBodyTemplate} />
                        </DataTable>
                    </div>
                </div>
            </div>
            {/* PrimeReact ConfirmDialog */}
            <ConfirmDialog />
        </Layout>
    );
}
