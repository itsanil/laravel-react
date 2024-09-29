import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";
import {useForm, usePage } from '@inertiajs/react';
import { Dropdown } from 'primereact/dropdown'; // PrimeReact Dropdown
import InputError from '@/Components/InputError';
import {InputText} from "primereact/inputtext";
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';

export default function Edit({ user,roles_data }) {
    // console.log(user);
    const { data, setData, put, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        role : user.roles[0]?.name,
        password: ''
    });

    const roles = roles_data.map(role => ({
        label: role.name, // Capitalize the first letter
        value: role.name
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/users/${user.id}`)
        // put(route('users.update', user.id));
    };

    return (
        <Layout>
            <Head title="User Edit" />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <header>
                            <h2 className="text-lg font-medium">User List</h2>

                            <p className="mt-1 text-sm text-gray-600">
                                Add user's profile information.
                            </p>
                        </header>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="block text-900 font-medium mb-2">Name</label>
                                <InputText
                                    id="name"
                                    type="text"
                                    placeholder="Name"
                                    className="w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} className=""/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                                <InputText
                                    id="email"
                                    type="text"
                                    placeholder="Email address"
                                    className="w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className=""/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="role" className="block text-900 font-medium mb-2">Role</label>
                                <Dropdown
                                    id="role"
                                    options={roles}
                                    value={data.role}
                                    className="w-full"
                                    onChange={(e) => setData('role', e.value)}
                                    placeholder="Select a Role"
                                    required
                                />
                                {errors.role && <small className="p-error">{errors.role}</small>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                                <InputText
                                    id="password"
                                    type="text"
                                    placeholder="password address"
                                    className="w-full"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className=""/>
                            </div>
                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>Save</PrimaryButton>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-gray-600">Saved.</p>
                                </Transition>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
