<?php

namespace App\Http\Controllers;

use App\Mail\MailCode;
use App\Models\EmailVerificationCode;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CodeController extends Controller
{

    private $masterController;
    public function __construct(){
        $this->masterController = new MasterController();
    }

    /**
     * random code store in json file and in table email verification code
     */

    public function storeRandomCode($randomCode, $email){

        $filePath = array();
        $data = [
            'email' => $email,
            'verification_code' => $randomCode,
            'created_at' => Carbon::now(),
        ];

        $extension = 'json';
        $encrytEmail = base64_encode($email);
        $encrytEmailWithExtension = $encrytEmail. '.' .$extension;
        $pathDestination = public_path('verification-code/'. $email);

        if (!file_exists($pathDestination)) {
            mkdir($pathDestination, 0777, true);  // Create directory with appropriate permissions
        }

        if(file_exists(public_path($pathDestination . '/' . $encrytEmailWithExtension))){
            $uuid = Str::uuid()->toString();
            $encrytEmailWithExtension = $uuid . '.' . $extension;
        }

        $filePath = $pathDestination . '/' . $encrytEmailWithExtension;

        // Write the data to the file in JSON format
        file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));
        $filePaths = $email .'/'. $encrytEmailWithExtension;
        $emailVerificationCodes = new EmailVerificationCode();
        $emailVerificationCodes->email = $email;
        $emailVerificationCodes->verification_code = $filePaths;
        $emailVerificationCodes->created_at = Carbon::now();
        $emailVerificationCodes->updated_at = Carbon::now();
        $emailVerificationCodes->save();
        return $data;
    }

    /**
     * code verification
     */

    public function codeVerifiaction(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|string|email',
                'verification_code' => 'required|numeric',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => $validator->errors()
                ], 400);
            }

            $verificationCode = EmailVerificationCode::where('email', $request->email)->first();
            if (isset($verificationCode->verification_code)) {
                // Construct the full path to the JSON file using the path stored in the database
                $filePath = public_path('verification-code/' . $verificationCode->verification_code);  // This points to 'public/user-code/{email}/{encryptedEmailWithExtension}.json'

                // Check if the file exists
                if (file_exists($filePath)) {
                    // Read the contents of the JSON file
                    $jsonContent = file_get_contents($filePath);
                    // Decode the JSON data
                    $storedData = json_decode($jsonContent, true);

                    // Compare the input code with the stored code in the JSON file
                    if ($storedData && isset($storedData['verification_code']) && $request->verification_code == $storedData['verification_code']) {
                        $users = User::where('email', $request->email)->first();
                        if ($users) {
                            $users->email_verified_at = Carbon::now();
                            $users->updated_at = Carbon::now();
                            $users->save();
                        }

                        if (isset($verificationCode->verification_code)) {
                            $verification_code = public_path('verification-code/' . $verificationCode->verification_code);
                            // Check if the JSON file exists in the directory
                            if (file_exists($verification_code)) {
                                // Delete the JSON file
                                unlink($verification_code);
                            }
                        }
                        $verificationCode->delete();

                        return response()->json([
                            'verified' => true,
                            'status' => 'success',
                            'message' => 'verification successfully',
                        ], 200);  // Redirect if the code matches
                    }

                    // If the code doesn't match, return an error response
                    return response()->json([
                        'success' => false,
                        'status' => 'error',
                        'message' => 'Invalid code provided.',
                    ], 400);
                }

                // If the file does not exist, return an error
                return response()->json([
                    'success' => false,
                    'status' => 'error',
                    'message' => 'Code file not found.',
                ], 404);
            }
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
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'verified' => false,
                'status' => 'error',
                'message' => $validator->errors()
            ], 400);
        }
        $randomCode = rand(100000, 999999);

        $this->storeRandomCode($randomCode, $request->email);
        Mail::to($request->email)->send(new MailCode($randomCode));
        return response()->json([
            'verified' => true,
            'status' => 'success',
            'message' => 'code created',
        ], 200);
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


    public function delete(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
        ]);
        if($validator->fails()){
            return response()->json([
                'verified' => false,
                'status' => 'error',
                'message' => $validator->errors()
            ], 400);
        }

        $emailVerificationCode = EmailVerificationCode::where('email', $request->email)->first();

        if(isset($emailVerificationCode->verification_code)){
            $verification_code = public_path('verification-code/'. $emailVerificationCode->verification_code);
            // Check if the JSON file exists in the directory
           if (file_exists($verification_code)) {
               // Delete the JSON file
               unlink($verification_code);
           }
        }
        $emailVerificationCode->delete();

        return response()->json([
            'verified' => true,
            'status' => 'success',
            'message' => 'code deleted',
        ], 200);
    }
}
