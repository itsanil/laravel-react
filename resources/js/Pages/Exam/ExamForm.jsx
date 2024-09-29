import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Head } from '@inertiajs/react';
import Layout from "@/Layouts/layout/layout.jsx";

export default function ExamForm({ exam = null }) {
    const { data, setData, post, put,errors } = useForm({
        title: exam ? exam.title : '',
        description: exam ? exam.description : '',
        excel_file: exam ? exam.excel_file : null,
        total_time_for_exam: exam ? exam.total_time_for_exam : '',
        marks: exam ? exam.marks : ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (exam) {
            // console.log(data);
            put(route('exams.update', exam.id)); // For update
        } else {
            post(route('exams.store')); // For create
        }
    };

    return (
        <Layout>
            <Head title={exam ? "Edit Exam" : "Create Exam"} />
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <h2 className="text-lg font-medium">{exam ? "Edit Exam" : "Create Exam"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="field">
                                <label htmlFor="title">Title</label>
                                <InputText id="title" className="w-full" value={data.title} 
                                onChange={(e) => setData('title', e.target.value)} required />
                                {errors.title && <small className="p-error">{errors.title}</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="description">Description</label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={data.description}
                                    onChange={(event, editor) => {
                                        const desc = editor.getData();
                                        setData('description', desc);
                                    }}
                                    className="custom-ckeditor"
                                />
                                {errors.description && <small className="p-error">{errors.description}</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="excel_file">Upload Excel File</label>
                                <FileUpload
                                    mode="basic"
                                    name="excel_file"
                                    accept=".xlsx,.xls"
                                    maxFileSize={1000000} // 1MB limit
                                    onSelect={(e) => {
                                        // console.log(e.files[0]); // Log the file
                                        setData('excel_file', e.files[0]);
                                    }}
                                    // onUpload={(e) => {
                                    //     console.log(e.files[0]);
                                    //     setData('excel_file', e.files[0])
                                    // }
                                    // }
                                    className="w-full"
                                />
                                {errors.excel_file && <small className="p-error">{errors.excel_file}</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="total_time_for_exam">Total Time for Exam (minutes)</label>
                                <InputText id="total_time_for_exam" className="w-full" value={data.total_time_for_exam} onChange={(e) => setData('total_time_for_exam', e.target.value)} required />
                                {errors.total_time_for_exam && <small className="p-error">{errors.total_time_for_exam}</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="marks">Marks</label>
                                <InputText id="marks" className="w-full" value={data.marks} onChange={(e) => setData('marks', e.target.value)} required />
                                {errors.marks && <small className="p-error">{errors.marks}</small>}
                            </div>
                            <Button type="submit" label={exam ? "Update Exam" : "Create Exam"} icon="pi pi-check" />
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
