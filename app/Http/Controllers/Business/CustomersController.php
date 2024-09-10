<?php

namespace App\Http\Controllers\Business;

use App\Models\CustomerAddresses;
use App\Models\Customers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CustomersController
{
    /**
     * @return Response
     */
    public function index(): \Inertia\Response
    {
        return Inertia::render('Business/Customers/All');
    }

    /**
     * @return JsonResponse
     */
    public function listCustomers(): \Illuminate\Http\JsonResponse

    {
        try {
            $businessId = auth()->user()->id;
            $customers = Customers::where('business_id', $businessId)->get();
            return response()->json([
                "status" => true,
                "customers" => $customers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => false,
                "message" => "Hata: " . $e->getMessage()
            ]);
        }
    }

    /**
     * @param $id
     * @return JsonResponse
     */
    public function getCustomer($id): JsonResponse
    {
        $customer = Customers::find($id);
        if(!$customer) {
            return response()->json([
                "status" => false,
                "message" => "Müşteri bulunamadı."
            ]);
        }else{
            return response()->json([
                "status" => true,
                "customer" => $customer
            ]);
        }
    }

    /**
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('Business/Customers/Create');
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'phone' => 'required|string|max:15',
                'note' => 'nullable|string|max:500',
                'address_title' => 'required|string|max:255',
                'address_city' => 'required|string|max:255',
                'address_district' => 'required|string|max:255',
                'address_phone' => 'required|string|max:15',
                'address' => 'required|string|max:500',
                'address_notes' => 'nullable|string|max:500',
            ]);
            $customer = new Customers();
            $customer->business_id = auth()->user()->id;
            $customer->name = $request->name;
            $customer->phone = $request->phone;
            $customer->note = $request->note ?? null;
            if ($customer->save()) {
                $customerAddress = new CustomerAddresses();
                $customerAddress->customer_id = $customer->id;
                $customerAddress->phone = $request->address_phone;
                $customerAddress->title = $request->address_title;
                $customerAddress->city = $request->address_city;
                $customerAddress->district = $request->address_district;
                $customerAddress->address = $request->address;
                $customerAddress->notes = $request->address_notes ?? null;
                if ($customerAddress->save()) {
                    return response()->json([
                        "status" => true,
                        "message" => "Müşteri başarıyla eklendi."
                    ]);
                } else {
                    $customer->delete();
                    return response()->json([
                        "status" => false,
                        "message" => "Müşteri adresi eklenirken bir hata oluştu."
                    ]);
                }
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Müşteri eklenirken bir hata oluştu."
                ]);
            }
        } catch (ValidationException $e) {
            return response()->json([
                "status" => false,
                "message" => $e->getMessage(),
                "errors" => $e->errors()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => false,
                "message" => "Bir hata oluştu: " . $e->getMessage()
            ]);
        }
    }

    /**
     * @param $customerId
     * @return Response|RedirectResponse
     */
    public function edit($customerId): Response|\Illuminate\Http\RedirectResponse
    {
        $customer = Customers::where('id', $customerId)->where('business_id', auth()->user()->id)->first(["id"]);
        if (!$customer) {
            return redirect()->route('business.customers.index')->with('message', 'Müşteri Bulunamadı.')->with('type', 'error')->with("title", "Hata");
        }
        return Inertia::render('Business/Customers/Edit', [
            'customerId' => $customer->id
        ]);
    }

    /**
     * @param Request $request
     * @param $id
     * @return JsonResponse
     */
    public function update(Request $request, $id): \Illuminate\Http\JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'phone' => 'required|string|max:15',
                'note' => 'nullable|string|max:500',
            ]);
            $customer = Customers::find($id);
            if (!$customer) {
                return response()->json([
                    "status" => false,
                    "message" => "Müşteri bulunamadı."
                ]);
            }
            $customer->name = $request->name;
            $customer->phone = $request->phone;
            $customer->note = $request->note ?? null;
            if ($customer->save()) {
                return response()->json([
                    "status" => true,
                    "message" => "Müşteri bilgileri başarıyla güncellendi."
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Müşteri bilgileri güncellenirken bir hata oluştu."
                ]);
            }
        } catch (ValidationException $e) {
            return response()->json([
                "status" => false,
                "message" => $e->getMessage(),
                "errors" => $e->errors()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => false,
                "message" => "Bir hata oluştu: " . $e->getMessage()
            ]);
        }
    }

    /**
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id): \Illuminate\Http\JsonResponse
    {
        try {
            $customer = Customers::find($id);
            if (!$customer) {
                return response()->json([
                    "status" => false,
                    "message" => "Müşteri bulunamadı."
                ]);
            }
            if ($customer->delete()) {
                return response()->json([
                    "status" => true,
                    "message" => "Müşteri başarıyla silindi."
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Müşteri silinirken bir hata oluştu."
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                "status" => false,
                "message" => "Bir hata oluştu: " . $e->getMessage()
            ]);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function multipleDestroy(Request $request): JsonResponse
    {
        $customers = Customers::where('business_id', auth()->user()->id)->whereIn('id', $request->ids);
        if ($customers) {
            $customers->delete();
            return response()->json([
                "status" => true,
                "message" => "Seçilen Müşteriler Silindi."
            ]);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Seçilen Müşteriler Silinemedi."
            ]);
        }
    }

    /**
     * @param $customerId
     * @return JsonResponse
     */
    public function getAdresses($customerId): \Illuminate\Http\JsonResponse
    {
        try {
            $addresses = CustomerAddresses::where('customer_id', $customerId)->get();
            return response()->json([
                "status" => true,
                "addresses" => $addresses
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => false,
                "message" => "Bir hata oluştu: " . $e->getMessage()
            ]);
        }
    }

    /**
     * @param Request $request
     * @param $customerId
     * @return JsonResponse
     */
    public function storeAdress(Request $request, $customerId): \Illuminate\Http\JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'phone' => 'required|string|max:15',
                'title' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'district' => 'required|string|max:255',
                'address' => 'required|string|max:500',
                'notes' => 'nullable|string|max:500',
            ]);
            $customer = Customers::find($customerId);
            if (!$customer) {
                return response()->json([
                    "status" => false,
                    "message" => "Müşteri bulunamadı."
                ]);
            }
            $customerAddress = new CustomerAddresses();
            $customerAddress->customer_id = $customerId;
            $customerAddress->phone = $request->phone;
            $customerAddress->title = $request->title;
            $customerAddress->city = $request->city;
            $customerAddress->district = $request->district;
            $customerAddress->address = $request->address;
            $customerAddress->notes = $request->notes ?? null;
            if ($customerAddress->save()) {
                return response()->json([
                    "status" => true,
                    "message" => "Adres başarıyla eklendi."
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Adres eklenirken bir hata oluştu."
                ]);
            }
        } catch (ValidationException $e) {
            return response()->json([
                "status" => false,
                "message" => $e->getMessage(),
                "errors" => $e->errors()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => false,
                "message" => "Bir hata oluştu: " . $e->getMessage()
            ]);
        }
    }

    /**
     * @param Request $request
     * @param $addressId
     * @return JsonResponse
     */
    public function updateAdress(Request $request, $addressId): \Illuminate\Http\JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'phone' => 'required|string|max:15',
                'title' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'district' => 'required|string|max:255',
                'address' => 'required|string|max:500',
                'notes' => 'nullable|string|max:500',
            ]);
            $address = CustomerAddresses::find($addressId);
            if (!$address) {
                return response()->json([
                    "status" => false,
                    "message" => "Adres bulunamadı."
                ]);
            }
            $address->phone = $request->phone;
            $address->title = $request->title;
            $address->city = $request->city;
            $address->district = $request->district;
            $address->address = $request->address;
            $address->notes = $request->notes ?? null;
            if ($address->save()) {
                return response()->json([
                    "status" => true,
                    "message" => "Adres başarıyla güncellendi."
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Adres güncellenirken bir hata oluştu."
                ]);
            }
        } catch (ValidationException $e) {
            return response()->json([
                "status" => false,
                "message" => $e->getMessage(),
                "errors" => $e->errors()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => false,
                "message" => "Bir hata oluştu: " . $e->getMessage()
            ]);
        }
    }

    /**
     * @param $addressId
     * @return JsonResponse
     */
    public function destroyAdress($addressId): \Illuminate\Http\JsonResponse
    {
        try {
            $address = CustomerAddresses::find($addressId);
            if (!$address) {
                return response()->json([
                    "status" => false,
                    "message" => "Adres bulunamadı."
                ]);
            }
            if ($address->delete()) {
                return response()->json([
                    "status" => true,
                    "message" => "Adres başarıyla silindi."
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Adres silinirken bir hata oluştu."
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                "status" => false,
                "message" => "Bir hata oluştu: " . $e->getMessage()
            ]);
        }
    }

}
