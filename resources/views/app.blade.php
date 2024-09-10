<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="manifest" href="/manifest.json">
    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- begin:Theme Styles -->
    <link id="theme-link" href="/theme/theme-light/yellow/theme.css" rel="stylesheet"/>
    <!-- end:Theme Styles -->
    <!-- begin:Theme Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
    <!-- end:Theme Scripts -->
    <!-- begin:Pusher Beam -->
    <script src="https://js.pusher.com/beams/1.0/push-notifications-cdn.js"></script>
    <!-- end:Pusher Beam -->
</head>
<body>
@inertia
<script>
    const beamsClient = new PusherPushNotifications.Client({
        instanceId: 'ada43e68-9d69-43c9-b0f1-ef26f8afcfce',

    });

    beamsClient.start()
        .then(() => beamsClient.getDeviceId())
        .then(() => beamsClient.addDeviceInterest('hello'))
        .then(() => console.log('Successfully registered and subscribed!'))
        .catch(console.error);
</script>
</body>
</html>
