import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import Layout from '@/Layouts/layout/layout.jsx';
import { Toast } from 'primereact/toast'; 
import { Badge } from 'primereact/badge';
import { FileUpload } from 'primereact/fileupload';

export default function Index(){
    const { all_data,title,url,flash } = usePage().props;
    // const successMessage = flash?.success;
    const [dataDialog, setdataDialog] = useState(false); // Toggle modal for creating/updating Categorys
    const [deletedataDialog, setDeletedataDialog] = useState(false); // Toggle delete confirmation modal
    const [selecteddata, setSelecteddata] = useState(null); // Store selected role for editing
    const [globalFilter, setGlobalFilter] = useState(''); // State for storing search input
    const toast = React.useRef(null);  // Toast reference
    const statuses = [
        { label: 'Active', value: '1' },
        { label: 'Inactive', value: '0' },
    ];

    const { data, setData,get, post, put, reset, delete:destroy, processing, errors } = useForm({
        name: '',
        status: ''
    });

    


    React.useEffect(() => {
        console.log(flash);
        if (flash?.success) {
            console.log(flash?.success);
            toast.current.show({ severity: 'success', summary: 'Success', detail: flash.success, life: 3000 });
        }
    }, [flash]);

    // Open create modal
    const openNew = () => {
        reset(); // Clear form data
        setSelecteddata(null);
        setdataDialog(true);
    };
    // const currentStatus = statuses.find(status => status.value === data.status);
    // Open edit modal
    const openEdit = (sel) => {
        setSelecteddata(sel);
        setData({
            name: sel.name,
            status: sel.status,
        });
        setdataDialog(true);
    };

    // Submit form to create a new role or update an existing one
    const submitForm = (e) => {
        e.preventDefault();
        if (selecteddata) {
            put(route(url+'.update', selecteddata.id), { onSuccess: () => setdataDialog(false) });
        } else {
            post(route(url+'.store'), { onSuccess: () => setdataDialog(false) });
        }
        
    };

    // Open delete confirmation dialog
    const confirmDeleteCategory = (sel) => {
        setSelecteddata(sel);
        setDeletedataDialog(true);
    };

    // Delete role
    const deleteCategory = () => {
        destroy(route(url+'.destroy', selecteddata.id), {
            onSuccess: () => setDeletedataDialog(false),
        });
    };

    // Modal footer for create/update dialog
    const dataDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setdataDialog(false)} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={submitForm} loading={processing} />
        </React.Fragment>
    );

    // Modal footer for delete confirmation dialog
    const deletedataDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDeletedataDialog(false)} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteCategory} />
        </React.Fragment>
    );

    // Action column with edit and delete buttons
    const actionBodyTemplate = (rowData) => {
        return (
            <div>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-warning mr-2" onClick={() => openEdit(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => confirmDeleteCategory(rowData)} />
            </div>
        );
    };

    const statusBodyTemplate = (rowData) => {

        if (rowData.status == 1) {
            return (
                <Badge value="Enable" severity="success"></Badge>
            )
        } else {
            return (
                <Badge value="Disable" severity="danger"></Badge>
            )
        }
    };



    return (
        <Layout>
            <div className="card">
                <h2 className="mb-4">Manage {title}</h2>
                <Toast ref={toast} /> {/* Toast component to show messages */}
                {/* Header with search and create button */}
                <div className="flex justify-content-between align-items-center mb-4">
                    {/* Search Input */}
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            type="search"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder={'Search '+title}
                        />
                    </span>

                    {/* Create Role Button */}
                    <Button label={'Create '+title} icon="pi pi-plus" className="p-button-success" onClick={openNew} />
                </div>
                {/* DataTable to show roles */}
                <DataTable
                    value={all_data}
                    globalFilter={globalFilter} // Apply global search filter
                    paginator rows={10}
                    responsiveLayout="scroll"
                    emptyMessage="No Question found."
                >
                    <Column field="name" header="Name" />
                    <Column field="status" header="status" body={statusBodyTemplate} />
                    <Column header="Actions" body={actionBodyTemplate} />
                </DataTable>

                {/* Create/Update Role Dialog */}
                <Dialog visible={dataDialog} style={{ width: '450px' }} header={title+' Details'} modal className="p-fluid" footer={dataDialogFooter} onHide={() => setdataDialog(false)}>
                    <form onSubmit={submitForm}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            {errors.name && <small className="p-error">{errors.name}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <Dropdown
                                id="status"
                                options={statuses}
                                value={data.status}
                                onChange={(e) => setData('status', e.value)}
                                placeholder="Select a status"
                                required
                            />
                            {errors.status && <small className="p-error">{errors.status}</small>}
                        </div>
                    </form>
                </Dialog>

                {/* Delete Role Confirmation Dialog */}
                <Dialog visible={deletedataDialog} style={{ width: '350px' }} header="Confirm" modal footer={deletedataDialogFooter} onHide={() => setDeletedataDialog(false)}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {selecteddata && <span>Are you sure you want to delete <b>{selecteddata.name}</b>?</span>}
                    </div>
                </Dialog>
            </div>
        </Layout>
    );

}