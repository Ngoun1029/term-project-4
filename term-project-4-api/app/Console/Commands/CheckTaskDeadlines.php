<?php

namespace App\Console\Commands;

use App\Events\TaskNotification;
use App\Models\History;
use App\Models\Notification;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Auth;

class CheckTaskDeadlines extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tasks:check-deadlines';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for tasks nearing their deadlines and store notifications.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Get tasks that have deadlines within the next 24 hours and have not yet passed
        $tasks = Task::where('deadline', '>', Carbon::now()) // Ensure deadline is in the future
            ->where('deadline', '<=', Carbon::now()->addDay()) // Deadline is within the next 24 hours
            ->get();

        foreach ($tasks as $task) {
            // Notify the assigner
            $this->notifyUser($task, $task->user_id, "The task '{$task->title}' you assigned is due in less than 24 hours.");

            // Notify the assignee
            $this->notifyUser($task, $task->assign_user_id, "Your assigned task '{$task->title}' is due in less than 24 hours.");
        }

        // Handle expired tasks
        $expiredTasks = Task::where('deadline', '<=', Carbon::now())->get();

        foreach ($expiredTasks as $expiredTask) {
            // Save to history
            $history = new History();
            $history->user_id = $expiredTask->assign_user_id;
            $history->categories = $expiredTask->categories;
            $history->title = $expiredTask->title;
            $history->description = $expiredTask->description;
            $history->deadline = $expiredTask->deadline;
            $history->emergent_level = $expiredTask->emergent_level;
            $history->progress = $expiredTask->progress;
            $history->assign_user_id = $expiredTask->assign_user_id;
            $history->created_at = Carbon::now();
            $history->updated_at = Carbon::now();
            $history->save();

            // Delete the expired task
            $expiredTask->delete();
        }

        $this->info('Notifications for approaching deadlines have been sent, and expired tasks have been handled.');
    }
     /**
     * Notify a user about a task.
     *
     * @param \App\Models\Task $task
     * @param int|null $userId
     * @param string $message
     */
    protected function notifyUser($task, $userId, $message)
    {
        if (!$userId) {
            return; // Skip if no user ID is provided
        }

        // Check if a notification already exists for this task and user
        $existingNotification = Notification::where('task_id', $task->id)
            ->where('user_id', $userId)
            ->first();

        // If no existing notification is found, create a new one
        if (!$existingNotification) {
            $notification = new Notification();
            $notification->user_id = $userId;
            $notification->task_id = $task->id;
            $notification->message = $message;
            $notification->mark_as_read = false;
            $notification->created_at = Carbon::now();
            $notification->updated_at = Carbon::now();
            $notification->save();

            // Broadcast the notification
            broadcast(new TaskNotification(
                $userId,
                $message,
                $task->title,
                $notification->created_at
            ));
        }
    }
}
