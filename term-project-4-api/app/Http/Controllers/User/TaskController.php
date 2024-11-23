<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Controllers\MasterController;
use App\Models\Task;
use App\Models\User;
use App\Models\UserDetail;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TaskController extends Controller
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
        try {
            if (!Auth::check()) {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'please login'
                ]);
            }

            $validator = Validator::make($request->all(), [
                'categories' => 'required|string',
                'title' => 'required|string',
                'description' => 'required|string',
                'deadline' => 'required|string',
                'emergent_level' => 'required|numeric',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => $validator->errors(),
                ], 400);
            }

            if (Auth::user()->tokenCan('user:task-create')) {
                $users = Auth::user();
                $tasks = new Task();
                $tasks->user_id = $users->id;
                $tasks->categories = $request->categories;
                $tasks->title = $request->title;
                $tasks->description = $request->description;
                $tasks->deadline = $request->deadline;
                $tasks->emergent_level = $request->emergent_level;
                $tasks->progress = 'pending';
                $tasks->created_at = Carbon::now();
                $tasks->updated_at = Carbon::now();
                $tasks->save();
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'task have create successfully',
                    'data' => [
                        'result' => $tasks,
                    ]
                ], 200);
            } else {
                return response()->json([
                    'verified' => false,
                    'status ' => 'error',
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
     * display all task of specific user
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
                    'message' => $validator->errors()
                ], 400);
            }

            $page = $request->get('page', 1);
            Paginator::currentPageResolver(function () use ($page) {
                return $page;
            });


            if (Auth::user()->tokenCan('user:task-view')) {
                $tasks = Task::where('user_id', Auth::user()->id)->orderBy('created_at', 'desc')->paginate($request->range);
                $userId = $tasks->pluck('user_id');
                $users = User::whereIn('id', $userId)->get()->keyBy('id');
                $userDetailId = $users->pluck('id');
                $user_details = UserDetail::whereIn('user_id', $userDetailId)->get()->keyBy('user_id');
                $user_details = $user_details->map(function ($user_detail) {
                    $user_detail->profile_picture = $this->masterController->appendBaseUrl($user_detail->profile_picture, 'user-profile');
                    return $user_detail;
                });
                $tranFormCollection = $tasks->getCollection()->transform(function ($task) use ($tasks, $user_details, $users) {
                    $user = $users->get($task->user_id) ?? null;
                    $user_detail = $user_details->get($user->id) ?? null;
                    if ($task !== null) {
                        $task['users'] = $user;
                        $user['user_details'] = $user_detail;
                    } else {
                        $task = null;
                    }
                    return $task;
                });
                $tasks->setCollection($tranFormCollection);
                return response()->json([
                    'verified' => true,
                    'status' => 'success',
                    'message' => 'found',
                    'data' => [
                        'result' => $tasks,
                    ]
                ], 200);
            } else {
                return response()->json([
                    'verified' => false,
                    'status ' => 'error',
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
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
            if (!Auth::check()) {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'please login'
                ]);
            }

            if(Auth::user()->tokenCan('user:task-view-detail')){
                
            }
            else {
                return response()->json([
                    'verified' => false,
                    'status ' => 'error',
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
    public function edit(Request $request)
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
                'task_id' => 'required|numeric',
                'categories' => 'nullable|string',
                'title' => 'nullable|string',
                'description' => 'nullable|string',
                'deadline' => 'nullable|string',
                'emergent_level' => 'nullable|numeric',
                'progress' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => $validator->errors(),
                ], 400);
            }

            if (Auth::user()->tokenCan('user:task-edit')) {
                $users = Auth::user();
                $tasks = Task::where('id', $request->task_id)->first();
                if ($tasks->user_id !== $users->id) {
                    return response()->json([
                        'verified' => false,
                        'status' => 'error',
                        'message' => 'forbidden',
                    ]);
                }

                $tasks->categories = empty($request->categories) || null ? $tasks->categories : $request->categories;
                $tasks->title = empty($request->title) || null ? $tasks->title : $request->title;
                $tasks->description = empty($request->description) || null ? $tasks->description : $request->description;
                $tasks->deadline = empty($request->deadline) || null ? $tasks->deadline : $request->deadline;
                $tasks->emergent_level = empty($request->emergent_level) || null ? $tasks->emergent_level : $request->emergent_level;
                $tasks->progress = empty($request->progress) || null ? $tasks->progress : $request->progress;
                $tasks->updated_at = Carbon::now();
                $tasks->save();

                return response()->json([
                    'verified' => true,
                    'status' => 'success',
                    'message' => 'task have update successfully',
                    'data' => [
                        'result' => $tasks,
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
        try {
            if (!Auth::check()) {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'please login'
                ]);
            }
            if (Auth::user()->tokenCan('user:task-remove')) {
                $users = Auth::user();
                if (!$users) {
                    return response()->json([
                        'verified' => false,
                        'status' => 'error',
                        'message' => 'forbidden',
                    ], 401);
                }
                $tasks = Task::where('id', $id)->first();
                $tasks->delete();

                return response()->json([
                    'verified' => true,
                    'status' => 'success',
                    'message' => 'task have delete successfully',
                    'data' => [
                        'result' => $tasks,
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
}
