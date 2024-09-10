<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use NotificationChannels\PusherPushNotifications\PusherChannel;
use NotificationChannels\PusherPushNotifications\PusherMessage;

class Example extends Notification
{

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }
    public function via($notifiable): array
    {
        return [PusherChannel::class];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toPushNotification($notifiable)
    {
        return PusherMessage::create()
            ->web()
            ->title("Deneme")
            ->body("Your account was approved!");
    }
}
