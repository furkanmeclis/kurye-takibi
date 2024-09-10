<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use App\Models\CustomerAdresses;
use App\Models\Customers;
use App\Models\Orders;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Inertia\ResponseFactory;

class OrdersController extends Controller
{
    /**
     * @return Response|ResponseFactory
     */
    public function index(): Response|ResponseFactory
    {
        return Inertia::render('Business/Orders/All');
    }

    public function listOrders(Request $request): \Illuminate\Http\JsonResponse
    {
        $orders = Orders::where('business_id', auth()->user()->id)->get();
        return response()->json([
            'orders' => $orders,
            'status' => true
        ]);
    }

    public function create(): Response|ResponseFactory
    {
        return Inertia::render('Business/Orders/Create');
    }

    public function store()
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
            $customerAddress = new CustomerAdresses();
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
        }
    }
}
