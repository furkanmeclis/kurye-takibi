<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $useProfileCompleted = (object)[
            "completed" => false,
            "approved" => false,
        ];
        if ($request->user()) {
            $useProfileCompleted = $request->user()->profile_completed();
        }
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'profile_completed' => $useProfileCompleted->completed,
                'profile_approved' => $useProfileCompleted->approved,
            ],
            'csrfToken' => csrf_token(),
            'flash' => [
                'message' => fn() => $request->session()->get('message'),
                'type' => fn() => $request->session()->get('type'),
                'title' => fn() => $request->session()->get('title'),
            ],
            'courierIsTransporting' => $this->courierIsTransporting()
        ];
    }

    public function courierIsTransporting()
    {
        $user = auth()->user();
        return $user && $user->role == "courier" ? $user->isTransporting() : false;
    }
}
