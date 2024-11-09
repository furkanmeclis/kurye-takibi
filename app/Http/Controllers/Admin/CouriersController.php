<?php

namespace App\Http\Controllers\Admin;

use App\Exports\BusinessOrdersExport;
use App\Exports\CourierOrdersExport;
use App\Models\CourierDetails;
use App\Models\Orders;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

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
                $newCourier->activated_at = now();
                $newCourier->activated = 1;
            } else {
                $newCourier->email_verified_at = null;
                $newCourier->activated_at = null;
                $newCourier->activated = 0;
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
        } elseif ($type == "activated") {
            $couriers = User::where("role", "courier")->orderBy("created_at", "desc")->where("activated", 1);
        } elseif ($type == "unactivated") {
            $couriers = User::where("role", "courier")->orderBy("created_at", "desc")->where("activated", 0);
        }
        if ($couriers) {
            $couriers = $couriers->get()->map(function ($courier) {
                $courier->phone = "0" . str_replace(["(", ")", "-", " "], "", $courier->phone);
                $courier->details = CourierDetails::where("courier_id", $courier->id)->first();
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

    public function getWaitApprovalCouriers(): \Illuminate\Http\JsonResponse
    {
        $couriers = CourierDetails::where("approved", 0)->where("completed", 1)->orderBy("created_at", "desc")->get()->map(function ($details) {
            $details->courier = User::where("id", $details->courier_id)->first();
            return $details;
        });
        if ($couriers) {
            return response()->json([
                "status" => true,
                "details" => $couriers
            ]);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Onay Bekleyen Kurye Listesi Alınamadı."
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
        $courier = User::where('role', 'courier')->where('id', $id)->first(["id", "activated"]);
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
                    if ($courier->activated == 0) {
                        $courier->activated = 1;
                        $courier->activated_at = now();
                    }
                } else {
                    if ($courier->activated == 1) {
                        $courier->activated = 0;
                        $courier->activated_at = null;
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
            if ($courier->activated == 1) {
                return response()->json([
                    "status" => false,
                    "message" => "Kurye Zaten Onaylanmış."
                ]);
            } else {
                $courier->activated = 1;
                $courier->activated_at = now();
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

    public function approveDetails($id): \Illuminate\Http\JsonResponse
    {
        $courier = CourierDetails::where('courier_id', $id)->first();
        if ($courier) {
            if ($courier->approved == 1) {
                return response()->json([
                    "status" => false,
                    "message" => "Kurye Zaten Onaylanmış."
                ]);
            } else {
                $courier->approved = 1;
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
                "activated" => 1,
                "activated_at" => now()
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
    public function exportOrdersReport(Request $request, $courierId): \Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\JsonResponse
    {
        $courier = User::find($courierId);
        if ($courier) {
            $startDate = Carbon::createFromTimestampMs($request->startDate)->startOfDay();
            $endDate = Carbon::createFromTimestampMs($request->endDate)->endOfDay();
            $orders = Orders::where("courier_id", $courier->id)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->get();
            if($orders->isEmpty()) {
                return response()->json([
                    "status" => false,
                    "message" => "Belirtilen Tarih Aralığında Sipariş Bulunamadı."
                ], 404);
            }
            $excelData = Orders::createCourierExportData($orders, $startDate->format("d.m.Y"), $endDate->format("d.m.Y"));
            $exportType = $request->exportType == "xlsx" ? \Maatwebsite\Excel\Excel::XLSX : \Maatwebsite\Excel\Excel::MPDF;
            return Excel::download(new CourierOrdersExport($excelData), 'orders.xlsx', $exportType);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Kurye Bulunamadı"
            ], 404);
        }
    }
}
