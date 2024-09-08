<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    protected $roles;

    public function __construct()
    {
        $this->roles = [];
    }

    public function handle($request, Closure $next, ...$roles)
    {
        $this->roles = $roles;

        if (Auth::check() && in_array(Auth::user()->role, $this->roles)) {
            return $next($request);
        }
        return Inertia::render('Auth/AccessDenied');
    }
}
