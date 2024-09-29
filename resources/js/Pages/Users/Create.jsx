import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
// import { Inertia } from '@inertiajs/inertia';
import { useForm } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext'; // PrimeReact Input
import { Dropdown } from 'primereact/dropdown'; // PrimeReact Dropdown
import { Button } from 'primereact/button'; // PrimeReact Button

export default function Create({roles_data}) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: '',
        status: 'active' // default status
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    const roles = roles_data.map(role => ({
        label: role.name, // Capitalize the first letter
        value: role.name
    }));

    

    const statuses = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
    ];

    return (
        <Layout>
            <Head title="User Edit" />
        <div>
            <h1>Create User</h1>
            <form onSubmit={handleSubmit} className="p-fluid">
                <div className="field">
                    <label htmlFor="name">Name</label>
                    <InputText
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    {errors.name && <small className="p-error">{errors.name}</small>}
                </div>

                <div className="field">
                    <label htmlFor="email">Email</label>
                    <InputText
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    {errors.email && <small className="p-error">{errors.email}</small>}
                </div>

                <div className="field">
                    <label htmlFor="role">Role</label>
                    <Dropdown
                        id="role"
                        options={roles}
                        value={data.role}
                        onChange={(e) => setData('role', e.value)}
                        placeholder="Select a Role"
                        required
                    />
                    {errors.role && <small className="p-error">{errors.role}</small>}
                </div>
                <div className="field">
                    <label htmlFor="password">Password</label>
                    <InputText
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    {errors.password && <small className="p-error">{errors.password}</small>}
                </div>
                <div className="field">
                    <label htmlFor="status">Status</label>
                    <Dropdown
                        id="status"
                        options={statuses}
                        value={data.status}
                        onChange={(e) => setData('status', e.value)}
                        placeholder="Select Status"
                        required
                    />
                    {errors.status && <small className="p-error">{errors.status}</small>}
                </div>

                <Button type="submit" label="Create User" loading={processing} className="mt-2" />
            </form>
        </div>
        </Layout>
    );
}
