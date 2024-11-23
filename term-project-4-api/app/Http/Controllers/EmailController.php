<?php

namespace App\Http\Controllers;

use App\Mail\MailCode;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class EmailController extends Controller
{

    /**
     * class parameter
     */

    private $masterController;
    private $codeController;
    public function __construct()
    {
        $this->masterController = new MasterController();
        $this->codeController = new CodeController();
    }


    /**
     * email verification
     */

    public function emailVerification(Request $request)
    {
        try {
            $validator = Validator($request->all(), [
                'email' => 'required|email|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'verifide' => false,
                    'status' => 'error',
                    'message' => $validator->errors(),
                ], 400);
            }

            $emailVerification = User::where('email', $request->email)->first();

            $randomCode = rand(10000, 99999);
            $this->codeController->storeRandomCode($randomCode, $emailVerification->email);
            Mail::to($emailVerification->email)->send(new MailCode($randomCode));

            return response()->json([
                'verified' => true,
                'status' => 'success',
                'message' => 'Check the email'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'verified' => false,
                'status' => 'error',
                'message' => Str::limit($e->getMessage(), 150, '...'),
            ], 500);
        }
    }


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
