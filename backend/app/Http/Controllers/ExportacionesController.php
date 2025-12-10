<?php

namespace App\Http\Controllers;

use App\Models\Acta;
use App\Models\Auditoria;
use App\Models\EncabezadoActa;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Facades\Excel;

class ExportacionesController extends Controller
{
    public function exportEquipos(Request $request)
    {
        $payload = $this->buildEquiposData($request);

        return $this->exportDataset($payload, 'equipos', $request->get('format'), 'exportaciones.pdf.equipos');
    }

    public function exportMantenimientos(Request $request)
    {
        $payload = $this->buildMantenimientosData($request);

        return $this->exportDataset($payload, 'mantenimientos', $request->get('format'), 'exportaciones.pdf.mantenimientos');
    }

    public function exportHistorial(Request $request)
    {
        $payload = $this->buildHistorialData($request);

        return $this->exportDataset($payload, 'historial', $request->get('format'), 'exportaciones.pdf.historial');
    }

    public function exportActas(Request $request)
    {
        $payload = $this->buildActasData($request);

        return $this->exportDataset($payload, 'actas', $request->get('format'), 'exportaciones.pdf.actas');
    }

    public function exportUsuarios(Request $request)
    {
        $payload = $this->buildUsuariosData($request);

        return $this->exportDataset($payload, 'usuarios', $request->get('format'), 'exportaciones.pdf.usuarios');
    }

    public function exportAuditoria(Request $request)
    {
        $payload = $this->buildAuditoriaData($request);

        return $this->exportDataset($payload, 'auditoria', $request->get('format'), 'exportaciones.pdf.auditoria');
    }

    public function exportOficinas(Request $request)
    {
        $payload = $this->buildOficinasData($request);

        return $this->exportDataset($payload, 'oficinas', $request->get('format'), 'exportaciones.pdf.oficinas');
    }

    public function exportServicios(Request $request)
    {
        $payload = $this->buildServiciosData($request);

        return $this->exportDataset($payload, 'servicios', $request->get('format'), 'exportaciones.pdf.servicios');
    }

    public function exportHospitales(Request $request)
    {
        $payload = $this->buildHospitalesData($request);

        return $this->exportDataset($payload, 'hospitales', $request->get('format'), 'exportaciones.pdf.hospitales');
    }

    public function exportTiposEquipos(Request $request)
    {
        $payload = $this->buildTiposEquiposData($request);

        return $this->exportDataset($payload, 'tipos_equipos', $request->get('format'), 'exportaciones.pdf.tipos-equipos');
    }

    private function exportDataset(array $payload, string $filename, ?string $format, string $view)
    {
        $format = strtolower($format ?? 'excel');
        $headers = $payload['headers'];
        $rows = $payload['rows'];

        if ($format === 'pdf') {
            $pdf = Pdf::loadView($view, [
                'headers' => $headers,
                'rows' => $rows,
                'generatedAt' => now(),
                'encabezadoUrl' => $this->getEncabezadoUrl(),
                'title' => ucfirst(str_replace('_', ' ', $filename)),
            ])->setPaper('a4', 'landscape');

            return $pdf->download($filename . '.pdf');
        }

        $writerType = $format === 'csv' ? \Maatwebsite\Excel\Excel::CSV : \Maatwebsite\Excel\Excel::XLSX;
        $extension = $format === 'csv' ? 'csv' : 'xlsx';
        $export = new GenericArrayExport($rows, $headers);

        return Excel::download($export, $filename . '.' . $extension, $writerType);
    }

    private function buildEquiposData(Request $request): array
    {
        $headers = [
            'ID',
            'Código patrimonial',
            'Nombre',
            'Marca',
            'Modelo',
            'Serie',
            'Tipo de equipo',
            'Estado',
            'Hospital',
            'Servicio',
            'Oficina',
            'Fecha de alta',
            'Último mantenimiento',
            'Próxima calibración',
            'Cantidad de adjuntos',
            'Actas asociadas',
        ];

        if (!Schema::hasTable('equipos')) {
            return ['headers' => $headers, 'rows' => []];
        }

        $columns = [
            'id' => 'id',
            'bien_patrimonial' => 'codigo_patrimonial',
            'nombre' => 'nombre',
            'marca' => 'marca',
            'modelo' => 'modelo',
            'serie' => 'serie',
            'tipo' => 'tipo_equipo',
            'estado' => 'estado',
            'hospital_id' => 'hospital',
            'servicio_id' => 'servicio',
            'oficina_id' => 'oficina',
            'fecha_alta' => 'fecha_alta',
            'ultimo_mantenimiento' => 'ultimo_mantenimiento',
            'proxima_calibracion' => 'proxima_calibracion',
        ];

        $query = DB::table('equipos');

        $this->applyFilters($query, $request, ['hospital_id', 'servicio_id', 'oficina_id', 'estado']);

        foreach ($columns as $column => $alias) {
            $query->addSelect($this->selectColumn('equipos', $column, $alias));
        }

        $query->addSelect($this->countRelation('equipo_adjuntos', 'equipo_id', 'equipos.id', 'adjuntos'));
        $query->addSelect($this->countRelation('actas', 'equipo_id', 'equipos.id', 'actas_asociadas'));

        $rows = $this->mapRows($query->limit(2000)->get(), array_values($columns), ['adjuntos', 'actas_asociadas']);

        return ['headers' => $headers, 'rows' => $rows];
    }

