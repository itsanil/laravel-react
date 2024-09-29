<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $title = 'Manage Category'.$category_data->name;
        $categorys = Category::where('parent_id',null)->get();
        return Inertia::render('Category/Index',compact('categorys'));
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
            'name' => 'required|unique:categories,name',
            'status' => 'required',
            'img' => 'nullable|mimes:png,jpg,jpeg,webp|max:2048',  // Limit the file size and type
        ]);

        $filePath = null;

        // Handle file upload
        if ($request->hasFile('img')) {
            $filePath = $request->file('img')->store('category_img', 'public');
        }

        Category::create([
            'name' => $validated['name'],
            'status' => $validated['status'],
            'img' => $filePath,
            'parent_id' => $request->parent_id,
        ]);

        return redirect()->back()->with('success', 'Category created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category_data = Category::where('id',$id)->first();
        $categorys = Category::where('parent_id',$id)->get();
        $title = 'Subcategory for '.$category_data->name;
        return Inertia::render('Category/Index',compact('categorys','category_data','title'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        $validated = $request->validate([
            'name' => 'required|unique:categories,name,' . $category->id,
            'status' => 'required',
            'img' => 'nullable|mimes:png,jpg,jpeg|max:2048',  // Limit the file size and type
        ]);

        $filePath = $request->file('img') ? $request->file('img')->store('category_img', 'public') : $category->img;

        $category->update([
            'name' => $validated['name'],
            'status' => $validated['status'],
            'img' => $filePath,
            'parent_id' => $request->parent_id,
        ]);

        return redirect()->back()->with('success', 'category updated successfully');
    }

    public function updates(Request $request, $id)
    {
        $category = Category::find($id);
        $validated = $request->validate([
            'name' => 'required|unique:categories,name,' . $category->id,
            'status' => 'required',
            'img' => 'nullable|mimes:png,jpg,jpeg|max:2048',  // Limit the file size and type
        ]);

        $filePath = $request->file('img') ? $request->file('img')->store('category_img', 'public') : $category->img;

        $category->update([
            'name' => $validated['name'],
            'status' => $validated['status'],
            'img' => $filePath,
            'parent_id' => $request->parent_id,
        ]);

        return redirect()->back()->with('success', 'category updated successfully');
    }

    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->back()->with('success', 'category deleted successfully');
    }
}
