<?php

namespace App\Http\Controllers;

use App\Models\UsuarioPermiso;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    private function ensureDashboardAccess(): void
    {
        $user = auth()->user();
        $roles = collect($user?->roles ?? [])->map(fn ($role) => strtolower((string) $role));

        if ($roles->contains('superadmin') || $roles->contains('admin') || $roles->contains('dashboard:view')) {
            return;
        }

        $userId = $user?->id;
        $hasPermission = false;

        if ($userId) {
            $hasPermission = UsuarioPermiso::where('user_id', $userId)
                ->whereIn('modulo', ['Dashboard', 'dashboard'])
                ->where('puede_ver', true)
                ->exists();
        }

        abort_if(!$hasPermission, 403, 'No tiene permisos para ver el dashboard.');
    }

    public function kpis(): JsonResponse
    {
        $this->ensureDashboardAccess();

        $totalEquipos = DB::table('equipos')->count();

        $equiposPorEstado = DB::table('equipos')
            ->select('estado', DB::raw('COUNT(*) as total'))
            ->groupBy('estado')
            ->pluck('total', 'estado')
            ->toArray();

        $now = Carbon::now();
        $mantenimientosMes = DB::table('mantenimientos')
            ->whereBetween('fecha', [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()])
            ->count();

        $totalHospitales = DB::table('hospitales')->count();
        $totalServicios = DB::table('servicios')->count();
        $totalOficinas = DB::table('oficinas')->count();

        return response()->json([
            'total_equipos' => $totalEquipos,
            'equipos_por_estado' => $equiposPorEstado,
            'mantenimientos_mes' => $mantenimientosMes,
            'total_hospitales' => $totalHospitales,
            'total_servicios' => $totalServicios,
            'total_oficinas' => $totalOficinas,
        ]);
    }

    public function equiposPorTipo(): JsonResponse
    {
        $this->ensureDashboardAccess();

        $data = DB::table('equipos as e')
            ->join('tipos_equipo as t', 'e.tipo_equipo_id', '=', 't.id')
            ->select('t.nombre as tipo', DB::raw('COUNT(*) as total'))
            ->groupBy('t.id', 't.nombre')
            ->orderByDesc('total')
            ->get();

        return response()->json($data);
    }

    public function equiposPorEstado(): JsonResponse
    {
        $this->ensureDashboardAccess();

        $data = DB::table('equipos')
            ->select('estado', DB::raw('COUNT(*) as total'))
            ->groupBy('estado')
            ->orderByDesc('total')
            ->get();

        return response()->json($data);
    }

    public function mantenimientosPorMes(): JsonResponse
    {
        $this->ensureDashboardAccess();

        $data = DB::table('mantenimientos')
            ->selectRaw("to_char(fecha, 'YYYY-MM') as mes, COUNT(*) as total")
            ->groupBy('mes')
            ->orderBy('mes')
            ->get();

        return response()->json($data);
    }

    public function equiposPorHospital(): JsonResponse
    {
        $this->ensureDashboardAccess();

        $data = DB::table('equipos as e')
            ->join('hospitales as h', 'e.hospital_id', '=', 'h.id')
            ->select('h.nombre as hospital', DB::raw('COUNT(*) as total'))
            ->groupBy('h.id', 'h.nombre')
            ->orderByDesc('total')
            ->get();

        return response()->json($data);
    }
}