    private function buildMantenimientosData(Request $request): array
    {
        $headers = [
            'Tipo',
            'Fecha',
            'Técnico',
            'Costo',
            'Diagnóstico / reparación',
            'Equipo',
            'Hospital',
            'Servicio',
            'Oficina',
        ];

        if (!Schema::hasTable('mantenimientos')) {
            return ['headers' => $headers, 'rows' => []];
        }

        $columns = [
            'tipo' => 'tipo',
            'fecha' => 'fecha',
            'tecnico' => 'tecnico',
            'costo' => 'costo',
            'detalle' => 'detalle',
            'equipo_id' => 'equipo',
            'hospital_id' => 'hospital',
            'servicio_id' => 'servicio',
            'oficina_id' => 'oficina',
        ];

        $query = DB::table('mantenimientos');

        $this->applyFilters($query, $request, ['hospital_id', 'servicio_id', 'oficina_id', 'tipo']);

        foreach ($columns as $column => $alias) {
            $query->addSelect($this->selectColumn('mantenimientos', $column, $alias));
        }

        if (Schema::hasTable('equipos')) {
            $query->leftJoin('equipos', 'mantenimientos.equipo_id', '=', 'equipos.id');
            $query->addSelect($this->selectColumn('equipos', 'nombre', 'equipo_nombre'));
        } else {
            $query->addSelect(DB::raw('NULL as equipo_nombre'));
        }

        $rows = $this->mapRows($query->limit(2000)->get(), array_values($columns), ['equipo_nombre']);

        return ['headers' => $headers, 'rows' => $rows];
    }

    private function buildHistorialData(Request $request): array
    {
        $headers = [
            'Tipo de evento',
            'Fecha',
            'Usuario',
            'Ubicación origen',
            'Ubicación destino',
            'Motivo',
        ];

        if (!Schema::hasTable('equipo_historial')) {
            return ['headers' => $headers, 'rows' => []];
        }

        $columns = [
            'tipo_evento' => 'tipo_evento',
            'fecha_evento' => 'fecha_evento',
            'usuario_registra' => 'usuario',
            'oficina_origen_id' => 'origen',
            'oficina_destino_id' => 'destino',
            'descripcion' => 'motivo',
        ];

        $query = DB::table('equipo_historial');

        $this->applyDateFilters($query, $request);

        foreach ($columns as $column => $alias) {
            $query->addSelect($this->selectColumn('equipo_historial', $column, $alias));
        }

        $rows = $this->mapRows($query->limit(2000)->get(), array_values($columns));

        return ['headers' => $headers, 'rows' => $rows];
    }

    private function buildActasData(Request $request): array
    {
        $headers = [
            'Tipo de acta',
            'Fecha',
            'Equipo asociado',
            'Responsable receptor',
            'Motivo / detalle',
            'QR generado',
            'Archivo PDF',
        ];

        if (!Schema::hasTable('actas')) {
            return ['headers' => $headers, 'rows' => []];
        }

        $columns = [
            'tipo' => 'tipo',
            'created_at' => 'fecha',
            'equipo_id' => 'equipo',
            'receptor_nombre' => 'receptor',
            'motivo' => 'motivo',
            'id' => 'qr',
            'path' => 'archivo',
        ];

        $query = Acta::query();

        $this->applyFilters($query, $request, ['hospital_id', 'tipo']);

        foreach ($columns as $column => $alias) {
            $query->addSelect($this->selectColumn('actas', $column, $alias));
        }

        $rows = $this->mapRows($query->limit(2000)->get(), array_values($columns));

        return ['headers' => $headers, 'rows' => $rows];
    }

