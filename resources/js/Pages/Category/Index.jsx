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
    const { categorys,category_data,title, flash } = usePage().props;
    const [categoryDialog, setCategoryDialog] = useState(false); // Toggle modal for creating/updating Categorys
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false); // Toggle delete confirmation modal
    const [selectedCategory, setSelectedCategory] = useState(null); // Store selected role for editing
    const [globalFilter, setGlobalFilter] = useState(''); // State for storing search input
    const toast = React.useRef(null);  // Toast reference
    const statuses = [
        { label: 'Active', value: '1' },
        { label: 'Inactive', value: '0' },
    ];

    const { data, setData,get, post, put, reset, delete:destroy, processing, errors } = useForm({
        name: '',
        status: '',
        currentStatus:'',
        img:'',
        parent_id:category_data?category_data.id:null,
    });

    


    React.useEffect(() => {
        if (flash?.success) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: flash.success, life: 3000 });
        }
    }, [flash]);

    // Open create modal
    const openNew = () => {
        reset(); // Clear form data
        setSelectedCategory(null);
        setCategoryDialog(true);
    };
    // const currentStatus = statuses.find(status => status.value === data.status);
    // Open edit modal
    const openEdit = (category) => {
        setSelectedCategory(category);
        setData({
            name: category.name,
            status: category.status,
            img: category.img,
            currentStatus:statuses.find(status => status.value == category.status),
        });
        setCategoryDialog(true);
        
        console.log(data);
    };

    // Submit form to create a new role or update an existing one
    const submitForm = (e) => {
        e.preventDefault();
        if (selectedCategory) {
            post(route('category-upload', selectedCategory.id), { onSuccess: () => setCategoryDialog(false) });
        } else {
            post(route('category.store'), { onSuccess: () => setCategoryDialog(false) });
        }
    };

    // Open delete confirmation dialog
    const confirmDeleteCategory = (category) => {
        setSelectedCategory(category);
        setDeleteCategoryDialog(true);
    };

    // Delete role
    const deleteCategory = () => {
        destroy(route('category.destroy', selectedCategory.id), {
            onSuccess: () => setDeleteCategoryDialog(false),
        });
    };

    // Modal footer for create/update dialog
    const categoryDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setCategoryDialog(false)} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={submitForm} loading={processing} />
        </React.Fragment>
    );

    // Modal footer for delete confirmation dialog
    const deleteCategoryDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteCategoryDialog(false)} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteCategory} />
        </React.Fragment>
    );

    // Action column with edit and delete buttons
    const actionBodyTemplate = (rowData) => {
        return (
            <div>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-warning mr-2" onClick={() => openEdit(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => confirmDeleteCategory(rowData)} />
                {
                    !category_data && ( // Check if category_data is truthy
                        <a 
                            href={route('category.show', rowData.id)} // Correct JSX for href
                            className="p-button p-button-info"
                        >
                            Subcategory
                        </a>
                    )
                }
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

    const imgBodyTemplate = (rowData) => {
        if (rowData.img) {
            return (
                <img className="shadow-2" src={`/storage/${rowData.img}`} alt={rowData.img} width="50" />
            )
        } else {
            return (
                <>NA</>
            )
        }
    };



    return (
        <Layout>
            <div className="card">
                <h2 className="mb-4">{(title)?title:'Manage Category'}</h2>
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
                            placeholder={(title)?"search SubCategory":'search Category'}
                        />
                    </span>

                    {/* Create Role Button */}
                    <Button label={(title)?"Create SubCategory":'Create Category'} icon="pi pi-plus" className="p-button-success" onClick={openNew} />
                </div>
                {/* DataTable to show roles */}
                <DataTable
                    value={categorys}
                    globalFilter={globalFilter} // Apply global search filter
                    paginator rows={10}
                    responsiveLayout="scroll"
                    emptyMessage="No roles found."
                >
                    <Column field="img" header="Image" body={imgBodyTemplate} />
                    <Column field="name" header="Name" />
                    <Column field="status" header="status" body={statusBodyTemplate} />
                    <Column header="Actions" body={actionBodyTemplate} />
                </DataTable>

                {/* Create/Update Role Dialog */}
                <Dialog visible={categoryDialog} style={{ width: '450px' }} header="Category Details" modal className="p-fluid" footer={categoryDialogFooter} onHide={() => setCategoryDialog(false)}>
                    <form onSubmit={submitForm}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            {errors.name && <small className="p-error">{errors.name}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="excel_file">Upload Image File</label>
                            <FileUpload
                                mode="advanced"
                                name="img"
                                accept=".png,.jpg,.jpeg"
                                maxFileSize={1000000} // 1MB limit
                                onSelect={(e) => {
                                    setData('img', e.files[0]);
                                }}
                                customUpload
                                uploadHandler={(e) => {
                                    setData('img', e.files[0]);
                                    post(route('category-upload', selectedCategory.id),data)
                                    // post('category-upload', data);  // Send formData with the image file
                                }}
                                className="w-full"
                            />
                            {errors.img && <small className="p-error">{errors.img}</small>}
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
                <Dialog visible={deleteCategoryDialog} style={{ width: '350px' }} header="Confirm" modal footer={deleteCategoryDialogFooter} onHide={() => setDeleteCategoryDialog(false)}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {selectedCategory && <span>Are you sure you want to delete <b>{selectedCategory.name}</b>?</span>}
                    </div>
                </Dialog>
            </div>
        </Layout>
    );

}