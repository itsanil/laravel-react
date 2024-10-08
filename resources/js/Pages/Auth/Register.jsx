import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {Checkbox} from "primereact/checkbox";
import {Button} from "primereact/button";
import {FileUpload} from 'primereact/fileupload';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        mobile: '',
        password: '',
        password_confirmation: '',
        dob: '',
        gender: '',
        photo: null, // For storing the uploaded photo
    });

    const genderOptions = [
        { label: 'Male', value: 'M' },
        { label: 'Female', value: 'F' },
        { label: 'Other', value: 'O' },
    ];

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="flex align-items-center justify-content-center flex-column">
                <img src="/images/logo/logo.svg" alt="hyper" height={50} className="mb-3"/>
                <div className="surface-card p-6 sm:p-4 shadow-2 border-round w-full lg:w-4">
                    <div className="text-center mb-5">
                        <div className="text-900 text-3xl font-medium mb-3">Register</div>
                    </div>
                    <form onSubmit={submit}>
                        <div>
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
                                <label htmlFor="mobile" className="block text-900 font-medium mb-2">Mobile</label>
                                <InputText
                                    id="mobile"
                                    type="text"
                                    placeholder="Mobile number"
                                    className="w-full"
                                    value={data.mobile}
                                    onChange={(e) => setData('mobile', e.target.value)}
                                />
                                <InputError message={errors.mobile} className=""/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="dob" className="block text-900 font-medium mb-2">DOB</label>
                                <InputText
                                    id="dob"
                                    type="date"
                                    placeholder="Your dob"
                                    className="w-full"
                                    value={data.dob}
                                    onChange={(e) => setData('dob', e.target.value)}
                                />
                                <InputError message={errors.age} className=""/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="gender" className="block text-900 font-medium mb-2">Gender</label>
                                <Dropdown
                                    id="gender"
                                    value={data.gender}
                                    options={genderOptions}
                                    onChange={(e) => setData('gender', e.value)}
                                    placeholder="Select Gender"
                                    className="w-full"
                                />
                                <InputError message={errors.gender} className=""/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="photo" className="block text-900 font-medium mb-2">Profile Photo</label>
                                <FileUpload
                                    name="photo"
                                    accept="image/*"
                                    customUpload
                                    auto
                                    onSelect={(e) => setData('photo', e.files[0])}
                                    mode="advanced"
                                    chooseLabel="Select Image"
                                    className="w-full"
                                />
                                <InputError message={errors.photo} className=""/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                                <InputText
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    className="w-full"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className=""/>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password_confirmation" className="block text-900 font-medium mb-2">Confirm Password</label>
                                <InputText
                                    id="password_confirmation"
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="w-full"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                                <InputError message={errors.password_confirmation} className=""/>
                            </div>

                            <div className="flex align-items-center justify-content-end mb-4">
                                <Link
                                    href={route('login')}
                                    className=""
                                >
                                    Already registered?
                                </Link>
                            </div>

                            <PrimaryButton label="Register" className="w-full" disabled={processing}/>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
