<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
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
     * @throws ValidationException
     */
    public function store(Request $request)
    {
        try{
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
                'phone' => 'required|string|max:255|unique:'.User::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
            ]);
            if($user){
                event(new Registered($user));
                Auth::login($user);
                $hiddenMail = substr($user->email, 0, 3) . str_repeat('*', strlen($user->email) - 6) . substr($user->email, -3);
                return response()->json([
                    "status" => true,
                    "message" => "Kaydınız Başarıyla Gerçekleşti",
                    "redirect" => 'login'
                ]);
            }else{
                return response()->json([
                    "status" => false,
                    "message" => "Kayıt İşlemi Başarısız Oldu. Lütfen Daha Sonra Tekrar Deneyiniz.",
                ]);
            }
        }catch (ValidationException $e) {
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
}
