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
    const { users, total, currentPage, perPage, sortField, sortOrder, search } = usePage().props;
    const [globalFilter, setGlobalFilter] = useState(''); // State for storing search input
    const { data, setData, get, delete: destroy, errors, processing, recentlySuccessful } = useForm({
        search:  search,
        currentPage:  currentPage,
        perPage:  perPage,
        sortOrder: sortOrder,
        total: total,
        sortField: sortField
    });
    // const { get, delete: destroy } = useForm({});
    const [localSearch, setLocalSearch] = useState(search || '');

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        get(route('users.index'), {
            search: data.search,
            // page: 1 // Reset to page 1
        });
    };

    // Handle pagination
    const onPageChange = (e) => {
        get(route('users.index'), {
            page: e.page + 1, // Increment for 1-based index
            perPage: e.rows,
            search: localSearch, // Keep search term in pagination
            sortField: sortField,
            sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
        });
    };

    // Handle sorting
    const onSort = (e) => {
        get(route('users.index'), {
            sortField: e.sortField,
            sortOrder: e.sortOrder === 1 ? 'asc' : 'desc',
            search: data.search,
            page: data.currentPage, // Current page to avoid resetting
            perPage: data.perPage,
        });
    };

    const roleBodyTemplate = (rowData) => {
        // console.log(rowData.roles[0].name);
        return (
            <div>
                {rowData.roles[0]?.name}
            </div>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div>
                <Link href={route('users.edit', { user: rowData.id })}>
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-info p-button-sm" aria-label="Edit" />
                </Link>
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger p-button-sm ml-2"
                    aria-label="Delete"
                    onClick={() => handleDelete(rowData.id)}
                />
                {/* <Link href={route('users.edit', rowData.id)} className="p-button p-button-info">Edit</Link>
                <button onClick={() => handleDelete(rowData.id)} className="p-button p-button-danger">Delete</button> */}
            </div>
        );
    };


    const handleDelete = (id) => {
        confirmDialog({
            message: 'Are you sure you want to delete this user?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => destroy(route('users.destroy', { user: id })),
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
                                    <h2 className="text-lg font-medium">User List</h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Manage users, edit or delete them.
                                    </p>
                                </div>
                                <div className="p-col text-right">
                                    {/* Create User Button */}
                                    {/* <Link href={route('users.create')} className="p-button p-button-primary">
                                        <i className="pi pi-plus mr-2"></i>
                                        Create User
                                    </Link> */}
                                </div>
                            </div>
                        </header>
                        {/* Search functionality */}
                        {/* <form onSubmit={handleSearch} className="mb-3">
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText value={data.search} onChange={(e) => setData('search', e.target.value) 
                                    // setLocalSearch(e.target.value)
                                    } placeholder="Search by name or email" />
                            </span>
                            <button type="submit" className="p-button p-button-primary ml-2">Search</button>
                        </form> */}
                        <div className="flex justify-content-between align-items-center mb-4">
                            {/* Search Input */}
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText
                                    type="search"
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    placeholder="Search roles"
                                />
                            </span>

                            {/* Create Role Button */}
                            <Link href={route('users.create')} className="p-button p-button-primary">
                                <i className="pi pi-plus mr-2"></i>
                                Create User
                            </Link>
                        </div>
                        {/* DataTable to show roles */}
                        <DataTable
                            value={users}
                            globalFilter={globalFilter} // Apply global search filter
                            paginator rows={10}
                            responsiveLayout="scroll"
                            emptyMessage="No users found."
                        >
                            <Column field="id" header="ID" sortable />
                            <Column field="name" header="Name" sortable />
                            <Column field="email" header="Email" sortable />
                            <Column header="Role" body={roleBodyTemplate} sortable />
                            <Column header="Actions" body={actionBodyTemplate} />
                        </DataTable>

                        {/* Pagination (if not using built-in DataTable pagination) */}
                        {/* <Paginator first={paginationState.first} rows={paginationState.rows} totalRecords={total}
                            onPageChange={onPageChange} rowsPerPageOptions={[5, 10, 25]} /> */}
                    </div>
                </div>
            </div>
            {/* PrimeReact ConfirmDialog */}
            <ConfirmDialog />
        </Layout>
    );
}
