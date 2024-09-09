<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\BusinessDetails;
use App\Models\CourierDetails;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rules;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $user = $request->user();
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:' . User::class . ',email,' . $user->id,
                'phone' => 'required|string|max:255|unique:' . User::class . ',phone,' . $user->id,
                'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            ]);
            $user->name = $request->input('name');
            $user->email = $request->input('email');
            $user->phone = $request->input('phone');
            if ($request->has("password_change")) {
                $user->password = bcrypt($request->input('password'));
            }
            if ($user->save()) {
                $updatePersonalInformation = false;
                if ($user->role === "courier") {
                    $details = CourierDetails::firstOrNew(['courier_id' => $user->id]);
                    $details->name = $user->name;
                    $details->email = $user->email;
                    $details->phone = $user->phone;
                    $details->save();
                    $updatePersonalInformation = true;
                }
                if($user->role === "business"){
                    $details = BusinessDetails::firstOrNew(['business_id' => $user->id]);
                    $details->name = $user->name;
                    $details->email = $user->email;
                    $details->phone = $user->phone;
                    $details->save();
                    $updatePersonalInformation = true;
                }
                return response()->json([
                    "status" => true,
                    "message" => "Profiliniz başarıyla güncellendi.",
                    "user" => $user,
                    "updatePersonalInformation" => $updatePersonalInformation,
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Profil güncellenirken bir hata oluştu."
                ]);
            }
        } catch (ValidationException $e) {
            $emailExists = isset($e->errors()['email']);
            $phoneExists = isset($e->errors()['phone']);
            return response()->json([
                "status" => false,
                "message" => ucfirst($e->getMessage()),
                "errors" => $e->errors(),
                "emailExists" => $emailExists,
                "phoneExists" => $phoneExists
            ]);
        }

    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
