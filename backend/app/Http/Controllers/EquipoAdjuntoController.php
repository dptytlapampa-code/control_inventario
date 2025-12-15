<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEquipoAdjuntoRequest;
use App\Models\EquipoAdjunto;
use App\Services\AuditoriaService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EquipoAdjuntoController extends Controller
{
    public function index(string $equipoId)
    {
        $adjuntos = EquipoAdjunto::where('equipo_id', $equipoId)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($adjuntos);
    }

    public function store(StoreEquipoAdjuntoRequest $request, string $equipoId)
    {
        $file = $request->file('archivo');

        $filename = now()->format('YmdHis') . '_' . $equipoId . '.' . $file->getClientOriginalExtension();
        $path = Storage::disk('public')->putFileAs('equipos_adjuntos', $file, $filename);

        $adjunto = EquipoAdjunto::create([
            'id' => Str::uuid(),
            'equipo_id' => $equipoId,
            'nombre_original' => $file->getClientOriginalName(),
            'nombre_archivo' => $filename,
            'mime' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'path' => $path,
        ]);

        AuditoriaService::registrar(
            'Subir adjunto',
            'Adjuntos',
            $adjunto->id,
            null,
            [
                'equipo_id' => $equipoId,
                'nombre_original' => $adjunto->nombre_original,
                'mime' => $adjunto->mime,
                'size' => $adjunto->size,
            ]
        );

        return response()->json($adjunto, 201);
    }

    public function download(string $id)
    {
        $adjunto = EquipoAdjunto::findOrFail($id);

        if (!Storage::disk('public')->exists($adjunto->path)) {
            return response()->json(['error' => 'Archivo no encontrado.'], 404);
        }

        return Storage::disk('public')->download($adjunto->path, $adjunto->nombre_original);
    }

    public function destroy(string $id)
    {
        $adjunto = EquipoAdjunto::findOrFail($id);

        if (Storage::disk('public')->exists($adjunto->path)) {
            Storage::disk('public')->delete($adjunto->path);
        }

        AuditoriaService::registrar(
            'Eliminar adjunto',
            'Adjuntos',
            $adjunto->id,
            [
                'equipo_id' => $adjunto->equipo_id,
                'nombre_original' => $adjunto->nombre_original,
                'mime' => $adjunto->mime,
            ],
            null
        );

        $adjunto->delete();

        return response()->json(null, 204);
    }
}
