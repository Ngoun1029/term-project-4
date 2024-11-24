<?php

namespace App\Events;

use App\Models\Notification;
use GuzzleHttp\Psr7\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskNotification
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $userId;
    public $message;
    public $taskId;
    public $createdAt;

    /**
     * Create a new event instance.
     */
    public function __construct($userId, $message, $taskId, $createdAt)
    {
        $this->userId = $userId;
        $this->message = $message;
        $this->taskId = $taskId;
        $this->createdAt = $createdAt;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return new Channel('App.Models.User.' . $this->userId);
    }

    public function broadcastWith()
    {
        return [
            'message' => $this->message,
            'task_id' => $this->taskId,
            'created_at' => $this->createdAt,
        ];
    }
}
