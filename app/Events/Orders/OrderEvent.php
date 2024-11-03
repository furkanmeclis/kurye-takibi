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

class OrderEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $businessId = null;
    public $title = null;
    public $message = null;
    public $severity = null;
    public $reload = false;
    public $onlyLocation = false;
    public $showMessage = true;
    public $playSound = false;
    public $forRole = null;


    /**
     * Create a new event instance.
     */
    public function __construct($businessId, $message = null, $reload = false, $onlyLocation = false, $playSound = false, $forRole = "business")
    {
        $this->forRole = $forRole;
        $this->businessId = $businessId;
        if ($message == null) {
            $this->showMessage = false;
        } else {
            $this->title = $message->title;
            $this->message = $message->message;
            $this->severity = $message->severity;
        }
        $this->reload = $reload;
        $this->onlyLocation = $onlyLocation;
        $this->playSound = $playSound;
    }

    public function broadcastAS(): string
    {
        return "order-event";
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('order-channel'),
        ];
    }
}
