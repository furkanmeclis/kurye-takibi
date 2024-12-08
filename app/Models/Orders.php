<?php

namespace App\Models;

use App\Events\Orders\OrderEvent;
use App\Services\IntegrationHelper;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class Orders extends Model
{
    use HasFactory;

    public static int $earthRadius = 6371;

    public function businessDetails(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(BusinessDetails::class, 'business_id', 'business_id');
    }

    public static function getNearbyOrders($lat, $lon, $limit = false): Collection
    {
        $radius = 10;
        $earthRadius = self::$earthRadius;
        Session::put("courier_lat", $lat);
        Session::put("courier_lon", $lon);
        $instance = self::join('business_details', 'orders.business_id', '=', 'business_details.business_id')
            ->whereNotNull('business_details.latitude')
            ->whereNotNull('business_details.longitude')
            ->select(
                'orders.*',
                DB::raw("(
                $earthRadius * ACOS(
                    COS(RADIANS($lat)) * COS(RADIANS(business_details.latitude)) *
                    COS(RADIANS(business_details.longitude) - RADIANS($lon)) +
                    SIN(RADIANS($lat)) * SIN(RADIANS(business_details.latitude))
                )
            ) AS distance")
            )
            ->having('distance', '<=', $radius)
            ->where('orders.status', 'opened')
            ->orderBy('distance', 'asc');
        if ($limit !== false) {
            $instance = $instance->offset(0)->limit($limit);
        }
        return $instance->get()->map(function ($order) {
            $order->distance = round($order->distance, 2);
            $order->customer = Customers::find($order->customer_id);
            $order->address = CustomerAddresses::find($order->address_id);
            $order->start_location = json_decode($order->start_location);
            $order->end_location = json_decode($order->end_location);
            $order->courier = User::getCourier($order->courier_id);
            $order->business = User::getBusiness($order->business_id);
            if ($order->cancellation_accepted_by != null) {
                $order->cancellation_accepted_by = User::where('id', $order->cancellation_accepted_by)->first(["id", "name"]);
            }
            return $order;
        });
    }

    public static function calculateDistance($latFrom, $lonFrom, $latTo, $lonTo): float
    {
        $latFrom = deg2rad($latFrom);
        $lonFrom = deg2rad($lonFrom);
        $latTo = deg2rad($latTo);
        $lonTo = deg2rad($lonTo);
        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;
        $a = sin($latDelta / 2) * sin($latDelta / 2) +
            cos($latFrom) * cos($latTo) *
            sin($lonDelta / 2) * sin($lonDelta / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return round(self::$earthRadius * $c, 2);
    }

    public static function findOrder($id, $withDetails = false, $withLocations = false): object
    {
        $order = self::find($id);
        if ($order) {
            if (!Session::has("courier_lat") || !Session::has("courier_lon")) {
                return (object)[
                    "status" => false,
                    "message" => "Kurye Konumu Alınamadı",
                    "getLocation" => true
                ];
            } else {
                if (
                    $order->status != "opened" &&
                    auth()->user()->role == "courier" &&
                    auth()->user()->id != $order->courier_id
                ) {
                    return (object)[
                        "status" => false,
                        "message" => "Bu İşlemi Yapmaya Yetkiniz Yok"
                    ];
                }
                if ($withDetails) {
                    $latFrom = Session::get("courier_lat");
                    $lonFrom = Session::get("courier_lon");
                    $order->customer = Customers::find($order->customer_id);
                    $order->address = CustomerAddresses::find($order->address_id);
                    $order->start_location = json_decode($order->start_location);
                    $order->end_location = json_decode($order->end_location);
                    $order->courier = User::getCourier($order->courier_id);
                    $order->business = User::getBusiness($order->business_id);
                    if ($order->cancellation_accepted_by != null) {
                        $order->cancellation_accepted_by = User::where('id', $order->cancellation_accepted_by)->first(["id", "name"]);
                    }
                    $latTo = $order->business->details->latitude;
                    $lonTo = $order->business->details->longitude;
                    $order->distance = self::calculateDistance($latFrom, $lonFrom, $latTo, $lonTo);
                }
                if ($withLocations) {
                    $order->locations = OrderLocations::getLocations($order->id);
                }
                return (object)[
                    "status" => true,
                    "order" => $order,
                    "message" => $order->status != "opened" ? "Bu Sipariş Görüntülemeye Müsait Değildir" : "Sipariş Görüntülendi"
                ];
            }
        }
        return (object)[
            "status" => false,
            "message" => "Sipariş Bulunamadı"
        ];
    }

    public static function getCourierOrders($limit = false)
    {
        $courierId = auth()->user()->id;
        $instance = self::where('courier_id', $courierId)->orderBy('updated_at', 'desc');
        if ($limit !== false) {
            $instance = $instance->offset(0)->limit($limit);
        }
        return $instance->get()->map(function ($order) {
            $order->customer = Customers::find($order->customer_id);
            $order->address = CustomerAddresses::find($order->address_id);
            $order->start_location = json_decode($order->start_location);
            $order->end_location = json_decode($order->end_location);
            $order->courier = User::getCourier($order->courier_id);
            $order->business = User::getBusiness($order->business_id);
            if ($order->cancellation_accepted_by != null) {
                $order->cancellation_accepted_by = User::where('id', $order->cancellation_accepted_by)->first(["id", "name"]);
            }
            return $order;
        });
    }

    public static function getCourierStatics(int $days = 7): object
    {
        $courierId = auth()->user()->id;
        $startDate = Carbon::now()->subDays($days);
        $orders = self::where('courier_id', $courierId)
            ->where('status', "delivered")
            ->where('updated_at', '>=', $startDate)
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($order) {
                $acceptedAt = Carbon::parse($order->courier_accepted_at);
                $deliveredAt = Carbon::parse($order->delivered_at);
                $hours = $acceptedAt->diffInHours($deliveredAt);
                $start_location = json_decode($order->start_location);
                $end_location = json_decode($order->end_location);
                $distance = self::calculateDistance(
                    $start_location->latitude,
                    $start_location->longitude,
                    $end_location->latitude,
                    $end_location->longitude);
                $order->average_speed = $hours > 0 ? $distance / $hours : 0;
                $order->delivery_time = $acceptedAt->diffInMinutes($deliveredAt);
                return $order;
            });
        $sumSpeed = 0;
        $sumTime = 0;
        $sumPrice = 0;
        $ordersCount = count($orders);

        foreach ($orders as $order) {
            $sumSpeed += $order->average_speed;
            $sumTime += $order->delivery_time;
            $sumPrice += $order->price;
        }

        $averageSpeed = $ordersCount > 0 ? ($sumSpeed / $ordersCount) : 0;
        $averageTime = $ordersCount > 0 ? ($sumTime / $ordersCount) : 0;
        $daysArray = [
            "monday" => 0,
            "tuesday" => 0,
            "wednesday" => 0,
            "thursday" => 0,
            "friday" => 0,
            "saturday" => 0,
            "sunday" => 0,
        ];
        $weekOfYear = Carbon::now()->weekOfYear;
        $thisWeekCounts = [...$daysArray];
        $lastWeekCounts = [...$daysArray];
        $thisWeekPrices = [...$daysArray];
        $lastWeekPrices = [...$daysArray];
        $thisWeekTimes = [...$daysArray];
        $lastWeekTimes = [...$daysArray];
        foreach ($orders as $order) {
            $day = strtolower(Carbon::parse($order->updated_at)->format("l"));
            $week = Carbon::parse($order->updated_at)->weekOfYear;
            if ($week == $weekOfYear) {
                $thisWeekCounts[$day]++;
                $thisWeekPrices[$day] += round($order->price, 2);
                $thisWeekTimes[$day] += $order->delivery_time;
            } elseif ($week == $weekOfYear - 1) {
                $lastWeekCounts[$day]++;
                $lastWeekPrices[$day] += round($order->price, 2);
                $lastWeekTimes[$day] += $order->delivery_time;
            }
        }
        return (object)[
            "price" => $sumPrice,
            "speed" => round($averageSpeed, 2),
            "time" => round($averageTime, 2),
            "count" => $ordersCount,
            "graph" => [
                "thisWeek" => [
                    "prices" => array_values($thisWeekPrices),
                    "counts" => array_values($thisWeekCounts),
                    "times" => array_values($thisWeekTimes)
                ],
                "lastWeek" => [
                    "prices" => array_values($lastWeekPrices),
                    "counts" => array_values($lastWeekCounts),
                    "times" => array_values($lastWeekTimes)
                ]
            ]
        ];
    }

    public static function generateOrderNumber($businessId): string
    {
        // Gün numarasını al (Carbon ile)
        $dayOfYear = Carbon::now()->dayOfYear; // Yılın günü (1-365)
        $dayOfYear = str_pad($dayOfYear, 3, '0', STR_PAD_LEFT);
        // Günlük sıralama numarasını belirleyin (Carbon ile)
        $todayDate = Carbon::now()->toDateString(); // Yalnızca bugünün tarihi
        $orderCountToday = self::whereDate('created_at', $todayDate)->where("business_id", $businessId)->count() + 1;
        $orderCountToday = str_pad($orderCountToday, 3, '0', STR_PAD_LEFT);

        // Sipariş numarasını oluştur
        return "W{$businessId}-{$dayOfYear}-{$orderCountToday}";
    }

    /**
     * @throws \Exception
     */
    public static function matchTrendyolOrders($trendyolContent, $businessId = false): object
    {
        if (!$businessId) {
            $business = auth()->user();
        } else {
            $business = User::find($businessId);
        }
        $businessDetails = $business->details();
        $trendyolContent = json_decode(json_encode($trendyolContent));
        $addedOrdersCount = 0;
        $existOrdersCount = 0;
        foreach ($trendyolContent as $order) {
            $controlOrder = self::where('marketplace_order_id', $order->id)->first();
            if ($controlOrder) {
                $newStatus = (new Orders)->mapOrderStatusTrendyol($order->packageStatus);
                if ($controlOrder->status != $newStatus) {
                    $controlOrder->status = $newStatus;
                    $controlOrder->updated_at = Carbon::createFromTimestamp($order->lastModifiedDate / 1000);
                    if ($order->packageStatus == "Delivered") {
                        $controlOrder->courier_accepted_at = Carbon::createFromTimestamp($order->lastModifiedDate / 1000);
                        $controlOrder->delivered_at = Carbon::createFromTimestamp($order->packageModificationDate / 1000);
                    }
                    if ($order->packageStatus == "Cancelled") {
                        $controlOrder->cancellation_accepted_by = User::where('role', "admin")->first(["id"])->id;
                        $controlOrder->canceled_at = Carbon::createFromTimestamp($order->lastModifiedDate / 1000);
                        if (isset($order->cancelInfo)) {
                            $controlOrder->cancellation_reason = IntegrationHelper::getCancellationReasonForTrendyol($order->cancelInfo->reasonCode);
                        } else {
                            $controlOrder->cancellation_reason = "Bilinmeyen Sebep";
                        }
                        $controlOrder->cancellation_requested_by = "business";
                        $controlOrder->cancellation_accepted = 1;
                        $controlOrder->cancellation_rejected = 0;
                    }
                    $controlOrder->save();
                    $existOrdersCount++;
                } else {
                    $existOrdersCount++;
                }
            } else {
                $controlCustomer = Customers::where('marketplace_id', $order->customer->id)->first();
                if ($controlCustomer) {
                    $customer = $controlCustomer;
                } else {
                    $customer = new Customers();
                    $customer->business_id = $business->id;
                    $customer->name = $order->customer->firstName . " " . $order->customer->lastName;
                    $customer->marketplace_id = $order->customer->id . $business->id;
                    $customer->phone = (new Orders)->formatPhoneNumberForTrendyol($order->callCenterPhone);
                    $customer->note = "Trendyol Müşterisi";
                    $customer->save();
                }
                $controlAddress = CustomerAddresses::where('marketplace_id', $order->customer->id)->where("notes", $order->address->addressDescription)->first();
                if ($controlAddress) {
                    $address = $controlAddress;
                    $address->note = $order->address->addressDescription;
                    $address->save();
                } else {
                    $addressParts = [
                        $order->address->neighborhood ?? null,
                        $order->address->address1 ?? null,
                        $order->address->address2 ?? null,
                        $order->address->addressDescription ?? null,
                        ($order->address->floor ? $order->address->floor . ". Kat" : null),
                        ($order->address->doorNumber ? "Daire " . $order->address->doorNumber : null),
                        $order->address->district ?? null,
                        $order->address->city ?? null,
                        $order->address->postalCode ?? null
                    ];
                    $address = new CustomerAddresses();
                    $address->customer_id = $customer->id;
                    $address->marketplace_id = $order->customer->id . $business->id;
                    $address->phone = (new Orders)->formatPhoneNumberForTrendyol($order->address->phone);
                    $address->title = "Trendyol Adresi";
                    $address->city = $order->address->city;
                    $address->district = $order->address->district;
                    $address->address = implode(", ", array_filter($addressParts));
                    $address->notes = $order->address->addressDescription;
                    $address->save();
                }
                $newOrder = new Orders();
                $newOrder->business_id = $business->id;
                $newOrder->customer_id = $customer->id;
                $newOrder->address_id = $address->id;
                $newOrder->customer_note = $order->customerNote;
                $newOrder->order_number = "T" . $business->id . "-" . $order->orderNumber;
                $newOrder->start_location = json_encode([
                    "latitude" => $businessDetails->latitude,
                    "longitude" => $businessDetails->longitude
                ]);
                $newOrder->status = (new Orders)->mapOrderStatusTrendyol($order->packageStatus);
                $newOrder->marketplace = "trendyol";
                $newOrder->marketplace_order_id = $order->id;
                $newOrder->marketplace_customer = json_encode([
                    "id" => $order->customer->id,
                    "customer" => $order->customer,
                    "address" => $order->address
                ]);
                $newOrder->marketplace_order_details = json_encode($order);
                $newOrder->price = IntegrationHelper::getTrendyolClient($businessId)->settings->defaultPackagePrice;
                $newOrder->updated_at = Carbon::createFromTimestamp($order->lastModifiedDate / 1000);
                $newOrder->created_at = Carbon::createFromTimestamp($order->packageCreationDate / 1000);
                if ($order->packageStatus == "Delivered") {
                    $newOrder->courier_accepted_at = Carbon::createFromTimestamp($order->lastModifiedDate / 1000);
                    $newOrder->delivered_at = Carbon::createFromTimestamp($order->packageModificationDate / 1000);
                }
                if ($order->packageStatus == "Cancelled") {
                    $newOrder->cancellation_accepted_by = User::where('role', "admin")->first(["id"])->id;
                    $newOrder->canceled_at = Carbon::createFromTimestamp($order->lastModifiedDate / 1000);
                    if (isset($order->cancelInfo)) {
                        $newOrder->cancellation_reason = IntegrationHelper::getCancellationReasonForTrendyol($order->cancelInfo->reasonCode);
                    } else {
                        $newOrder->cancellation_reason = "Bilinmeyen Sebep";
                    }
                    $newOrder->cancellation_requested_by = "business";
                    $newOrder->cancellation_accepted = 1;
                    $newOrder->cancellation_rejected = 0;
                }
                if ($newOrder->save()) {
                    if ($order->packageStatus == "Created") {
                        $newOrder->approveOrder();
                    }
                    $message = (object)[
                        "title" => "Yeni Sipariş",
                        "message" => "Yeni bir sipariş oluşturuldu. Sipariş No: " . $newOrder->order_number,
                        "severity" => "success"
                    ];
                    broadcast(new OrderEvent($newOrder->business_id, $message, true, false, true, "business"))->toOthers();
                    $addedOrdersCount++;
                } else {
                    $existOrdersCount++;
                }
            }
        }
        if (count($trendyolContent) == ($addedOrdersCount + $existOrdersCount)) {
            return (object)[
                "status" => true,
                "message" => "Trendyol Siparişleri Eşleştirildi"
            ];
        } else {
            return (object)[
                "status" => false,
                "message" => "Toplamda " . count($trendyolContent) . " Siparişten " . $addedOrdersCount . " Sipariş Eşleştirildi"
            ];
        }
    }

    public function mapOrderStatusTrendyol($apiStatus): string
    {
        switch ($apiStatus) {
            case 'Created':
                return 'draft';
            case 'Picking':
                return 'preparing';
            case 'Invoiced':
                return 'opened';
            case 'Shipped':
                return 'transporting';
            case 'Delivered':
                return 'delivered';
            case 'Returned':
                return 'canceled';
            case 'Cancelled':
                return 'canceled';
            case 'UnSupplied':
                return 'canceled';
            default:
                return "draft"; // Bilinmeyen bir durum için
        }
    }

    public function formatPhoneNumberForTrendyol($phoneNumber): string
    {
        $phoneNumber = str_replace(" ", "", $phoneNumber);
        if (str_starts_with($phoneNumber, "0")) {
            $phoneNumber = substr($phoneNumber, 1);
        }
        if (strlen($phoneNumber) != 10) {
            return $phoneNumber;
        }
        return sprintf("(%s)-%s-%s",
            substr($phoneNumber, 0, 3),
            substr($phoneNumber, 3, 3),
            substr($phoneNumber, 6)
        );
    }

    /**
     * @throws \Exception
     */
    public function approveOrder()
    {
        if ($this->marketplace == "trendyol") {
            $trendyol = IntegrationHelper::getTrendyolClient($this->business_id);
            if ($trendyol->status) {
                if ($trendyol->settings->autoApprove) {
                    return $trendyol->client->acceptOrder($this->marketplace_order_id, $trendyol->settings->preparationTime);
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public static function getBusinessStats(int $days = 7): object
    {
        $businessId = auth()->id();
        $startDate = Carbon::now()->subDays($days);
        $orders = self::where('business_id', $businessId)
            ->where('status', 'delivered')
            ->where('updated_at', '>=', $startDate)
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($order) {
                $acceptedAt = Carbon::parse($order->courier_accepted_at);
                $deliveredAt = Carbon::parse($order->delivered_at);
                $order->delivery_time = $acceptedAt->diffInMinutes($deliveredAt);
                return $order;
            });
        $sumTime = 0;
        $ordersCount = count($orders);
        foreach ($orders as $order) {
            $sumTime += $order->delivery_time;
        }
        $averageTime = $ordersCount > 0 ? ($sumTime / $ordersCount) : 0;
        $daysArray = [
            "monday" => 0,
            "tuesday" => 0,
            "wednesday" => 0,
            "thursday" => 0,
            "friday" => 0,
            "saturday" => 0,
            "sunday" => 0,
        ];
        $weekOfYear = Carbon::now()->weekOfYear;
        $thisWeekCounts = [...$daysArray];
        $lastWeekCounts = [...$daysArray];
        $thisWeekTimes = [...$daysArray];
        $lastWeekTimes = [...$daysArray];
        foreach ($orders as $order) {
            $day = strtolower(Carbon::parse($order->updated_at)->format("l"));
            $week = Carbon::parse($order->updated_at)->weekOfYear;
            if ($week == $weekOfYear) {
                $thisWeekCounts[$day]++;
                $thisWeekTimes[$day] += $order->delivery_time;
            } elseif ($week == $weekOfYear - 1) {
                $lastWeekCounts[$day]++;
                $lastWeekTimes[$day] += $order->delivery_time;
            }
        }
        // average times
        foreach ($thisWeekTimes as $key => $value) {
            $thisWeekTimes[$key] = $thisWeekCounts[$key] > 0 ? $value / $thisWeekCounts[$key] : 0;
        }
        foreach ($lastWeekTimes as $key => $value) {
            $lastWeekTimes[$key] = $lastWeekCounts[$key] > 0 ? $value / $lastWeekCounts[$key] : 0;
        }
        return (object)[
            "time" => round($averageTime, 2),
            "count" => $ordersCount,
            "courierWaitOrdersCount" => self::where('business_id', $businessId)->where('status', 'opened')->count(),
            "customerCount" => Customers::where('business_id', $businessId)->count(),
            "graph" => [
                "thisWeek" => [
                    "counts" => array_values($thisWeekCounts),
                    "times" => array_values($thisWeekTimes)
                ],
                "lastWeek" => [
                    "counts" => array_values($lastWeekCounts),
                    "times" => array_values($lastWeekTimes)
                ]
            ]
        ];
    }

    /**
     * @throws \Exception
     */
    public function finishPrepare(): bool
    {
        if ($this->marketplace == "trendyol") {
            $trendyol = IntegrationHelper::getTrendyolClient($this->business_id);
            if ($trendyol->status) {
                $res = $trendyol->client->finishPrepareOrder($this->marketplace_order_id);
                if ($res) {
                    $this->status = "opened";
                    return $this->save();
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } elseif ($this->marketplace == "web") {
            $this->status = "opened";
            return $this->save();
        } else {
            return false;
        }

    }

    /**
     * @throws \Exception
     */
    public function startTransporting(): bool
    {
        if ($this->marketplace == "trendyol") {
            $trendyol = IntegrationHelper::getTrendyolClient($this->business_id);
            if ($trendyol->status) {
                $res = $trendyol->client->shipOrder($this->marketplace_order_id);
                if ($res) {
                    $this->courier_accepted_at = Carbon::now();
                    $this->status = "transporting";
                    return $this->save();
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } elseif ($this->marketplace == "web") {
            $this->status = "transporting";
            $this->courier_accepted_at = Carbon::now();
            return $this->save();
        } else {
            return false;
        }
    }

    /**
     * @throws \Exception
     */
    public function deliveryOrder(): bool
    {
        if ($this->marketplace == "trendyol") {
            $trendyol = IntegrationHelper::getTrendyolClient($this->business_id);
            if ($trendyol->status) {
                $res = $trendyol->client->deliverOrder($this->marketplace_order_id);
                if ($res) {
                    $this->delivered_at = Carbon::now();
                    $this->status = "delivered";
                    return $this->save();
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } elseif ($this->marketplace == "web") {
            $this->status = "delivered";
            $this->delivered_at = Carbon::now();
            return $this->save();
        } else {
            return false;
        }
    }

    public static function getAdminOrderStatics($days): object
    {
        $startDate = Carbon::now()->subDays($days);
        $orders = self::where('status', 'delivered')
            ->where('updated_at', '>=', $startDate)
            ->orderBy('updated_at', 'desc')
            ->get();
        $ordersCount = count($orders);
        $daysArray = [
            "monday" => 0,
            "tuesday" => 0,
            "wednesday" => 0,
            "thursday" => 0,
            "friday" => 0,
            "saturday" => 0,
            "sunday" => 0,
        ];
        $weekOfYear = Carbon::now()->weekOfYear;
        $thisWeekCounts = [...$daysArray];
        $lastWeekCounts = [...$daysArray];
        foreach ($orders as $order) {
            $day = strtolower(Carbon::parse($order->updated_at)->format("l"));
            $week = Carbon::parse($order->updated_at)->weekOfYear;
            if ($week == $weekOfYear) {
                $thisWeekCounts[$day]++;
            } elseif ($week == $weekOfYear - 1) {
                $lastWeekCounts[$day]++;
            }
        }
        return (object)[
            "count" => $ordersCount,
            "graph" => [
                "thisWeek" => array_values($thisWeekCounts),
                "lastWeek" => array_values($lastWeekCounts),
            ]
        ];
    }

    public static function createBusinessExportData($orders, $startDate, $endDate): array
    {
        $statuses = [
            'draft' => [
                'label' => 'Taslak',
                'severity' => 'secondary'
            ],
            'preparing' => [
                'label' => 'Hazırlanıyor',
                'severity' => 'warning'
            ],
            'opened' => [
                'label' => 'Açık',
                'severity' => 'warning'
            ],
            'transporting' => [
                'label' => 'Taşımada',
                'severity' => 'info'
            ],
            'delivered' => [
                'label' => 'Teslim Edildi',
                'severity' => 'success'
            ],
            'canceled' => [
                'label' => 'İptal Edildi',
                'severity' => 'danger'
            ],
            'deleted' => [
                'label' => 'Silindi',
                'severity' => 'danger'
            ],
        ];
        $business = User::find($orders[0]->business_id);
        $data = [[]];
        $totalPrice = 0;
        foreach ($orders as $order) {
            $customer = Customers::find($order->customer_id);
            $data[] = (object)[
                "orderNumber" => $order->order_number,
                "businessName" => $business->name,
                "businessPhone" => $business->phone,
                "customerName" => $customer->name,
                "customerPhone" => $customer->phone,
                "courierName" => $order->courier_id ? User::find($order->courier_id)->name : "Kurye Atanmadı",
                "status" => $statuses[$order->status]['label'] ?? "Bilinmeyen Durum",
                "price" => $order->price . " ₺",
                "marketplace" => $order->marketplace,
                "createdAt" => $order->created_at->format("d.m.Y H:i:s"),
                "updatedAt" => $order->updated_at->format("d.m.Y H:i:s"),
            ];
            $totalPrice += $order->price;
        }
        $data[0] = (object)[
            "orderNumber" => "Tarih Aralığı",
            "businessName" => $startDate . " - " . $endDate,
            "businessPhone" => "",
            "customerName" => "",
            "customerPhone" => "",
            "courierName" => "",
            "status" => "",
            "price" => "",
            "marketplace" => "",
            "createdAt" => "Oluşturulma Tarihi",
            "updatedAt" => date("d.m.Y H:i:s"),
        ];
        $data[] = (object)[
            "orderNumber" => "Toplam",
            "businessName" => "",
            "businessPhone" => "",
            "customerName" => "",
            "customerPhone" => "",
            "courierName" => "",
            "status" => "",
            "price" => $totalPrice . " ₺",
            "marketplace" => "",
            "createdAt" => "Oluşturulma Tarihi",
            "updatedAt" => date("d.m.Y H:i:s"),
        ];
        return ($data);
    }
    public static function createCourierExportData($orders, $startDate, $endDate): array
    {
        $statuses = [
            'draft' => [
                'label' => 'Taslak',
                'severity' => 'secondary'
            ],
            'preparing' => [
                'label' => 'Hazırlanıyor',
                'severity' => 'warning'
            ],
            'opened' => [
                'label' => 'Açık',
                'severity' => 'warning'
            ],
            'transporting' => [
                'label' => 'Taşımada',
                'severity' => 'info'
            ],
            'delivered' => [
                'label' => 'Teslim Edildi',
                'severity' => 'success'
            ],
            'canceled' => [
                'label' => 'İptal Edildi',
                'severity' => 'danger'
            ],
            'deleted' => [
                'label' => 'Silindi',
                'severity' => 'danger'
            ],
        ];
        $courier = User::find($orders[0]->courier_id);
        $data = [[]];
        $totalPrice = 0;
        foreach ($orders as $order) {
            $business = User::find($order->business_id);
            $customer = Customers::find($order->customer_id);
            $data[] = (object)[
                "orderNumber" => $order->order_number,
                "courierName" => $courier->name,
                "businessName" => $business->name,
                "businessPhone" => $business->phone,
                "customerName" => $customer->name,
                "customerPhone" => $customer->phone,
                "status" => $statuses[$order->status]['label'] ?? "Bilinmeyen Durum",
                "price" => $order->price . " ₺",
                "marketplace" => $order->marketplace,
                "createdAt" => $order->created_at->format("d.m.Y H:i:s"),
                "updatedAt" => $order->updated_at->format("d.m.Y H:i:s"),
            ];
            $totalPrice += $order->price;
        }
        $data[0] = (object)[
            "orderNumber" => "Tarih Aralığı",
            "businessName" => $startDate . " - " . $endDate,
            "businessPhone" => "",
            "customerName" => "",
            "customerPhone" => "",
            "courierName" => "",
            "status" => "",
            "price" => "",
            "marketplace" => "",
            "createdAt" => "Oluşturulma Tarihi",
            "updatedAt" => date("d.m.Y H:i:s"),
        ];
        $data[] = (object)[
            "orderNumber" => "Toplam",
            "businessName" => "",
            "businessPhone" => "",
            "customerName" => "",
            "customerPhone" => "",
            "courierName" => "",
            "status" => "",
            "price" => $totalPrice . " ₺",
            "marketplace" => "",
            "createdAt" => "Oluşturulma Tarihi",
            "updatedAt" => date("d.m.Y H:i:s"),
        ];
        return ($data);
    }
}
