<?php

namespace App\Http\Controllers\Admin;

use App\Exports\BusinessOrdersExport;
use App\Http\Controllers\Controller;
use App\Models\BusinessDetails;
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

class BusinessesController extends Controller
{
    /**
     * @return Response
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Businesses/All');
    }

    /**
     * @return Response
     */
    public function waitApproval(): Response
    {
        return Inertia::render('Admin/Businesses/WaitApproval');
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Businesses/New');
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
            $newBusiness = new User();
            $newBusiness->name = $request->name;
            $newBusiness->email = $request->email;
            $newBusiness->phone = $request->phone;
            $newBusiness->password = Hash::make($request->password);
            $newBusiness->role = 'business';
            if ($request->account_verification == "1") {
                $newBusiness->email_verified_at = now();
                $newBusiness->activated_at = now();
                $newBusiness->activated = 1;
            } else {
                $newBusiness->email_verified_at = null;
                $newBusiness->activated_at = null;
                $newBusiness->activated = 0;
            }
            if ($newBusiness->save()) {
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

    public function listBusinesses($type): \Illuminate\Http\JsonResponse
    {
        $businesses = null;
        if ($type == "all") {
            $businesses = User::where("role", "business")->orderBy("created_at", "desc");
        } elseif ($type == "activated") {
            $businesses = User::where("role", "business")->orderBy("created_at", "desc")->where("activated", 1);
        } elseif ($type == "unactivated") {
            $businesses = User::where("role", "business")->orderBy("created_at", "desc")->where("activated", 0);
        }
        if ($businesses) {
            $businesses = $businesses->get()->map(function ($business) {
                $business->phone = "0" . str_replace(["(", ")", "-", " "], "", $business->phone);
                $business->details = BusinessDetails::where("business_id", $business->id)->first();
                return $business;
            });
            return response()->json([
                "status" => true,
                "businesses" => $businesses
            ]);
        } else {
            return response()->json([
                "status" => false,
                "message" => "İşletme Listesi Alınamadı."
            ]);
        }
    }

    public function getWaitApprovalBusinesses(): \Illuminate\Http\JsonResponse
    {
        $businesses = BusinessDetails::where("approved", 0)->where("completed", 1)->orderBy("created_at", "desc")->get()->map(function ($details) {
            $details->business = User::where("id", $details->business_id)->first();
            return $details;
        });
        if ($businesses) {
            return response()->json([
                "status" => true,
                "details" => $businesses
            ]);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Onay Bekleyen İşletme Listesi Alınamadı."
            ]);
        }
    }

    public function showDetails($id): \Illuminate\Http\JsonResponse
    {
        $business = User::where('role', 'business')->where('id', $id)->first();
        if ($business) {
            return response()->json([
                "status" => true,
                "business" => $business
            ]);
        } else {
            return response()->json([
                "status" => false,
                "message" => "İşletme Bulunamadı."
            ]);
        }
    }

    public function edit($id)
    {
        $business = User::where('role', 'business')->where('id', $id)->first(["id", "activated"]);
        if ($business) {
            return Inertia::render('Admin/Businesses/Edit', [
                'businessId' => $business->id,
            ]);
        } else {
            return redirect()->route('admin.businesses.index')->with('message', 'İşletme Bulunamadı.')->with('type', 'error')->with("title", "Hata");
        }
    }

