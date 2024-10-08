import React, { useState, useRef, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import Layout from '@/Layouts/layout/layout.jsx';
import { Toast } from 'primereact/toast';
import { useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';

export default function Index({ trips, flash }) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [layout, setLayout] = useState('grid'); // Grid or list view
    const [sortKey, setSortKey] = useState(null); // Sorting by fields
    const [sortOrder, setSortOrder] = useState(null); // Sort order
    const toast = useRef(null);
    const { get, delete: destroy } = useForm();

    const sortOptions = [
        { label: 'Start Time Ascending', value: 'start_time' },
        { label: 'Start Time Descending', value: '!start_time' },
    ];

    useEffect(() => {
        if (flash?.success) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: flash.success, life: 3000 });
        }
    }, [flash]);

    const actionTemplate = (trip) => {
        return (
            <div className="p-d-flex p-ai-center">
                <Button label="View" icon="pi pi-eye" className="p-button-rounded p-button-text p-button-primary mr-2" onClick={() => get(route('trip.show', trip.id))} />
                <Button label="Edit" icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-warning mr-2" onClick={() => get(route('trip.edit', trip.id))} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDelete(trip.id)} />
            </div>
        );
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this trip?')) {
            destroy(route('trip.destroy', id), {
                onError: () => {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete trip', life: 3000 });
                }
            });
        }
    };

    const renderGridItem = (trip) => {
        return (
            <div className="p-col-12 p-md-4">
                <div className="card p-shadow-4">
                    <div className="p-d-flex p-jc-between p-ai-center">
                        <h5>{trip.vehicle_type}</h5>
                        <span>{format(new Date(trip.start_time), 'dd-MM-yyyy hh:mm a')}</span>
                    </div>
                    <div className="p-mt-2">
                        <p><strong>Pickup Point:</strong> {trip.pickup_point}</p>
                        <p><strong>Destination:</strong> {trip.destination}</p>
                    </div>
                    <div className="p-mt-2">
                        {actionTemplate(trip)}
                    </div>
                </div>
            </div>
        );
    };

    const onSortChange = (event) => {
        const value = event.value;
        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortKey(value.substring(1, value.length));
        } else {
            setSortOrder(1);
            setSortKey(value);
        }
    };

    const filteredTrips = trips
        .filter((trip) => {
            return (
                trip.vehicle_type.toLowerCase().includes(globalFilter.toLowerCase()) ||
                trip.pickup_point.toLowerCase().includes(globalFilter.toLowerCase()) ||
                trip.destination.toLowerCase().includes(globalFilter.toLowerCase())
            );
        })
        .sort((a, b) => {
            if (!sortKey) return 0;

            const valueA = sortKey === 'start_time' ? new Date(a.start_time) : a[sortKey];
            const valueB = sortKey === 'start_time' ? new Date(b.start_time) : b[sortKey];

            return sortOrder === 1 ? valueA - valueB : valueB - valueA;
        });

    return (
        <Layout>
        <div className="card">
            <h2>Manage Trips</h2>
            <Toast ref={toast} />
            
            <div className="flex justify-content-between align-items-center mb-4">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <input
                        type="text"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value.toLowerCase())}
                        placeholder="Search Trips"
                        className="p-inputtext p-component"
                    />
                </span>
                <Button label="Create Trip" icon="pi pi-plus" className="p-button-success" onClick={() => get(route('trip.create'))} />
            </div>

            <div className="flex justify-content-between align-items-center mb-4">
                <Dropdown
                    value={sortKey}
                    options={sortOptions}
                    optionLabel="label"
                    placeholder="Sort By Start Time"
                    onChange={onSortChange}
                />
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>

            <DataView
                value={filteredTrips}
                layout={layout}
                itemTemplate={renderGridItem}
                paginator
                rows={9}
                emptyMessage="No Trips found."
            />
        </div>
    </Layout>
    );
}
