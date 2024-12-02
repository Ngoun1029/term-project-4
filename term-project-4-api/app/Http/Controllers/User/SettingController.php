<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    /**
     * email changing
     */
    public function userInformationEdit(Request $request){
        try{
            if(!Auth::check()){
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'please login'
                ]);
            }
            $validator = Validator::make($request->all(), [
                'first_name' => 'nullable|string',
                'last_name'=>'nullable|string',
                'birthdate' => 'nullable|string',
                'contact' => 'nullable|string|regex:/^[0-9]+$/',
            ]);

            if($validator->fails()){
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => $validator->errors(),
                ], 400);
            }

            if(Auth::user()->tokenCan('user:information-edit')){
                if(!(empty($request->first_name) || empty($request->last_name))){
                    $users = User::where('id', Auth::user()->id)->first();
                    if(!$users){
                        return response()->json([
                            'verified' => false,
                            'status' => 'error',
                            'message' => 'forbidden'
                        ], 401);
                    }
                    $users->first_name = empty($request->first_name) | null ? $users->first_name : $request->first_name;
                    $users->last_name = empty($request->last_name) | null ? $users->last_name : $request->last_name;
                    $users->created_at = Carbon::now();
                    $users->save();
                    return response()->json([
                        'verified' => true,
                        'status' => 'success',
                        'message' => 'save',
                        'data' =>[
                            'result' => $users,
                        ]
                    ], 200);
                }

                if(!(empty($request->birth_date) || empty($request->contact))){
                    $user_details = UserDetail::where('user_id', Auth::user()->id)->first();
                    if(!$user_details){
                        return response()->json([
                            'verified' => false,
                            'status' => 'error',
                            'message' => 'forbidden'
                        ], 401);
                    }
                    $user_details->birthdate = empty($request->birth_date) | null ? $user_details->birthdate : $request->birthdate;
                    $user_details->contact = empty($request->contact) |null ? $user_details->contact : $request->contact;
                    $user_details->created_at = Carbon::now();
                    $user_details->save();
                    return response()->json([
                        'verified' => true,
                        'status' => 'success',
                        'message' => 'save',
                        'data' =>[
                            'result' => $user_details,
                        ]
                    ], 200);
                }
            }
            else{
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'no accessible'
                ],403);
            }
        }
        catch (Exception $e) {
            return response()->json([
                'verified' => false,
                'status' => 'error',
                'message' => Str::limit($e->getMessage(), 150, '...'),
            ], 500);
        }
    }

    /**
     * email changing
     */

    public function emailChange(Request $request)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'please login'
                ]);
            }
            $validator = Validator::make($request->all(), [
                'new_email' => 'required|string|email',
                'confirm_email' => 'required|string|email',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => $validator->errors(),
                ], 400);
            }

            if(strcmp($request->confirm_email, $request->email)){
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'email not match'
                ]);
            }

            if (Auth::user()->tokenCan('user:email-change')) {

                $users = User::where('id', Auth::user()->id)->first();
                if (!$users) {
                    return response()->json([
                        'verified' => false,
                        'status' => 'error',
                        'message' => 'forbidden',
                    ], 401);
                }
                $users->email = $request->email;
                $users->updated_at = Carbon::now();
                $users->save();
                return response()->json([
                    'verified' => true,
                    'status' => 'success',
                    'message' => 'save',
                    'data' => [
                        'result' => $users,
                    ]
                ], 200);
            } else {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'no accessible',
                ], 403);
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
     * password changing
     */
    public function passwordUpdateByEmailVerification(Request $request)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'please login'
                ]);
            }
            $validator = Validator::make($request->all(), [
                'new_password' => 'required|string',
                'confirm_password' => 'required|string',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => $validator->errors(),
                ], 400);
            }

            //password range checking
            if (strlen($request->new_password) < 8 || strlen($request->new_password) > 16) {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'password must be higher than 8 and lower than 16',
                ]);
            }

            //confirm password range checking
            if (strlen($request->confirm_password) < 8 || strlen($request->confirm_password) > 16) {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'password must be higher than 8 and lower than 16',
                ]);
            }

            if(strcmp($request->confirm_password, $request->new_password)){
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'password not match'
                ]);
            }

            if (Auth::user()->tokenCan('user:password-change')) {

                $users = User::where('id', Auth::user()->id)->first();
                if (!$users) {
                    return response()->json([
                        'verified' => false,
                        'status' => 'error',
                        'message' => 'forbidden',
                    ], 401);
                }
                $users->password = Hash::make($request->new_password);
                $users->updated_at = Carbon::now();
                $users->save();
                return response()->json([
                    'verified' => true,
                    'status' => 'success',
                    'message' => 'save',
                    'data' => [
                        'result' => $users,
                    ]
                ], 200);
            } else {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'no accessible',
                ], 403);
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
