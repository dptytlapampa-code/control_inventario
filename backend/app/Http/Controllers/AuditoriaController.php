<?php

namespace App\Http\Controllers;

use App\Models\Auditoria;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AuditoriaController extends Controller
{
    public function index(Request $request)
    {
        $auditorias = $this->buildQuery($request)
            ->orderByDesc('created_at')
            ->paginate(min((int) $request->get('per_page', 15), 100))
            ->withQueryString();

        return response()->json($auditorias);
    }

    public function exportPdf(Request $request)
    {
        $auditorias = $this->buildQuery($request)
            ->orderByDesc('created_at')
            ->limit(500)
            ->get();

        $pdf = Pdf::loadView('auditoria.pdf', [
            'auditorias' => $auditorias,
        ])->setPaper('a4', 'landscape');

        return $pdf->download('auditoria.pdf');
    }

    public function exportExcel(Request $request): StreamedResponse
    {
        $auditorias = $this->buildQuery($request)
            ->orderByDesc('created_at')
            ->limit(1000)
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="auditoria.csv"',
        ];

        $callback = function () use ($auditorias) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Usuario', 'Email', 'Rol', 'IP', 'Acción', 'Módulo', 'Objeto', 'Fecha', 'Antes', 'Después']);

            foreach ($auditorias as $registro) {
                fputcsv($file, [
                    $registro->id,
                    $registro->user_name,
                    $registro->user_email,
                    $registro->user_role,
                    $registro->ip_address,
                    $registro->accion,
                    $registro->modulo,
                    $registro->objeto_id,
                    optional($registro->created_at)?->toIso8601String(),
                    json_encode($registro->antes, JSON_UNESCAPED_UNICODE),
                    json_encode($registro->despues, JSON_UNESCAPED_UNICODE),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function buildQuery(Request $request)
    {
        $query = Auditoria::query();

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->get('user_id'));
        }

        if ($request->filled('accion')) {
            $query->where('accion', $request->get('accion'));
        }

        if ($request->filled('modulo')) {
            $query->where('modulo', $request->get('modulo'));
        }

        if ($request->filled('desde')) {
            $query->whereDate('created_at', '>=', $request->get('desde'));
        }

        if ($request->filled('hasta')) {
            $query->whereDate('created_at', '<=', $request->get('hasta'));
        }

        if ($request->filled('search')) {
            $search = strtolower($request->get('search'));
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(user_name) LIKE ?', ['%' . $search . '%'])
                    ->orWhereRaw('LOWER(user_email) LIKE ?', ['%' . $search . '%'])
                    ->orWhereRaw('LOWER(accion) LIKE ?', ['%' . $search . '%'])
                    ->orWhereRaw('LOWER(modulo) LIKE ?', ['%' . $search . '%']);
            });
        }

        return $query;
    }
}
