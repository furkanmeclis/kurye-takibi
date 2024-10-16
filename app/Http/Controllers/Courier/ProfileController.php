<?php

namespace App\Http\Controllers\Courier;

use App\Http\Controllers\Controller;
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
                'vehicle_type' => 'required|in:car,motorcycle,bicycle',
            ]);
            $user = auth()->user();
            $courierDetails = CourierDetails::firstOrNew(['courier_id' => $user->id]);
            $courierDetails->name = $user->name;
            $courierDetails->email = $user->email;
            $courierDetails->phone = $user->phone;
            $courierDetails->courier_id = $user->id;
            $courierDetails->identity = null;
            $courierDetails->birth_date = null;
            $courierDetails->tax_name = null;
            $courierDetails->tax_number = null;
            $courierDetails->tax_address = null;
            $courierDetails->tax_office = null;
            if ($request->get("billing") == "individual") {
                $courierDetails->identity = $request->get("identity");
                $courierDetails->birth_date = $request->get("birth_date");
            } else {
                $courierDetails->tax_name = $request->get("tax_name");
                $courierDetails->tax_number = $request->get("tax_number");
                $courierDetails->tax_address = $request->get("tax_address");
                $courierDetails->tax_office = $request->get("tax_office");
            }
            $courierDetails->billing = $request->get("billing");
            $courierDetails->address = $request->get("address");
            $courierDetails->city = $request->get("city");
            $courierDetails->state = $request->get("state");
            $courierDetails->zip = $request->get("zip");
            $courierDetails->country = $request->get("country");
            $courierDetails->vehicle_type = $request->get("vehicle_type");
            $courierDetails->approved = 0;
            $courierDetails->completed = 1;
            if ($courierDetails->save()) {
                return response()->json([
                    "status" => true,
                    "message" => "Bilgileriniz başarıyla kaydedildi.",
                    "details" => $courierDetails,
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Bilgileriniz kaydedilirken bir hata oluştu.",
                ]);
            }

        } catch (ValidationException $e) {
            $emailExists = isset($e->errors()['email']);
            $phoneExists = isset($e->errors()['phone']);
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
        $courierDetails = CourierDetails::where('courier_id', $user->id)->first();
        if (!$courierDetails) {
            $courierDetails = new CourierDetails();
            $courierDetails->name = $user->name;
            $courierDetails->email = $user->email;
            $courierDetails->phone = $user->phone;
            $courierDetails->courier_id = $user->id;
            $courierDetails->completed = 0;
            $courierDetails->approved = 0;
            $courierDetails->save();
        }

        return response()->json([
            "status" => true,
            "details" => $courierDetails,
            "courier" => $user,
        ]);
    }

    public function getStatics(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            "status" => true,
            "statics" => Orders::getCourierStatics(14)
        ]);
    }
}
