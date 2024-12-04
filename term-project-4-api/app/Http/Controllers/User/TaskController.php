<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Controllers\MasterController;
use App\Models\History;
use App\Models\Invitation;
use App\Models\Task;
use App\Models\User;
use App\Models\UserDetail;
use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Exception;

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
                $tasks->assign_user_id = 0;
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
                'progress' => 'nullable|string',
                'emergent_level' => 'nullable|numeric',
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
                $query = Task::where('user_id', Auth::user()->id);

                if ($request->has('progress') && !empty($request->progress)) {
                    $query->where('progress', $request->progress);
                }
                if($request->has('emergent_level') && !empty($request->emergent_level)){
                    $query->where('emergent_level', $request->emergent_level);
                }

                $tasks = $query->orderBy('created_at', 'desc')->paginate($request->range);
                $userId = $tasks->pluck('user_id');
                $users = User::whereIn('id', $userId)->get()->keyBy('id');
                $userDetailId = $users->pluck('id');
                $user_details = UserDetail::whereIn('user_id', $userDetailId)->get()->keyBy('user_id');
                $user_details = $user_details->map(function ($user_detail) {
                    $user_detail->profile_picture = $this->masterController->appendBaseUrl($user_detail->profile_picture, 'user-profile');
                    return $user_detail;
                });
                $userAssignId = $tasks->pluck('assign_user_id');
                $users_assigns = User::whereIn('id', $userAssignId)->get()->keyBy('id');
                $usersAssignId = $users_assigns->pluck('id');
                $user_detail_assigns = UserDetail::whereIn('user_id', $usersAssignId)->get()->keyBy('user_id');
                $user_detail_assigns = $user_detail_assigns->map(function($user_detail_assign){
                    $user_detail_assign->profile_picture = $this->masterController->appendBaseUrl($user_detail_assign->profile_picture, 'user-profile');
                    return $user_detail_assign;
                });

                $tranFormCollection = $tasks->getCollection()->transform(function ($task) use ($tasks, $user_details, $users, $users_assigns, $user_detail_assigns) {
                    // Retrieve user and their details
                    $user = $users->get($task->user_id) ?? null;
                    $user_detail = $user ? $user_details->get($user->id) : null;

                    // Retrieve assigned user and their details
                    $user_assign = $users_assigns->get($task->assign_user_id) ?? null;
                    $user_detail_assign = $user_assign ? $user_detail_assigns->get($user_assign->id) : null;

                    // Only modify task if it exists
                    if ($task !== null) {
                        $task['users'] = $user;
                        $task['user_assign'] = $user_assign;

                        // Add user details if they exist
                        if ($user) {
                            $user['user_details'] = $user_detail;
                        }
                        if ($user_assign) {
                            $user_assign['user_detail_assign'] = $user_detail_assign;
                        }
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

            if (Auth::user()->tokenCan('user:task-view-detail')) {
                // Fetch the task by ID
                $tasks = Task::where('id', $id)->first();

                // Check if the task exists
                if (!$tasks) {
                    return response()->json([
                        'verified' => false,
                        'status' => 'error',
                        'message' => 'Task not found',
                    ], 404);
                }

                // Get the assigned user ID from the task
                $userAssignId = $tasks->assign_user_id;

                // Fetch the assigned user(s)
                $user_assigns = User::where('id', $userAssignId)->get()->keyBy('id');
                $userDetailAssignId = $user_assigns->pluck('id');

                // Fetch user details
                $user_detail_assigns = UserDetail::whereIn('user_id', $userDetailAssignId)->get()->keyBy('user_id');

                // Fetch specific user assign and details
                $user_assign = $user_assigns->get($userAssignId) ?? null;
                $user_detail_assign = $user_assign ? $user_detail_assigns->get($user_assign->id) : null;

                // Modify user detail assign if it exists
                if ($user_detail_assign) {
                    $user_detail_assign->profile_picture = $this->masterController->appendBaseUrl(
                        $user_detail_assign->profile_picture,
                        'user-profile'
                    );
                }

                // Add user assign details to the task
                $tasks['user_assign'] = $user_assign;
                if ($user_assign) {
                    $user_assign['user_detail_assign'] = $user_detail_assign;
                }

                // Return the response
                return response()->json([
                    'verified' => true,
                    'status' => 'success',
                    'message' => 'found',
                    'data' => [
                        'result' => $tasks,
                    ],
                ], 200);
            } else {
                // User does not have permission
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
                'progress' => 'nullable|string',
                'email' => 'nullable|string',
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
                $usersAssignToTask = User::where('email', $request->email)->first();
                if(!$usersAssignToTask){
                    return response()->json([
                        'verified' => false,
                        'status' => 'error',
                        'message' => 'not found'
                    ], 404);
                }
                $userId = $usersAssignToTask->id;
                $tasks->categories = empty($request->categories) || null ? $tasks->categories : $request->categories;
                $tasks->title = empty($request->title) || null ? $tasks->title : $request->title;
                $tasks->description = empty($request->description) || null ? $tasks->description : $request->description;
                $tasks->deadline = empty($request->deadline) || null ? $tasks->deadline : $request->deadline;
                $tasks->emergent_level = empty($request->emergent_level) || null ? $tasks->emergent_level : $request->emergent_level;
                $tasks->progress = empty($request->progress) || null ? $tasks->progress : $request->progress;
                $tasks->assign_user_id = empty($request->email) || null ? $userId : 0;
                $tasks->updated_at = Carbon::now();
                $tasks->save();

                $invitations = new Invitation();
                $invitations->inviter_id = Auth::user()->id;
                $invitations->invited_id = $userId;
                $invitations->message = $users->user_name.' '.'invite you to do'. ' ' . $tasks->title;
                $invitations->save();

                $updateTask = [
                    'task' => $tasks,
                    'invite' => $invitations,
                ];

                return response()->json([
                    'verified' => true,
                    'status' => 'success',
                    'message' => 'task have update successfully',
                    'data' => [
                        'result' => $updateTask,
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

    public function viewAssignTask(Request $request){
        try{
            if(!Auth::check()){
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

            if($validator->fails()){
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

            if(Auth::user()->tokenCan('user:task-assign-view')){
                $users = Auth::user();
                $taskAssigns = Task::where('assign_user_id', $users->id)->paginate($request->range);
                $userAssignerId = $taskAssigns->pluck('user_id');
                $user_assigners = User::whereIn('id', $userAssignerId)->get()->keyby('id');
                $userDetailAssignerId = $user_assigners->pluck('id');
                $user_detail_assigners = UserDetail::whereIn('user_id', $userDetailAssignerId)->get()->keyBy('user_id');
                $user_detail_assigners = $user_detail_assigners->map(function($user_detail_assigner){
                    $user_detail_assigner->profile_picture = $this->masterController->appendBaseUrl($user_detail_assigner->profile_picture, 'user-profile');
                    return $user_detail_assigner;
                });
                $transformCollection = $taskAssigns->getCollection()->transform(function ($taskAssign) use ($user_assigners, $user_detail_assigners) {
                    $user_assigner = $user_assigners->get($taskAssign->user_id) ?? null;
                    $user_detail_assigner = $user_assigner ? $user_detail_assigners->get($user_assigner->id) : null;

                    if ($taskAssign !== null) {
                        $taskAssign['user'] = $user_assigner;
                        if ($user_assigner) {
                            $user_assigner['user_detail'] = $user_detail_assigner;
                        }
                    } else {
                        $taskAssign = null;
                    }
                    return $taskAssign;
                });


                $taskAssigns->setCollection($transformCollection);
                return response()->json([
                    'verified' => true,
                    'status' => 'success',
                    'message' => 'found',
                    'data' => [
                        'result' => $taskAssigns,
                    ]
                ], 200 );
            }
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
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        try{

            if(!Auth::check()){
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'please login'
                ]);
            }

            $validator = Validator::make($request->all(), [
                'taskId' => 'required|string',
                'progress' => 'required|string',

            ]);

            if($validator->fails()){
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => $validator->errors(),
                ], 400);
            }

            if(Auth::user()->tokenCan('user:task-update')){
                $users = Auth::user();
                $tasks = Task::where('id', $request->taskId)->first();
                if(!$tasks){
                    return response()->json([
                        'verified' => false,
                        'status' => 'error',
                        'message' => 'not found',
                    ], 404);
                }
                if($tasks->assign_user_id !== $users->id){
                    return response()->json([
                        'verified' => false,
                        'status' => 'error',
                        'message' => 'not found',
                    ], 404);
                }
                $tasks->progress = empty($request->progress) || null ? $tasks->progress : $request->progress;
                $tasks->updated_at = Carbon::now();
                $tasks->save();
                return response()->json([
                    'verified' => true,
                    'status' => 'success',
                    'message' => 'save',
                    'data' => [
                        'result' => $tasks,
                    ]
                ], 200);
            }
            else{
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' =>'no accessible',
                ], 403);
            }

        }catch (Exception $e) {
            return response()->json([
                'verified' => false,
                'status' => 'error',
                'message' => Str::limit($e->getMessage(), 150, '...'),
            ], 500);
        }
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
                if(!$tasks){
                    return response()->json([
                        'verified' => false,
                        'status' => 'error',
                        'message' => 'not found'
                    ], 404);
                }

                $history = new History();
                $history->user_id = $tasks->assign_user_id;
                $history->categories = $tasks->categories;
                $history->title = $tasks->title;
                $history->description = $tasks->description;
                $history->deadline = $tasks->deadline;
                $history->emergent_level = $tasks->emergent_level;
                $history->progress = $tasks->progress;
                $history->assign_user_id = $tasks->assign_user_id;
                $history->created_at = Carbon::now();
                $history->updated_at = Carbon::now();
                $history->save();

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
