<?php

namespace Maatwebsite\Excel;

use Illuminate\Support\ServiceProvider;

class ExcelServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton('excel', fn () => new ExcelManager());
    }
}
