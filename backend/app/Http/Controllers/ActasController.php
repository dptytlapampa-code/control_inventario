<?php

namespace App\Http\Controllers;

use App\Models\Acta;
use App\Models\EncabezadoActa;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facade\QrCode;

class ActasController extends Controller
{
    public function generarEntrega(Request $request, string $equipoId)
    {
        return $this->generarActa($request, 'entrega', $equipoId);
    }

    public function generarTraslado(Request $request, string $equipoId)
    {
        return $this->generarActa($request, 'traslado', $equipoId);
    }

    public function generarBaja(Request $request, string $equipoId)
    {
        return $this->generarActa($request, 'baja', $equipoId);
    }

    public function generarPrestamo(Request $request, string $equipoId)
    {
        return $this->generarActa($request, 'prestamo', $equipoId);
    }

    public function download(string $id)
    {
        $acta = Acta::findOrFail($id);
        $this->ensureActaPermission($acta);

        if (!Storage::disk('public')->exists($acta->path)) {
            return response()->json(['message' => 'Archivo no encontrado'], 404);
        }

        return Storage::disk('public')->download($acta->path, $acta->tipo . '-' . $acta->id . '.pdf');
    }

    private function generarActa(Request $request, string $tipo, string $equipoId)
    {
        $validated = $request->validate([
            'motivo' => 'required|string|max:2000',
            'receptor_nombre' => 'required|string|max:255',
            'receptor_identificacion' => 'nullable|string|max:255',
            'receptor_cargo' => 'nullable|string|max:255',
            'equipo' => 'nullable|array',
            'equipo.nombre' => 'nullable|string|max:255',
            'equipo.marca' => 'nullable|string|max:255',
            'equipo.modelo' => 'nullable|string|max:255',
            'equipo.serie' => 'nullable|string|max:255',
            'equipo.codigo' => 'nullable|string|max:255',
            'equipo.ubicacion' => 'nullable|string|max:255',
            'hospital_id' => 'nullable|string|max:255',
            'detalle' => 'nullable|string|max:4000',
        ]);

        $user = $request->user();
        $hospitalId = $validated['hospital_id'] ?? ($user->hospital_id ?? null);

        $encabezado = EncabezadoActa::latest()->first();
        $encabezadoUrl = $encabezado && Storage::disk('public')->exists('encabezados/actas/' . $encabezado->filename)
            ? Storage::disk('public')->url('encabezados/actas/' . $encabezado->filename)
            : null;

        $actaId = (string) Str::uuid();
        $downloadUrl = url('/api/actas/' . $actaId . '/download');
        $qrImage = base64_encode(QrCode::format('png')->size(220)->generate($downloadUrl));

        $acta = Acta::create([
            'id' => $actaId,
            'tipo' => $tipo,
            'equipo_id' => $equipoId,
            'hospital_id' => $hospitalId,
            'usuario_id' => $user?->id,
            'receptor_nombre' => $validated['receptor_nombre'],
            'receptor_identificacion' => $validated['receptor_identificacion'] ?? null,
            'receptor_cargo' => $validated['receptor_cargo'] ?? null,
            'motivo' => $validated['motivo'],
            'data' => [
                'detalle' => $validated['detalle'] ?? null,
                'equipo' => array_merge([
                    'id' => $equipoId,
                ], $validated['equipo'] ?? []),
            ],
            'path' => 'actas/' . $tipo . '/' . $actaId . '.pdf',
        ]);

        $viewData = [
            'acta' => $acta,
            'tipo' => ucfirst($tipo),
            'encabezadoUrl' => $encabezadoUrl,
            'qr' => $qrImage,
            'downloadUrl' => $downloadUrl,
            'usuario' => $user,
        ];

        $pdf = Pdf::loadView('actas.' . $tipo, $viewData)->setPaper('a4');
        Storage::disk('public')->makeDirectory('actas/' . $tipo);
        Storage::disk('public')->put($acta->path, $pdf->output());

        return response()->json([
            'id' => $acta->id,
            'tipo' => $acta->tipo,
            'path' => $acta->path,
            'url' => Storage::disk('public')->url($acta->path),
        ], 201);
    }

    private function ensureActaPermission(Acta $acta): void
    {
        $user = request()->user();

        if ($this->userHasRole($user, 'superadmin')) {
            return;
        }

        $userHospital = $user->hospital_id ?? null;

        if ($acta->hospital_id && $userHospital && $acta->hospital_id !== $userHospital) {
            abort(403, 'No autorizado para acceder a esta acta.');
        }
    }

    private function userHasRole($user, string $role): bool
    {
        if (!$user) {
            return false;
        }

        if (method_exists($user, 'hasRole')) {
            return $user->hasRole($role);
        }

        $roles = $user->roles ?? ($user->role ?? null);

        if (is_string($roles)) {
            return $roles === $role;
        }

        if (is_array($roles)) {
            return in_array($role, $roles, true);
        }

        return false;
    }
}
