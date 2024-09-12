<?php

namespace App\Events\Orders;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UpdateOrder implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $orderId = null;
    public $severity = null;
    public $message = null;
    public $title = null;
    public $reload = false;
    public $businessId = null;

    /**
     * Create a new event instance.
     */
    public function __construct($orderId, $severity, $message, $title, $reload, $businessId)
    {
        $this->orderId = $orderId;
        $this->severity = $severity;
        $this->message = $message;
        $this->title = $title;
        $this->reload = $reload;
        $this->businessId = $businessId;
    }

    public function broadcastAS(): string
    {
        if ($this->orderId == null) {
            return "update-order-business-" . $this->businessId;
        }
        return "update-order-" . $this->orderId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel("order-channel"),
        ];
    }
}
