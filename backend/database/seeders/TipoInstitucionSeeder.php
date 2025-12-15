<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\TipoInstitucion;

class TipoInstitucionSeeder extends Seeder
{
    public function run(): void
    {
        $tipos = [
            'Hospital',
            'Ministerio',
            'Subsecretaría',
            'Dirección',
            'Departamento',
            'Coordinación',
            'Área',
            'Fundación',
            'Particular',
            'Depósito de medicamentos',
        ];

        foreach ($tipos as $tipo) {
            TipoInstitucion::updateOrCreate(
                ['nombre' => $tipo],
                [
                    'id' => Str::uuid(),
                    'descripcion' => null,
                    'activo' => true,
                ]
            );
        }
    }
}
