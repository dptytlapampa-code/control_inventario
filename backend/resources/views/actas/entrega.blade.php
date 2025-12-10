<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Acta de Entrega</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; margin: 24px; color: #1f2937; }
        .encabezado { text-align: center; margin-bottom: 20px; }
        .encabezado img { max-width: 100%; height: auto; }
        .titulo { text-align: center; font-size: 20px; margin-bottom: 10px; text-transform: uppercase; }
        .subtitulo { text-align: center; color: #4b5563; margin-bottom: 20px; }
        .seccion { margin-bottom: 16px; }
        .seccion h3 { margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        table td { padding: 8px; border: 1px solid #e5e7eb; font-size: 12px; }
        .detalle { padding: 12px; border: 1px solid #e5e7eb; background: #f8fafc; border-radius: 6px; min-height: 80px; font-size: 13px; }
        .firmas { margin-top: 28px; display: flex; justify-content: space-between; gap: 40px; }
        .firma { flex: 1; text-align: center; padding-top: 40px; border-top: 1px solid #9ca3af; font-size: 12px; }
        .qr { text-align: right; margin-top: 20px; font-size: 10px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="encabezado">
        @if($encabezadoUrl)
            <img src="{{ $encabezadoUrl }}" alt="Encabezado institucional">
        @else
            <strong>Encabezado institucional no configurado</strong>
        @endif
    </div>

    <div class="titulo">Acta de Entrega</div>
    <div class="subtitulo">Documento oficial generado el {{ $acta->created_at?->format('d/m/Y H:i') ?? now()->format('d/m/Y H:i') }}</div>

    @php
        $equipo = $acta->data['equipo'] ?? [];
    @endphp

    <div class="seccion">
        <h3>Datos del Equipo</h3>
        <table>
            <tr>
                <td><strong>ID Equipo</strong></td>
                <td>{{ $equipo['id'] ?? $acta->equipo_id }}</td>
                <td><strong>Nombre</strong></td>
                <td>{{ $equipo['nombre'] ?? 'N/D' }}</td>
            </tr>
            <tr>
                <td><strong>Marca</strong></td>
                <td>{{ $equipo['marca'] ?? 'N/D' }}</td>
                <td><strong>Modelo</strong></td>
                <td>{{ $equipo['modelo'] ?? 'N/D' }}</td>
            </tr>
            <tr>
                <td><strong>Serie</strong></td>
                <td>{{ $equipo['serie'] ?? 'N/D' }}</td>
                <td><strong>Código patrimonial</strong></td>
                <td>{{ $equipo['codigo'] ?? 'N/D' }}</td>
            </tr>
            <tr>
                <td><strong>Ubicación</strong></td>
                <td colspan="3">{{ $equipo['ubicacion'] ?? 'N/D' }}</td>
            </tr>
        </table>
    </div>

    <div class="seccion">
        <h3>Motivo / Detalle del Acto</h3>
        <div class="detalle">{{ $acta->motivo }} @if(!empty($acta->data['detalle']))<br>{{ $acta->data['detalle'] }}@endif</div>
    </div>

    <div class="seccion">
        <h3>Receptor</h3>
        <table>
            <tr>
                <td><strong>Nombre</strong></td>
                <td>{{ $acta->receptor_nombre }}</td>
                <td><strong>Identificación</strong></td>
                <td>{{ $acta->receptor_identificacion ?? 'N/D' }}</td>
            </tr>
            <tr>
                <td><strong>Cargo</strong></td>
                <td colspan="3">{{ $acta->receptor_cargo ?? 'N/D' }}</td>
            </tr>
        </table>
    </div>

    <div class="firmas">
        <div class="firma">Firma receptor</div>
        <div class="firma">Vo. Bo.</div>
    </div>

    <div class="qr">
        <div>QR de trazabilidad</div>
        <img src="data:image/png;base64,{{ $qr }}" alt="QR" style="height:110px; width:110px;">
        <div>{{ $downloadUrl }}</div>
    </div>
</body>
</html>
