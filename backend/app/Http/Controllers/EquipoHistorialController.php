<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEquipoHistorialRequest;
use App\Models\EquipoHistorial;
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

        return response()->json($historial, 201);
    }

    public function update(StoreEquipoHistorialRequest $request, string $id)
    {
        $historial = EquipoHistorial::findOrFail($id);
        $this->authorize('update', $historial);

        $data = $request->validated();
        unset($data['equipo_id'], $data['usuario_registra']);

        $historial->update($data);

        return response()->json($historial);
    }

    public function destroy(string $id)
    {
        $historial = EquipoHistorial::findOrFail($id);
        $this->authorize('delete', $historial);

        $historial->delete();

        return response()->json(null, 204);
    }
}
