<?php

namespace App\Services;

use Pusher\PusherException;

class EventEmitter
{
    protected static $pusher = null;
    protected static $channel = null;
    protected static $event = null;
    protected static $data = null;

    /**
     * @throws PusherException
     */
    protected static function init(): ?\Pusher\Pusher
    {
        self::$pusher = new \Pusher\Pusher(
            env('PUSHER_APP_KEY'),
            env('PUSHER_APP_SECRET'),
            env('PUSHER_APP_ID'),
            [
                'cluster' => env('PUSHER_APP_CLUSTER'),
                'useTLS' => true
            ]
        );
        return self::$pusher;
    }

    public static function channel($channelName): EventEmitter
    {
        self::init();
        self::$channel = $channelName;
        return new self;
    }

    public function event($eventName): static
    {
        self::$event = $eventName;
        return $this;
    }

    public function data($data): static
    {
        self::$data = $data;
        return $this;
    }

    public function dispatch(): void
    {
        self::$pusher->trigger(self::$channel, self::$event, self::$data);
    }

}
