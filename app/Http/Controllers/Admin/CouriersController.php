<?php

namespace App\Http\Controllers\Admin;

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

class CouriersController extends \App\Http\Controllers\Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Couriers/All');
    }

    public function waitApproval(): Response
    {
        return Inertia::render('Admin/Couriers/WaitApproval');
    }
    public function create(): Response
    {
        return Inertia::render('Admin/Couriers/New');
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
                'phone' => 'required|string|max:255|unique:' . User::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);
            $newUserArray = [
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'role' => 'courier',
            ];
            if($request->account_verification == 1){
                $newUserArray['email_verified_at'] = now();
                $newUserArray["verified_at"] = now();
                $newUserArray["verified"] = 1;
            }else{
                $newUserArray['email_verified_at'] = null;
                $newUserArray["verified_at"] = null;
                $newUserArray["verified"] = 0;
            }
            $user = User::create($newUserArray);
            if ($user) {
                return response()->json([
                    "status" => true,
                    "message" => "Kayıt Başarıyla Gerçekleşti.",
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Kayıt İşlemi Başarısız Oldu. Lütfen Daha Sonra Tekrar Deneyiniz.",
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

    public function listCouriers($type): \Illuminate\Http\JsonResponse
    {
        $couriers = null;
        if($type == "all"){
            $couriers = User::where("role","courier")->orderBy("created_at","desc");
        }elseif($type == "verified"){
            $couriers = User::where("role","courier")->orderBy("created_at","desc")->where("verified",1);
        }elseif($type == "unverified"){
            $couriers = User::where("role","courier")->orderBy("created_at","desc")->where("verified",0);
        }
        if($couriers){
            $couriers = $couriers->get()->map(function($courier){
                $courier->phone = "0".str_replace(["(",")","-"," "],"",$courier->phone);
                return $courier;
            });
            return response()->json([
                "status" => true,
                "couriers" => $couriers
            ]);
        }else{
            return response()->json([
                "status" => false,
                "message" => "Kurye Listesi Alınamadı. Lütfen Daha Sonra Tekrar Deneyiniz."
            ]);
        }
    }
}
