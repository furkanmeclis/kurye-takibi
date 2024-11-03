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
            $table->double("price")->default(1);
            $table->string("customer_note")->nullable();
            $table->string("order_number")->nullable();
            $table->enum("status", ["draft","preparing","opened", "transporting", "delivered", "canceled", "deleted"])->default("draft");
            $table->string("start_location")->default('{"latitude":0,"longitude":0}');
            $table->string("end_location")->default('{"latitude":0,"longitude":0}');
            $table->boolean("cancellation_accepted")->default(false);
            $table->boolean("cancellation_rejected")->default(false);
            $table->unsignedBigInteger("cancellation_accepted_by")->nullable();
            $table->enum("cancellation_requested_by", ["courier", "business"])->nullable();
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
