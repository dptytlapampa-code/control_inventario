<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\EncabezadoActa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EncabezadoActaController extends Controller
{
    public function index()
    {
        $encabezado = EncabezadoActa::latest()->first();

        if (!$encabezado || !Storage::disk('public')->exists('encabezados/actas/encabezado.png')) {
            return response()->json(null, 200);
        }

        return response()->json([
            'filename' => $encabezado->filename,
            'mime' => $encabezado->mime,
            'size' => $encabezado->size,
            'url' => Storage::disk('public')->url('encabezados/actas/encabezado.png'),
            'updated_at' => $encabezado->updated_at,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'encabezado' => 'required|file|mimetypes:image/png,image/jpeg|max:2048',
        ]);

        $file = $request->file('encabezado');
        $dimensions = @getimagesize($file->getRealPath());

        if (!$dimensions) {
            return response()->json(['message' => 'No se pudo validar la imagen del encabezado.'], 422);
        }

        [$width, $height] = $dimensions;
        $ratio = $width / max($height, 1);
        $expectedRatio = 4.8;
        $tolerance = 0.35;

        if ($ratio < $expectedRatio - $tolerance || $ratio > $expectedRatio + $tolerance) {
            return response()->json([
                'message' => 'La relación de aspecto del encabezado debe ser aproximada a 1200x250 (4.8:1).',
            ], 422);
        }

        $filename = 'encabezado.png';
        $path = 'encabezados/actas/' . $filename;

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        if (in_array(strtolower($file->getClientOriginalExtension()), ['jpg', 'jpeg'])) {
            $imageResource = imagecreatefromstring(file_get_contents($file->getRealPath()));
            ob_start();
            imagepng($imageResource);
            $pngContent = ob_get_clean();
            imagedestroy($imageResource);
            Storage::disk('public')->put($path, $pngContent);
            $storedMime = 'image/png';
            $storedSize = strlen($pngContent);
        } else {
            Storage::disk('public')->putFileAs('encabezados/actas', $file, $filename);
            $storedMime = $file->getClientMimeType();
            $storedSize = $file->getSize();
        }

        EncabezadoActa::truncate();

        $encabezado = EncabezadoActa::create([
            'filename' => $filename,
            'mime' => $storedMime,
            'size' => $storedSize,
        ]);

        return response()->json([
            'message' => 'Encabezado actualizado correctamente.',
            'data' => [
                'filename' => $encabezado->filename,
                'mime' => $encabezado->mime,
                'size' => $encabezado->size,
                'url' => Storage::disk('public')->url($path),
            ],
        ], 201);
    }

    public function destroy()
    {
        $encabezado = EncabezadoActa::latest()->first();

        if (!$encabezado) {
            return response()->json(null, 204);
        }

        $path = 'encabezados/actas/' . $encabezado->filename;

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        EncabezadoActa::truncate();

        return response()->json(null, 204);
    }
}
