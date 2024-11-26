<?php

namespace App\Http\Controllers\User;

use App\Events\TaskNotification;
use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Task;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class NotificationController extends Controller
{
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
     * view all notification
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


            if (Auth::user()->tokenCan('user:notification-view')) {
                $users = Auth::user();
                $notifications = Notification::where('user_id', $users->id)->orderBy('created_at', 'desc')->paginate($request->range);
                $taskId = $notifications->pluck('task_id');
                $tasks = Task::whereIn('id', $taskId)->get()->keyBy('id');

                $tranFormCollection = $notifications->getCollection()->transform(function ($notification) use ($tasks) {

                    $task = $tasks->get($notification->task_id) ?? null; // Use task_id, not notification->id
                    if ($notification !== null) {
                        $notification['tasks'] = $task;
                    } else {
                        $notification = null;
                    }
                    return $notification;
                });
                $notifications->setCollection($tranFormCollection);
                return response()->json([
                    'verified' => true,
                    'status' => 'success',
                    'message' => 'found',
                    'data' => [
                        'result' => $notifications
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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {

            $users = Auth::user();
            $validator = Validator::make($request->all(), [
                'task_id' => 'required|numeric',
                'message' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => $validator->errors()
                ], 400);
            }
            $notifications = new Notification();
            $notifications->user_id = $users->id;
            $notifications->task_id = $request->task_id;
            $notifications->message = $request->message;
            $notifications->mark_as_read = 0;
            $notifications->created_at = Carbon::now();
            $notifications->updated_at = Carbon::now();
            $notifications->save();

            broadcast(new TaskNotification(
                $users->id,  // Pass the user ID to the event
                $notifications->message,  // Pass the message to the event
                $notifications->task_id,  // Pass the task ID to the event
                $notifications->created_at  // Pass the created_at timestamp to the event
            ));
            return response()->json([
                'verified' => true,
                'status' => 'success',
                'message' => 'notification',
                'data' => [
                    'result' => $notifications,
                ],
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
     * read
     */

    public function read(string $id){
        try{
            if (!Auth::check()) {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'please login'
                ]);
            }

            // $validator = Validator::make($request->all(), [
            //     'notification_id' => 'required|numeric',
            // ]);

            // if($validator->fails()){
            //     return response()->json([
            //         'verified' => false,
            //         'status' => 'error',
            //         'message' => $validator->errors(),
            //     ], 400);
            // }

            if(Auth::user()->tokenCan('user:notification-read')){
                $read = Notification::where('id', $id)->first();
                if(!$read){
                    return response()->json([
                        'verified' => false,
                        'status' => 'error',
                        'message' => 'not found'
                    ], 404);
                }

                $read->mark_as_read = true;
                $read->updated_at = Carbon::now();
                $read->save();
                return response()->json([
                    'verified' => true,
                    'status' => 'success',
                    'message' => 'read',
                    'data' => [
                        'result' => $read,
                    ]
                ],200);
            }
            else {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'no accessible'
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
        try{

            if (!Auth::check()) {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'please login'
                ]);
            }
            if(Auth::user()->tokenCan('user:notification-remove')){
                $users = Auth::user();
                $notifications = Notification::where('id', $id)->first();
                if($notifications->user_id !== $users->id){
                    return response()->json([
                        'verified' => false,
                        'status' => 'error',
                        'message' =>'forbidden',
                    ], 401);
                }
                $notifications->delete();

                return response()->json([
                    'verified' => true,
                    'status' => 'success',
                    'message' => 'read',
                    'data' => [
                        'result' => $notifications,
                    ]
                ],200);

            }
            else {
                return response()->json([
                    'verified' => false,
                    'status' => 'error',
                    'message' => 'no accessible'
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
}
