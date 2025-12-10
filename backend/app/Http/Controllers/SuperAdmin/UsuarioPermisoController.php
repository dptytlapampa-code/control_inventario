<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUsuarioPermisoRequest;
use App\Models\UsuarioPermiso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UsuarioPermisoController extends Controller
{
    public function index(Request $request)
    {
        $this->ensureSuperAdmin($request);

        $usuarios = UsuarioPermiso::select('user_id', DB::raw('COUNT(*) as permisos'))
            ->groupBy('user_id')
            ->orderBy('user_id')
            ->get();

        return response()->json(['data' => $usuarios]);
    }

    public function show(Request $request, string $id)
    {
        $this->ensureSuperAdmin($request);

        $permisos = UsuarioPermiso::where('user_id', $id)
            ->orderBy('modulo')
            ->orderBy('hospital_id')
            ->get();

        return response()->json([
            'data' => [
                'user_id' => $id,
                'permisos' => $permisos,
            ],
        ]);
    }

    public function store(StoreUsuarioPermisoRequest $request, string $id)
    {
        $payload = collect($request->validated('permisos'))
            ->map(function (array $permiso) use ($id) {
                $campos = [
                    'user_id' => $id,
                    'modulo' => $permiso['modulo'],
                    'hospital_id' => $permiso['hospital_id'] ?? null,
                ];

                $valores = [
                    'puede_ver' => (bool)($permiso['puede_ver'] ?? false),
                    'puede_crear' => (bool)($permiso['puede_crear'] ?? false),
                    'puede_editar' => (bool)($permiso['puede_editar'] ?? false),
                    'puede_eliminar' => (bool)($permiso['puede_eliminar'] ?? false),
                ];

                return UsuarioPermiso::updateOrCreate($campos, $valores);
            });

        $permisos = UsuarioPermiso::where('user_id', $id)
            ->orderBy('modulo')
            ->orderBy('hospital_id')
            ->get();

        return response()->json([
            'data' => [
                'user_id' => $id,
                'permisos' => $permisos,
                'actualizados' => $payload,
            ],
        ], 201);
    }

    public function destroy(Request $request, int $id)
    {
        $this->ensureSuperAdmin($request);

        $permiso = UsuarioPermiso::findOrFail($id);
        $permiso->delete();

        return response()->json(null, 204);
    }

    protected function ensureSuperAdmin(Request $request): void
    {
        $user = $request->user();

        if (!$user || !in_array('superadmin', $user->roles ?? [])) {
            abort(response()->json(['error' => 'Forbidden'], 403));
        }
    }
}
