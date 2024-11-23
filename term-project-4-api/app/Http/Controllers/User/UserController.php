<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Controllers\MasterController;
use App\Models\UserDetail;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class UserController extends Controller
{
    private $masterController;

    public function __construct(){
        $this->masterController = new MasterController();
    }

    /**
     * Display a listing of the resource.
     */
    public function profile()
    {
        try{
            if(!Auth::check()){
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'please login'
                ]);
            }

            if(Auth::user()->tokenCan('user:profile-view')){
                
                $users = Auth::user();
                $userId = $users->pluck('id');
                $user_details = UserDetail::whereIn('user_id', $userId)->get()->keyBy('user_id');
                $user_details = $user_details->map(function ($user_detail){
                    $user_detail->profile_picture = $this->masterController->appendBaseUrl($user_detail->profile_picture, 'user-profile');
                    return $user_detail;
                });
                $user_detail = $user_details->get($users->id) ?? null;
                if($users !== null){
                    $users['user_details'] = $user_detail;
                }
                else{
                    $users = null;
                }
                return response()->json([
                    'verified' => true,
                    'status' => 'success',
                    'message' => 'found',
                    'data' => [
                       'result' => $users
                    ]
                ], 200);
            }
            else{
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'no accessible'
                ], 403);
            }
        }
        catch(Exception $e){
            return response()->json([
                'verified' => false,
                'status' => 'error',
                'message' => Str::limit($e->getMessage(), 150, '...'),
            ],500);
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
