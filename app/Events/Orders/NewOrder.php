<?php

namespace App\Events\Orders;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewOrder implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $orderId = null;

    /**
     * Create a new event instance.
     */
    public function __construct($orderId)
    {
        $this->orderId = $orderId;
    }

    public function broadcastAS(): string
    {
        return "new-order";
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