    private function buildUsuariosData(Request $request): array
    {
        $headers = [
            'Nombre',
            'Email',
            'Rol',
            'Permisos',
            'Hospital asignado',
        ];

        if (!Schema::hasTable('users')) {
            return ['headers' => $headers, 'rows' => []];
        }

        $columns = [
            'name' => 'nombre',
            'email' => 'email',
            'role' => 'rol',
            'permisos' => 'permisos',
            'hospital_id' => 'hospital',
        ];

        $query = DB::table('users');

        foreach ($columns as $column => $alias) {
            $query->addSelect($this->selectColumn('users', $column, $alias));
        }

        $rows = $this->mapRows($query->limit(2000)->get(), array_values($columns));

        return ['headers' => $headers, 'rows' => $rows];
    }

    private function buildAuditoriaData(Request $request): array
    {
        $headers = [
            'Usuario',
            'Rol',
            'Acción',
            'Módulo',
            'Objeto',
            'Fecha / hora',
            'IP',
            'Antes',
            'Después',
        ];

        $query = Auditoria::query();

        $this->applyDateFilters($query, $request);

        $rows = $query->orderByDesc('created_at')
            ->limit(2000)
            ->get()
            ->map(function ($registro) {
                return [
                    $registro->user_name,
                    $registro->user_role,
                    $registro->accion,
                    $registro->modulo,
                    $registro->objeto_id,
                    optional($registro->created_at)?->toDateTimeString(),
                    $registro->ip_address,
                    json_encode($registro->antes, JSON_UNESCAPED_UNICODE),
                    json_encode($registro->despues, JSON_UNESCAPED_UNICODE),
                ];
            })
            ->toArray();

        return ['headers' => $headers, 'rows' => $rows];
    }

    private function buildHospitalesData(Request $request): array
    {
        $headers = [
            'ID',
            'Nombre',
            'Localidad',
            'Domicilio',
            'Teléfono',
            'Zona sanitaria',
            'Latitud',
            'Longitud',
            'Activo',
        ];

        if (!Schema::hasTable('instituciones')) {
            return ['headers' => $headers, 'rows' => []];
        }

        $columns = [
            'id' => 'id',
            'nombre' => 'nombre',
            'localidad' => 'localidad',
            'domicilio' => 'domicilio',
            'telefono' => 'telefono',
            'zona_sanitaria' => 'zona_sanitaria',
            'latitud' => 'latitud',
            'longitud' => 'longitud',
            'activo' => 'activo',
        ];

        $query = DB::table('instituciones');

        foreach ($columns as $column => $alias) {
            $query->addSelect($this->selectColumn('instituciones', $column, $alias));
        }

        $rows = $this->mapRows($query->limit(2000)->get(), array_values($columns));

        return ['headers' => $headers, 'rows' => $rows];
    }

    private function buildServiciosData(Request $request): array
    {
        $headers = [
            'ID',
            'Nombre',
            'Hospital',
            'Descripción',
            'Activo',
        ];

        if (!Schema::hasTable('unidades_organizacionales')) {
            return ['headers' => $headers, 'rows' => []];
        }

        $query = DB::table('unidades_organizacionales')->where('tipo', 'servicio');

        $query->addSelect($this->selectColumn('unidades_organizacionales', 'id', 'id'));
        $query->addSelect($this->selectColumn('unidades_organizacionales', 'nombre', 'nombre'));
        $query->addSelect($this->selectColumn('unidades_organizacionales', 'descripcion', 'descripcion'));
        $query->addSelect($this->selectColumn('unidades_organizacionales', 'activo', 'activo'));
        $query->addSelect($this->selectColumn('unidades_organizacionales', 'institucion_id', 'institucion_id'));

        $rows = $this->mapRows($query->limit(2000)->get(), ['id', 'nombre', 'institucion_id', 'descripcion', 'activo']);

        return ['headers' => $headers, 'rows' => $rows];
    }

    private function buildOficinasData(Request $request): array
    {
        $headers = [
            'ID',
            'Nombre',
            'Servicio',
            'Hospital',
            'Descripción',
            'Activo',
        ];

        if (!Schema::hasTable('unidades_organizacionales')) {
            return ['headers' => $headers, 'rows' => []];
        }

        $query = DB::table('unidades_organizacionales')->where('tipo', 'oficina');

        $query->addSelect($this->selectColumn('unidades_organizacionales', 'id', 'id'));
        $query->addSelect($this->selectColumn('unidades_organizacionales', 'nombre', 'nombre'));
        $query->addSelect($this->selectColumn('unidades_organizacionales', 'parent_id', 'servicio'));
        $query->addSelect($this->selectColumn('unidades_organizacionales', 'institucion_id', 'institucion_id'));
        $query->addSelect($this->selectColumn('unidades_organizacionales', 'descripcion', 'descripcion'));
        $query->addSelect($this->selectColumn('unidades_organizacionales', 'activo', 'activo'));

        $rows = $this->mapRows($query->limit(2000)->get(), ['id', 'nombre', 'servicio', 'institucion_id', 'descripcion', 'activo']);

        return ['headers' => $headers, 'rows' => $rows];
    }

