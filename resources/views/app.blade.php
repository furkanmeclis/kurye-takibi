<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
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
</head>
<body>
@inertia
</body>
</html>
