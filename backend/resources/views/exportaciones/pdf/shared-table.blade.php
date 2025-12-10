<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{{ $title ?? 'Exportación' }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #111827; }
        h1 { margin: 0; font-size: 18px; }
        p.meta { color: #6b7280; font-size: 11px; margin: 4px 0 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #e5e7eb; padding: 6px 8px; text-align: left; }
        th { background: #f3f4f6; }
        .header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .header img { max-height: 60px; }
    </style>
</head>
<body>
    <div class="header">
        @if(!empty($encabezadoUrl))
            <img src="{{ $encabezadoUrl }}" alt="Encabezado institucional">
        @endif
        <div>
            <h1>{{ $title ?? 'Exportación' }}</h1>
            <p class="meta">Generado el {{ optional($generatedAt ?? now())->toDateTimeString() }}</p>
        </div>
    </div>
    <table>
        <thead>
            <tr>
                @foreach($headers as $header)
                    <th>{{ $header }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @forelse($rows as $row)
                <tr>
                    @foreach($row as $cell)
                        <td>{{ is_array($cell) ? json_encode($cell, JSON_UNESCAPED_UNICODE) : $cell }}</td>
                    @endforeach
                </tr>
            @empty
                <tr>
                    <td colspan="{{ count($headers) }}" style="text-align:center;">Sin datos para mostrar</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
