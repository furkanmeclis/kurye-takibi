<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Hesabınız zaten doğrulanmış!',
                'status' => true,
            ]);
        }
        try {
            $request->user()->sendEmailVerificationNotification();
            return response()->json([
                'message' => 'Doğrulama maili gönderildi!',
                'status' => true,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Doğrulama maili gönderilemedi!',
                'status' => false,
            ]);
        }


    }
}
