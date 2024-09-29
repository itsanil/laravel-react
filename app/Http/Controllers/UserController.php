<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
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
        // Fetch users with search and pagination
        // $query = User::query();

        // if ($search) {
        //     $query->where('name', 'like', "%{$search}%")
        //           ->orWhere('email', 'like', "%{$search}%");
        // }

        $users = User::with('roles')->get();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'total' => 15,
            'lastPage' => 1,
            'currentPage' => 1,
            'perPage' =>1,
            // 'total' => $users->total(),
            // 'lastPage' => $users->lastPage(),
            // 'currentPage' => $users->currentPage(),
            // 'perPage' => $users->perPage(),
            'sortField' => $sortField,
            'sortOrder' => $sortOrder,
            'search' => $search
        ]);
    }

    // Show create form (Create)
    public function create()
    {
        $roles_data = Role::all();
        return Inertia::render('Users/Create',compact('roles_data'));
    }

    // Store user in database (Create)
    public function store(Request $request)
    {
        // echo "<pre>"; print_r($request->all()); echo "</pre>"; die('anil');
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            // 'role' => 'required|min:6',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);
        $user = User::where('email',$request->email)->first();
        $user->assignRole($request->role);
        return redirect()->route('users.index')->with('success', 'User created successfully');
    }

    // Show edit form (Update)
    public function edit(User $user)
    {
        $user = User::with('roles')->where('id',$user->id)->first();
        $roles_data = Role::all();
        return Inertia::render('Users/Edit', ['user' => $user,'roles_data'=>$roles_data]);
    }

    // Update user in database (Update)
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'] ? bcrypt($validated['password']) : $user->password,
        ]);

        return redirect()->route('users.index')->with('success', 'User updated successfully');
    }

    // Delete user (Delete)
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index')->with('success', 'User deleted successfully');
    }
}
