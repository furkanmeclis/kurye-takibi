<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Illuminate\Http\Request;
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
            $newCourier = new User();
            $newCourier->name = $request->name;
            $newCourier->email = $request->email;
            $newCourier->phone = $request->phone;
            $newCourier->password = Hash::make($request->password);
            $newCourier->role = 'courier';
            if ($request->account_verification == "1") {
                $newCourier->email_verified_at = now();
                $newCourier->verified_at = now();
                $newCourier->verified = 1;
            } else {
                $newCourier->email_verified_at = null;
                $newCourier->verified_at = null;
                $newCourier->verified = 0;
            }

            if ($newCourier->save()) {
                return response()->json([
                    "status" => true,
                    "message" => "Kayıt Başarıyla Gerçekleşti.",
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Kayıt İşlemi Başarısız Oldu.",
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
        if ($type == "all") {
            $couriers = User::where("role", "courier")->orderBy("created_at", "desc");
        } elseif ($type == "verified") {
            $couriers = User::where("role", "courier")->orderBy("created_at", "desc")->where("verified", 1);
        } elseif ($type == "unverified") {
            $couriers = User::where("role", "courier")->orderBy("created_at", "desc")->where("verified", 0);
        }
        if ($couriers) {
            $couriers = $couriers->get()->map(function ($courier) {
                $courier->phone = "0" . str_replace(["(", ")", "-", " "], "", $courier->phone);
                return $courier;
            });
            return response()->json([
                "status" => true,
                "couriers" => $couriers
            ]);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Kurye Listesi Alınamadı."
            ]);
        }
    }

    public function showDetails($id): \Illuminate\Http\JsonResponse
    {
        $courier = User::where('role', 'courier')->where('id', $id)->first();
        if ($courier) {
            return response()->json([
                "status" => true,
                "courier" => $courier
            ]);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Kurye Bulunamadı."
            ]);
        }
    }

    public function edit($id)
    {
        $courier = User::where('role', 'courier')->where('id', $id)->first(["id", "verified"]);
        if ($courier) {
            return Inertia::render('Admin/Couriers/Edit', [
                'courierId' => $courier->id,
            ]);
        } else {
            return redirect()->route('admin.couriers.index')->with('message', 'Kurye Bulunamadı.')->with('type', 'error')->with("title", "Hata");
        }
    }

    public function update(Request $request, $id)
    {
        $courier = User::where('role', 'courier')->where('id', $id)->first();
        if ($courier) {
            try {
                $request->validate([
                    'name' => 'required|string|max:255',
                    'email' => 'required|string|lowercase|email|max:255|unique:' . User::class . ',email,' . $courier->id,
                    'phone' => 'required|string|max:255|unique:' . User::class . ',phone,' . $courier->id,
                    'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
                ]);
                $courier->name = $request->name;
                $courier->email = $request->email;
                $courier->phone = $request->phone;
                if ($request->account_verification == "1") {
                    if ($courier->verified == 0) {
                        $courier->verified = 1;
                        $courier->verified_at = now();
                    }
                } else {
                    if ($courier->verified == 1) {
                        $courier->verified = 0;
                        $courier->verified_at = null;
                    }
                }
                if ($request->has("password_change")) {
                    $courier->password = Hash::make($request->password);
                }
                if ($courier->save()) {
                    return response()->json([
                        "status" => true,
                        "message" => "Kurye Güncelleme İşlemi Başarılı.",
                        "courier" => $courier,
                    ]);
                } else {
                    return response()->json([
                        "status" => false,
                        "message" => "Kurye Güncelleme İşlemi Başarısız Oldu."
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
        } else {
            return response()->json([
                "status" => false,
                "message" => "Kurye Bulunamadı."
            ]);
        }
    }

    public function approve($id): \Illuminate\Http\JsonResponse
    {
        $courier = User::where('role', 'courier')->where('id', $id)->first();
        if ($courier) {
            if ($courier->verified == 1) {
                return response()->json([
                    "status" => false,
                    "message" => "Kurye Zaten Onaylanmış."
                ]);
            } else {
                $courier->verified = 1;
                $courier->verified_at = now();
                if ($courier->save()) {
                    return response()->json([
                        "status" => true,
                        "message" => "Kurye Onaylama İşlemi Başarılı."
                    ]);
                } else {
                    return response()->json([
                        "status" => false,
                        "message" => "Kurye Onaylama İşlemi Başarısız Oldu."
                    ]);
                }
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "Kurye Bulunamadı."
            ]);
        }
    }

    public function multipleApprove(Request $request): \Illuminate\Http\JsonResponse
    {
        $couriers = User::where('role', 'courier')->whereIn('id', $request->ids);
        if ($couriers) {
            $couriers->update([
                "verified" => 1,
                "verified_at" => now()
            ]);
            return response()->json([
                "status" => true,
                "message" => "Seçilen Kuryeler Onaylandı."
            ]);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Seçilen Kuryeler Onaylanamadı."
            ]);
        }
    }

    public function destroy($id): \Illuminate\Http\JsonResponse
    {
        $courier = User::where('role', 'courier')->where('id', $id)->first();
        if ($courier) {
            if ($courier->delete()) {
                return response()->json([
                    "status" => true,
                    "message" => "Kurye Silme İşlemi Başarılı."
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Kurye Silme İşlemi Başarısız Oldu."
                ]);
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "Kurye Bulunamadı."
            ]);
        }
    }

    public function multipleDestroy(Request $request): \Illuminate\Http\JsonResponse
    {
        $couriers = User::where('role', 'courier')->whereIn('id', $request->ids);
        if ($couriers) {
            $couriers->delete();
            return response()->json([
                "status" => true,
                "message" => "Seçilen Kuryeler Silindi."
            ]);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Seçilen Kuryeler Silinemedi."
            ]);
        }
    }
}