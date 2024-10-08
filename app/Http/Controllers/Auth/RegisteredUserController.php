<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // echo "<pre>"; print_r($request->all()); echo "</pre>"; die('anil');
        // Validate the incoming request data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'mobile' => 'required|string|max:15|unique:users,mobile', // Validate mobile
            'dob' => 'required', // Validate age with range
            'gender' => 'required|in:M,F,O', // Validate gender to be M, F, or O
            'photo' => 'nullable|image|max:2048', // Optional, validate photo (image type, max size 2MB)
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Handle file upload (profile photo) if provided
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('profile_photos', 'public'); // Store in 'storage/app/public/profile_photos'
        }

        // Create the new user with all provided details
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'mobile' => $request->mobile,
            'dob' => $request->dob,
            'gender' => $request->gender,
            'photo' => $photoPath, // Save photo path in the database
            'password' => Hash::make($request->password),
        ]);

        // Trigger Registered event
        event(new Registered($user));

        // Assign the user a default role (e.g., 'admin')
        $user->assignRole('admin');

        // Log the user in after registration
        Auth::login($user);

        // Redirect to the home page
        return redirect(RouteServiceProvider::HOME);
    }
}
