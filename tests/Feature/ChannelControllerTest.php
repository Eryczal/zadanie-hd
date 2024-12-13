<?php

namespace Tests\Feature;

use App\Models\Channel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Response;
use Tests\TestCase;

class ChannelControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $validChannelData = [
        'name' => 'Channel A',
        'number' => 101,
    ];

    protected $invalidChannelData = [
        'name' => '',
        'number' => 'invalid',
    ];

    /** @test */
    public function it_can_list_channels()
    {
        Channel::factory()->count(3)->create();

        $response = $this->getJson('/api/channels');

        $response->assertStatus(Response::HTTP_OK);
        $response->assertJsonCount(3);
    }

    /** @test */
    public function it_can_create_a_channel()
    {
        $response = $this->postJson('/api/channels', $this->validChannelData);

        $response->assertStatus(Response::HTTP_CREATED);
        $response->assertJson($this->validChannelData);
        $this->assertDatabaseHas('channels', $this->validChannelData);
    }

    /** @test */
    public function it_validates_channel_creation_data()
    {
        $response = $this->postJson('/api/channels', $this->invalidChannelData);

        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
        $response->assertJsonValidationErrors(['name', 'number']);
    }

    /** @test */
    public function it_can_show_a_channel()
    {
        $channel = Channel::factory()->create();

        $response = $this->getJson("/api/channels/{$channel->id}");

        $response->assertStatus(Response::HTTP_OK);
        $response->assertJson(['id' => $channel->id, 'name' => $channel->name]);
    }

    /** @test */
    public function it_returns_404_when_showing_a_non_existent_channel()
    {
        $response = $this->getJson("/api/channels/999");

        $response->assertStatus(Response::HTTP_NOT_FOUND);
        $response->assertJson(['message' => 'Item not found']);
    }

    /** @test */
    public function it_can_update_a_channel()
    {
        $channel = Channel::factory()->create();
        $updateData = ['name' => 'Updated Channel', 'number' => 202];

        $response = $this->putJson("/api/channels/{$channel->id}", $updateData);

        // Assert: Check the respons
        $response->assertStatus(Response::HTTP_OK);
        $response->assertJson($updateData);
        $this->assertDatabaseHas('channels', $updateData);
    }

    /** @test */
    public function it_returns_404_when_updating_a_non_existent_channel()
    {
        $response = $this->putJson('/api/channels/999', $this->validChannelData);

        $response->assertStatus(Response::HTTP_NOT_FOUND);
        $response->assertJson(['message' => 'Item not found']);
    }

    /** @test */
    public function it_returns_400_when_updating_without_valid_data()
    {
        $channel = Channel::factory()->create();

        $response = $this->putJson("/api/channels/{$channel->id}", []);

        $response->assertStatus(Response::HTTP_BAD_REQUEST);
        $response->assertJson(['message' => 'No valid fields provided for update']);
    }

    /** @test */
    public function it_can_delete_a_channel()
    {
        $channel = Channel::factory()->create();

        $response = $this->deleteJson("/api/channels/{$channel->id}");

        $response->assertStatus(Response::HTTP_OK);
        $response->assertJson(['message' => 'Item deleted successfully']);
        $this->assertDatabaseMissing('channels', ['id' => $channel->id]);
    }

    /** @test */
    public function it_returns_404_when_deleting_a_non_existent_channel()
    {
        $response = $this->deleteJson('/api/channels/999');

        $response->assertStatus(Response::HTTP_NOT_FOUND);
        $response->assertJson(['message' => 'Item not found']);
    }

    /** @test */
    public function it_can_delete_multiple_channels()
    {
        $channels = Channel::factory()->count(3)->create();
        $ids = $channels->pluck('id')->toArray();

        $response = $this->deleteJson('/api/channels', ['ids' => $ids]);

        $response->assertStatus(Response::HTTP_OK);
        $response->assertJson(['message' => 'Items deleted successfully', 'deletedCount' => 3]);
        $this->assertDatabaseMissing('channels', ['id' => $ids[0]]);
    }

    /** @test */
    public function it_returns_400_when_deleting_multiple_channels_with_invalid_ids()
    {
        $response = $this->deleteJson('/api/channels', ['ids' => 'invalid']);

        $response->assertStatus(Response::HTTP_BAD_REQUEST);
        $response->assertJson(['message' => 'Invalid input. Provide an array of IDs.']);
    }
}
