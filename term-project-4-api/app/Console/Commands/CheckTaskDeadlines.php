<?php

namespace App\Console\Commands;

use App\Events\TaskNotification;
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
        $tasks = Task::where('deadline', '>', Carbon::now())  // Ensure deadline is in the future
            ->where('deadline', '<=', Carbon::now()->addDay())  // Deadline is within the next 24 hours
            ->get();

        foreach ($tasks as $task) {
            // Check if a notification already exists for this task and user, without considering read status
            $existingNotification = Notification::where('task_id', $task->id)
                ->where('user_id', $task->user_id)
                ->first();  // Only check for task and user combination

            // If no existing notification is found, create a new one
            if (!$existingNotification) {

                $notifications = new Notification();
                $notifications->user_id = $tasks->user_id;
                $notifications->task_id = $tasks->id;
                $notifications->message = "Your task '{$task->title}' is due in less than 24 hours.";
                $notifications->mark_as_read = false;
                $notifications->created_at = Carbon::now();
                $notifications->updated_at = Carbon::now();
                $notifications->save();
                broadcast(new TaskNotification(
                    Auth::user()->id,
                    $notifications->message,
                    $task->title,
                    $notifications->created_at
                ));


            }
        }

        $this->info('Notifications for approaching deadlines have been sent.');
        
    }
}
