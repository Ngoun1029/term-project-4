<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Controllers\MasterController;
use App\Models\History;
use App\Models\User;
use App\Models\UserDetail;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class HistoryController extends Controller
{
    private $masterController;

    public function __construct()
    {
        $this->masterController = new MasterController();
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
     * Display the history.
     */
    public function view(Request $request)
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
                'page' => 'required|numeric',
                'range' => 'required|numeric',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => $validator->errors(),
                ], 400);
            }

            $page = $request->get('page', 1);
            Paginator::currentPageResolver(function () use ($page) {
                return $page;
            });
            if (Auth::user()->tokenCan('user:history-view')) {
                $users = Auth::user();

                // Fetch history data with pagination
                $historys = History::where('user_id', $users->id)
                    ->orderBy('created_at', 'desc')
                    ->paginate($request->range);

                // Fetch assign_user_id from histories
                $userAssignId = $historys->pluck('assign_user_id');

                // Fetch users and user details
                $user_assigns = User::whereIn('id', $userAssignId)->get()->keyBy('id');
                $userDetailAssignId = $user_assigns->pluck('id');
                $user_detail_assigns = UserDetail::whereIn('user_id', $userDetailAssignId)
                    ->get()
                    ->keyBy('user_id');

                // Map and append profile picture URLs
                $user_detail_assigns = $user_detail_assigns->map(function ($user_detail_assign) {
                    $user_detail_assign->profile_picture = $this->masterController->appendBaseUrl($user_detail_assign->profile_picture, 'user-profile');
                    return $user_detail_assign;
                });

                // Transform history collection
                $transformCollection = $historys->getCollection()->transform(function ($history) use ($user_assigns, $user_detail_assigns) {
                    // Get assigned user and their details
                    $user_assign = $user_assigns->get($history->assign_user_id) ?? null;
                    $user_detail_assign = $user_assign ? $user_detail_assigns->get($user_assign->id) : null;

                    // Add user and user detail information to history
                    if ($history !== null) {
                        $history['user_assign'] = $user_assign;
                        if ($user_assign) {
                            $user_assign['user_detail_assign'] = $user_detail_assign;
                        }
                    }

                    return $history; // Ensure the transformed history object is returned
                });

                // Set transformed collection back to history pagination
                $historys->setCollection($transformCollection);

                // Return JSON response
                return response()->json([
                    'verified' => true,
                    'status' => 'success',
                    'message' => 'found',
                    'data' => [
                        'result' => $historys,
                    ]
                ], 200);
            } else {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'no accessible'
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
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
            if(!Auth::check()){
                return response()->json([
                    'verified' =>false,
                    'status' => 'error',
                    'message' => 'please login'
                ]);
            }
            if (Auth::user()->tokenCan('user:history-view-detail')) {
                $historys = History::where('id', $id)->first();

                if ($historys !== null) {
                    $userAssignId = $historys->assign_user_id;

                    // Use where instead of whereIn for a single value
                    $user_assigns = User::where('id', $userAssignId)->get()->keyBy('id');

                    $userDetailAssignId = $user_assigns->pluck('id');
                    $user_detail_assigns = UserDetail::whereIn('user_id', $userDetailAssignId)->get()->keyBy('user_id');

                    $user_assign = $user_assigns->get($historys->assign_user_id) ?? null;
                    $user_detail_assign = $user_assign ? $user_detail_assigns->get($user_assign->id) : null;

                    $historys['user_assigns'] = $user_assign;

                    if ($user_assign) {
                        $user_assign['user_detail_assigns'] = $user_detail_assign;
                    }
                } else {
                    $historys = null;
                }

                return response()->json([
                    'verified' => true,
                    'status' => 'success',
                    'message' => 'found',
                    'data' => [
                        'result' => $historys,
                    ]
                ], 200);
            }


            // if(Auth::user()->tokenCan('user:history-view-detail')){
            //     $historys = History::where('id', $id)->first();
            //     $userAssignId = $historys->assign_user_id;
            //     $user_assigns = User::whereIn('id', $userAssignId)->get()->keyBy('id');
            //     $userDetailAssignId = $user_assigns->pluck('id');
            //     $user_detail_assigns = UserDetail::whereIn('user_id', $userDetailAssignId)->get()->keyBy('user_id');
            //     $user_assign = $user_assigns->get($historys->assign_user_id) ?? null;
            //     $user_detail_assign = $user_detail_assigns->get($user_assigns->id) ?? null;

            //     if($historys !== null){
            //         $historys['user_assigns'] = $user_assign;
            //         $user_assign['user_detail_assigns'] = $user_detail_assign;
            //     }
            //     else{
            //         $historys = null;
            //     }

            //     return response()->json([
            //         'verified' => true,
            //         'status' => 'success',
            //         'message' => 'foung',
            //         'data' => [
            //             'result' => $historys,
            //         ]
            //     ], 200);
            // }
            else{
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'no accessible',
                ], 403);
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
