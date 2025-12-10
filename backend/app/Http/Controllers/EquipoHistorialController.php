<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEquipoHistorialRequest;
use App\Models\EquipoHistorial;
use App\Services\AuditoriaService;
use Illuminate\Support\Str;

class EquipoHistorialController extends Controller
{
    public function index(string $equipoId)
    {
        $this->authorize('viewAny', [EquipoHistorial::class, $equipoId]);

        $historial = EquipoHistorial::where('equipo_id', $equipoId)
            ->orderByDesc('fecha_evento')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($historial);
    }

    public function store(StoreEquipoHistorialRequest $request, string $equipoId)
    {
        $this->authorize('create', EquipoHistorial::class);

        $data = $request->validated();
        $data['id'] = (string) Str::uuid();
        $data['equipo_id'] = $equipoId;
        $user = auth()->user();
        $data['usuario_registra'] = $user->username ?? $user->email ?? 'sistema';

        $historial = EquipoHistorial::create($data);

        AuditoriaService::registrar(
            'Crear historial',
            'Historial',
            $historial->id,
            null,
            [
                'equipo_id' => $equipoId,
                'tipo_evento' => $historial->tipo_evento,
                'fecha_evento' => $historial->fecha_evento,
            ]
        );

        return response()->json($historial, 201);
    }

    public function update(StoreEquipoHistorialRequest $request, string $id)
    {
        $historial = EquipoHistorial::findOrFail($id);
        $this->authorize('update', $historial);

        $data = $request->validated();
        unset($data['equipo_id'], $data['usuario_registra']);

        $antes = [
            'tipo_evento' => $historial->tipo_evento,
            'fecha_evento' => $historial->fecha_evento,
        ];

        $historial->update($data);

        AuditoriaService::registrar(
            'Editar historial',
            'Historial',
            $historial->id,
            $antes,
            [
                'tipo_evento' => $historial->tipo_evento,
                'fecha_evento' => $historial->fecha_evento,
            ]
        );

        return response()->json($historial);
    }

    public function destroy(string $id)
    {
        $historial = EquipoHistorial::findOrFail($id);
        $this->authorize('delete', $historial);

        AuditoriaService::registrar(
            'Eliminar historial',
            'Historial',
            $historial->id,
            [
                'equipo_id' => $historial->equipo_id,
                'tipo_evento' => $historial->tipo_evento,
            ],
            null
        );

        $historial->delete();

        return response()->json(null, 204);
    }
}
