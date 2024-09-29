<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Role;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Get query params for search, sort, and pagination
        $search = $request->input('search');
        $sortField = $request->input('sortField', 'id'); // Default sort field
        $sortOrder = $request->input('sortOrder', 'asc'); // Default sort order
        $perPage = $request->input('perPage', 10); // Rows per page
        $page = $request->input('page', 1); // Current page
        // echo "<pre>"; print_r($request->all()); echo "</pre>"; die('anil');
        // Fetch Role with search and pagination
        $query = Role::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $Role = $query->orderBy($sortField, $sortOrder)
                       ->paginate($perPage, ['*'], 'page', $page);
        return Inertia::render('Role/Index', [
            'roles' => $Role->items(),
            'total' => $Role->total(),
            'lastPage' => $Role->lastPage(),
            'currentPage' => $Role->currentPage(),
            'perPage' => $Role->perPage(),
            'sortField' => $sortField,
            'sortOrder' => $sortOrder,
            'search' => $search,
        ]);
    }

    // Show create form (Create)
    public function create()
    {
        return Inertia::render('Role/Create');
    }

    // Store user in database (Create)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:roles,name',
        ]);

        Role::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
        ]);

        return redirect()->route('roles.index')->with('success', 'Role created successfully');
    }

    // Show edit form (Update)
    public function edit(User $user)
    {
        return Inertia::render('Role/Edit', ['user' => $user]);
    }

    // Update user in database (Update)
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|unique:roles,name,' . $role->id,
        ]);

        $role->update([
            'name' => $validated['name'],
        ]);

        return redirect()->route('roles.index')->with('success', 'Role updated successfully');
    }

    // Delete user (Delete)
    public function destroy(Role $role)
    {
        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Role deleted successfully');
    }
}
