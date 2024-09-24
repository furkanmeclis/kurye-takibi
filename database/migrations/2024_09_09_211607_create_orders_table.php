<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("business_id");
            $table->unsignedBigInteger("customer_id")->nullable();
            $table->unsignedBigInteger("courier_id")->nullable();
            $table->unsignedBigInteger("address_id")->nullable();
            $table->string("customer_note")->nullable();
            $table->enum("status", ["draft", "opened", "transporting", "delivered", "canceled", "deleted"])->default("draft");
            $table->json("start_location")->default('{"latitude":0,"longitude":0}');
            $table->json("end_location")->default('{"latitude":0,"longitude":0}');
            $table->boolean("cancellation_accepted")->default(false);
            $table->unsignedBigInteger("cancellation_accepted_by")->nullable();
            $table->enum("cancellation_requested_by",["courier","business"])->nullable();
            $table->string("cancellation_reason")->nullable();
            $table->enum("marketplace", ["web", "trendyol", "yemeksepeti", "getir"])->default("web");
            $table->string("marketplace_order_id")->nullable();
            $table->json("marketplace_order_details")->nullable();
            $table->json("marketplace_transactions")->nullable();
            $table->json("marketplace_customer")->nullable();
            $table->timestamp("delivered_at")->nullable();
            $table->timestamp("canceled_at")->nullable();
            $table->timestamp("courier_accepted_at")->nullable();
            $table->timestamps();
            $table->foreign("business_id")->references("id")->on("users")->onDelete("set null");
            $table->foreign("customer_id")->references("id")->on("customers")->onDelete("set null");
            $table->foreign("courier_id")->references("id")->on("users")->onDelete("set null");
            $table->foreign("cancellation_accepted_by")->references("id")->on("users")->onDelete("set null");
            $table->foreign("address_id")->references("id")->on("customer_addresses")->onDelete("set null");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
