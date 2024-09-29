<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Exam;
use Inertia\Inertia;

class ExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Exam/Index', ['exams'=>Exam::all()]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Exam/ExamForm');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'excel_file' => 'nullable|mimes:xls,xlsx|max:2048',  // Limit the file size and type
            'total_time_for_exam' => 'required|integer|min:1',
            'marks' => 'required|integer|min:1',
        ]);

        $filePath = null;

        // Handle file upload
        if ($request->hasFile('excel_file')) {
            $filePath = $request->file('excel_file')->store('exam_excels', 'public');
        }

        // Create exam
        Exam::create([
            'title' => $request->title,
            'description' => $request->description,
            'excel_file' => $filePath,
            'total_time_for_exam' => $request->total_time_for_exam,
            'marks' => $request->marks,
        ]);

        return redirect()->route('exams.index')->with('success', 'Exam created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Exam $exam)
    {
        return Inertia::render('Exam/ExamForm',compact('exam'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Exam $exam)
    {
        // echo "<pre>"; print_r($request->all()); echo "</pre>"; die('anil');
        
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'excel_file' => 'nullable|mimes:xls,xlsx|max:2048',
            'total_time_for_exam' => 'required|integer|min:1',
            'marks' => 'required|integer|min:1',
        ]);
        $filePath = $request->file('excel_file') ? $request->file('excel_file')->store('exam_excels', 'public') : $exam->excel_file;

        $exam->update([
            'title' => $request->title,
            'description' => $request->description,
            'excel_file' => $filePath,
            'total_time_for_exam' => $request->total_time_for_exam,
            'marks' => $request->marks,
        ]);

        return redirect()->route('exams.index')->with('success', 'Exam updated successfully');
    }

    public function destroy(Exam $exam)
    {
        if ($exam->excel_file) {
            Storage::delete($exam->excel_file);
        }

        $exam->delete();
        return redirect()->route('exams.index')->with('success', 'Exam deleted successfully');
    }
}
