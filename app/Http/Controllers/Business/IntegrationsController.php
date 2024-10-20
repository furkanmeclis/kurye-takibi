<?php

namespace App\Http\Controllers\Business;

use Inertia\Inertia;

class IntegrationsController
{
    public function show(): \Inertia\Response
    {
        return Inertia::render('Business/Integrations');
    }
}
