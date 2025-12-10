<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Auditoría</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #111827; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #e5e7eb; padding: 6px 8px; text-align: left; }
        th { background: #f3f4f6; }
        h1 { margin: 0; font-size: 18px; }
        .muted { color: #6b7280; font-size: 11px; }
    </style>
</head>
<body>
    <h1>Registro de auditoría</h1>
    <p class="muted">Generado el {{ now()->toDateTimeString() }}</p>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>IP</th>
                <th>Acción</th>
                <th>Módulo</th>
                <th>Objeto</th>
                <th>Fecha</th>
                <th>Antes</th>
                <th>Después</th>
            </tr>
        </thead>
        <tbody>
            @forelse($auditorias as $registro)
                <tr>
                    <td>{{ $registro->id }}</td>
                    <td>{{ $registro->user_name }}<br><span class="muted">{{ $registro->user_email }}</span></td>
                    <td>{{ $registro->user_role }}</td>
                    <td>{{ $registro->ip_address }}</td>
                    <td>{{ $registro->accion }}</td>
                    <td>{{ $registro->modulo }}</td>
                    <td>{{ $registro->objeto_id }}</td>
                    <td>{{ optional($registro->created_at)?->toDateTimeString() }}</td>
                    <td><pre style="white-space: pre-wrap; margin: 0;">{{ json_encode($registro->antes, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) }}</pre></td>
                    <td><pre style="white-space: pre-wrap; margin: 0;">{{ json_encode($registro->despues, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) }}</pre></td>
                </tr>
            @empty
                <tr>
                    <td colspan="10" style="text-align:center;">Sin datos</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