    private function buildTiposEquiposData(Request $request): array
    {
        $headers = [
            'ID',
            'Nombre',
            'Descripción',
            'Estado',
        ];

        if (!Schema::hasTable('tipos_equipos')) {
            if (Schema::hasTable('equipos') && Schema::hasColumn('equipos', 'tipo')) {
                $tipos = DB::table('equipos')->select('tipo')->distinct()->get();
                $rows = $tipos->map(fn ($tipo) => [$tipo->tipo, $tipo->tipo, null, null])->toArray();

                return ['headers' => $headers, 'rows' => $rows];
            }

            return ['headers' => $headers, 'rows' => []];
        }

        $columns = [
            'id' => 'id',
            'nombre' => 'nombre',
            'descripcion' => 'descripcion',
            'estado' => 'estado',
        ];

        $query = DB::table('tipos_equipos');

        foreach ($columns as $column => $alias) {
            $query->addSelect($this->selectColumn('tipos_equipos', $column, $alias));
        }

        $rows = $this->mapRows($query->limit(2000)->get(), array_values($columns));

        return ['headers' => $headers, 'rows' => $rows];
    }

    private function applyFilters(Builder|EloquentBuilder $query, Request $request, array $allowed): void
    {
        $table = $this->resolveTable($query);

        foreach ($allowed as $filter) {
            if ($request->filled($filter) && $table && Schema::hasColumn($table, $filter)) {
                $query->where($filter, $request->get($filter));
            }
        }
    }

    private function applyDateFilters(Builder|EloquentBuilder $query, Request $request): void
    {
        $table = $this->resolveTable($query);

        if ($request->filled('desde') && $table && Schema::hasColumn($table, 'created_at')) {
            $query->whereDate($table . '.created_at', '>=', $request->get('desde'));
        }

        if ($request->filled('hasta') && $table && Schema::hasColumn($table, 'created_at')) {
            $query->whereDate($table . '.created_at', '<=', $request->get('hasta'));
        }
    }

    private function resolveTable(Builder|EloquentBuilder $query): ?string
    {
        if ($query instanceof EloquentBuilder) {
            return $query->getModel()->getTable();
        }

        return $query->from ?? null;
    }

    private function selectColumn(string $table, string $column, string $alias)
    {
        return Schema::hasColumn($table, $column)
            ? $table . '.' . $column . ' as ' . $alias
            : DB::raw('NULL as ' . $alias);
    }

    private function countRelation(string $table, string $foreignKey, string $localKey, string $alias)
    {
        if (!Schema::hasTable($table)) {
            return DB::raw('0 as ' . $alias);
        }

        return DB::raw('(select count(*) from ' . $table . ' where ' . $table . '.' . $foreignKey . ' = ' . $localKey . ') as ' . $alias);
    }

    private function mapRows(Collection $collection, array $fields, array $extraFields = []): array
    {
        $allFields = array_merge($fields, $extraFields);

        return $collection->map(function ($item) use ($allFields) {
            $row = [];
            foreach ($allFields as $field) {
                $value = is_array($item) ? ($item[$field] ?? null) : ($item->{$field} ?? null);
                $row[] = is_bool($value) ? ($value ? 'Sí' : 'No') : $value;
            }

            return $row;
        })->toArray();
    }

    private function getEncabezadoUrl(): ?string
    {
        if (!Schema::hasTable('encabezado_actas')) {
            return null;
        }

        $encabezado = EncabezadoActa::latest()->first();

        if (!$encabezado) {
            return null;
        }

        $path = storage_path('app/public/encabezados/actas/' . $encabezado->filename);

        return file_exists($path) ? asset('storage/encabezados/actas/' . $encabezado->filename) : null;
    }
}

class GenericArrayExport implements FromArray, WithHeadings, WithMapping, ShouldAutoSize
{
    private array $rows;

    private array $headers;

    public function __construct(array $rows, array $headers)
    {
        $this->rows = $rows;
        $this->headers = $headers;
    }

    public function array(): array
    {
        return $this->rows;
    }

    public function headings(): array
    {
        return $this->headers;
    }

    public function map($row): array
    {
        return array_map(fn ($value) => $value === null ? '' : $value, is_array($row) ? $row : (array) $row);
    }
}
