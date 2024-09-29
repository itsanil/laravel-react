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

const RolesCrud = () => {
    const { roles, flash } = usePage().props;
    const [roleDialog, setRoleDialog] = useState(false); // Toggle modal for creating/updating roles
    const [deleteRoleDialog, setDeleteRoleDialog] = useState(false); // Toggle delete confirmation modal
    const [selectedRole, setSelectedRole] = useState(null); // Store selected role for editing
    const [globalFilter, setGlobalFilter] = useState(''); // State for storing search input
    const toast = React.useRef(null);  // Toast reference

    const { data, setData, post, put, reset, delete:destroy, processing, errors } = useForm({
        name: '',
        // description: '',
    });

    React.useEffect(() => {
        if (flash?.success) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: flash.success, life: 3000 });
        }
    }, [flash]);

    // Open create modal
    const openNew = () => {
        reset(); // Clear form data
        setSelectedRole(null);
        setRoleDialog(true);
    };

    // Open edit modal
    const openEdit = (role) => {
        setSelectedRole(role);
        setData({
            name: role.name,
            // description: role.description,
        });
        setRoleDialog(true);
    };

    // Submit form to create a new role or update an existing one
    const submitForm = (e) => {
        e.preventDefault();
        if (selectedRole) {
            put(route('roles.update', selectedRole.id), { onSuccess: () => setRoleDialog(false) });
        } else {
            post(route('roles.store'), { onSuccess: () => setRoleDialog(false) });
        }
    };

    // Open delete confirmation dialog
    const confirmDeleteRole = (role) => {
        setSelectedRole(role);
        setDeleteRoleDialog(true);
    };

    // Delete role
    const deleteRole = () => {
        destroy(route('roles.destroy', selectedRole.id), {
            onSuccess: () => setDeleteRoleDialog(false),
        });
    };

    // Modal footer for create/update dialog
    const roleDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setRoleDialog(false)} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={submitForm} loading={processing} />
        </React.Fragment>
    );

    // Modal footer for delete confirmation dialog
    const deleteRoleDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteRoleDialog(false)} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteRole} />
        </React.Fragment>
    );

    // Action column with edit and delete buttons
    const actionBodyTemplate = (rowData) => {
        return (
            <div>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-warning mr-2" onClick={() => openEdit(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => confirmDeleteRole(rowData)} />
            </div>
        );
    };

    return (
        <Layout>
            <div className="card">
                <h2 className="mb-4">Manage Roles</h2>
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
                            placeholder="Search roles"
                        />
                    </span>

                    {/* Create Role Button */}
                    <Button label="Create Role" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
                </div>
                {/* DataTable to show roles */}
                <DataTable
                    value={roles}
                    globalFilter={globalFilter} // Apply global search filter
                    paginator rows={10}
                    responsiveLayout="scroll"
                    emptyMessage="No roles found."
                >
                    <Column field="id" header="ID" />
                    <Column field="name" header="Role Name" />
                    {/* <Column field="description" header="Description" /> */}
                    <Column header="Actions" body={actionBodyTemplate} />
                </DataTable>

                {/* Create/Update Role Dialog */}
                <Dialog visible={roleDialog} style={{ width: '450px' }} header="Role Details" modal className="p-fluid" footer={roleDialogFooter} onHide={() => setRoleDialog(false)}>
                    <form onSubmit={submitForm}>
                        <div className="field">
                            <label htmlFor="name">Role Name</label>
                            <InputText id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            {errors.name && <small className="p-error">{errors.name}</small>}
                        </div>

                        {/* <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputText id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            {errors.description && <small className="p-error">{errors.description}</small>}
                        </div> */}
                    </form>
                </Dialog>

                {/* Delete Role Confirmation Dialog */}
                <Dialog visible={deleteRoleDialog} style={{ width: '350px' }} header="Confirm" modal footer={deleteRoleDialogFooter} onHide={() => setDeleteRoleDialog(false)}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {selectedRole && <span>Are you sure you want to delete <b>{selectedRole.name}</b>?</span>}
                    </div>
                </Dialog>
            </div>
        </Layout>
    );
};

export default RolesCrud;
