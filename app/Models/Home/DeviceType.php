<?php

namespace App\Models\Home;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

class DeviceType extends Model {

    public $timestamps = false;

    protected $table = 'home_device_types';

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'key',
        'group',
        'name',
    ];

    public function __toString(): string {
        return (string)$this->name;
    }

}
