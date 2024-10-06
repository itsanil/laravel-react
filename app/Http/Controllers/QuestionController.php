<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $all_data = Question::all();
        $title = 'Question';
        $url = 'questions';
        // session()->flash('success', 'Records fetched successfully');
        return Inertia::render('Question/Index',compact('all_data','title','url'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:questions,name',
            'status' => 'required',
        ]);

        Question::create([
            'name' => $validated['name'],
            'status' => $validated['status'],
        ]);
        session()->flash('success', 'Records Added successfully');
        return redirect()->back()->with('success', 'Records created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Question $question)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $question = Question::find($id);
        $validated = $request->validate([
            'name' => 'required|unique:questions,name,' . $question->id,
            'status' => 'required',
        ]);
        $question->update([
            'name' => $validated['name'],
            'status' => $validated['status'],
        ]);
        // session()->flash('success', 'Records Updated successfully');
        return redirect()->back()->with('success', 'Records Updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question)
    {
        $question->delete();
        return redirect()->back()->with('success', 'Records deleted successfully');
    }
}
