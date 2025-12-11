<?php

namespace App\Services;

use App\Http\Resources\Actas\ActaResource;
use App\Models\Acta;
use App\Models\EncabezadoActa;
use App\Services\AuditoriaService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facade\QrCode;

class ActasService
{
    public function listar(array $filters): LengthAwarePaginator
    {
        $query = Acta::query()
            ->when($filters['q'] ?? null, function ($builder, string $texto) {
                $builder->where(function ($query) use ($texto) {
                    $query->where('motivo', 'like', "%{$texto}%")
                        ->orWhere('tipo', 'like', "%{$texto}%")
                        ->orWhere('receptor_nombre', 'like', "%{$texto}%");
                });
            })
            ->when($filters['hospital_id'] ?? null, fn ($builder, string $hospitalId) => $builder->where('hospital_id', $hospitalId))
            ->when($filters['tipo'] ?? null, fn ($builder, string $tipo) => $builder->where('tipo', $tipo))
            ->when($filters['fecha_desde'] ?? null, fn ($builder, string $desde) => $builder->whereDate('created_at', '>=', $desde))
            ->when($filters['fecha_hasta'] ?? null, fn ($builder, string $hasta) => $builder->whereDate('created_at', '<=', $hasta))
            ->orderByDesc('created_at');

        $page = (int) ($filters['page'] ?? 1);
        $perPage = (int) ($filters['per_page'] ?? 15);

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function generar(string $tipo, array $data, $user): Acta
    {
        $hospitalId = $data['hospital_id'] ?? ($user->hospital_id ?? null);
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
            'equipo_id' => $data['equipo_id'],
            'hospital_id' => $hospitalId,
            'usuario_id' => $user?->id,
            'receptor_nombre' => $data['receptor_nombre'],
            'receptor_identificacion' => $data['receptor_identificacion'] ?? null,
            'receptor_cargo' => $data['receptor_cargo'] ?? null,
            'motivo' => $data['motivo'],
            'data' => [
                'detalle' => $data['detalle'] ?? null,
                'equipo' => array_merge([
                    'id' => $data['equipo_id'],
                ], $data['equipo'] ?? []),
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

        AuditoriaService::registrar(
            'Generar acta en PDF',
            'Actas',
            $acta->id,
            null,
            [
                'tipo' => $tipo,
                'equipo_id' => $data['equipo_id'],
                'motivo' => $data['motivo'],
                'receptor' => [
                    'nombre' => $data['receptor_nombre'],
                    'identificacion' => $data['receptor_identificacion'] ?? null,
                    'cargo' => $data['receptor_cargo'] ?? null,
                ],
                'usuario' => $user?->email,
            ]
        );

        return $acta;
    }

    public function formatearRespuesta(LengthAwarePaginator $paginator): array
    {
        return [
            'data' => ActaResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ];
    }

    public function descargar(Acta $acta)
    {
        if (!Storage::disk('public')->exists($acta->path)) {
            abort(404, 'Archivo no encontrado');
        }

        return Storage::disk('public')->download($acta->path, $acta->tipo . '-' . $acta->id . '.pdf');
    }
}
