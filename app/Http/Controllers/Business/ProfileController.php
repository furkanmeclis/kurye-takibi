<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Models\BusinessDetails;
use App\Models\CourierDetails;
use App\Models\Orders;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    public function savePersonalInformation(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $individualFirst = "nullable";
            if ($request->get("billing") == "individual") {
                $individualFirst = "required";
            }
            $companyFirst = "nullable";
            if ($request->get("billing") == "company") {
                $companyFirst = "required";
            }
            $request->validate([
                'address' => 'required|string|min:10',
                'city' => 'required|string',
                'state' => 'required|string',
                'zip' => ['required', 'string', 'regex:/^\d{5}$/'],
                'country' => 'required|string',
                'status' => 'nullable|string',
                'billing' => 'required|in:individual,company',
                'identity' => $individualFirst . '|string|min:11|max:11',
                'birth_date' => $individualFirst . '|date_format:d.m.Y',
                'tax_name' => $companyFirst . '|string',
                'tax_number' => $companyFirst . '|string|min:10|max:10',
                'tax_address' => $companyFirst . '|string|min:10',
                'tax_office' => $companyFirst . '|string',
                'latitude' => "required",
                "longitude" => "required"
            ]);
            $user = auth()->user();
            $businessDetails = BusinessDetails::firstOrNew(['business_id' => $user->id]);
            $businessDetails->name = $user->name;
            $businessDetails->email = $user->email;
            $businessDetails->phone = $user->phone;
            $businessDetails->business_id = $user->id;
            $businessDetails->identity = null;
            $businessDetails->birth_date = null;
            $businessDetails->tax_name = null;
            $businessDetails->tax_number = null;
            $businessDetails->tax_address = null;
            $businessDetails->tax_office = null;
            $businessDetails->latitude = $request->get("latitude");
            $businessDetails->longitude = $request->get("longitude");
            $businessDetails->sector = $request->get("sector");
            $businessDetails->businessPhone = $request->get("businessPhone");
            if ($request->get("billing") == "individual") {
                $businessDetails->identity = $request->get("identity");
                $businessDetails->birth_date = $request->get("birth_date");
            } else {
                $businessDetails->tax_name = $request->get("tax_name");
                $businessDetails->tax_number = $request->get("tax_number");
                $businessDetails->tax_address = $request->get("tax_address");
                $businessDetails->tax_office = $request->get("tax_office");
            }
            $businessDetails->billing = $request->get("billing");
            $businessDetails->address = $request->get("address");
            $businessDetails->city = $request->get("city");
            $businessDetails->state = $request->get("state");
            $businessDetails->zip = $request->get("zip");
            $businessDetails->country = $request->get("country");
            $businessDetails->approved = 0;
            $businessDetails->completed = 1;
            if ($businessDetails->save()) {
                return response()->json([
                    "status" => true,
                    "message" => "Bilgileriniz başarıyla kaydedildi.",
                    "details" => $businessDetails,
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Bilgileriniz kaydedilirken bir hata oluştu.",
                ]);
            }

        } catch (ValidationException $e) {
            return response()->json([
                "status" => false,
                "message" => ucfirst($e->getMessage()),
                "errors" => $e->errors(),
            ]);
        }
    }

    public function getPersonalInformation(): \Illuminate\Http\JsonResponse
    {
        $user = auth()->user();
        $businessDetails = BusinessDetails::where('business_id', $user->id)->first();
        if (!$businessDetails) {
            $businessDetails = new BusinessDetails();
            $businessDetails->name = $user->name;
            $businessDetails->email = $user->email;
            $businessDetails->phone = $user->phone;
            $businessDetails->business_id = $user->id;
            $businessDetails->completed = 0;
            $businessDetails->approved = 0;
            $businessDetails->save();
        }

        return response()->json([
            "status" => true,
            "details" => $businessDetails,
            "courier" => $user,
        ]);
    }

    public function getStatics(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            "status" => true,
            "statics" => Orders::getBusinessStats(14)
        ]);
    }
}