    public function update(Request $request, $id)
    {
        $business = User::where('role', 'business')->where('id', $id)->first();
        if ($business) {
            try {
                $request->validate([
                    'name' => 'required|string|max:255',
                    'email' => 'required|string|lowercase|email|max:255|unique:' . User::class . ',email,' . $business->id,
                    'phone' => 'required|string|max:255|unique:' . User::class . ',phone,' . $business->id,
                    'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
                ]);
                $business->name = $request->name;
                $business->email = $request->email;
                $business->phone = $request->phone;
                if ($request->account_verification == "1") {
                    if ($business->activated == 0) {
                        $business->activated = 1;
                        $business->activated_at = now();
                    }
                } else {
                    if ($business->activated == 1) {
                        $business->activated = 0;
                        $business->activated_at = null;
                    }
                }
                if ($request->has("password_change")) {
                    $business->password = Hash::make($request->password);
                }
                if ($business->save()) {
                    return response()->json([
                        "status" => true,
                        "message" => "İşletme Güncelleme İşlemi Başarılı.",
                        "business" => $business,
                    ]);
                } else {
                    return response()->json([
                        "status" => false,
                        "message" => "İşletme Güncelleme İşlemi Başarısız Oldu."
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
                "message" => "İşletme Bulunamadı."
            ]);
        }
    }

    public function approve($id): \Illuminate\Http\JsonResponse
    {
        $business = User::where('role', 'business')->where('id', $id)->first();
        if ($business) {
            if ($business->activated == 1) {
                return response()->json([
                    "status" => false,
                    "message" => "İşletme Zaten Onaylanmış."
                ]);
            } else {
                $business->activated = 1;
                $business->activated_at = now();
                if ($business->save()) {
                    return response()->json([
                        "status" => true,
                        "message" => "İşletme Onaylama İşlemi Başarılı."
                    ]);
                } else {
                    return response()->json([
                        "status" => false,
                        "message" => "İşletme Onaylama İşlemi Başarısız Oldu."
                    ]);
                }
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "İşletme Bulunamadı."
            ]);
        }
    }

    public function approveDetails($id): \Illuminate\Http\JsonResponse
    {
        $businessDetails = BusinessDetails::where('business_id', $id)->first();
        if ($businessDetails) {
            if ($businessDetails->approved == 1) {
                return response()->json([
                    "status" => false,
                    "message" => "İşletme Zaten Onaylanmış."
                ]);
            } else {
                $businessDetails->approved = 1;
                if ($businessDetails->save()) {
                    return response()->json([
                        "status" => true,
                        "message" => "İşletme Onaylama İşlemi Başarılı."
                    ]);
                } else {
                    return response()->json([
                        "status" => false,
                        "message" => "İşletme Onaylama İşlemi Başarısız Oldu."
                    ]);
                }
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "İşletme Bulunamadı."
            ]);
        }
    }

    public function multipleApprove(Request $request): \Illuminate\Http\JsonResponse
    {
        $businesses = User::where('role', 'business')->whereIn('id', $request->ids);
        if ($businesses) {
            $businesses->update([
                "activated" => 1,
                "activated_at" => now()
            ]);
            return response()->json([
                "status" => true,
                "message" => "Seçilen İşletme Onaylandı."
            ]);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Seçilen İşletme Onaylanamadı."
            ]);
        }
    }

    public function destroy($id): \Illuminate\Http\JsonResponse
    {
        $business = User::where('role', 'business')->where('id', $id)->first();
        if ($business) {
            if ($business->delete()) {
                return response()->json([
                    "status" => true,
                    "message" => "İşletme Silme İşlemi Başarılı."
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "İşletme Silme İşlemi Başarısız Oldu."
                ]);
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "İşletme Bulunamadı."
            ]);
        }
    }

    public function multipleDestroy(Request $request): \Illuminate\Http\JsonResponse
    {
        $businesses = User::where('role', 'business')->whereIn('id', $request->ids);
        if ($businesses) {
            $businesses->delete();
            return response()->json([
                "status" => true,
                "message" => "Seçilen İşletmeler Silindi."
            ]);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Seçilen İşletmeler Silinemedi."
            ]);
        }
    }

    public function exportOrdersReport(Request $request, $businessId): \Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\JsonResponse
    {
        $business = User::find($businessId);
        if ($business) {
            $startDate = Carbon::createFromTimestampMs($request->startDate);
            $endDate = Carbon::createFromTimestampMs($request->endDate);
            $orders = Orders::where("business_id", $business->id)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->get();
            if($orders->isEmpty()) {
                return response()->json([
                    "status" => false,
                    "message" => "Belirtilen Tarih Aralığında Sipariş Bulunamadı."
                ], 404);
            }
            $excelData = Orders::createBusinessExportData($orders, $startDate->format("d.m.Y"), $endDate->format("d.m.Y"));
            $exportType = $request->exportType == "xlsx" ? \Maatwebsite\Excel\Excel::XLSX : \Maatwebsite\Excel\Excel::MPDF;
            return Excel::download(new BusinessOrdersExport($excelData), 'orders.xlsx', $exportType);
        } else {
            return response()->json([
                "status" => false,
                "message" => "İşletme Bulunamadı"
            ], 404);
        }
    }
}
